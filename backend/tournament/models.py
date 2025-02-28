from django.db import models

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
    number_players = models.PositiveIntegerField(default=int)
    name = models.CharField(max_length=255)
    players = models.JSONField(default=dict)  # {"player1": "Youssef", "player2": "Taza", ...}
    matches = models.JSONField(default=dict)  # {"1": {"player1": 1, "player2": 2, "winner": None}, ...}
    winner_team = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=50, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def add_players(self, player_data):
        """Add players from a dictionary."""
        if not isinstance(player_data, dict):
            raise ValueError("Player data must be a dictionary.")

        self.players = player_data
        self.number_players = len(player_data)
        self.save()

    def generate_matches(self):
        """Generate initial matches based on the number of players."""
        if self.state != "pending":
            raise ValueError("Matches can only be generated when the tournament is pending.")

        player_ids = list(self.players.values())
        matches = {}
        match_id = 1

        for i in range(0, len(player_ids), 2):
            if i + 1 < len(player_ids):
                matches[str(match_id)] = {
                    "player1": player_ids[i],
                    "player2": player_ids[i + 1],
                    "winner": None,
                }
                match_id += 1

        self.matches = matches
        self.state = "ongoing"
        self.save()

    def update_match(self, match_id, winner_id):
        """Update the winner of a specific match."""
        if not self.matches or match_id not in self.matches:
            raise KeyError(f"Match ID '{match_id}' does not exist.")

        if winner_id not in self.players.values():
            raise ValueError("Winner ID must be one of the players.")

        self.matches[match_id]["winner"] = winner_id
        self.save()

    def generate_next_round(self):
        """
        Generate matches for the next round based on winners,
        handling both 4 and 8 player tournaments.
        """
        if self.state != "ongoing":
            raise ValueError("Next round can only be generated when the tournament is ongoing.")

        # Collect current winners from the existing matches
        current_winners = [
            match["winner"]
            for match in self.matches.values()
            if match["winner"]
        ]

        # Check if all matches in the current round have winners
        if len(current_winners) < len(self.matches):
            print("Not all matches have winners yet.")
            return

        # If there are 4 players, ensure 3 matches: 2 semi-finals and 1 final
        if self.number_players == 4:
            if len(self.matches) < 3:  # Semi-finals and final haven't been created yet
                # Add semi-finals
                next_match_id = len(self.matches) + 1
                for i in range(0, len(current_winners), 2):
                    if i + 1 < len(current_winners):
                        self.matches[str(next_match_id)] = {
                            "player1": current_winners[i],
                            "player2": current_winners[i + 1],
                            "winner": None,
                        }
                        next_match_id += 1

            # If semi-finals are complete, create the final match
            elif len(self.matches) == 2:  # Semi-finals complete, generate the final
                semi_final_winners = [
                    match["winner"]
                    for match_id, match in self.matches.items()
                    if match_id in ["1", "2"] and match["winner"]
                ]
                if len(semi_final_winners) == 2:
                    self.matches["3"] = {
                        "player1": semi_final_winners[0],
                        "player2": semi_final_winners[1],
                        "winner": None,
                    }

            # If the final is complete, set the winner
            elif "3" in self.matches and self.matches["3"]["winner"]:
                self.winner_team = self.matches["3"]["winner"]
                self.state = "completed"
                print(f"Tournament completed! Winner: {self.winner_team}")

        # If there are 8 players, ensure 7 matches: 4 quarter-finals, 2 semi-finals, and 1 final
        elif self.number_players == 8:
            if len(self.matches) < 5:  # Add semi-finals
                next_match_id = len(self.matches) + 1
                for i in range(0, len(current_winners), 2):
                    if i + 1 < len(current_winners):
                        self.matches[str(next_match_id)] = {
                            "player1": current_winners[i],
                            "player2": current_winners[i + 1],
                            "winner": None,
                        }
                        next_match_id += 1

            # If semi-finals are complete, create the final match
            elif len(self.matches) == 6:  # Semi-finals complete, generate the final
                semi_final_winners = [
                    match["winner"]
                    for match_id, match in self.matches.items()
                    if match_id in ["5", "6"] and match["winner"]
                ]
                if len(semi_final_winners) == 2:
                    self.matches["7"] = {
                        "player1": semi_final_winners[0],
                        "player2": semi_final_winners[1],
                        "winner": None,
                    }

            # If the final is complete, set the winner
            elif "7" in self.matches and self.matches["7"]["winner"]:
                self.winner_team = self.matches["7"]["winner"]
                self.state = "completed"
                print(f"Tournament completed! Winner: {self.winner_team}")

        # Save the updated tournament
        self.save()


