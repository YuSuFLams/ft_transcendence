import { useEffect } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { removeData } from "@/components/game/match-local/match";

export const useWinnerHandler = (winner: string | null, isDone: boolean, setIsDone: React.Dispatch<React.SetStateAction<boolean>>) => {
    const router = useRouter();

    useEffect(() => {
        let elapsedTime = 0;

        const intervalId = setInterval(() => {
            if (winner && !isDone) {
                elapsedTime += 1000;
                if (elapsedTime >= 10000) {
                    removeData();
                    Cookie.remove("idTournament")
                    Cookie.remove("idMatch")
                    setIsDone(true);
                    clearInterval(intervalId);
                    router.push("/game");
                }
            } else if (isDone) {
                clearInterval(intervalId);
            }
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [winner, isDone, setIsDone, router]);
};