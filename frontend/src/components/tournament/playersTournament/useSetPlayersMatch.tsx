import Cookie from "js-cookie";
import { useEffect } from "react";

export const useSetPlayersMatch = (
    players8: any, numberPlayers: number, numberMatch: number, tournamentData: any, setRound: React.Dispatch<React.SetStateAction<string>>
) => {
    useEffect(() => {
        if (!players8 || !tournamentData?.matches) return;

        const matches = tournamentData.matches;
        const setPlayers = (p1: string, p2: string) => {
            Cookie.set("p1", p1);
            Cookie.set("p2", p2);
        };

        const config: { rounds: string[]; players: [string, string][]; } = numberPlayers === 8 ? {
            rounds: [
                "Quarter-Final 1", "Quarter-Final 2", "Quarter-Final 3", "Quarter-Final 4",
                "Semi-Final 1", "Semi-Final 2", "Final"
            ],
            players: [
                ["1", "2"], ["3", "4"], ["5", "6"], ["7", "8"],

                [matches["5"]?.player1 === matches["1"]?.player1 ? "1" : "2", matches["5"]?.player2 === matches["2"]?.player1 ? "3" : "4"],
                [matches["6"]?.player1 === matches["3"]?.player1 ? "5" : "6", matches["6"]?.player2 === matches["4"]?.player1 ? "7" : "8"],

                [matches["7"]?.player1 === matches["5"]?.player1 ? (matches["5"]?.player1 === matches["1"]?.player1 ? "1" : "2") : (matches["5"]?.player2 === matches["2"]?.player1 ? "3" : "4"),
                matches["7"]?.player2 === matches["6"]?.player1 ? (matches["6"]?.player1 === matches["3"]?.player1 ? "5" : "6") : (matches["6"]?.player2 === matches["4"]?.player1 ? "7" : "8")]
            ]
        } : {
            rounds: ["Semi-Final 1", "Semi-Final 2", "Final"],
            players: [
                ["1", "2"], ["3", "4"],
                [matches["3"]?.player1 === matches["1"]?.player1 ? "1" : "2", matches["3"]?.player2 === matches["2"]?.player1 ? "3" : "4"]
            ]
        };

        const matchIndex = numberMatch - 1;

        if (matchIndex < 0 || matchIndex >= config.players.length) return;

        setRound(config.rounds[matchIndex] || "Final");

        const players = config.players[matchIndex];
        if (!players || players.length < 2) return;

        setPlayers(...players);
    }, [players8, numberPlayers, numberMatch, tournamentData, setRound]);
};
