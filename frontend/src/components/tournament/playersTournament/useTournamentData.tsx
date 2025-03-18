import { useEffect } from "react";
import default_img from "@/../public/Image/default_img.png";
import picture1 from "@/../public/Image/picture1.jpg";
import picture2 from "@/../public/Image/picture2.jpg";
import picture3 from "@/../public/Image/picture3.jpg";
import picture4 from "@/../public/Image/picture4.jpg";
import picture5 from "@/../public/Image/picture5.jpg";
import picture6 from "@/../public/Image/picture6.jpg";
import picture7 from "@/../public/Image/picture7.jpg";
import picture8 from "@/../public/Image/picture8.jpg";
import { PlayersProps } from "@/components/utils/interface";

const pictures = { picture1, picture2, picture3, picture4, picture5, picture6, picture7, picture8 };

// Helper function to determine picture for winners
const getWinnerPicture = (username: string | undefined, matchKey: string, matches: any): any => {
    if (!username || username === "?") return default_img;

    const match = matches[matchKey];
    if (!match) return default_img;

    const getPicture = (key: string) => pictures[`picture${key}`] || default_img;

    switch (matchKey) {
        case "3":
            return match.player1 === username? getPicture(matches["1"].player1 === username ? "1" : "2"): getPicture(matches["2"].player1 === username ? "3" : "4");
        case "5":
            return match.player1 === username? getPicture(matches["1"].player1 === username ? "1" : "2"): getPicture(matches["2"].player1 === username ? "3" : "4");
        case "6":
            return match.player1 === username? getPicture(matches["3"].player1 === username ? "5" : "6"): getPicture(matches["4"].player1 === username ? "7" : "8");
        case "7":
            return match.player1 === username? getWinnerPicture(match.player1, "5", matches): getWinnerPicture(match.player2, "6", matches);
        default:
            return default_img;
    }
};

// Helper function to create player objects
const createPlayer = (matchKey: number, playerKey: "player1" | "player2", matches: any) => ({
    username: matches[matchKey]?.[playerKey] || "?",
    picture: pictures[`picture${String(matchKey * 2 - (playerKey === "player1" ? 1 : 0))}`] || default_img,
});

export const useTournamentData = (
    tournamentData: any, setNumberPlayers: React.Dispatch<React.SetStateAction<number>>,
    setPlayers8: React.Dispatch<React.SetStateAction<PlayersProps>>,
    setWinnerTournament: React.Dispatch<React.SetStateAction<string | null>>,
    setNumberMatch: React.Dispatch<React.SetStateAction<number>>
) => {
    useEffect(() => {
        if (!tournamentData) return;

        const { matches = {}, winner_team, number_players } = tournamentData;

        // Set current match number
        const currentMatch = Object.keys(matches).find((key) => matches[key]?.winner === null);
        setNumberMatch(currentMatch ? parseInt(currentMatch, 10) : 0);

        // Set basic tournament info
        setWinnerTournament(winner_team || null);
        setNumberPlayers(number_players || 0);

        if (!matches || !number_players) return;

        // Create players object based on number of players
        const players: PlayersProps = {};

        if (number_players === 8) {
            for (let i = 1; i <= 4; i++) {
                players[`player${i * 2 - 1}`] = createPlayer(i, "player1", matches);
                players[`player${i * 2}`] = createPlayer(i, "player2", matches);
            }
            players.winner1 = { username: matches["5"]?.player1 || "?", picture: getWinnerPicture(matches["5"]?.player1, "5", matches) };
            players.winner2 = { username: matches["5"]?.player2 || "?", picture: getWinnerPicture(matches["5"]?.player2, "5", matches) };
            players.winner3 = { username: matches["6"]?.player1 || "?", picture: getWinnerPicture(matches["6"]?.player1, "6", matches) };
            players.winner4 = { username: matches["6"]?.player2 || "?", picture: getWinnerPicture(matches["6"]?.player2, "6", matches) };
            players.finalWinner1 = { username: matches["7"]?.player1 || "?", picture: getWinnerPicture(matches["7"]?.player1, "7", matches) };
            players.finalWinner2 = { username: matches["7"]?.player2 || "?", picture: getWinnerPicture(matches["7"]?.player2, "7", matches) };
        } else if (number_players === 4) {
            players.winner1 = createPlayer(1, "player1", matches);
            players.winner2 = createPlayer(1, "player2", matches);
            players.winner3 = createPlayer(2, "player1", matches);
            players.winner4 = createPlayer(2, "player2", matches);
            players.finalWinner1 = { username: matches["3"]?.player1 || "?", picture: getWinnerPicture(matches["3"]?.player1, "3", matches) };
            players.finalWinner2 = { username: matches["3"]?.player2 || "?", picture: getWinnerPicture(matches["3"]?.player2, "3", matches) };
        }

        setPlayers8(players);
    }, [tournamentData, setNumberPlayers, setPlayers8, setWinnerTournament, setNumberMatch]);
};