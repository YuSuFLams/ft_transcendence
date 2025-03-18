import { useState, useRef, useEffect } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { checkInfoMatch, removeData } from "@/components/game/match-local/match";
import { listenConnection, openWebSocket } from "@/components/game/match-local/during-match/socket";

export const useGameLogic = () => {
    // Player Left 
    const [playerLeft, setPlayerLeft] = useState<string>("");
    const [positionPlayerPaddleLeft, setPositionPlayerPaddleLeft] = useState<number>(0);
    const [scorePlayerLeft, setScorePlayerLeft] = useState<number>(0);
    
    // Player Right
    const [playerRight, setPlayerRight] = useState<string>("");
    const [positionPlayerPaddleRight, setPositionPlayerPaddleRight] = useState<number>(0);
    const [scorePlayerRight, setScorePlayerRight] = useState<number>(0);

    // Ball
    const [ballPosition, setBallPosition] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0.12, z: 0 });

    // Utils Match
    const router = useRouter();
    const token = Cookie.get("access");
    const socket = useRef<WebSocket | null>(null);
    const [isDone, setIsDone] = useState<boolean>(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [gameStarted, setGameStarted] = useState<boolean>(false);

    useEffect(() => {
        const isCreate = Cookie.get("gameCreated");
        if (!isCreate) router.push("/game/game-local");   
        checkInfoMatch(setPlayerLeft, setPlayerRight, setPositionPlayerPaddleLeft, setPositionPlayerPaddleRight, setGameStarted);
    }, [gameStarted, playerLeft, playerRight, router]);

    useEffect(() => {
        if (token) openWebSocket(token, socket);

        return () => {
            if (socket.current && socket.current.readyState === WebSocket.OPEN) {
                socket.current.send(JSON.stringify({ action: "close-game" }));
                removeData();
                socket.current.close();
            }
        };
    }, [playerLeft, playerRight, token]);

    useEffect(() => {
        if (gameStarted) {listenConnection(socket, setBallPosition, setPositionPlayerPaddleRight, setPositionPlayerPaddleLeft, setScorePlayerLeft, setScorePlayerRight, setWinner);}
    }, [gameStarted]);

    return { 
        playerLeft, playerRight, positionPlayerPaddleLeft, positionPlayerPaddleRight, scorePlayerLeft, scorePlayerRight, 
        ballPosition, gameStarted, winner, isDone, setIsDone, socket, setGameStarted,
    };
};