import os
import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
from asgiref.sync import sync_to_async

from game.consumers import GameEvent, get_tournament_local_by_id, update_tournament, create_or_update_game_Tourament

logger = logging.getLogger(__name__)

# Constants for colored logs (assuming you have these defined somewhere)
YELLOW = '\033[93m'
RED = '\033[91m'
GREEN = '\033[92m'
RESET = '\033[0m'
    
class GameRunning:
    def __init__(self, consumer=None):
        self.consumer = consumer
        self.match = GameEvent(consumer)

    async def game_loop(self):
        while self.match.event_match.is_running:
            await self.update_game_state()
            await self.match.send_ball_position()
            await asyncio.sleep(1 / 60)

    async def update_game_state(self):
        new_ball_position = {
            'x': self.match.event_match.ball['x'] + self.match.event_match.velocity['x'],
            'y': self.match.event_match.ball['y'], 
            'z': self.match.event_match.ball['z'] + self.match.event_match.velocity['z']
        }

        await self.match.event_match.ball_wall_collision(new_ball_position)
        self.match.event_match.ball = await self.match.event_match.ball_paddle_collision(new_ball_position)
        await self.match.event_match.normalize_velocity()

        if new_ball_position['z'] > self.match.event_match.table_game['height'] / 2:
            await self.on_score("left", case='TournamentGame')
            await self.match.event_match.reset_ball("left")
        elif new_ball_position['z'] < -self.match.event_match.table_game['height'] / 2:
            await self.on_score("right", case='TournamentGame')
            await self.match.event_match.reset_ball("right")
        if self.match.event_match.winner is not None:
            await self.match.send_end_game_data()

    async def on_score(self, player_side: str, case:str='LocalGame'):
        if player_side == 'left':
            self.match.event_match.score_p1 += 1
        elif player_side == 'right':
            self.match.event_match.score_p2 += 1

        if self.match.event_match.score_p1 == self.match.event_match.score_winner or self.match.event_match.score_p2 == self.match.event_match.score_winner:
            self.match.event_match.is_running = False
            self.match.event_match.winner = self.match.event_match.player1 if self.match.event_match.score_p1 == self.match.event_match.score_winner else self.match.event_match.player2
            await create_or_update_game_Tourament(
                action='updateGame', state='finished', winner=self.match.event_match.winner, GameId=self.match.event_match.game_id, 
                score_p1=self.match.event_match.score_p1, score_p2=self.match.event_match.score_p2
            )
            if case == 'TournamentGame':
                try:
                    await update_tournament(idTournament=self.match.event_match.id_tournament, idMatch=self.match.event_match.id_match, winner=self.match.event_match.winner)
                except Exception as e:
                    pass
            if self.match.event_match.game_loop_task:
                self.match.event_match.game_loop_task.cancel()
        else:
            await create_or_update_game_Tourament(action='updateGame', score_p1=self.match.event_match.score_p1, score_p2=self.match.event_match.score_p2, GameId=self.match.event_match.game_id)

    async def start_game(self, data: dict, action: str, case:str='LocalGame'):
        try:
            self.match.event_match.player1 = data.get('player1')
            self.match.event_match.player2 = data.get('player2')
            if case == 'TournamentGame':
                self.match.event_match.id_tournament = data.get('idTournament')
                self.match.event_match.id_match = data.get('idMatch')
                self.match.event_match.game_id = await create_or_update_game_Tourament(action, player1=self.match.event_match.player1, player2=self.match.event_match.player2)
            self.match.event_match.is_running = True
            await self.consumer.send_data({'type': 'start-game', 'data': {'idGame': self.match.event_match.game_id}})
            await asyncio.sleep(2)
            if not self.match.event_match.game_loop_task or self.match.event_match.game_loop_task.done():
                self.match.event_match.game_loop_task = asyncio.create_task(self.game_loop())
        except Exception as e:
            pass 
    
    async def reset_data_game(self, data: dict, case: str = 'LocalGame'):
        try:
            idGame = data.get('idGame')
            if idGame is None:
                raise ValueError("idGame is missing in the received data.")
            
            self.match.event_match.game_id = idGame
            
            score_p1 = data.get('score_p1')
            score_p2 = data.get('score_p2')
            if score_p1 is not None and score_p2 is not None:
                self.match.event_match.score_p1 = int(score_p1)
                self.match.event_match.score_p2 = int(score_p2)

            game_instance = await get_tournament_local_by_id(self.match.event_match.game_id)
            if game_instance:
                game_instance.score_p1 = (self.match.event_match.score_p1 if self.match.event_match.score_p1 > 0 else game_instance.score_p1)
                game_instance.score_p2 = (self.match.event_match.score_p2 if self.match.event_match.score_p2 > 0 else game_instance.score_p2)
                await sync_to_async(game_instance.save)()
                
                self.match.event_match.score_p1 = game_instance.score_p1
                self.match.event_match.score_p2 = game_instance.score_p2
                self.match.event_match.player1 = game_instance.player1
                self.match.event_match.player2 = game_instance.player2

            if case == 'TournamentGame':
                self.match.event_match.id_tournament = data.get('idTournament')
                self.match.event_match.id_match = data.get('idMatch')

            left_paddle = data.get('left_paddle')
            right_paddle = data.get('right_paddle')
            if left_paddle is not None:  # Fixed inconsistent None checking
                self.match.event_match.paddle1['x'] = float(left_paddle)
            if right_paddle is not None:
                self.match.event_match.paddle2['x'] = float(right_paddle)

            ball_position = data.get('ball')
            velocity = data.get('velocity')  # Fixed typo from 'valocity'
            if ball_position is not None and velocity is not None:
                try:
                    if isinstance(ball_position, str):
                        ball_position = json.loads(ball_position)
                    if isinstance(velocity, str):
                        velocity = json.loads(velocity)
                    self.match.event_match.ball['x'] = float(ball_position['x'])
                    self.match.event_match.ball['y'] = float(ball_position['y'])
                    self.match.event_match.ball['z'] = float(ball_position['z'])
                    self.match.event_match.velocity['x'] = float(velocity['x'])
                    self.match.event_match.velocity['y'] = float(velocity['y'])
                    self.match.event_match.velocity['z'] = float(velocity['z'])
                except (ValueError, KeyError, TypeError, json.JSONDecodeError) as e:
                    print(f"{GREEN}Error processing ball/velocity: {e}{RESET}")

            self.match.event_match.is_running = True
            if not self.match.event_match.game_loop_task or self.match.event_match.game_loop_task.done():
                self.match.event_match.game_loop_task = asyncio.create_task(self.game_loop())

        except Exception as e:
            print(f"{GREEN}Error in reset_data_game: {e}{RESET}")
            raise  # Consider raising the error after loggin

