"use client";

import Cookie from "js-cookie";
import * as THREE from "three";
import { TableLocal } from "./gameTable";
import { removeData } from "./clickEvent";
import { useRouter } from "next/navigation";
import { handleKeyDown } from "./mouvePaddle";
import { CardPlayers } from "./preMatchLocal";
import React, { useEffect, useState, useRef } from "react";
import { checkInfoMatch, WinnerCard } from "./utilsGameMatch";
import { listenConnection, openWebSocket } from "./socketConnect";


const MatchLocalGame = () => {

    // Player Left 
    const [playerLeft, setPlayerLeft] = useState<string>("");
	const paddlePlayerLeftRef = useRef<THREE.Mesh | null>(null);
    const [positionPlayerPaddleLeft, setPositionPlayerPaddleLeft] = useState<number>(0);
    const [scorePlayerLeft, setScorePlayerLeft] = useState<number>(0);


    // Player Right
    const [playerRight, setPlayerRight] = useState<string>("");
	const paddlePlayerRightRef = useRef<THREE.Mesh | null>(null);
    const [positionPlayerPaddleRight, setPositionPlayerPaddleRight] = useState<number>(0);
    const [scorePlayerRight, setScorePlayerRight] = useState<number>(0);

    // Ball
	const ballRef = useRef<THREE.Mesh | null>(null);
    const [ballPosition, setBallPosition] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0.3, z: 0 });

    // Utils Match
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [isDone, setIsDone] = useState<boolean>(false);
    const socket = useRef<WebSocket | null>(null);
	const token = Cookie.get("access");
    const router = useRouter();

    useEffect(() => {
		checkInfoMatch(setPlayerLeft, setPlayerRight, setPositionPlayerPaddleLeft, setPositionPlayerPaddleRight, 
            setGameStarted, router);
	}, [gameStarted, playerLeft, playerRight, router]);

    useEffect(() => {
		if (token) openWebSocket(token, socket);

        return () => {
            if (socket.current && socket.current.readyState === WebSocket.OPEN) {
                if (socket.current.readyState === WebSocket.OPEN) {
                    socket.current.send(JSON.stringify({ action: "closeGame"}));
                    removeData();
                }
                socket.current.close();
            }
        }
	}, [playerLeft, playerRight, token]);

    if (gameStarted) listenConnection(socket, setBallPosition, setScorePlayerLeft, setScorePlayerRight, setWinner);

    useEffect(() => {
        const handleKeyDownWrapper = (event: KeyboardEvent) => 
            handleKeyDown(event, socket, setPositionPlayerPaddleLeft, setPositionPlayerPaddleRight, paddlePlayerLeftRef, paddlePlayerRightRef  );

        let elapsedTime = 0;

        const intervalId = setInterval(() => {
            if (winner && !isDone) {
                elapsedTime += 1000;
                if (elapsedTime >= 10000) {
                    removeData();
                    setIsDone(true);
                    clearInterval(intervalId);
                    router.push("game");
                }
            } else if (isDone) {
                clearInterval(intervalId);
            }
        
        }, 1000);

        window.addEventListener('keydown', handleKeyDownWrapper);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('keydown', handleKeyDownWrapper);
        };
    }, [setPositionPlayerPaddleLeft, setPositionPlayerPaddleRight, winner, isDone]);

    return (
        <div className="w-screen h-screen bg-gradient-to-b from-[#0A2C57] via-[#1A3B6B] to-gray-600 text-white flex flex-col font-sans">
            <main className="flex flex-col items-center justify-center flex-grow space-y-8">
                {!gameStarted ? (
                    <CardPlayers playerLeft={playerLeft} playerRight={playerRight} socket={socket} router={router} setGameStarted={setGameStarted}/>
                ):( 
                    !winner ? (
                        <TableLocal playerLeft={playerLeft} playerRight={playerRight} scorePlayerLeft={scorePlayerLeft} 
                            scorePlayerRight={scorePlayerRight} positionPlayerPaddleLeft={positionPlayerPaddleLeft} socket={socket}  
                            positionPlayerPaddleRight={positionPlayerPaddleRight} ballPosition={ballPosition} ballRef={ballRef} 
                            paddlePlayerRightRef={paddlePlayerRightRef} paddlePlayerLeftRef={paddlePlayerLeftRef} router={router} />
                    ) : (
                        <WinnerCard winner={winner} router={router} playerLeft={playerLeft} setIsDone={setIsDone}/>
                      )
                  )
                }
            </main>
        </div>
    );
};

export default MatchLocalGame;