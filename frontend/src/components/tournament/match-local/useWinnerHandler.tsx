import { removeData } from "@/components/game/match-local/match";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useWinnerHandler = (winner: string | null, idTournament: number | null, setWinner: React.Dispatch<React.SetStateAction<string | null>>) => {
    const router = useRouter();

    useEffect(() => {
        if (winner) {
            const timeout = setTimeout(() => {
                removeData();
                router.push(`/game/tournament/competition`);
                console.log("Winner detected, redirecting...");
                setWinner(null);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [winner, idTournament, router, setWinner]);
};