
import Cookie from "js-cookie";

const removeData = () => {
    Cookie.remove("player1");
    Cookie.remove("player2");
    Cookie.remove("gameStarted");
    Cookie.remove("idGame");
    Cookie.remove("left_paddle");
    Cookie.remove("right_paddle");
    Cookie.remove("ball");
    Cookie.remove("velocity");
    Cookie.remove("gameCreated");
}


const handleExitGame = (
    socket: React.RefObject<WebSocket | null>,
    router: any
) => {
    const isStart = Cookie.get("gameStarted");
    if (socket.current && socket.current.readyState === WebSocket.OPEN && isStart) {
        try {
            socket.current.send(JSON.stringify({ action: "exitGame" }));
            socket.current.close(); // Close the socket on exit
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
        socket.current.send(JSON.stringify({ action: "startGame", player1: player1, player2: player2 }));
        Cookie.set("gameStarted", "true");
        setGameStarted(true);
    } else {
        console.warn("Socket is not ready or game already started.");
    }
};


const handleQuitGame = (
    socket: React.MutableRefObject<WebSocket | null>,
    router: any,
) => {

    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        try {
            // Send quit game message to the server
            socket.current.send( JSON.stringify({ action: "quitGame" }));

            // Remove cookies related to the game state
            removeData()
            // Navigate to the game-local page
            router.push("/game");
        } catch (error) {
            console.error("Error during quitting the game:", error);
        }
    } else {
        console.warn("WebSocket is not open or already closed.");
    }
};

export { handleExitGame, handleStartGame, removeData, handleQuitGame };