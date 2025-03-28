"use client";

import { useKeydownHandler } from "@/components/game/match-local/during-match/useKeydownHandler";
import { useWinnerHandler } from "@/components/game/match-local/during-match/useWinnerHandler";
import { useGameLogic } from "@/components/game/match-local/during-match/useGameLogic";
import { CardPlayers } from "@/components/game/match-local/pre-match/pre-match";
import { WinnerCard } from "@/components/game/after-game/winner";
import { TableLocal } from "./game-table";

// MatchLocalGame (unchanged)
const MatchLocalGame = () => {

    const { 
		playerLeft, playerRight, positionPlayerPaddleLeft, positionPlayerPaddleRight, scorePlayerLeft,
      	scorePlayerRight, ballPosition, gameStarted, winner, isDone, setIsDone, socket, setGameStarted, router
    } = useGameLogic();
  
    useKeydownHandler(socket);
    useWinnerHandler(winner, isDone, setIsDone);
  
    return (
      	<div className="w-screen h-screen text-white flex flex-col font-sans">
        	<main className="flex flex-col items-center justify-center flex-grow space-y-8">
         		{!gameStarted ? (
            		<CardPlayers playerLeft={playerLeft} playerRight={playerRight} socket={socket} router={router} setGameStarted={setGameStarted}/>
          		) : !winner ? (
            		<TableLocal 
						positionPlayerPaddleRight={positionPlayerPaddleRight} positionPlayerPaddleLeft={positionPlayerPaddleLeft} 
						router={router} ballPosition={ballPosition} playerLeft={playerLeft} scorePlayerRight={scorePlayerRight} 
						socket={socket} playerRight={playerRight} scorePlayerLeft={scorePlayerLeft}
            		/>
          		) : (
            		<WinnerCard winner={winner || ""} router={router} playerLeft={playerLeft} setIsDone={setIsDone} />
          		)}
        	</main>
      	</div>
    );
};

export default MatchLocalGame;

