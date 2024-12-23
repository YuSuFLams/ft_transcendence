"use client";

import { FaGamepad, FaGlobe, FaRandom, FaUserFriends } from "react-icons/fa";
import { motion } from "framer-motion"; 
import { useRouter } from 'next/navigation';


const PageGame = () => {
    const router = useRouter(); 

    const handleClick = (path: string) => router.push(path);

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
            <div className="grid grid-cols-2 gap-6">
                {/* Game Local Button */}
                <motion.button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-500 via-purple-600 
                    to-pink-500 rounded-xl shadow-xl space-y-4 w-[28em] h-[12em] cursor-pointer" onClick={() => handleClick('/game-local')}
                    whileHover={{ scale: 1.04 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} 
                >
                    <FaGamepad size={40} className="text-white" />
                    <div className="text-4xl font-light text-white font-[Roquila] text-center">Game Local</div>
                </motion.button>

                {/* Game Online Button */}
                <motion.button
                    className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 
                    rounded-xl shadow-xl space-y-4 w-[28em] h-[12em] cursor-pointer" initial={{ opacity: 0, y: 20 }} whileHover={{ scale: 1.04 }} 
                    animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}  onClick={() => handleClick('/game-online')} 
                >
                    <FaGlobe size={40} className="text-white" />
                    <div className="text-4xl font-light text-white font-[Roquila] text-center">Game Online</div>
                </motion.button>

                {/* Game Tournament Random Online Button */}
                <motion.button
                    className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-400 via-yellow-400 to-orange-500 rounded-xl shadow-xl space-y-4 w-[28em] h-[12em] cursor-pointer"
                    initial={{ opacity: 0, y: 20 }} whileHover={{ scale: 1.04 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.2 }} 
                    onClick={() => handleClick('/game-tournament-random')}
                >
                    <FaRandom size={40} className="text-white" />
                    <div className="text-4xl font-light text-white font-[Roquila] text-center">
                         Tournament Random 
                    </div>
                </motion.button>

                {/* Game Tournament Invite Online Button */}
                <motion.button
                    className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-500 via-red-500 to-orange-600 rounded-xl shadow-xl space-y-4 w-[28em] h-[12em] cursor-pointer"
                    initial={{ opacity: 0, y: 20 }} whileHover={{ scale: 1.04 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.3 }} 
                    onClick={() => handleClick('/game-tournament-invite')}
                >
                    <FaUserFriends size={40} className="text-white" />
                    <div className="text-4xl font-light text-white font-[Roquila] text-center">
                         Tournament Invite 
                    </div>
                </motion.button>
            </div>
        </div>
    );
};

export default PageGame;
