from django.urls import re_path, path
from .local import PingPongGameLocal
from .tournament import PingPongMatchTournamentLocal


websocket_urlpatterns = [
    re_path('ws/ping-pong-game-local/', PingPongGameLocal.as_asgi()),
    re_path('ws/match-local-tournament/', PingPongMatchTournamentLocal.as_asgi()),

]
 