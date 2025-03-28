"use client"

import { useKeydownHandler } from "@/components/game/match-local/during-match/useKeydownHandler";
import { useWinnerHandler } from "@/components/tournament/match-local/useWinnerHandler";
import { TableLocal } from "@/components/game/match-local/during-match/game-table";
import { useGameLogic } from "@/components/tournament/match-local/useGameLogic";
import { CardPlayers } from "@/components/tournament/match-local/pre-match";
import React, { useRef } from "react";
import * as THREE from "three";

const MatchLocalTournament = () => {
    const { 
        playerLeft, playerRight, positionPlayerPaddleLeft, positionPlayerPaddleRight, scorePlayerLeft, 
        scorePlayerRight, ballPosition, gameStarted, winner, setWinner, setGameStarted, socket, idTournament,
    } = useGameLogic();
    useKeydownHandler(socket);
    useWinnerHandler(winner, idTournament, setWinner);

    return (
        <div className="w-screen h-screen text-white flex flex-col font-sans">
            <main className="flex flex-col items-center justify-center flex-grow space-y-8">
                {!gameStarted ? (
                    <CardPlayers playerLeft={playerLeft} playerRight={playerRight} socket={socket} setGameStarted={setGameStarted}/>
                ) : (
                    <TableLocal 
                        positionPlayerPaddleRight={positionPlayerPaddleRight} positionPlayerPaddleLeft={positionPlayerPaddleLeft} playerLeft={playerLeft} 
                        scorePlayerLeft={scorePlayerLeft} scorePlayerRight={scorePlayerRight} playerRight={playerRight} ballPosition={ballPosition}
                    />
                )}
            </main>
        </div>
    );
};


export default MatchLocalTournament