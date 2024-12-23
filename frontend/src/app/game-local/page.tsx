"use client";

import React, { useState, useRef, useEffect } from "react";
import Cookie from "js-cookie";
import { CardPlayers, PreGameLocal } from "./preGame";
import { useRouter } from "next/navigation";




const PageGameLocal = () => {
    // Pre Game Created
    const [gameCreated, setGameCreated] = useState<boolean>(false);

    // Player Left
    const [playerLeft, setPlayerLeft] = useState<string>("");
    const pictureLeft = "https://randomuser.me/api/portraits/lego/1.jpg";

    // Player Right
    const [playerRight, setPlayerRight] = useState<string>("");
    const pictureRight = "https://randomuser.me/api/portraits/lego/2.jpg";

    // Game Started
    const [winner, setWinner] = useState<string | null>(null);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const socket = useRef<WebSocket | null>(null);
    const router = useRouter();

    useEffect(() => {
        const player1 = Cookie.get("player1");
        const player2 = Cookie.get("player2");
        const game_created = Cookie.get("game_created");

        if (game_created) setGameCreated(true);
        if (player1 && player2) {
            setGameCreated(true);
            setPlayerLeft(player1 || "");
            setPlayerRight(player2 || "");
        }

    }, [gameCreated]);

    return (
        <div className="w-screen h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col font-sans">
            {/* Title at the Top */}
            <div className="flex items-center justify-center mt-12">
                <h1 className="text-5xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 
                    via-purple-400 to-pink-400">Game Local
                </h1>
            </div>

            {/* Content Centered */}
            <main className="flex flex-col items-center justify-center flex-grow space-y-8">
                {!gameCreated ? (
                    <PreGameLocal playerLeft={playerLeft} playerRight={playerRight} setGameCreated={setGameCreated} 
                        setPlayerLeft={setPlayerLeft} setPlayerRight={setPlayerRight}/>
                ) : (
                    !gameStarted ? (
                        <CardPlayers playerLeft={playerLeft} playerRight={playerRight} socket={socket} setGameStarted={setGameStarted} 
                            router={router} pictureRight={pictureLeft} pictureLeft={pictureRight}
                        />
                    ):( 
                        !winner ? (
                            <div>Game in Progress...</div>
                        ) : (
                            <div>Game Over: {winner}</div>
                        )
                    )
                )}
            </main>
        </div>
    );
};

export default PageGameLocal;
