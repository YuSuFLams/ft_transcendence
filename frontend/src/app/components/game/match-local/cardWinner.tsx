import React from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import { HiRefresh } from 'react-icons/hi';
import { HiOutlineTrophy } from 'react-icons/hi2'; // Corrected import
import { IoMdHappy } from 'react-icons/io';
import pictureLeft from "@/../public/Image/picture1.jpg";
import pictureRight from "@/../public/Image/picture2.jpg";
import { removeData } from "@/app/components/game/match-local/event-prematch-local";

interface WinnerCardProps {
    playerLeft: string;
    winner: string;
    router: any;
    setIsDone: React.Dispatch<React.SetStateAction<boolean>>;
}
import { LiaTrophySolid } from "react-icons/lia";
import { BiHappyBeaming } from "react-icons/bi";

const WinnerCard: React.FC<WinnerCardProps> = ({ playerLeft, winner, router, setIsDone }) => {
    const picture = winner === playerLeft ? pictureLeft : pictureRight;

    const handlePlayAgain = () => {
        removeData();
        setIsDone(true);
        router.push('/game/game-local');
    };

    return (
        <motion.div className="flex flex-col items-center w-[420px] h-[550px] rounded-2xl justify-center border-2 border-[#FFF0DC] text-white 
            bg-gradient-to-bl from-[#09152b]  via-[#082751] to-[#063977] shadow-lg space-y-6" 
        >
            <motion.div className="rounded-full shadow-lg border-4 border-[#FFF0DC] p-[2px]" whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}>
                <Image className="rounded-full border-4 border-[#1E3A8A] shadow-md" alt={`${winner}'s Avatar`} src={picture} width={150} height={150}/>
            </motion.div>

            <motion.div className="font-[Font6]  text-center" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                <LiaTrophySolid size={60} className=" text-[#60A5FA] mx-auto" />
                
                <h1 className="mt-4 text-3xl font-semibold text-gray-100">🏆 Congratulations! 🏆</h1>
                <p className="mt-2 text-2xl  text-gray-300">
                    🎉 <span className="font-bold  text-[#3B82F6]">{winner}</span> is the winner! 🎉
                </p>
            </motion.div>

            <motion.div className="animate-pulse text-center" initial={{ scale: -1 }} animate={{ scale: [1, 1.5, 1] }} 
                transition={{ delay: 1, duration: 1, repeat: Infinity }} 
            >
                <BiHappyBeaming size={45} className="text-[#38BDF8]" />
            </motion.div>

            <motion.button className="mt-12 px-8 py-4 text-2xl font-extrabold border-2 border-[#FFF0DC] text-[#FFF0DC] rounded-full shadow-lg 
                bg-gradient-to-br from-gray-800 via-blue-900 to-black transform transition-all duration-300 hover:scale-110 hover:shadow-2xl 
                focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center group font-[Font6]" onClick={handlePlayAgain}
                aria-label="Play Again" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
                <HiRefresh size={24} className="mr-2 text-[#FFF0DC] group-hover:animate-spin transition-all duration-300" />
                
                Play Again
            </motion.button>
        </motion.div>
    );
};

export { WinnerCard };
