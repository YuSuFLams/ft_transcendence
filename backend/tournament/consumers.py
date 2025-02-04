import os
import json
import asyncio
from django.utils import timezone
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import logging
from asgiref.sync import sync_to_async
import math
from django.core.exceptions import ObjectDoesNotExist

from .models import Game, TournamentLocal

# Constants for colored logs (assuming you have these defined somewhere)
YELLOW = '\033[93m'
RED = '\033[91m'
GREEN = '\033[92m'
RESET = '\033[0m'

@database_sync_to_async
def create_or_update_game_local(action: str, state='onprogress', player1=None, player2=None, score_p1=0, score_p2=0, winner=None, GameId=None):
    try:
        if action == 'startGame':
            game = Game(state=state, player1=player1, player2=player2, score_p1=score_p1, score_p2=score_p2, winner=winner)
            game.save()
            return game.id
        elif action == 'updateGame' and GameId is not None:
            game = Game.objects.get(id=GameId)
            if game:
                game.score_p1 = score_p1
                game.score_p2 = score_p2
                game.state = state
                if winner is not None:
                    game.winner = winner
                game.updated_at = timezone.now()
                game.save()
            return game.id

    except Exception as e:
        return None
    


@database_sync_to_async
def get_game_local_by_id(game_id):
    try:
        return Game.objects.get(id=game_id)
    except Game.DoesNotExist:
        return None


@sync_to_async
def update_tournament(idTournament, idMatch, winner):
    try:
        tournament = TournamentLocal.objects.get(id=idTournament)
        if str(idMatch) in tournament.matches:
            tournament.update_match(str(idMatch), winner)
            tournament.save()
            return tournament.id
        else:
            return None
    except ObjectDoesNotExist:
        return None
    except Exception as e:
        return None

    

class GameOnRunning:
    def __init__(self, consumer=None):
        self.score_p1: int = 0
        self.score_p2: int = 0
        self.player1: str = None
        self.player2: str = None
        self.GameId: int = None
        self.score_winner: int = 5
        self.start_game: bool = False
        self.winner: str = None
        self.radius: float = 0.1
        self.fixed_speed: float = 0.027
        self.ball: dict = {"x": 0, "y": 0.3, "z": 0}
        self.paddle = {'width': 0.8, 'height': 0.2}
        self.paddle1: dict = {"x": 0, "y": 0.1, "z": -2.7}
        self.paddle2: dict = {"x": 0, "y": 0.1, "z": 2.7}
        self.table_game: dict = {"width": 3, "height": 6}
        self.velocity: dict = {"x": 0.007, "y": 0, "z": 0.017}
        self.consumer = consumer
        self.idTournament = None
        self.idMatch = None
        self.game_loop_task = None

    async def ball_wall_collision(self, new_ball_position: dict):
        half_width = self.table_game['width'] / 2

        if new_ball_position['x'] + self.radius >= half_width:
            new_ball_position['x'] = half_width - self.radius
            self.velocity['x'] *= -1

        elif new_ball_position['x'] - self.radius <= -half_width:
            new_ball_position['x'] = -half_width + self.radius
            self.velocity['x'] *= -1

    async def ball_paddle_collision(self, new_ball_position: dict):
        paddle = self.paddle1 if new_ball_position['z'] < 0 else self.paddle2
        half_paddle_width = self.paddle['width'] / 2
        half_paddle_height = self.paddle['height'] / 2

        if (abs(new_ball_position['z'] - paddle['z']) < half_paddle_height + self.radius and
            abs(new_ball_position['x'] - paddle['x']) < half_paddle_width + self.radius):
            self.velocity['z'] *= -1

            if new_ball_position['z'] < 0:
                new_ball_position['z'] = paddle['z'] + half_paddle_height + self.radius
            else:
                new_ball_position['z'] = paddle['z'] - half_paddle_height - self.radius

        return new_ball_position

    async def reset_ball(self, scoring_player: str):
        self.ball = {'x': 0, 'y': 0.3, 'z': 0}
        self.velocity = {'x': 0.001, 'y': 0.0, 'z': 0.015 if scoring_player == "left" else -0.015}

    def normalize_velocity(self):
        magnitude = math.sqrt(self.velocity['x']**2 + self.velocity['z']**2)
        if magnitude > 0:
            self.velocity['x'] = (self.velocity['x'] / magnitude) * self.fixed_speed
            self.velocity['z'] = (self.velocity['z'] / magnitude) * self.fixed_speed

    async def on_score(self, player_side: str, case:str='LocalGame'):
        if player_side == 'left':
            self.score_p1 += 1
        elif player_side == 'right':
            self.score_p2 += 1

        if case == 'LocalGame':
            if self.score_p1 == self.score_winner or self.score_p2 == self.score_winner:
                self.start_game = False
                self.winner = self.player1 if self.score_p1 == self.score_winner else self.player2
                await create_or_update_game_local(
                    action='updateGame', state='finished', winner=self.winner,
                    GameId=self.GameId, score_p1=self.score_p1, score_p2=self.score_p2
                )
                try:
                    await update_tournament(idTournament=self.idTournament, idMatch=self.idMatch, winner=self.winner)
                except Exception as e:
                    pass
                if self.game_loop_task and not self.game_loop_task.done():
                    self.game_loop_task.cancel()
            else:
                await create_or_update_game_local(action='updateGame', score_p1=self.score_p1, score_p2=self.score_p2, GameId=self.GameId)

