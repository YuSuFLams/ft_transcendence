import Cookie from "js-cookie";
import React from "react";

// Define types for WebSocket messages and data
type WebSocketMessage = {
    type: string;
    data: any;
};

export type BallPosition = { x: number; y: number; z: number };

// Constants for cookie keys
const COOKIE_KEYS = {
    GAME_STARTED: "gameStarted",
    ID_GAME: "idGame",
    LEFT_PADDLE: "left_paddle",
    RIGHT_PADDLE: "right_paddle",
    BALL: "ball",
    VELOCITY: "velocity",
    SCORE_P1: "score_p1",
    SCORE_P2: "score_p2",
};

const getCookie = (key: string) => Cookie.get(key);
const setCookie = (key: string, value: string) => Cookie.set(key, value);

const openWebSocket = (token: string, socket: React.RefObject<WebSocket | null>) => {
    if (!token) {
        console.error("Token is required to open WebSocket connection.");
        return;
    }

    const SOCKET_URL = `ws://localhost:8000/ws/ping-pong-game-local/?access_token=${token}`;

    socket.current = new WebSocket(SOCKET_URL);

    socket.current.onopen = () => {

        if (socket.current?.readyState === WebSocket.OPEN) {
            const gameStarted = getCookie(COOKIE_KEYS.GAME_STARTED);
            if (gameStarted) {
                const idGame = getCookie(COOKIE_KEYS.ID_GAME);
                const leftPaddle = getCookie(COOKIE_KEYS.LEFT_PADDLE);
                const rightPaddle = getCookie(COOKIE_KEYS.RIGHT_PADDLE);
                const ball = getCookie(COOKIE_KEYS.BALL);
                const velocity = getCookie(COOKIE_KEYS.VELOCITY);
                const scoreP1 = getCookie(COOKIE_KEYS.SCORE_P1);
                const scoreP2 = getCookie(COOKIE_KEYS.SCORE_P2);

                const resetGameMessage = { action: "reset-game", idGame: idGame || null, left_paddle: leftPaddle || null,
                    right_paddle: rightPaddle || null, ball: ball || null, velocity: velocity || null,
                    score_p1: scoreP1 || null, score_p2: scoreP2 || null
                };

                socket.current.send(JSON.stringify(resetGameMessage));
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
    };
};

// Listen to WebSocket messages
const listenConnection = (
    socket: React.RefObject<WebSocket | null>,
    setBallPosition: React.Dispatch<React.SetStateAction<BallPosition>>,
    setPositionPlayerPaddleRight: React.Dispatch<React.SetStateAction<number>>,
    setPositionPlayerPaddleLeft: React.Dispatch<React.SetStateAction<number>>,
    setScorePlayerLeft: React.Dispatch<React.SetStateAction<number>>,
    setScorePlayerRight: React.Dispatch<React.SetStateAction<number>>,
    setWinner: React.Dispatch<React.SetStateAction<string | null>>
) => {
    if (!socket.current) {
        console.error("WebSocket connection is not established.");
        return;
    }

    socket.current.onmessage = async (event) => {
        try {
            const message: WebSocketMessage = JSON.parse(event.data);

            switch (message.type) {
                case "start-game":
                    handleStartGameMessage(message);
                    break;

                case "ball":
                    handleBallMessage(message, setBallPosition, setScorePlayerLeft, setScorePlayerRight);
                    break;

                case "paddle":
                    handlePaddleMessage(message, setPositionPlayerPaddleLeft, setPositionPlayerPaddleRight);
                    break;

                case "end-game":
                    handleEndGameMessage(message, setWinner);
                    break;

                default:
                    console.warn("Unknown message type:", message.type);
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };
};

// Handle "startGame" messages
const handleStartGameMessage = (message: WebSocketMessage) => {
    const idGame = message.data.idGame;
    if (idGame) {
        setCookie(COOKIE_KEYS.ID_GAME, idGame);
    }
};

// Handle "ball" messages
const handleBallMessage = (
    message: WebSocketMessage,
    setBallPosition: React.Dispatch<React.SetStateAction<BallPosition>>,
    setScorePlayerLeft: React.Dispatch<React.SetStateAction<number>>,
    setScorePlayerRight: React.Dispatch<React.SetStateAction<number>>
) => {
    setBallPosition(message.data.ball);
    setScorePlayerLeft(message.data.score_p1);
    setScorePlayerRight(message.data.score_p2);

    const idGame = message.data.id_game;
    if (idGame) {
        setCookie(COOKIE_KEYS.ID_GAME, idGame);
    }

    if (message.data.winner === null) {
        setCookie(COOKIE_KEYS.SCORE_P1, message.data.score_p1.toString());
        setCookie(COOKIE_KEYS.SCORE_P2, message.data.score_p2.toString());
        setCookie(COOKIE_KEYS.BALL, JSON.stringify(message.data.ball));
        setCookie(COOKIE_KEYS.VELOCITY, JSON.stringify(message.data.velocity));
    }
};

// Handle "paddle" messages
const handlePaddleMessage = (
    message: WebSocketMessage,
    setPositionPlayerPaddleLeft: React.Dispatch<React.SetStateAction<number>>,
    setPositionPlayerPaddleRight: React.Dispatch<React.SetStateAction<number>>
) => {
    if (message.data.left_paddle != null) {
        setPositionPlayerPaddleLeft(message.data.left_paddle);
        setCookie(COOKIE_KEYS.LEFT_PADDLE, message.data.left_paddle.toString());
    }

    if (message.data.right_paddle != null) {
        setPositionPlayerPaddleRight(message.data.right_paddle);
        setCookie(COOKIE_KEYS.RIGHT_PADDLE, message.data.right_paddle.toString());
    }
};

// Handle "endGame" messages
const handleEndGameMessage = (
    message: WebSocketMessage,
    setWinner: React.Dispatch<React.SetStateAction<string | null>>
) => {
    setTimeout(() => {
        setWinner(message.data.winner);
    }, 500);
};

export { openWebSocket, listenConnection };