"use client";

import { FaUserFriends, FaDice, FaEnvelopeOpenText, FaGlobeAmericas } from "react-icons/fa";
import { FaTableTennis, FaTrophy, FaRegLaughBeam } from "react-icons/fa";
import { motion, useAnimate } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const PageGame = () => {
    const router = useRouter();

    const [cursor, setCursor] = useState("default");

    // Function to change cursor style
    const handleMouseEnter = () => setCursor("pointer");
    const handleMouseLeave = () => setCursor("default");

    // Navigate to the specified path
    const handleClick = (path: string) => router.push(path);

    // Animated welcome message
    const message = "\u2728 Welcome to the Ultimate Ping Pong Experience \u2728";
    const wordsArray = message.split(" ");
    const [scope, animate] = useAnimate();

    useEffect(() => {
        wordsArray.forEach((_, index) => {
            animate(
                `span:nth-child(${index + 1})`,
                { opacity: 1, scale: [0.8, 1.2, 1], filter: "blur(0px)" },
                { duration: 1, delay: index * 0.25, ease: "easeOut" }
            );
        });
    }, [scope, animate, wordsArray]);

    const buttons = [
        {
            label: "Game Local",
            icon: <FaUserFriends size={60} className="text-[#005f73]" />,
            path: "/game/game-local",
            delay: 0
        },
        {
            label: "Game Online",
            icon: <FaGlobeAmericas size={60} className="text-[#ffd780]" />,
            path: "/game-online",
            delay: 0.1
        },
        {
            label: "Tournament Local",
            icon: <FaDice size={60} className="text-[#16404D]" />,
            path: "/my/tournament-local",
            delay: 0.2
        },
        {
            label: "Tournament Invite",
            icon: <FaEnvelopeOpenText size={60} className="text-[#710000]" />,
            path: "/tournament-invite",
            delay: 0.3
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#001219] via-[#031D44] to-[#062A78] text-white relative"
            style={{ cursor: cursor }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0.8)_70%)]"></div>

            {/* Centered welcome message at the top */}
            <div className="flex flex-col absolute top-12 w-full justify-center items-center space-y-4">
                <div className="flex flex-col items-center">
                    <motion.h1
                        className="font-[Font3] flex justify-center text-[2.6em] text-[2.9em] 
                        font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffcc00] to-[#ff6600] 
                        text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <div ref={scope} className="flex justify-center items-center">
                            {wordsArray.map((word, index) => (
                                <span key={index} className="inline-block opacity-0 filter blur-sm">
                                    {word} {index < wordsArray.length - 1 && <span className="mr-2" />}
                                </span>
                            ))}
                        </div>
                    </motion.h1>
                </div>

                <div className="mt-4 flex justify-center gap-4">
                    <FaTableTennis size={40} className="text-[#FFD700]" />
                    <FaTrophy size={40} className="text-[#FFD700]" />
                    <FaRegLaughBeam size={40} className="text-[#FFD700]" />
                </div>
            </div>

            {/* Button grid */}
            <div className="absolute inset-0 flex flex-1 items-center justify-center mt-24">
                <div className="grid grid-cols-2 gap-8">
                    {buttons.map(({ label, icon, path, delay }, index) => (
                        <motion.button
                            className="flex flex-col items-center justify-center p-6 bg-[#aaabbc] bg-opacity-60 
                            rounded-3xl shadow-lg hover:shadow-xl hover:shadow-[#00eaff] active:scale-95 active:translate-y-1 
                            active:shadow-[0px_0px_10px_#00eaff,0px_0px_25px_rgba(0,234,255,0.6)] space-y-4 w-[28em] h-[12em] cursor-pointer 
                            transition-all"
                            key={index}
                            whileHover={{ scale: 1.03 }}
                            onClick={() => { handleClick(path); }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: delay }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                                className="animate-pulse"
                            >
                                {icon}
                            </motion.div>
                            <div className="text-3xl font-extrabold text-[#082751] font-[Font6] text-center">{label}</div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute w-[300px] h-[300px] bg-purple-400 rounded-full opacity-30 blur-3xl animate-move-up left-10 top-10"></div>
            <div className="absolute w-[200px] h-[200px] bg-blue-500 rounded-full opacity-30 blur-3xl animate-move-down right-20 bottom-20"></div>
        </div>
    );
};

export default PageGame;