class GameRunning:
    def __init__(self, consumer=None):
        self.consumer = consumer
        self.game = GameOnRunning(consumer)

    async def game_loop(self):
        while self.game.start_game:
            await self.update_game_state()
            await self.send_ball_position()
            await asyncio.sleep(1 / 60)

    async def update_game_state(self):
        new_ball_position = {
            'x': self.game.ball['x'] + self.game.velocity['x'],
            'y': self.game.ball['y'], 
            'z': self.game.ball['z'] + self.game.velocity['z']
        }

        await self.game.ball_wall_collision(new_ball_position)
        self.game.ball = await self.game.ball_paddle_collision(new_ball_position)
        self.game.normalize_velocity()

        if new_ball_position['z'] > self.game.table_game['height'] / 2:
            await self.game.on_score("left", case='LocalGame')
            await self.game.reset_ball("left")
        elif new_ball_position['z'] < -self.game.table_game['height'] / 2:
            await self.game.on_score("right", case='LocalGame')
            await self.game.reset_ball("right")
        if self.game.winner is not None:
            await self.send_end_game_data()

    async def send_ball_position(self):
        try:
            data = {'ball': self.game.ball, 'score_p1': self.game.score_p1, 'score_p2': self.game.score_p2,
                'id_game': self.game.GameId, 'velocity': self.game.velocity, 'winner': self.game.winner }
            await self.consumer.send_data({'type': 'ball', 'data': data})
        except Exception as e:
            pass

    async def send_end_game_data(self):
        try:
            data = {'winner': self.game.winner, 'score_p1': self.game.score_p1, 'score_p2': self.game.score_p2}
            await self.consumer.send_data({'type': 'endGame', 'data': data})
        except Exception as e:
            pass



