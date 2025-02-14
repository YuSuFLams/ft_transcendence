// game stats 
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