class PingPongMatchLocal(AsyncWebsocketConsumer):
    def __init__(self, consumer=None):
        self.consumer = consumer
        self.game = GameRunning(consumer)

    async def disconnect(self):
        try:
            self.game.match.event_match.is_running = False
            if self.game.match.event_match.game_loop_task and not self.game.match.event_match.game_loop_task.done():
                self.game.match.event_match.game_loop_task.cancel()
                try:
                    await self.game.match.event_match.game_loop_task
                except asyncio.CancelledError:
                    pass
        except Exception as e:
            pass 

    
    async def receive(self, data: dict):
        action = data.get('action')
        try:
            if not action:
                raise ValueError("Action is missing in the received data.")

            elif action == "start-game":
                await self.game.start_game(data, action, case='TournamentGame')
            
            elif action == 'reset-game':
                await self.game.reset_data_game(data, case='TournamentGame')

            elif action == 'paddle':
                await self.game.match.paddle_move(data)
        except json.JSONDecodeError as e:
            pass
        except Exception as e:
            pass

class PingPongMatchTournamentLocal(AsyncWebsocketConsumer):
    def __init__(self):
        self.data_game: PingPongMatchLocal = PingPongMatchLocal(consumer=self)
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
            logger.error(f"Error in WebSocket receive: {str(e)}")

    async def send_data(self, data):
        try:
            await self.send(text_data=json.dumps(data))
        except Exception as e:
            logger.error(f"Error in WebSocket send: {str(e)}")