class LocalGameInfo:
    def __init__(self, consumer=None):
        self.consumer = consumer
        self.data_game = GameRunning(consumer)

    async def disconnect(self):
        try:
            self.data_game.game.start_game = False
            if self.data_game.game.game_loop_task and not self.data_game.game.game_loop_task.done():
                self.data_game.game.game_loop_task.cancel()
                try:
                    await self.data_game.game.game_loop_task
                except asyncio.CancelledError:
                    pass
        except Exception as e:
            pass  

    async def reset_data_game(self, data: dict):
        try:
            idGame = data.get('idGame')
            if idGame is None:
                raise ValueError("idGame is missing in the received data.")
            self.data_game.game.GameId = idGame
            game_instance = await get_game_local_by_id(self.data_game.game.GameId)
            if game_instance:
                self.data_game.game.score_p1 = game_instance.score_p1
                self.data_game.game.score_p2 = game_instance.score_p2
                self.data_game.game.player1 = game_instance.player1
                self.data_game.game.player2 = game_instance.player2

            self.data_game.game.idTournament = data.get('idTournament')
            self.data_game.game.idMatch = data.get('idMatch')

            left_paddle = data.get('left_paddle')
            right_paddle = data.get('right_paddle')

            if left_paddle != None:
                self.data_game.game.paddle1['x'] = float(data['left_paddle'])  
            if right_paddle != None:
                self.data_game.game.paddle2['x'] = float(data['right_paddle'])

            ball_position = data.get('ball')
            valocity = data.get('velocity')
            if ball_position is not None and valocity is not None:
                try:
                    if isinstance(ball_position, str):
                        ball_position = json.loads(ball_position)
                    if isinstance(valocity, str):
                        valocity = json.loads(valocity)
                    self.data_game.game.ball['x'] = float(ball_position['x'])
                    self.data_game.game.ball['y'] = float(ball_position['y'])
                    self.data_game.game.ball['z'] = float(ball_position['z'])
                    self.data_game.game.velocity['x'] = float(valocity['x'])
                    self.data_game.game.velocity['y'] = float(valocity['y'])
                    self.data_game.game.velocity['z'] = float(valocity['z'])
                except (ValueError, KeyError, TypeError) as e:
                    pass
            
            self.data_game.game.start_game = True
            if not self.data_game.game.game_loop_task or self.data_game.game.game_loop_task.done():
                self.data_game.game.game_loop_task = asyncio.create_task(self.data_game.game_loop())
        except Exception as e:
            pass

    async def paddle_move(self, data: dict):
        try:
            table_width = self.data_game.game.table_game['width']
            half_width = table_width / 2
            move_amount = 0.3
            lerp_speed = 0.3 

            prev_pos_right = self.data_game.game.paddle2['x']
            prev_pos_left = self.data_game.game.paddle1['x']

            if data.get('direction') == 'right':
                if data.get('event') == 'ArrowRight':
                    target_position = min(prev_pos_right + move_amount, half_width - 0.4)  
                elif data.get('event') == 'ArrowLeft':
                    target_position = max(prev_pos_right - move_amount, -half_width + 0.4)
                else:
                    target_position = prev_pos_right  

                new_position = prev_pos_right + (target_position - prev_pos_right) * lerp_speed
                self.data_game.game.paddle2['x'] = new_position
                await self.consumer.send_data({'type': 'paddle', 'data': {'right_paddle': new_position}})
            elif data.get('direction') == 'left':
                if data.get('event') == 'D':
                    target_position = max(prev_pos_left - move_amount, -half_width + 0.4)
                elif data.get('event') == 'A':
                    target_position = min(prev_pos_left + move_amount, half_width - 0.4) 
                else:
                    target_position = prev_pos_left  

                new_position = prev_pos_left + (target_position - prev_pos_left) * lerp_speed
                self.data_game.game.paddle1['x'] = new_position
                await self.consumer.send_data({'type': 'paddle', 'data': {'left_paddle': new_position}})
        except Exception as e:
            pass

    async def start_game(self, data: dict, action: str):
        try:
            self.data_game.game.player1 = data.get('player1')
            self.data_game.game.player2 = data.get('player2')
            self.data_game.game.idTournament = data.get('idTournament')
            self.data_game.game.idMatch = data.get('idMatch')
            self.data_game.game.GameId = await create_or_update_game_local(action, player1=self.data_game.game.player1, 
                player2=self.data_game.game.player2)
            self.data_game.game.start_game = True
            await self.consumer.send_data({'type': 'startGame', 'data': {'idGame': self.data_game.game.GameId}})
            await asyncio.sleep(2)
            if not self.data_game.game.game_loop_task or self.data_game.game.game_loop_task.done():
                self.data_game.game.game_loop_task = asyncio.create_task(self.data_game.game_loop())
        except Exception as e:
            pass

    async def receive(self, data: dict):
        action = data.get('action')
        try:
            if not action:
                raise ValueError("Action is missing in the received data.")

            if action == "startGame":
                await self.start_game(data, action)
            
            elif action == 'resetGame':
                await self.reset_data_game(data)

            elif action == 'paddle':
                await self.paddle_move(data)
            
            # elif action == 'closeGame':
            #     if self.data_game.game.winner is None:
            #         if self.data_game.game.GameId:
            #             await delete_game_local_by_id(self.data_game.game.GameId)
            #         self.data_game.game.GameId = None
            
        except json.JSONDecodeError as e:
            pass
        except Exception as e:
            pass


class PingPongMatchTournamentLocal(AsyncWebsocketConsumer):
    def __init__(self):
        self.data_game: LocalGameInfo = LocalGameInfo(consumer=self)
        super().__init__()

    async def connect(self):
        self.user = self.scope.get('user')
        if not self.user.is_authenticated:
            await self.close()
            return
        await self.accept()

    async def disconnect(self, close_code):
        await self.data_game.disconnect()

    async def receive(self, text_data: str):
        try:
            data = json.loads(text_data)
            await self.data_game.receive(data)
        except Exception as e:
            pass

    async def send_data(self, data):
        try:
            await self.send(text_data=json.dumps(data))
        except Exception as e:
            pass