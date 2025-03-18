from django.db import models

# Create your models here.
class GameLocal(models.Model):
    state = models.CharField(max_length=20, default='onprogress')
    player1 = models.CharField(max_length=100)
    player2 = models.CharField(max_length=100)
    score_p1 = models.IntegerField(default=0)
    score_p2 = models.IntegerField(default=0)
    winner = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Game {self.id}: {self.player1} vs {self.player2}"

# Game Tournament 
class Game(models.Model):
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

class TournamentLocal(models.Model):
    number_players = models.PositiveIntegerField(default=0)
    name = models.CharField(max_length=255)
    players = models.JSONField(default=dict)
    matches = models.JSONField(default=dict)
    winner_team = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=50, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def add_players(self, player_data):
        if not isinstance(player_data, dict):
            raise ValueError("Player data must be a dictionary.")
        self.players = player_data
        self.number_players = len(player_data)
        self.save()

    def generate_matches(self):
        if self.state != "pending":
            raise ValueError("Matches can only be generated when the tournament is pending.")

        player_ids = list(self.players.values())
        matches = {}
        match_id = 1

        for i in range(0, len(player_ids), 2):
            if i + 1 < len(player_ids):
                matches[str(match_id)] = {"player1": player_ids[i], "player2": player_ids[i + 1], "winner": None}
            else:
                matches[str(match_id)] = {"player1": player_ids[i], "player2": None, "winner": player_ids[i]}
            match_id += 1

        self.matches = matches
        self.state = "ongoing"
        self.save()

    def update_match(self, match_id, winner_id):
        if not self.matches or str(match_id) not in self.matches:
            raise KeyError(f"Match ID '{match_id}' does not exist.")

        if winner_id not in self.players.values():
            raise ValueError("Winner ID must be one of the players.")

        self.matches[str(match_id)]["winner"] = winner_id
        self.save()
        self._generate_next_match(str(match_id), winner_id)

    def _generate_next_match(self, match_id, winner_id):
        if self.state != "ongoing":
            return
        
        if self.number_players == 4 and match_id == "3" and self.matches["3"].get("winner"):
            self.winner_team = self.matches["3"]["winner"]
            self.state = "completed"
        elif self.number_players == 8 and match_id == "7" and self.matches["7"].get("winner"):
            self.winner_team = self.matches["7"]["winner"]
            self.state = "completed"

        if self.state == "completed":
            self.save()

        next_match_map = {
            4: {"1": "3", "2": "3"},
            8: {"1": "5", "2": "5", "3": "6", "4": "6", "5": "7", "6": "7"},
        }

        if self.number_players not in next_match_map:
            return

        next_match_id = next_match_map[self.number_players].get(match_id)
        if not next_match_id:
            return

        if next_match_id in self.matches:
            if self.matches[next_match_id]["player1"] is None:
                self.matches[next_match_id]["player1"] = winner_id
            elif self.matches[next_match_id]["player2"] is None:
                self.matches[next_match_id]["player2"] = winner_id
        else:
            self.matches[next_match_id] = {"player1": winner_id, "player2": None, "winner": None}

        self.save()

        if self.matches[next_match_id]["player1"] and self.matches[next_match_id]["player2"]:
            self.matches[next_match_id]["winner"] = None
            self.save()