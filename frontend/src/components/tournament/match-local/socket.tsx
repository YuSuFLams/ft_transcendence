// websocketConnection.ts
import Cookie from "js-cookie";

export interface WebSocketMessage {
    type: string;
    data: any;
}

const handleOpenConnection = (socket: React.RefObject<WebSocket | null>) => {
    if (socket.current?.readyState !== WebSocket.OPEN) return;

    const game_started = Cookie.get("gameStarted");
    if (!game_started) return;

    const gameData = {
        score_p1: Cookie.get("score_p1"), score_p2: Cookie.get("score_p2"), idGame: Cookie.get("idGame"), 
        left_paddle: Cookie.get("left_paddle"), right_paddle: Cookie.get("right_paddle"), ball: Cookie.get("ball"), 
        velocity: Cookie.get("velocity"), idTournament: Cookie.get("idTournament"), idMatch: Cookie.get("idMatch")
    };

    if (!gameData.idTournament || !gameData.idMatch) return;

    socket.current.send(JSON.stringify({
        action: "reset-game", idMatch: gameData.idMatch, idTournament: gameData.idTournament, idGame: gameData.idGame || null, 
        left_paddle: gameData.left_paddle || null, right_paddle: gameData.right_paddle || null, ball: gameData.ball || null, 
        velocity: gameData.velocity || null, score_p1: gameData.score_p1 || null, score_p2: gameData.score_p2 || null
    }));
};


export interface GameState {
    ball: { x: number; y: number; z: number };
    score_p1: number;
    score_p2: number;
    left_paddle: number;
    right_paddle: number;
    velocity?: { x: number; y: number };
    winner?: string | null;
    id_game?: string;
    idGame?: string;
}

export const openWebSocket = ( token: string, socket: React.RefObject<WebSocket | null>) => {

    if (!token) return;
    
    const SOCKET_URL = `ws://localhost:8000/ws/match-local-tournament/?access_token=${token}`;
    socket.current = new WebSocket(SOCKET_URL);

    socket.current.onopen = () => {
        console.log("WebSocket connection opened");
        handleOpenConnection(socket);
    };

    socket.current.onerror = (error) => {console.error("WebSocket Error:", error);};

    socket.current.onclose = () => {console.log("WebSocket connection closed");};

    return () => {
        socket.current?.close();
        console.log("WebSocket connection cleaned up");
    };
};


const handleBallUpdate = (
    data: GameState,
    setters: {
        setBallPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number }>>;
        setScorePlayerLeft: React.Dispatch<React.SetStateAction<number>>;
        setScorePlayerRight: React.Dispatch<React.SetStateAction<number>>;
    }
) => {
    setters.setBallPosition(data.ball);
    setters.setScorePlayerLeft(data.score_p1);
    setters.setScorePlayerRight(data.score_p2);
    Cookie.set("idGame", data.id_game);

    if (data.winner === null) {
        Cookie.set("score_p1", data.score_p1.toString());
        Cookie.set("score_p2", data.score_p2.toString());
        Cookie.set("ball", JSON.stringify(data.ball));
        Cookie.set("velocity", JSON.stringify(data.velocity));
    }
};

const handlePaddleUpdate = (
    data: GameState,
    setters: {
        setPositionPlayerPaddleRight: React.Dispatch<React.SetStateAction<number>>;
        setPositionPlayerPaddleLeft: React.Dispatch<React.SetStateAction<number>>;
    }
) => {
    if (data.left_paddle != null) {
        setters.setPositionPlayerPaddleLeft(data.left_paddle);
        Cookie.set("left_paddle", data.left_paddle.toString());
    }
    if (data.right_paddle != null) {
        setters.setPositionPlayerPaddleRight(data.right_paddle);
        Cookie.set("right_paddle", data.right_paddle.toString());
    }
};

const handleMessage = (
    message: WebSocketMessage,
    setters: {
        setBallPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number }>>;
        setPositionPlayerPaddleRight: React.Dispatch<React.SetStateAction<number>>;
        setPositionPlayerPaddleLeft: React.Dispatch<React.SetStateAction<number>>;
        setScorePlayerLeft: React.Dispatch<React.SetStateAction<number>>;
        setScorePlayerRight: React.Dispatch<React.SetStateAction<number>>;
        setWinner: React.Dispatch<React.SetStateAction<string | null>>;
    }
) => {
    switch (message.type) {
        case "start-game":
            Cookie.set("idGame", message.data.idGame);
            break;

        case "ball":
            handleBallUpdate(message.data, setters);
            break;

        case "paddle":
            handlePaddleUpdate(message.data, setters);
            break;

        case "end-game":
            setTimeout(() => {
                setters.setWinner(message.data.winner);
                Cookie.remove("idMatch");
            }, 500);
            break;
    }
};

export const listenConnection = (
    socket: React.RefObject<WebSocket | null>,
    setBallPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number }>>,
    setPositionPlayerPaddleRight: React.Dispatch<React.SetStateAction<number>>,
    setPositionPlayerPaddleLeft: React.Dispatch<React.SetStateAction<number>>,
    setScorePlayerLeft: React.Dispatch<React.SetStateAction<number>>,
    setScorePlayerRight: React.Dispatch<React.SetStateAction<number>>,
    setWinner: React.Dispatch<React.SetStateAction<string | null>>
) => {
    if (!socket.current) return;

    socket.current.onmessage = async (event) => {
        try {
            const message = JSON.parse(event.data);
            handleMessage(message, {setBallPosition, setPositionPlayerPaddleRight, setPositionPlayerPaddleLeft, setScorePlayerLeft, setScorePlayerRight, setWinner});
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };
};