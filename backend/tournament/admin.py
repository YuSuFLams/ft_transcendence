from django.contrib import admin
from .models import TournamentLocal, Game

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('id', 'player1', 'player2', 'score_p1', 'score_p2', 'winner', 'state', 'created_at', 'updated_at')

@admin.register(TournamentLocal)
class TournamentLocalAdmin(admin.ModelAdmin):
    list_display = ('id', 'number_players', 'name', 'display_players', 'display_matches', 'winner_team', 'state', 'created_at', 'updated_at')
    actions = ['start_tournament', 'generate_next_round']

    def display_players(self, obj):
        """Display a comma-separated list of players."""
        if isinstance(obj.players, dict):
            return ", ".join(obj.players.values()) or "No players"
        return "Invalid data"

    display_players.short_description = 'Players'

    def display_matches(self, obj):
        """Display formatted match details."""
        if isinstance(obj.matches, dict):
            return ", ".join([
                f"Match {match_id}: {details.get('player1', 'Unknown')} vs {details.get('player2', 'Unknown')} (Winner: {details.get('winner', 'TBD')})"
                for match_id, details in obj.matches.items()
            ]) or "No matches"
        return "Invalid data"

    display_matches.short_description = 'Matches'

    @admin.action(description='Start Tournament')
    def start_tournament(self, request, queryset):
        """Action to start the tournament by generating matches."""
        for tournament in queryset:
            try:
                tournament.generate_matches()
                self.message_user(request, f"Tournament '{tournament.name}' started successfully.")
            except ValueError as e:
                self.message_user(request, str(e), level='warning')

    @admin.action(description='Generate Next Round')
    def generate_next_round(self, request, queryset):
        """Action to generate the next round of matches."""
        for tournament in queryset:
            try:
                tournament.generate_next_round()
                if tournament.state == 'completed':
                    self.message_user(request, f"Tournament '{tournament.name}' has been completed. Winner: {tournament.winner_team}.")
                else:
                    self.message_user(request, f"Next round for Tournament '{tournament.name}' generated successfully.")
            except ValueError as e:
                self.message_user(request, str(e), level='warning')
