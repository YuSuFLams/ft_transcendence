import React from "react";
import Cookie from "js-cookie";

const handleCreateGame = (
    player1: string,
    player2: string,
    setGameCreated: React.Dispatch<React.SetStateAction<boolean>>,
    setPlayer1Error: React.Dispatch<React.SetStateAction<string>>,
    setPlayer2Error: React.Dispatch<React.SetStateAction<string>>
) => {
    // Trim the inputs and validate
    const trimmedPlayer1 = player1.trim();
    const trimmedPlayer2 = player2.trim();

    let valid = true;
    
    if (!trimmedPlayer1) {
        setPlayer1Error("Player 1 name cannot be empty!");
        valid = false;
    } else {
        setPlayer1Error("");
    }

    if (!trimmedPlayer2) {
        setPlayer2Error("Player 2 name cannot be empty!");
        valid = false;
    } else {
        setPlayer2Error("");
    }

    if (valid) {
        setGameCreated(true);
        Cookie.set("player1", trimmedPlayer1);
        Cookie.set("player2", trimmedPlayer2);
    }
};

const removeData = () => {
    Cookie.remove("player1");
    Cookie.remove("player2");
    Cookie.remove("game_created");
    Cookie.remove("gameStarted");
    Cookie.remove("id_game");
    Cookie.remove("left_paddle_position");
    Cookie.remove("right_paddle_position");
    Cookie.remove("ball_position");
    Cookie.remove("velocity");
}

const handleExitGame = (
    socket: React.RefObject<WebSocket | null>,
    router: any
) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        try {
            removeData();
            socket.current.send(JSON.stringify({ action: "exitGame" }));
            socket.current.close(); // Close the socket on exit
            router.push("/game");
        } catch (error) {
            console.error("Error during exit game:", error);
        }
    } else {
        console.warn("WebSocket is not open or already closed.");
    }
};

const handleStartGame = (
    socket: React.RefObject<WebSocket | null>,
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const isStart = Cookie.get("gameStarted");
    if (socket.current && socket.current.readyState === WebSocket.OPEN && !isStart) {
        socket.current.send(JSON.stringify({ action: "startGame" }));
        Cookie.set("gameStarted", "true");
        setGameStarted(true);
    } else {
        console.warn("Socket is not ready or game already started.");
    }
};

export { handleCreateGame, handleExitGame, handleStartGame };