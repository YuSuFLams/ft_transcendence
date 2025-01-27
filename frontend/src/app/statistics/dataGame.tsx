import axios from "axios";
import Cookie from 'js-cookie';
import { GameHistoryItem } from "./utils";
import React from "react";

const GameLocalData = async (
    setGameHistory: React.Dispatch<React.SetStateAction<GameHistoryItem[]>>
) => {
    try {
        const token = Cookie.get("access");
        if (!token) return;

        const response = await axios.get("http://localhost:8000/api/game/get-all-game", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = response.data;

        const gameHistoryItems = data.map((game: any) => {
            const data1: GameHistoryItem = {
                gameId: game.id, winner: game.winner,
                player1: game.player1,
                score: `${game.score_p1} - ${game.score_p2}`,
                player2: game.player2, type: "local",
            };
            return data1;
        });

        setGameHistory((prev) => [...prev, ...gameHistoryItems]);
    } catch (error) {
        console.error(error);
    }
};

export { GameLocalData };
