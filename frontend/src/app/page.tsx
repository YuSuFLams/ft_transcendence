"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Point } from "./utils/background";

const HomePage = () => {
	const router = useRouter();

	const handleClick = () => {
		const token = Cookies.get("access");
		router.push(token ? "/dashboard" : "/login-signup");
	};

	return (
		<div className="relative w-screen h-screen bg-[#050A30] overflow-hidden flex items-center justify-center">


			<div className="relative flex flex-col items-center justify-center z-[10] text-center">
				{/* Title - Soft Neon Glow with No Strong Shadows */}
				<h1 className="font-[Font5] text-[3rem] sm:text-[5rem] lg:text-[8rem] uppercase tracking-widest 
					text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] via-[#ff1493] to-[#00eaff] 
					animate-neon-subtle">
					PING PONG
				</h1>

				{/* Subtitle - Clean & Simple */}
				<p className="font-[Font5] text-blue-300 text-[1.4rem] sm:text-[1.6rem] lg:text-[3rem] tracking-wide opacity-90">
					Play. Compete. Chat. Have Fun!
				</p>

				{/* Clean, Minimal Button */}
				<button onClick={handleClick} className="relative px-14 sm:px-16 lg:px-24 py-4 mt-10 font-extrabold font-[Font8]  
					sm:text-xl lg:text-2xl uppercase tracking-widest rounded-xl transition-all duration-300 ease-in-out text-white 
					border-2 border-[#00eaff] hover:shadow-[0px_0px_20px_#00eaff,0px_0px_40px_rgba(0,234,255,0.8)] hover:scale-105 
					bg-[#0A1F44] backdrop-blur-md bg-opacity-30 shadow-[0px_0px_12px_#00eaff,0px_0px_30px_rgba(0,234,255,0.5)] text-lg
					active:scale-100 active:translate-y-1 active:shadow-[0px_0px_10px_#00eaff,0px_0px_25px_rgba(0,234,255,0.6)]"
				>
					Start Playing
				</button>


			</div>
			<Point />
		</div>
	);
};

export default HomePage;
