"use client";

import { FaUserFriends, FaDice, FaGlobeAmericas, FaTableTennis, FaTrophy, FaRegLaughBeam } from "react-icons/fa";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const PageGame = () => {
    const router = useRouter();

    // Game types data
    const gameTypes = [
        {
            title: "Local Game",
            description: "Play with friends on the same device. Perfect for couch gaming!",
            icon: <FaUserFriends size={40} className="text-[#FFD700]" />,
            path: "/game/game-local",
            color: "from-[#FFD700] to-[#FFA500]", // Updated gradient colors
        },
        {
            title: "Online Match",
            description: "Challenge players from around the world in real-time matches.",
            icon: <FaGlobeAmericas size={40} className="text-[#00FFCC]" />,
            path: "/game-online",
            color: "from-[#00FFCC] to-[#00BFFF]", // Updated gradient colors
        },
        {
            title: "Local Tournament",
            description: "Host or join a local tournament with your friends and family.",
            icon: <FaDice size={40} className="text-[#FF6666]" />,
            path: "/game/tournament-local",
            color: "from-[#FF6666] to-[#FF4500]", // Updated gradient colors
        },
    ];

    // Animation for staggered cards
    const cardVariants = {hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },};

    // Animation for the hero section
    const heroVariants = {hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } },};

    // Animation for the footer icons
    const iconVariants = {hidden: { opacity: 0, scale: [0.7, 1.1, 0.7] }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }};

    // Trigger animations when in view
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) controls.start("visible");
    }, [controls, isInView]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#050026] via-[#11002D] to-[#002A52] text-white px-6 py-12">
            {/* Hero Section */}
            <motion.div className="text-center mb-12" variants={heroVariants} initial="hidden" animate="visible">
                <h1 className="text-4xl sm:text-6xl font-[Font2] font-extrabold text-[#D4EBF8] mb-4"> Welcome to Ping Pong Universe! </h1>
                <p className="text-lg sm:text-xl font-[Font6] text-gray-300"> Choose your game mode and start playing today. Fun, competition, and trophies await!</p>
            </motion.div>

            {/* Game Cards Section */}
            <motion.div ref={ref} initial="hidden" animate={controls} variants={{ visible: { transition: { staggerChildren: 0.2 } }}}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                {gameTypes.map((game, index) => (
                    <motion.div className="flex flex-col items-center p-8 bg-gradient-to-r from-[#152582] via-[#112863] to-[#12195C] rounded-2xl shadow-lg cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl"
                        key={index}  whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(255, 255, 255, 0.3)" }}
                        onClick={() => router.push(game.path)} variants={cardVariants} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                        {/* Game Icon */}
                        <motion.div className="mb-6" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 300 }} > {game.icon} </motion.div>

                        {/* Game Title */}
                        <h2 className="text-3xl font-[Font4] font-bold mb-2 text-center">{game.title}</h2>

                        {/* Game Description */}
                        <p className="text-center font-[Font7] text-gray-200">{game.description}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Footer Icons */}
            <motion.div className="flex justify-center gap-6 text-[#89BAD9] text-4xl mt-12" initial="hidden" animate={controls}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } },}}
            >
                {[FaTableTennis, FaTrophy, FaRegLaughBeam].map((Icon, index) => (
                    <motion.div key={index} variants={iconVariants} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                        <Icon aria-label="Game Feature" />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default PageGame;