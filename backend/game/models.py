from django.db import models

# Create your models here.
class GameLocal(models.Model):
    player1 = models.CharField(max_length=255)
    player2 = models.CharField(max_length=255)
    score_p1 = models.IntegerField(default=0)
    score_p2 = models.IntegerField(default=0)
    winner = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=50, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.player1} vs {self.player2} - Winner: {self.winner if self.winner else 'Pending'}"