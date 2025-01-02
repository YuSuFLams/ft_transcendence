# chat/serializers.py
from rest_framework import serializers
from .models import Channel, Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'channel', 'user', 'content', 'timestamp']

class ChannelSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Channel
        fields = ['id', 'name', 'description', 'messages']
