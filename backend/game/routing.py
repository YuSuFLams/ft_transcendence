from django.urls import re_path, path
from .consumers import PingPongGameLocal

websocket_urlpatterns = [
    re_path('ws/ping-pong-game-local/', PingPongGameLocal.as_asgi()),
]
 