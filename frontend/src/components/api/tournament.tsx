import { ErrorState, validateInput } from "@/components/tournament/index/index-utils";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import axios from "axios";

const handleCreateTournament = async (
    nameTournament: string, players: Record<string, string>, numPlayers: number,
    setErrors: React.Dispatch<React.SetStateAction<ErrorState>>, router: ReturnType<typeof useRouter>
) => {
    if (validateInput(nameTournament, players, setErrors)) {
        const token = Cookie.get("access");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const data = {numberPlayers: numPlayers, tournamentName: nameTournament, playerNames: players};
            const response = await axios.post("http://localhost:8000/api/game/local-tournament/", data,{
                headers: {Authorization: `Bearer ${token}`},
                }
            );

            if (response.data) {
                Cookie.set("idTournament", response.data.tournament_id);
                router.push(`/game/tournament/competition`);
            }
        } catch (error) {
            console.error("Error creating the tournament:", error);
        }
    }
};

const getPlayers = async (
    setPlayerLeft: React.Dispatch<React.SetStateAction<string>>,
    setPlayerRight: React.Dispatch<React.SetStateAction<string>>,
    setIfGetPlayers: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        const token = Cookie.get("access");
        const idMatch = Cookie.get("idMatch");
        const idTournament = Cookie.get("idTournament");

        if (!token || !idMatch || !idTournament) return;

        const response = await axios.get(`http://localhost:8000/api/game/local-tournament/match/${idTournament}/${idMatch}/`, {
            headers: {Authorization: `Bearer ${token}`},
        });

        if (!response.data) {
            console.error("No data received from API");
            return;
        }
        setPlayerLeft(response.data.player1);
        setPlayerRight(response.data.player2);
        setIfGetPlayers(true);
    } catch (error) {
        console.error("An error occurred:", error);
    }
};

const getTournamentLocalByID = async (id: string) => {
    try {
        const token = Cookie.get("access");
        if (!token) {
            console.error("No access token found");
            return null;
        }
        const response = await axios.get(`http://localhost:8000/api/game/local-tournament/${id}/`, {
            headers: {Authorization: `Bearer ${token}`},
        });

        if (!response.data) {
            console.error("No data received from API");
            return null;
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching tournament data:", error);
        return null;
    }
};


export { handleCreateTournament, getTournamentLocalByID, getPlayers };