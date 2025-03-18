"use client"

import { useKeydownHandler } from "@/components/game/match-local/during-match/useKeydownHandler";
import { useWinnerHandler } from "@/components/tournament/match-local/useWinnerHandler";
import { useGameLogic } from "@/components/tournament/match-local/useGameLogic";
import { CardPlayers } from "@/components/tournament/match-local/pre-match";
import { TableLocal } from "@/app/game/match-local/gameTable";
import React, { useRef } from "react";
import * as THREE from "three";

const MatchLocalTournament = () => {
    const paddlePlayerLeftRef = useRef<THREE.Mesh | null>(null);
    const paddlePlayerRightRef = useRef<THREE.Mesh | null>(null);
    const ballRef = useRef<THREE.Mesh | null>(null);

    const { 
        playerLeft, playerRight, positionPlayerPaddleLeft, positionPlayerPaddleRight, scorePlayerLeft, 
        scorePlayerRight, ballPosition, gameStarted, winner, setWinner, setGameStarted, socket, idTournament,
    } = useGameLogic();
    useWinnerHandler(winner, idTournament, setWinner);
    useKeydownHandler(socket);

    return (
        <div className="w-screen h-screen text-white flex flex-col font-sans">
            <main className="flex flex-col items-center justify-center flex-grow space-y-8">
                {!gameStarted ? (
                    <CardPlayers playerLeft={playerLeft} playerRight={playerRight} socket={socket} setGameStarted={setGameStarted}/>
                ) : (
                    <TableLocal positionPlayerPaddleRight={positionPlayerPaddleRight} positionPlayerPaddleLeft={positionPlayerPaddleLeft} playerLeft={playerLeft}
                        paddlePlayerRightRef={paddlePlayerRightRef} paddlePlayerLeftRef={paddlePlayerLeftRef} scorePlayerRight={scorePlayerRight}
                        playerRight={playerRight} scorePlayerLeft={scorePlayerLeft} ballPosition={ballPosition} ballRef={ballRef}
                    />
                )}
            </main>
        </div>
    );
};


export default MatchLocalTournament