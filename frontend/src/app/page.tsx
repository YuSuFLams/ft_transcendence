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
		<div className="relative w-screen h-screen bg-gradient-to-br from-[#001219] via-[#031D44] to-[#062A78] overflow-hidden flex items-center justify-center">
			{/* Glowing Overlay */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0.8)_100%)]"></div>

			<div className="relative flex flex-col items-center justify-center z-10 text-center">
				<h1 className="font-[Font5] text-transparent text-[3rem] sm:text-[5rem] lg:text-[8rem] uppercase tracking-widest 
					bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-glow animate-blob">
					PING PONG
				</h1>

				{/* Subtitle */}
				<p className="font-[Font5] text-blue-200 text-[1.4rem] sm:text-[1.6rem] lg:text-[3rem] tracking-wide drop-shadow-md animate-fade-in">
					The Ultimate Game for Everyone
				</p>

				{/* Play Button with Glassmorphism & Glow Effect */}
				<button
					onClick={handleClick}
					className="relative px-20 lg:px-36 py-3 mt-8 text-white font-bold font-[Font8] text-lg lg:text-2xl uppercase tracking-wider 
					backdrop-blur-lg bg-white bg-opacity-10 rounded-full border border-purple-400 shadow-lg transition-all duration-300
					hover:bg-opacity-20 hover:scale-105 active:scale-95"
				>
					PLAY
					{/* Animated Glow Effect */}
					<span className="absolute inset-0 bg-purple-500 opacity-20 blur-2xl animate-ping"></span>
				</button>
			</div>

			{/* Soft Moving Lights in the Background */}
			<div className="absolute w-[300px] h-[300px] bg-purple-400 rounded-full opacity-30 blur-3xl animate-move-up left-10 top-10"></div>
			<div className="absolute w-[200px] h-[200px] bg-blue-500 rounded-full opacity-30 blur-3xl animate-move-down right-20 bottom-20"></div>
		</div>
	);
};

export default HomePage;
