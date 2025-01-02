# chat/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

from .models import Channel, Message
from .serializers import ChannelSerializer, MessageSerializer

class ChannelListCreateView(viewsets.ModelViewSet):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer

class MessageListCreateView(APIView):
    def get(self, request, channel_id):
        """Retrieve all messages for a specific channel"""
        messages = Message.objects.filter(channel_id=channel_id)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, channel_id):
        """Create a new message in a specific channel"""
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(channel_id=channel_id, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
