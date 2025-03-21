import { getPlayers } from "@/components/api/tournament";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { checkInfoMatch } from "@/components/game/match-local/match";
import { listenConnection, openWebSocket } from "./socket";
import { removeData } from "@/components/game/match-local/match";


export const useGameLogic = () => {
    const router = useRouter();
    const token = Cookie.get("access");
    const socket = useRef<WebSocket | null>(null);

    // Player Left
    const [playerLeft, setPlayerLeft] = useState<string>("");
    const [positionPlayerPaddleLeft, setPositionPlayerPaddleLeft] = useState<number>(0);
    const [scorePlayerLeft, setScorePlayerLeft] = useState<number>(0);

    // Player Right
    const [playerRight, setPlayerRight] = useState<string>("");
    const [positionPlayerPaddleRight, setPositionPlayerPaddleRight] = useState<number>(0);
    const [scorePlayerRight, setScorePlayerRight] = useState<number>(0);

    // Ball
    const [ballPosition, setBallPosition] = useState<{ x: number; y: number; z: number }>({x: 0, y: 0.12, z: 0,});

    // Utils Match
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [ifGetPlayers, setIfGetPlayers] = useState<boolean>(false);
    const [idTournament, setIdTournament] = useState<number | null>(null);

    // Initial setup effect
    useEffect(() => {
        const id_match = Cookie.get("idMatch");
        if (!id_match) {
            removeData();
            router.push("/game/tournament/competition");
            return;
        }
        getPlayers(setPlayerLeft, setPlayerRight, setIfGetPlayers).then(() => {
            checkInfoMatch(setPlayerLeft, setPlayerRight, setPositionPlayerPaddleLeft, setPositionPlayerPaddleRight, setGameStarted);
            const isStarted = Cookie.get("gameStarted");
            const idTournamentFromCookie = Cookie.get("idTournament");
            if (isStarted) setGameStarted(true);
            if (idTournamentFromCookie) setIdTournament(parseInt(idTournamentFromCookie));
            if (!idTournamentFromCookie) router.push("/game/tournament");
        });
    }, [router]);

    // WebSocket connection effect
    useEffect(() => {
        if (ifGetPlayers && token) openWebSocket(token, socket);

        return () => {
            if (socket.current && socket.current.readyState === WebSocket.OPEN) socket.current.close();
        };
    }, [ifGetPlayers, token]);

    // Listen to WebSocket updates when game starts
    useEffect(() => {
        if (gameStarted) {
            listenConnection(socket, setBallPosition, setPositionPlayerPaddleRight, setPositionPlayerPaddleLeft, setScorePlayerLeft, setScorePlayerRight, setWinner );
        }
    }, [gameStarted]);

    return {
        playerLeft, setPlayerLeft, positionPlayerPaddleLeft, setPositionPlayerPaddleLeft, scorePlayerLeft, setScorePlayerLeft, playerRight,
        setPlayerRight, positionPlayerPaddleRight, setPositionPlayerPaddleRight, scorePlayerRight, setScorePlayerRight, ballPosition,
        setBallPosition, gameStarted, setGameStarted, winner, setWinner, idTournament, socket,
    };
};

