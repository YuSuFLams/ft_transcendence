"use client";

import { FaTrophy, FaTableTennis, FaRegLaughBeam, FaHome } from "react-icons/fa";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GiLaurelsTrophy } from "react-icons/gi";
import { TbWorld } from "react-icons/tb";
import { RulesButton, RulesGameLocal } from "@/components/game/index-utils";
import React from "react";
import './index.css'

const PageGame = () => {
    const router = useRouter();
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [isClicked, setIsClicked] = useState(false);

    const gameTypes = [
        {title: "Local Game", icon: <FaHome />, path: "/game/game-local", description: "Multiplayer on single device", neon: "neon-blue", color: "blue-400",},

        {title: "Online Match", icon: <TbWorld />, path: "/game-online", description: "Global real-time battles", neon: "neon-blue-light", color: "blue-500",},

        {title: "Tournament", icon: <GiLaurelsTrophy />, path: "/game/tournament-local", description: "Local competitive play", neon: "neon-blue-dark", color: "blue-600",},
    ];

    const glowVariants = {hidden: { opacity: 0, scale: 1 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4, duration: 0.8 }}};

    useEffect(() => {
        if (isInView) controls.start("visible");
    }, [controls, isInView]);


    return (
        <div className="min-h-screen text-white px-6 py-12 font-['Orbitron'] overflow-hidden relative">

            {/* Header */}
            <motion.div className="text-center mb-16 relative z-10" initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
                <h1 className="text-5xl md:text-6xl font-bold tracking-wider glitch" data-text="PPU PROTOCOL">PPU PROTOCOL </h1>
                <p className="text-lg mt-4 text-gray-400 tracking-wide"> INITIALIZE YOUR GAME MODULE</p>
                <div className="w-1/4 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 mx-auto mt-4 rounded-full" />
            </motion.div>

            <RulesGameLocal isClicked={isClicked} setIsClicked={setIsClicked} />

            {/* Game Selection */}
            <motion.div ref={ref} className="max-w-[100rem] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12" initial="hidden" animate={controls}>
                {gameTypes.map((game, index) => (
                    <motion.div key={index} variants={glowVariants} onClick={() => router.push(game.path)} className={`relative p-8 bg-gray-900/80 
                        border-2 ${game.neon} rounded-xl cursor-pointer group overflow-hidden transition-transform duration-300 min-h-[300px]`}
                        whileHover={{scale:1.05, boxShadow: `0 0 20px ${game.color}`}}
                    >
                        {/* Neon Border Effect */}
                        <div className={`absolute inset-0 ${game.neon}-glow opacity-50 group-hover:opacity-100 transition-opacity`} />
                        
                        {/* Content */}
                        <div className="relative z-10">
                            <div className="flex justify-center mb-8"> {React.cloneElement(game.icon, {size: 70, className: `text-${game.color} group-hover:animate-pulse`})} </div>
                            
                            <h2 className="text-3xl font-bold text-center mb-4 tracking-wide"> <span className={`text-${game.color} `}>{game.title}</span></h2>
                            
                            <p className="text-gray-300 text-center text-base uppercase tracking-wider"> {game.description} </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Footer */}
            <motion.div className="mt-16 flex justify-center gap-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                {[FaTableTennis, FaTrophy, FaRegLaughBeam].map((Icon, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.3, color: "#0487D9", textShadow: "0 0 10pxrgb(94, 165, 210)"}} className="text-gray-400">
                        <Icon size={32} />
                    </motion.div>
                ))}
            </motion.div>
            
            <div className="text-center mt-8"> <RulesButton setIsClicked={setIsClicked}/> </div>

            {/* Floating Particles */}
            <div className="fixed inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div key={i} className={`absolute w-1 h-1 bg-${['cyan', 'purple', 'pink'][i % 3]}-400 rounded-full`} animate={{ y: ["0vh", "100vh"], opacity: [0, 1, 0]}}
                        transition={{duration: Math.random() * 10 + 5, repeat: Infinity, delay: Math.random() * 5}} initial={{ x: Math.random() * 100 + "vw", y: Math.random() * 100 + "vh"}}
                    />
                ))}
            </div>
        </div>
    );
};

export default PageGame;