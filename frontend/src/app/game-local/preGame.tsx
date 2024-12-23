import { useState } from "react";
import Cookie from "js-cookie";
import { handleCreateGame, handleExitGame, handleStartGame } from "./clickEvent";

interface PreGameLocalProps {
    playerLeft: string;
    playerRight: string;
    setGameCreated: React.Dispatch<React.SetStateAction<boolean>>;
    setPlayerLeft: React.Dispatch<React.SetStateAction<string>>;
    setPlayerRight: React.Dispatch<React.SetStateAction<string>>;
}

const PreGameLocal: React.FC<PreGameLocalProps> = ({ playerLeft, playerRight, setGameCreated, setPlayerLeft, setPlayerRight }) => {

    const [player1Error, setPlayer1Error] = useState<string>("");
    const [player2Error, setPlayer2Error] = useState<string>("");

    return (
        <div className="flex flex-col items-center space-y-8">
            {/* Player Inputs */}
            <div className="flex items-center justify-center space-x-20">
                {/* Player 1 Input */}
                <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-2 text-blue-400">Player 1</h2>
                    <input className="p-3 w-64 rounded-lg border-2 border-gray-600 bg-gray-800 text-white placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-lg"
                        type="text" value={playerLeft} placeholder="Player 1" onChange={(e) => setPlayerLeft(e.target.value)}/>
                    {player1Error && ( <li className="ml-2 text-red-500">{player1Error}</li>)}
                </div>

                {/* VS Text */}
                <div>
                    <h2 className="mt-8 text-5xl font-extrabold text-gray-400">VS</h2>
                </div>

                {/* Player 2 Input */}
                <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-2 text-pink-400">Player 2</h2>
                    <input className="p-3 w-64 rounded-lg border-2 border-gray-600 bg-gray-800 text-white placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-300 shadow-lg"
                        type="text" placeholder="Player 2" value={playerRight} onChange={(e) => setPlayerRight(e.target.value)} />
                    {player2Error && ( <li className="ml-2 text-red-500">{player2Error}</li>)}
                </div>
            </div>

            {/* Start Game Button */}
            <div>
                <button onClick={() =>handleCreateGame( playerLeft, playerRight, setGameCreated, setPlayer1Error, setPlayer2Error)}
                    className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 
                    rounded-lg text-lg font-semibold tracking-wide shadow-xl transform hover:scale-105 transition-transform duration-300"
                > Start Game </button>
            </div>
        </div>
    );
};




const UserDetails: React.FC<{ username: string, picture: string }> = ({ username, picture }) => {
    return (
      <div className="flex flex-col items-center space-y-6 p-6 bg-gray-900 rounded-xl shadow-2xl w-[20em]">
        <div>
          <img
            src={picture}
            alt={`${username}'s profile picture`}
            className="w-[10em] h-[10em] rounded-full border-4 border-gray-700 shadow-lg"
          />
        </div>
        <div className="text-4xl font-bold text-white">{username}</div>
      </div>
    );
  };
  
  interface cardPlayersProps {
    playerLeft: string;
    playerRight: string;
    socket: React.RefObject<WebSocket | null>;
    pictureLeft: string;
    pictureRight: string;
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
    router: any;
  }
  
  const CardPlayers: React.FC<cardPlayersProps> = ({
    playerLeft, playerRight, socket, pictureLeft, pictureRight, setGameStarted, router
  }) => {
    return (
      <div className="flex flex-col items-center justify-center text-white">
        {/* Player Details Section */}
        <div className="flex items-center justify-center space-x-12 p-8 bg-gray-800 rounded-xl shadow-xl border-4 border-gray-700">
          {/* Player Left Details */}
          <div className="flex flex-col items-center space-y-4">
            {playerLeft && <UserDetails username={playerLeft} picture={pictureLeft} />}
          </div>
  
          {/* VS Separator */}
          <div className="text-6xl font-extrabold text-red-700 font-[Roquila] drop-shadow-2xl">
            VS
          </div>
  
          {/* Player Right Details */}
          <div className="flex flex-col items-center space-y-4">
            {playerRight && <UserDetails username={playerRight} picture={pictureRight} />}
          </div>
        </div>
  
        {/* Action Buttons Section */}
        <div className="mt-8 flex space-x-6 w-full max-w-md">
          {/* Exit Button */}
          <button
            className="w-full px-8 py-4 text-2xl font-extrabold text-white bg-red-800 rounded-xl hover:bg-red-900 hover:scale-105 
              transition transform duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-50"
            onClick={() => handleExitGame(socket, router)}
          >
            Exit
          </button>
  
          {/* Conditional Start Game Button */}
          <button
            onClick={() => handleStartGame(socket, setGameStarted)}
            className="w-full bg-blue-800 text-white px-8 py-4 rounded-xl hover:bg-blue-900 hover:scale-105 
              transition transform duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50"
          >
            Start Game
          </button>
        </div>
      </div>
    );
};
  

export { PreGameLocal, UserDetails, CardPlayers };
