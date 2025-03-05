import os
import jwt
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.middleware import BaseMiddleware
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
from game.routing import websocket_urlpatterns as game_websocket_urlpatterns
from tournament.routing import websocket_urlpatterns as tournament_websocket_urlpatterns


User = get_user_model()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auth.settings')

class WebSocketJWTAuthenticationMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        scope['user'] = AnonymousUser()
        query_string = scope.get('query_string', b'').decode('utf-8')
        token = parse_qs(query_string).get('access_token', [None])[0]

        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload.get('user_id')
                user = await self.get_user(user_id)
                scope['user'] = user
            except jwt.ExpiredSignatureError:
                print("Token expired.")
            except jwt.InvalidTokenError:
                print("Invalid token.")

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()

from chat.routing import websocket_urlpatterns as wb_chat
from users.routing import websocket_urlpatterns as wb_user

websocket_urlpatterns = game_websocket_urlpatterns + tournament_websocket_urlpatterns + wb_chat + wb_user


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        WebSocketJWTAuthenticationMiddleware(
            URLRouter(
                websocket_urlpatterns
            )
        )
    ),
})
