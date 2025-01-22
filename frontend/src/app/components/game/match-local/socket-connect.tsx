import Cookie from "js-cookie";
import { removeData } from "./event-prematch-local";

const openWebSocket = (
    token: string,
    socket: React.MutableRefObject<WebSocket | null>,
) => {
    if (!token) return;
    
    const SOCKET_URL = `ws://localhost:8000/ws/ping-pong-game-local/?access_token=${token}`;

    socket.current = new WebSocket(SOCKET_URL);

    socket.current.onopen = () => {
        console.log("WebSocket connection opened");
		if (socket.current?.readyState === WebSocket.OPEN) {
			const game_started = Cookie.get("gameStarted");
			if (game_started) {
                const idGame = Cookie.get("idGame");
                const left_paddle = Cookie.get("left_paddle");
                const right_paddle = Cookie.get("right_paddle");
                const ball = Cookie.get("ball");
                const velocity = Cookie.get("velocity");
                socket.current.send(JSON.stringify({ action: "resetGame", idGame: idGame ? idGame : null, 
                    left_paddle: left_paddle ? left_paddle : null, right_paddle: right_paddle? right_paddle : null, 
                    ball:ball ? ball : null, velocity: velocity ? velocity : null }));
            }
        }
    };

    socket.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };

    socket.current.onclose = () => {
        console.log("WebSocket connection closed");
    };

    return () => {
        socket.current?.close();
        
        console.log("WebSocket connection cleaned up");
    };
}

const listenConnection = (
    socket: React.MutableRefObject<WebSocket | null>, 
    setBallPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number }>>,
    setScorePlayerLeft: React.Dispatch<React.SetStateAction<number>>,
    setScorePlayerRight: React.Dispatch<React.SetStateAction<number>>,
    setWinner: React.Dispatch<React.SetStateAction<string | null>>
) => {
    if (!socket.current) return;
    socket.current.onmessage = async (event) => {
        try {
            const message = JSON.parse(event.data);
            if (message.type === "startGame") {
                const idGame = message.data.idGame;
                Cookie.set("idGame", idGame);
            }
            if(message.type === "ball") {
                setBallPosition(message.data.ball);
                setScorePlayerLeft(message.data.score_p1);
                setScorePlayerRight(message.data.score_p2);
                const IdGame = message.data.id_game;
                Cookie.set("idGame", IdGame);
                if (message.data.winner === null){
                    Cookie.set("ball", JSON.stringify(message.data.ball));
                    Cookie.set("velocity", JSON.stringify(message.data.velocity));
                }
            }
            if (message.type === "endGame") {
                setTimeout(() => {
                    setWinner(message.data.winner);
                }, 500);
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };
}


export { openWebSocket, listenConnection };