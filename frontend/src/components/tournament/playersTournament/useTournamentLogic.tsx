import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTournamentLocalByID } from "@/components/api/tournament";
import { PlayersProps } from "@/components/utils/interface";

export const useTournamentLogic = () => {
    // Utils Tournament
    const router = useRouter();
    const [numberPlayers, setNumberPlayers] = useState<number>(4);
    const [tournamentData, setTournamentData] = useState<any | null>(null);
    const [players8, setPlayers8] = useState<PlayersProps>({} as PlayersProps);
    const [winnerTournament, setWinnerTournament] = useState<string | null>(null);
    const [isDone, setIsDone] = useState<boolean>(false);
    const [numberMatch, setNumberMatch] = useState<number>(1);
    const [round, setRound] = useState<string>("");
    
    // Get Tournament Data by ID
    useEffect(() => {
        const id = Cookie.get("idTournament");
        if (id) {
            const parsedId = parseInt(id, 10);
            if (!isNaN(parsedId)) {
                getTournamentLocalByID(id).then((data) => {if (data) setTournamentData(data);});
            }
        } else {
            router.push("/game/tournament");
        }
    }, []);

    return {
        numberPlayers, setNumberPlayers, tournamentData, players8, setPlayers8, winnerTournament, 
        setWinnerTournament, isDone, setIsDone, numberMatch, setNumberMatch, router, round, setRound
    };
}