"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import React from "react";

const HomePage = () => {
    const router = useRouter();

    const handleClick = () => {
        const token = Cookies.get("access");
        router.push(token ? "/dashboard" : "/login-signup");
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-[#010d19]">
            <div className="relative flex flex-col items-center justify-center z-[10] text-center">
                {/* Title with gradient */}
                <h1 className="font-[Font5] text-[3.5rem] sm:text-[5rem] lg:text-[8rem] uppercase tracking-widest 
                    text-transparent bg-clip-text bg-gradient-to-r from-[#5650f0] to-[#A1E3F9]">
                    PING PONG
                </h1>

                {/* Subtitle with soft glow */}
                <p className="font-[Borias] text-[#c0c0c0] text-[1.2rem] sm:text-[1.5rem] lg:text-[2.7rem] tracking-wide opacity-90">
                    Play. Compete. Chat. Have Fun!
                </p>

                {/* Futuristic Glowing Button */}
                <button
                    onClick={handleClick}
                    className="relative px-14 sm:px-16 lg:px-24 py-4 mt-10 font-extrabold font-[Font7]  
                    sm:text-xl lg:text-2xl uppercase tracking-widest rounded-xl transition-all duration-300 ease-in-out text-white 
                    border-2 border-[#4635B1] bg-[#010d19] bg-opacity-50 backdrop-blur-xl active:scale-100 active:translate-y-1 
                    shadow-[0px_0px_10px_#4635B1,0px_0px_20px_rgba(70,53,177,0.8)] hover:scale-105
                    hover:shadow-[0px_0px_20px_#4635B1,0px_0px_40px_rgba(70,53,177,1)] 
                    active:shadow-[0px_0px_20px_#4635B1,0px_0px_40px_rgba(70,53,177,0.8)]"
                >
                    Start Playing
                </button>
            </div>
        </div>
    );
};

export default HomePage;