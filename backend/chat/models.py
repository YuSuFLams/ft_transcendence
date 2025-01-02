# chat/models.py
from django.db import models
from django.contrib.auth.models import User

class Channel(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Message(models.Model):
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message by {self.user.username} in {self.channel.name}"
