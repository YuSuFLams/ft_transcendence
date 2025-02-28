from rest_framework import serializers
from .models import TournamentLocal

class TournamentLocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentLocal
        fields = ['id', 'name', 'number_players', 'players', 'matches', 'winner_team', 'state', 'created_at', 'updated_at']
