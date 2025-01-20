from django.urls import re_path, path
from .consumers import PingPongMatchTournamentLocal

websocket_urlpatterns = [
    re_path('ws/match-local-tournament/', PingPongMatchTournamentLocal.as_asgi()),
]
 