import Image from "next/image";
import pictureLeft from "@/../public/Image/picture1.jpg";
import pictureRight from "@/../public/Image/picture2.jpg";
import { handleExitGame, handleStartGame } from "./clickEvent";
import React from "react";

interface PlayerCradProps {
	player: string;
	picture: any;
}

const PlayerCrad: React.FC<PlayerCradProps> = ({ player, picture }) => {
	return (
		<div className="flex flex-col items-center space-y-4">
			{player && 
				<div className="flex flex-col items-center space-y-6 p-10 border-4 border-indigo-600 bg-gradient-to-b from-[#0A2C57] 
					via-[#1A3B6B] to-gray-600 rounded-xl shadow-2xl w-[20em]">
					<div>
						<Image className="w-[10em] h-[10em] rounded-full border-4 border-gray-700 shadow-lg hover:scale-110 transition 
							duration-300"width={140} height={140} src={picture} alt={`${player}'s profile picture`}/>
					</div>

					<div className="text-4xl font-bold font-[ssb] text-[#ECF0F1]">{player}</div>
				</div>
			}
		</div>
	)
}

interface ButtonGameProps {
	playerLeft: string;
	playerRight: string;
	socket: React.RefObject<WebSocket | null>;
	setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
	router: any;
}

const ButtonGame: React.FC<ButtonGameProps> = ({ playerLeft, playerRight, socket, setGameStarted, router }) => {
	return (
		<div className="mt-8 flex space-x-6">
			<button className="w-full px-8 py-4 text-2xl font-extrabold font-[ssb] text-white bg-red-800 rounded-xl hover:bg-gradient-to-l 
				hover:from-red-800 hover:to-red-600 hover:scale-105 transition transform duration-300 ease-in-out shadow-lg focus:outline-none 
				focus:ring-4 focus:ring-red-600 focus:ring-opacity-50" onClick={() => handleExitGame(socket, router)}
			>
				Exit Game
			</button>

			<button onClick={() => handleStartGame(socket, setGameStarted, playerLeft, playerRight)} className="w-full bg-[#1A2B47] text-2xl 
				text-white font-[ssb] px-8 rounded-xl shadow-lg hover:bg-gradient-to-l hover:from-blue-900 hover:to-blue-700 hover:scale-105 
				transition transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 py-4"
			>
				Start Game
			</button>
		</div>
	)
}

interface cardPlayersProps {
	playerLeft: string;
	playerRight: string;
	socket: React.RefObject<WebSocket | null>;
	setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
	router: any;
}

const CardPlayers: React.FC<cardPlayersProps> = ({
	playerLeft, playerRight, socket, setGameStarted, router
}) => {
    return (

		<div className="flex flex-col items-center justify-center text-white space-y-12">
			{/* Title at the Top */}
            <div className="flex items-center justify-center">
				<h1 className="text-7xl font-extrabold tracking-wider font-[ssb] font-extrabold text-indigo-600"> Game Local </h1>
            </div>


			{/* Player Cards Section */}
			<div className="flex items-center justify-center space-x-12 p-8 rounded-xl shadow-2xl border-4 border-indigo-600">
				{/* Player Left Details */}
				<PlayerCrad player={playerLeft} picture={pictureLeft} />

				{/* VS Separator */}
				<div className="text-6xl font-extrabold text-yellow-400 font-[ssb] drop-shadow-2xl"> VS </div>

				{/* Player Right Details */}
				<PlayerCrad player={playerRight} picture={pictureRight} />
			</div>

			{/* Action Buttons Section */}
			<div className="w-full max-w-md">
				<ButtonGame playerLeft={playerLeft} playerRight={playerRight} socket={socket} setGameStarted={setGameStarted} 
				router={router}/>
			</div>
		</div>
    );
};

export { CardPlayers };