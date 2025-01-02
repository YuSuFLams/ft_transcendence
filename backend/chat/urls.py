# chat/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChannelListCreateView, MessageListCreateView

router = DefaultRouter()
router.register(r'channels', ChannelListCreateView)

urlpatterns = [
    path('channels/', include(router.urls)),
    path('channels/<int:channel_id>/messages/', MessageListCreateView.as_view(), name='message-list-create'),
]
