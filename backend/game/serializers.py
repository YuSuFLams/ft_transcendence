
# from django.contrib.auth.models import User
from rest_framework import serializers
from .models import GameLocal, TournamentLocal


class GameLocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameLocal
        fields = ['id', 'player1', 'player2', 'score_p1', 'score_p2', 'winner', 'state', 'created_at', 'updated_at']

class TournamentLocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentLocal
        fields = ['id', 'name', 'number_players', 'players', 'matches', 'winner_team', 'state', 'created_at', 'updated_at']
