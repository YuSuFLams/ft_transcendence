from django.urls import re_path
from .consumers import NotifConsumer

websocket_urlpatterns = [
    re_path(r'ws/notif/$', NotifConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<id>\d+)/$', NotifConsumer.as_asgi()),
]