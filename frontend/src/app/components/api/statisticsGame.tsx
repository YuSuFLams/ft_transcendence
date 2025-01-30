import axios from "axios";
import Cookie from 'js-cookie';
import React from "react";

export interface TournamentItem {
    players: string[];
    nameTournament: string;
    matches: { [stage: string]: string[] };
    type: "4-player" | "8-player";
    winner: string;
    date: string;
}

export interface GameHistoryItem {
	winner: string;
	gameId: string;
	player1: string;
	score: string;
	player2: string;
	type: "local" | "online";
}

export interface LeaderboardItem  { 
	player: string; 
	wins: number; 
	losses: number, 
	avatar:any 
};


const GameLocalData = async (
    setGameHistory: React.Dispatch<React.SetStateAction<GameHistoryItem[]>>
) => {
    try {
        const token = Cookie.get("access");
        if (!token) return;

        const response = await axios.get("http://localhost:8000/api/game/get-all-game", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = response.data;

        const gameHistoryItems = data.map((game: any) => {
            const data1: GameHistoryItem = {
                gameId: game.id, winner: game.winner,
                player1: game.player1,
                score: `${game.score_p1} - ${game.score_p2}`,
                player2: game.player2, type: "local",
            };
            return data1;
        });

        setGameHistory((prev) => [...prev, ...gameHistoryItems]);
    } catch (error) {
        console.error(error);
    }
};


const GameTournamentLocalData = async (setTournaments: React.Dispatch<React.SetStateAction<TournamentItem[]>>) => {

    try {
        const token = Cookie.get("access");
        if (!token) return;
  
        const response = await axios.get("http://localhost:8000/api/tournament/get-all-tournament", {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
  
        const data = response.data;
  
        const gameTournamentData = data.map((game: any) => {
            const playersArray = Object.values(game.players || {}) as string[]; 
            let matches: Record<string, any> = {}; 
  
            if (game.number_players === 8) {
                matches = {
                    "Quarter-Final": [
                        game.matches[1],
                        game.matches[2],
                        game.matches[3],
                        game.matches[4],
                    ],
                    "Semi-Final": [
                        game.matches[5], 
                        game.matches[6]
                    ],
                    Final: game.matches[7],
                };
            } else if (game.number_players === 4) {
                matches = {
                    "Semi-Final": [
                        game.matches[1], 
                        game.matches[2]
                    ],
                    Final: game.matches[3],
                };
            }
  
            const data1: TournamentItem = {
                nameTournament: game.name,
                players: playersArray,
                matches: matches,
                type: game.number_players === 8 ? "8-player" : "4-player",
                winner: game.winner_team,
                date: game.created_at.slice(0, 10),
            };
  
            return data1;
        });
  
        setTournaments((prev) => [...prev, ...gameTournamentData]);
    } catch (error) {
      console.error(error);
    }
};

export { GameLocalData, GameTournamentLocalData };
