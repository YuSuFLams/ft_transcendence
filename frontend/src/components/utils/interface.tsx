// game stats 
export interface TournamentItem {
    players: string[];
    nameTournament: string;
    matches: { [stage: string]: string[] };
    type: "4-player" | "8-player";
    winner: string;
    date: string;
	id: number;
}

export interface GameHistoryItem {
	winner: string;
	player1: string;
	score: string;
	player2: string;
	type: "local" | "online";
}

export interface LeaderboardItem  { 
	player: string; 
	wins: number; 
	losses: number;
	avatar:any ;
};

export interface PlayerGame {
	username: string;
	picture: any;
}
  
export interface PlayersProps {
	player1?: PlayerGame;
	player2?: PlayerGame;
	player3?: PlayerGame;
	player4?: PlayerGame;
	player5?: PlayerGame;
	player6?: PlayerGame;
	player7?: PlayerGame;
	player8?: PlayerGame;
	winner1?: PlayerGame;
	winner2?: PlayerGame;
	winner3?: PlayerGame;
	winner4?: PlayerGame;
	finalWinner1?: PlayerGame;
	finalWinner2?: PlayerGame;
}