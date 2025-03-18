from channels.db import database_sync_to_async
from django.utils import timezone
from asgiref.sync import sync_to_async
from .models import GameLocal, Game, TournamentLocal
from django.core.exceptions import ObjectDoesNotExist
import math

@database_sync_to_async
def create_or_update_game_local(action: str, state='onprogress', player1=None, player2=None, score_p1=0, score_p2=0, winner=None, GameId=None):
    try:
        if action == 'start-game':
            game = GameLocal(state=state, player1=player1, player2=player2, score_p1=score_p1, score_p2=score_p2, winner=winner)
            game.save()
            return game.id
        elif action == 'updateGame' and GameId is not None:
            game = GameLocal.objects.get(id=GameId)
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
def delete_game_local_by_id(game_id):
    try:
        GameLocal.objects.filter(id=game_id).delete()
    except GameLocal.DoesNotExist:
        pass

@database_sync_to_async
def get_game_local_by_id(game_id):
    try:
        return GameLocal.objects.get(id=game_id)
    except GameLocal.DoesNotExist:
        return None

@database_sync_to_async
def create_or_update_game_Tourament(action: str, state='onprogress', player1=None, player2=None, score_p1=0, score_p2=0, winner=None, GameId=None):
    try:
        if action == 'start-game':
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
def get_tournament_local_by_id(game_id):
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

class MatchInfo:
    def __init__(self, consumer=None):
        self.consumer = consumer
        self.game_id: int = None
        self.score_p1: int = 0
        self.score_p2: int = 0
        self.player1: str = None
        self.player2: str = None
        self.score_winner: int = 5
        self.is_running: bool = False
        self.winner: str = None
        self.radius: float = 0.1
        self.fixed_speed: float = 0.025
        self.max_speed: float = 0.07
        self.speed_increase_factor: float = 1.05
        self.ball: dict = {"x": 0, "y": 0.12, "z": 0}
        self.paddle: dict = {'width': 0.8, 'height': 0.2}
        self.paddle1: dict = {"x": 0, "y": 0.1, "z": -2.7}
        self.paddle2: dict = {"x": 0, "y": 0.1, "z": 2.7}
        self.table_game: dict = {"width": 3, "height": 6}
        self.velocity: dict = {"x": 0.005, "y": 0, "z": 0.015}
        self.id_tournament = None
        self.game_loop_task = None
        self.match_data: dict = None
        self.id_match = None
        self.last_input: dict = {"player1": None, "player2": None}

    async def ball_wall_collision(self, new_ball_position: dict):
        half_width = self.table_game['width'] / 2

        if new_ball_position['x'] + self.radius >= half_width:
            new_ball_position['x'] = half_width - self.radius
            self.velocity['x'] *= -1

        elif new_ball_position['x'] - self.radius <= -half_width:
            new_ball_position['x'] = -half_width + self.radius
            self.velocity['x'] *= -1

    async def reset_ball(self, scoring_player: str):
        self.ball = {'x': 0, 'y': 0.12, 'z': 0}
        self.velocity = {'x': 0.001, 'y': 0.0, 'z': 0.015 if scoring_player == "left" else -0.015}

    async def normalize_velocity(self):
        magnitude = math.sqrt(self.velocity['x']**2 + self.velocity['z']**2)
        if magnitude > 0:
            # Calculate the normalized velocity
            normalized_x = self.velocity['x'] / magnitude
            normalized_z = self.velocity['z'] / magnitude
            
            # Apply the fixed speed, but limit it if the magnitude exceeds the fixed speed
            speed_limit = self.fixed_speed  # Define your speed limit (e.g., 10)
            
            # Ensure the speed does not exceed the limit
            if magnitude > speed_limit:
                self.velocity['x'] = normalized_x * speed_limit
                self.velocity['z'] = normalized_z * speed_limit
            else:
                # If the velocity is within the limit, just scale it to the fixed speed
                self.velocity['x'] = normalized_x * self.fixed_speed
                self.velocity['z'] = normalized_z * self.fixed_speed

    async def ball_paddle_collision(self, new_ball_position: dict):
        paddle = self.paddle1 if new_ball_position['z'] < 0 else self.paddle2
        half_paddle_width = self.paddle['width'] / 2
        half_paddle_height = self.paddle['height'] / 2

        if (abs(new_ball_position['z'] - paddle['z']) < half_paddle_height + self.radius and
            abs(new_ball_position['x'] - paddle['x']) < half_paddle_width + self.radius):
            self.velocity['z'] *= -1

            # Increase the speed of the ball
            self.velocity['x'] *= self.speed_increase_factor
            self.velocity['z'] *= self.speed_increase_factor

            # Limit the speed to the maximum speed
            magnitude = math.sqrt(self.velocity['x']**2 + self.velocity['z']**2)
            if magnitude > self.max_speed:
                scale = self.max_speed / magnitude
                self.velocity['x'] *= scale
                self.velocity['z'] *= scale

            if new_ball_position['z'] < 0:
                new_ball_position['z'] = paddle['z'] + half_paddle_height + self.radius
            else:
                new_ball_position['z'] = paddle['z'] - half_paddle_height - self.radius

        return new_ball_position   

class GameEvent:
    def __init__(self, consumer=None):
        self.consumer = consumer
        self.event_match = MatchInfo(consumer)
    
    async def send_ball_position(self):
        try:
            data = {'ball': self.event_match.ball, 'score_p1': self.event_match.score_p1, 'score_p2': self.event_match.score_p2,
                'id_game': self.event_match.game_id, 'velocity': self.event_match.velocity, 'winner': self.event_match.winner}
            await self.consumer.send_data({'type': 'ball', 'data': data})
        except Exception as e:
            pass

    async def send_end_game_data(self):
        try:
            data = {'winner': self.event_match.winner, 'score_p1': self.event_match.score_p1, 'score_p2': self.event_match.score_p2}
            await self.consumer.send_data({'type': 'end-game', 'data': data})
        except Exception as e:
            pass

    async def paddle_move(self, data: dict):
        try:
            table_width = self.event_match.table_game['width']
            half_width = table_width / 2
            move_amount = 0.3
            lerp_speed = 0.3 

            prev_pos_right = self.event_match.paddle2['x']
            prev_pos_left = self.event_match.paddle1['x']

            if data.get('direction') == 'right':
                if data.get('event') == 'ArrowRight':
                    target_position = min(prev_pos_right + move_amount, half_width - 0.4)  
                elif data.get('event') == 'ArrowLeft':
                    target_position = max(prev_pos_right - move_amount, -half_width + 0.4)
                else:
                    target_position = prev_pos_right  

                new_position = prev_pos_right + (target_position - prev_pos_right) * lerp_speed
                self.event_match.paddle2['x'] = new_position
                await self.consumer.send_data({'type': 'paddle', 'data': {'right_paddle': new_position}})
            elif data.get('direction') == 'left':
                if data.get('event') == 'D':
                    target_position = max(prev_pos_left - move_amount, -half_width + 0.4)
                elif data.get('event') == 'A':
                    target_position = min(prev_pos_left + move_amount, half_width - 0.4) 
                else:
                    target_position = prev_pos_left  

                new_position = prev_pos_left + (target_position - prev_pos_left) * lerp_speed
                self.event_match.paddle1['x'] = new_position
                await self.consumer.send_data({'type': 'paddle', 'data': {'left_paddle': new_position}})
        except Exception as e:
            pass
