from django.contrib import admin

# Register your models here.
from .models import GameLocal

@admin.register(GameLocal)
class GameLocalAdmin(admin.ModelAdmin):
    list_display = ('id', 'player1', 'player2', 'score_p1', 'score_p2', 'winner', 'state', 'created_at', 'updated_at')
