// components/CardPlayers.tsx
import { handleExitGame, handleStartGame } from "../match";
import pictureRight from "@/../public/Image/picture2.jpg";
import pictureLeft from "@/../public/Image/picture1.jpg";
import React from "react";
import { PlayerCard } from "./card";
import { useRouter } from "next/navigation";

interface ButtonGameProps {
    playerLeft: string;
    playerRight: string;
    socket: React.RefObject<WebSocket | null>;
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
    router: ReturnType<typeof useRouter>;
}
  
const ButtonGame: React.FC<ButtonGameProps> = ({ playerLeft, playerRight, socket, setGameStarted, router }) => {
    const buttonStyles = (type: string) => {

        // Base styles shared by both buttons
        let baseStyles = `mt-6 px-6 py-2 bg-transparent border-2 text-lg md:text-xl lg:text-2xl font-bold rounded-sm hover:text-black transition-all duration-300 ease-out uppercase tracking-wide`;
  
        // Specific styles based on button type
        if (type === "start") {
            return `${baseStyles} border-blue-600 text-blue-600 hover:bg-blue-600 hover:border-blue-700 focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50`;
        } else if (type === "exit") {
            return `${baseStyles} border-red-600 text-red-600 hover:bg-red-600 hover:border-red-700 focus:ring-4 focus:ring-red-400 focus:ring-opacity-50`;
        }
        
        return baseStyles; // Fallback (though not needed with current logic)
    };
  
    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center">
            <button onClick={() => handleExitGame(socket, router)} className={buttonStyles("exit")}> Exit Game </button>
            <button onClick={() => handleStartGame(socket, setGameStarted, playerLeft, playerRight)} className={buttonStyles("start")}> Start Game </button>
        </div>
    );
};
  



interface CardPlayersProps {
    playerLeft: string;
    playerRight: string;
    socket: React.RefObject<WebSocket | null>;
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
    router: ReturnType<typeof useRouter>;
}

const DisplayPlayers:React.FC<CardPlayersProps> = ({ playerLeft, playerRight, socket, setGameStarted, router,}) => {

    return (
        <div className="w-full max-w-[90%] sm:max-w-3xl md:max-w-5xl lg:max-w-6xl flex flex-col items-center space-y-8 py-10 px-4 sm:px-6 md:px-8 
            bg-gray-900/20 rounded-2xl border border-gray-700/50 shadow-xl backdrop-blur-sm">
            
            {/* Players Container */}
            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
                {/* Player 1 Card */}
                <div className="w-full max-w-sm bg-gray-800/30 border border-gray-600/50 p-4 rounded-xl hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                    <PlayerCard player={playerLeft} picture={pictureLeft} />
                </div>

                {/* VS Separator */}
                <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-600">VS</div>

                {/* Player 2 Card */}
                <div className="w-full max-w-sm bg-gray-800/30 border border-gray-600/50 p-4 rounded-xl hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                    <PlayerCard player={playerRight} picture={pictureRight} />
                </div>
            </div>

            {/* Start Game Button */}
            <ButtonGame playerLeft={playerLeft} playerRight={playerRight} socket={socket} setGameStarted={setGameStarted}router={router}/>
        </div>
    )
}

const CardPlayers: React.FC<CardPlayersProps> = ({playerLeft, playerRight, socket, setGameStarted, router,}) => {

    return (
        <div className="w-full flex-1 font-mono flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative">
            <h1 className="absolute top-10 text-3xl md:text-4xl lg:text-6xl font-bold text-blue-600 tracking-widest animate-pulse">[LOCAL:GAME]</h1>
            <DisplayPlayers playerLeft={playerLeft} playerRight={playerRight} socket={socket} setGameStarted={setGameStarted} router={router}/>
        </div>
    );
};

export { ButtonGame, PlayerCard, CardPlayers };