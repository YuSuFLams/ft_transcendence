"use client";

import { useKeydownHandler } from "@/components/game/match-local/during-match/useKeydownHandler";
import { useWinnerHandler } from "@/components/game/match-local/during-match/useWinnerHandler";
import { useGameLogic } from "@/components/game/match-local/during-match/useGameLogic";
import { CardPlayers } from "@/components/game/match-local/pre-match/pre-match";
import { WinnerCard } from "@/components/game/after-game/winner";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import * as THREE from "three";
import {TableLocal} from "./gameTable";

// MatchLocalGame (unchanged)
const MatchLocalGame = () => {
    const paddlePlayerLeftRef = useRef<THREE.Mesh | null>(null);
    const paddlePlayerRightRef = useRef<THREE.Mesh | null>(null);
    const ballRef = useRef<THREE.Mesh | null>(null);
    const router = useRouter();

    const { 
		playerLeft, playerRight, positionPlayerPaddleLeft, positionPlayerPaddleRight, scorePlayerLeft,
      	scorePlayerRight, ballPosition, gameStarted, winner, isDone, setIsDone, socket, setGameStarted,
    } = useGameLogic();
  
    useKeydownHandler(socket);
    useWinnerHandler(winner, isDone, setIsDone);
  
    return (
      	<div className="w-screen h-screen text-white flex flex-col font-sans">
        	<main className="flex flex-col items-center justify-center flex-grow space-y-8">
         		{!gameStarted ? (
            		<CardPlayers playerLeft={playerLeft} playerRight={playerRight} socket={socket} router={router} setGameStarted={setGameStarted}/>
          		) : !winner ? (
            		<TableLocal positionPlayerPaddleRight={positionPlayerPaddleRight} positionPlayerPaddleLeft={positionPlayerPaddleLeft} socket={socket}
              			router={router} paddlePlayerRightRef={paddlePlayerRightRef} paddlePlayerLeftRef={paddlePlayerLeftRef} ballPosition={ballPosition}
						playerLeft={playerLeft} scorePlayerRight={scorePlayerRight} playerRight={playerRight} scorePlayerLeft={scorePlayerLeft} ballRef={ballRef}
            		/>
          		) : (
            		<WinnerCard winner={winner || ""} router={router} playerLeft={playerLeft} setIsDone={setIsDone} />
          		)}
        	</main>
      	</div>
    );
};

export default MatchLocalGame;
