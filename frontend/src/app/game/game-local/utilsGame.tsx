"use client";

import Cookie from "js-cookie";
import pictureRight from "@/../public/Image/picture1.jpg";
import pictureLeft from "@/../public/Image/picture2.jpg";
import Image from "next/image";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiArrowSmLeft, HiQuestionMarkCircle, HiX } from "react-icons/hi";

const handleCreateGame = ( player1: string, player2: string, setGameCreated: React.Dispatch<React.SetStateAction<boolean>>,
    setPlayer1Error: React.Dispatch<React.SetStateAction<string>>, setPlayer2Error: React.Dispatch<React.SetStateAction<string>>
) => {
    const trimmedPlayer1 = player1.trim();
    const trimmedPlayer2 = player2.trim();

    let valid = true;

    if (!trimmedPlayer1) {
        setPlayer1Error("Player 1 name cannot be empty!");
        valid = false;
    } else {
        setPlayer1Error("");
    }

    if (!trimmedPlayer2) {
        setPlayer2Error("Player 2 name cannot be empty!");
        valid = false;
    } else {
        setPlayer2Error("");
    }

    if (valid) {
        setGameCreated(true);
        Cookie.set("player1", trimmedPlayer1);
        Cookie.set("player2", trimmedPlayer2);
        Cookie.set("gameCreated", "true");
    }
};

interface CardPlayersProps {
    player:string;
    picture: any;
    username: string;
    playerError: string;
    setPlayer: React.Dispatch<React.SetStateAction<string>>
}

const UserCard: React.FC<CardPlayersProps> = ({ player, picture, username, playerError, setPlayer }) => {
    return (
        <div className="flex flex-col items-center">
            <Image className="rounded-full border-4 border-indigo-500 hover:scale-105 transition duration-300"
            src={picture} alt={username} width={160} height={160}/>

            <h2 className="text-2xl mt-4 mb-4 font-bold font-[Font6] text-indigo-300"> {player} </h2>

            <input className="px-4 py-2 w-64 rounded-lg text-lg border-2 border-indigo-500 bg-[#1A2B47] text-white placeholder-[#aaabbc] 
            font-[Font6]
            focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition duration-300 shadow-lg" 
            type="text" value={username} placeholder={player} onChange={(e) => setPlayer(e.target.value)} />

            {playerError && ( <p className="mt-2 ml-4 text-lg font-[Font2] text-red-500">{playerError}</p>)}
        </div>
    )
}

interface CreateGameProps {
    playerLeft: string;
    playerRight: string;
    setGameCreated: React.Dispatch<React.SetStateAction<boolean>>;
    setPlayer1Error: React.Dispatch<React.SetStateAction<string>>;
    setPlayer2Error: React.Dispatch<React.SetStateAction<string>>;
}

const CraeteGame:React.FC<CreateGameProps> = ({ playerLeft, playerRight, setGameCreated, setPlayer1Error, setPlayer2Error }) => {

    return (
        <button onClick={() => handleCreateGame(playerLeft, playerRight, setGameCreated, setPlayer1Error, setPlayer2Error)}
            className="mt-4 py-3 px-8 hover:bg-indigo-700 hover:text-[#09152b] rounded-xl text-lg bg-indigo-600 shadow-xl 
            tracking-wide transform hover:scale-105 transition-transform duration-300 text-[#f7f2e8] font-bold font-[Font6]">
            Create Game
        </button>
    )
}

const BackButton: React.FC<{router: any}> = ({ router }) => {
    return (
        <div className="absolute font-[Font3] text-[#0D0D0D] text-3xl top-4 left-4 flex justify-center">
            <motion.button onClick={() => router.push("/game")} className="bg-indigo-600 flex group items-center px-3 py-2 
                rounded-full font-semibold tracking-wide shadow-xl transition transform duration-300 hover:scale-110 group">

                <HiArrowSmLeft size={40} className="transition-opacity duration-300 group-hover:opacity-0" />
                
                <p className="text-lg absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300"> Back </p>
            </motion.button>
        </div>
    )
}

const RulesButton: React.FC<{setIsClicked: React.Dispatch<React.SetStateAction<boolean>>}> = ({ setIsClicked }) => {
    return (
        <div className="absolute bottom-4 text-[#0D0D0D] hover:text-[#FBF2ED] right-4">
            <motion.button onClick={() => setIsClicked(true)} className="group px-3 font-[Font6] py-2 rounded-full bg-indigo-600 font-semibold 
            tracking-wide shadow-xl transition transform duration-300 hover:scale-110 flex items-center">
            <HiQuestionMarkCircle size={30} className="mr-2" />
            Rules
            </motion.button>
        </div>
    )
}


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
        <div className="flex flex-col items-center justify-center flex-grow justify-around space-y-8">
            {/* Player Inputs */}
            <div className="flex items-center justify-center space-x-20">
                <UserCard player="Player 1" picture={pictureLeft} username={playerLeft} playerError={player1Error} 
                    setPlayer={setPlayerLeft} />

                {/* VS Text */}
                <div> <h2 className="mt-8 text-5xl font-[Borias] font-extrabold text-indigo-300"> VS </h2> </div>

                {/* Player 2 Input */}
                <UserCard player="Player 2" picture={pictureRight} username={playerRight} playerError={player2Error} 
                    setPlayer={setPlayerRight} />
            </div>

            {/* Start Game Button */}
            <div>
                <CraeteGame playerLeft={playerLeft} playerRight={playerRight} setGameCreated={setGameCreated} 
                    setPlayer1Error={setPlayer1Error} setPlayer2Error={setPlayer2Error} />
            </div>
        </div>
    );
};


const RulesGameLocal: React.FC<{ isClicked: boolean; onClose: () => void }> = ({ isClicked, onClose }) => {
    const array = [
        "Two players compete against each other.",
        "Score points if opponent fails to return properly.",
        "First to 5 points wins the match.",
        'Player 1: "W" to move Left, "S" to move Right.',
        'Player 2: Use "Left" and "Right" arrows.'
    ]

    return (
        <AnimatePresence>
            {isClicked && (
                <motion.div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-lg flex 
                    items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    
                    {/* Modal Content */}
                    <motion.div className="bg-gray-800 p-8 rounded-3xl shadow-2xl relative w-full
                        max-w-3xl text-white space-y-6 border-2 border-blue-500" transition={{ type: "spring", stiffness: 300, damping: 20 }} 
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} >

                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-3xl border-4 border-blue-400 opacity-40 blur-lg"></div>

                        {/* Close Button */}
                        <button className="absolute top-4 right-4 bg-blue-600 p-2 rounded-full text-white hover:bg-red-600 hover:scale-110 
                        transition-transform shadow-lg" onClick={onClose}> <HiX size={20} /> </button>

                        {/* Title */}
                        <h1 className="text-4xl font-[Font6] font-extrabold text-[#FBF2ED] text-center uppercase tracking-wide text-white">
                            Game <span className="text-blue-400">Rules</span>
                        </h1>

                        {/* Rules List */}
                        <ul className="space-y-4 text-lg">
                            {array.map((rule, index) => (
                                <li key={index} className="flex font-[Font6] text-[#FBF2ED] items-start space-x-4">
                                    <span className="w-8 h-8 font-[Font6] flex items-center justify-center bg-blue-600 rounded-full text-white 
                                        font-bold">{index + 1}
                                    </span>
                                    <p>{rule}</p>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { handleCreateGame, PreGameLocal, BackButton, RulesButton, RulesGameLocal };