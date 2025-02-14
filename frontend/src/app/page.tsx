"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


const HomePage = () => {
    const router = useRouter();

    const handleClick = () => {
        const token = Cookies.get("access");
        router.push(token ? "/dashboard" : "/login-signup");
    };

    return (
        <div className="relative w-screen h-screen bg-gradient-to-br from-[#050026] via-[#11002D] to-[#002A52] 
            overflow-hidden flex items-center justify-center">
            <div className="relative flex flex-col items-center justify-center z-[10] text-center">
                <h1 className="font-[Font5] text-[3.5rem] sm:text-[5rem] lg:text-[8rem]  uppercase tracking-widest 
                    text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] via-[#0099FF] to-[#7300FF]">
                    PING PONG
                </h1>

                {/* Subtitle with soft electric blue glow */}
                <p className="font-[Borias] text-[#E8F9FD] text-[1.2rem] sm:text-[1.5rem] lg:text-[2.7rem]  tracking-wide opacity-90 ">
                    Play. Compete. Chat. Have Fun!
                </p>

                {/* Futuristic Glowing Button */}
                <button onClick={handleClick} className="relative px-14 sm:px-16 lg:px-24 py-4 mt-10 font-extrabold font-[Font7]  
                    sm:text-xl lg:text-2xl uppercase tracking-widest rounded-xl transition-all duration-300 ease-in-out text-white 
                    border-2 border-[#00FFFF] bg-[#071A30] bg-opacity-50 backdrop-blur-xl active:scale-100 active:translate-y-1 
                    shadow-[0px_0px_10px_#084D63,0px_0px_20px_rgba(0,255,255,0.8)] hover:scale-105
                    hover:shadow-[0px_0px_20px_#1D2A40,0px_0px_40px_rgba(0,255,255,1)] 
                    active:shadow-[0px_0px_20px_#00FFFF,0px_0px_40px_rgba(0,255,255,0.8)]">
                    Start Playing
                </button>
            </div>
        </div>
    );
};

export default HomePage;
