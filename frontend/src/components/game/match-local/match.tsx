import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

const checkInfoMatch = (
    setPlayerLeft: React.Dispatch<React.SetStateAction<string>>,
    setPlayerRight: React.Dispatch<React.SetStateAction<string>>,
    setPositionPlayerPaddleLeft: React.Dispatch<React.SetStateAction<number>>,
    setPositionPlayerPaddleRight: React.Dispatch<React.SetStateAction<number>>,
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const playerleft = Cookie.get("player1");
    if (playerleft) setPlayerLeft(playerleft);
    const playerright = Cookie.get("player2");
    if (playerright) setPlayerRight(playerright);
    const paddleLeft = Cookie.get("left_paddle");
    if (paddleLeft) setPositionPlayerPaddleLeft(parseFloat(paddleLeft));
    const paddleRight = Cookie.get("right_paddle");
    if (paddleRight) setPositionPlayerPaddleRight(parseFloat(paddleRight));
    const game_started = Cookie.get("gameStarted");
    if (game_started) setGameStarted(true);
}

const removeData = () => {
    Cookie.remove("right_paddle");
    Cookie.remove("left_paddle");
    Cookie.remove("gameStarted");
    Cookie.remove("gameCreated");
    Cookie.remove("score_p1");
    Cookie.remove("score_p2");
    Cookie.remove("velocity");
    Cookie.remove("player1");
    Cookie.remove("player2");
    Cookie.remove("idGame");
    Cookie.remove("ball");
}

const handleQuitGame = (
    socket?: React.RefObject<WebSocket | null>,
    router?: ReturnType<typeof useRouter>
) => {
    if (!socket) return;
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        try {
            socket.current.send( JSON.stringify({ action: "quit-game" }));
            removeData()
            router?.push("/game");
        } catch (error) {
            console.error("Error during quitting the game:", error);
        }
    } else {
        console.warn("WebSocket is not open or already closed.");
    }
};

const handleExitGame = (
    socket: React.RefObject<WebSocket | null>,
    router: ReturnType<typeof useRouter>
) => {
    const isStart = Cookie.get("gameStarted");
    if (socket.current && socket.current.readyState === WebSocket.OPEN && isStart) {
        try {
            socket.current.send(JSON.stringify({ action: "exit-game" }));
            socket.current.close();
        } catch (error) {
            console.error("Error during exit game:", error);
        }
    } else {
        console.warn("WebSocket is not open or already closed.");
    }
    router.push("/game");
    removeData();
};

const handleStartGame = (
    socket: React.RefObject<WebSocket | null>,
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
    player1: string,
    player2: string,
) => {
    const isStart = Cookie.get("gameStarted");
    if (socket.current && socket.current.readyState === WebSocket.OPEN && !isStart) {
        socket.current.send(JSON.stringify({ action: "start-game", player1: player1, player2: player2 }));
        Cookie.set("gameStarted", "true");
        setGameStarted(true);
    } else {
        console.warn("Socket is not ready or game already started.");
    }
};

export { removeData, handleQuitGame, handleExitGame, handleStartGame, checkInfoMatch };