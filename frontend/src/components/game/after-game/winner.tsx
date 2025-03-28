import { removeData } from '@/components/game/match-local/match';
import React, { useState, useEffect, useRef } from 'react';
import { LiaTrophySolid } from "react-icons/lia";
import { BiHappyBeaming } from "react-icons/bi";
import { motion } from "framer-motion";
import Confetti from 'react-confetti';
import Image from "next/image";
import Cookie from "js-cookie";
import { useRouter } from 'next/navigation';

interface WinnerCardProps {
    playerLeft: string;
    winner: string;
    router: ReturnType<typeof useRouter>;
    setIsDone?: React.Dispatch<React.SetStateAction<boolean>>;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ playerLeft, winner, router, setIsDone }) => {
    // Determine the winner's picture
	const p1 = Cookie.get("p1") || "2";
	const p2 = Cookie.get("p2") || "1";
    const picture = winner === playerLeft ? `/Image/picture${p2}.jpg` : `/Image/picture${p1}.jpg`;

    // Handle "Play Again" button click
    const handleReturnToGame = () => {
        removeData();
		if (setIsDone) setIsDone(true);
		else {
			Cookie.remove("idTournament")
			Cookie.remove("idMatch")
			Cookie.remove("p1");
    		Cookie.remove("p2");
		}
        router.push('/game');
    };

    // Use a ref to track the container dimensions for Confetti
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const containerRef = useRef<HTMLDivElement>(null);

    // Animation variants
	const cardVariants = {hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 }};

	const avatarVariants = {hover: { scale: 1.1, rotate: 5 }};

    useEffect(() => {
		const updateDimensions = () => {
			if (containerRef.current) {
				const { width, height } = containerRef.current.getBoundingClientRect();
				setDimensions({ width, height });
			}
		};

		updateDimensions();
		window.addEventListener('resize', updateDimensions);
		return () => window.removeEventListener('resize', updateDimensions);
	}, []);

    const winnerAvatar = picture ? picture : '/Image/default_ing.png';

    return (
        <div ref={containerRef} className="relative flex items-center justify-center min-h-screen w-full">
            {/* Confetti Animation */}
            <Confetti width={dimensions.width} height={dimensions.height} recycle={false} numberOfPieces={1000} gravity={0.2}/>

            {/* Main Winner Card */}
			<motion.div className="relative w-[90%] max-w-md flex flex-col items-center space-y-8 rounded-2xl border-2 border-blue-700 bg-gray-900/95 p-8 shadow-2xl shadow-blue-900/30"
				variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.8, ease: 'easeOut' }} whileHover={{ scale: 1.03 }}
			>
                {/* Winner Avatar */}
				<motion.div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-48 md:w-48 rounded-full border-4 border-blue-900 overflow-hidden ring-2 ring-blue-900/50"
					variants={avatarVariants} transition={{ type: 'spring', stiffness: 300 }}
				>
					<Image src={winnerAvatar} alt={`${winner || 'Winner'}'s Avatar`} fill sizes='100%' priority className="object-cover"/>
				</motion.div>

                {/* Winner Message */}
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="text-center space-y-4" >
					<LiaTrophySolid size={50} className="mx-auto text-yellow-400 animate-bounce" />
					<h1 className="text-3xl font-bold text-white tracking-tight">Congratulations!</h1>
					<p className="text-lg text-blue-200"><span className="font-semibold text-red-400">{winner || 'Anonymous'}</span>, you’ve claimed victory!</p>
				</motion.div>

                {/* Celebration Icon */}
				<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: 'spring', stiffness: 200 }}>
					<BiHappyBeaming size={40} className="mx-auto text-yellow-300" />
				</motion.div>

                {/* Play Again Button */}
				<motion.button className="mmt-6 px-6 py-2 bg-transparent border-2 text-md md:text-lg lg:text-xl font-bold rounded-sm hover:text-black 
                    transition-all duration-300 ease-out uppercase tracking-wide border-blue-600 text-blue-600 hover:bg-blue-600 hover:border-blue-700 
                    focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleReturnToGame}
				>
					<span>Return to Game</span>
				</motion.button>
            </motion.div>
        </div>
    );
};

export { WinnerCard };