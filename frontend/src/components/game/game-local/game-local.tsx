"use client";

import React, { useEffect, useRef, useState } from "react";
import { CardPlayers } from "./utils-local";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

interface GameLocalPre {
    player1: React.RefObject<HTMLInputElement | null>;
    player2: React.RefObject<HTMLInputElement | null>;
    setGameCreated: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    error: Record<string, string>;
}

const PreGameLocal: React.FC<GameLocalPre> = ({ player1, player2, setGameCreated, setError, error }) => {
    return (
        <div className="w-screen h-screen text-white font-mono flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                <h1 className="absolute top-10 text-3xl md:text-4xl lg:text-6xl font-bold text-blue-600 tracking-widest animate-pulse">
                    [LOCAL:GAME]
                </h1>
                <CardPlayers player1={player1} player2={player2} setError={setError} error={error} setGameCreated={setGameCreated}/>
            </div>
        </div>
    );
};

const PageGameLocal = () => {
    const router = useRouter();
    const player1 = useRef<HTMLInputElement | null>(null);
    const player2 = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<Record<string, string>>({});
    const [gameCreated, setGameCreated] = useState<boolean>(false);

    useEffect(() => {
        setGameCreated(Cookie.get("gameCreated") === "true");
        if (gameCreated) {router.push("/game/match-local");}
    }, [gameCreated, router]);

    return (
        <PreGameLocal player1={player1} player2={player2} setError={setError} error={error} setGameCreated={setGameCreated}/>
    );
};

export default PageGameLocal;