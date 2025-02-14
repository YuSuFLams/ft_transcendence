"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import avatar from "@/../public/Image/picture2.jpg";
import { GameHistoryItem, LeaderboardItem, TournamentItem } from "../utils/interface";
import { GameLocalData, GameTournamentLocalData } from "../api/game-stats";
import ChartsData from "./chart/chart-game";
import GameHistoryTabs from "./game/local-online";
import LeaderboardTable from "./leader/Leaderboard";
import TournamentCards from "./tournament/TournamentCard";




const PageHistoryGame = () => {
	const [activeTab, setActiveTab] = useState<"history" | "leaderboard" | "tournaments" | "charts">("history");
	const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
	const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
	const [tournaments, setTournaments] = useState<TournamentItem[]>([]);

	useEffect(() => {
		GameLocalData(setGameHistory);
		GameTournamentLocalData(setTournaments);
	}, []);

	useEffect(() => {
		setGameHistory([
			{ winner: "Youssef", player1: "Youssef", score: "8 - 7", player2: "ok", type: "online" },
			{ winner: "Youssef", player1: "Youssef", score: "8 - 7", player2: "ok", type: "online" },
			{ winner: "ok", player1: "Youssef", score: "5 - 7", player2: "ok", type: "online" },
			{ winner: "Youssef", player1: "Youssef", score: "8 - 7", player2: "ok", type: "online" },
			{ winner: "ok", player1: "Youssef", score: "6 - 7", player2: "ok", type: "online" },
		]);
		setLeaderboard([
			{ player: "youssef", wins: 10, losses: 12, avatar: avatar },
			{ player: "holla", wins: 13, losses: 12, avatar: avatar },
			{ player: "taza", wins: 17, losses: 5, avatar: avatar },
			{ player: "badr", wins: 19, losses: 4, avatar: avatar },
			{ player: "abd", wins: 11, losses: 7, avatar: avatar },
			{ player: "rabat", wins: 14, losses: 19, avatar: avatar },
			{ player: "casa", wins: 14, losses: 9, avatar: avatar },
			{ player: "1337", wins: 4, losses: 23, avatar: avatar },
		]);
	}, []);

	return (
		<div className="space-y-4 bg-gradient-to-br from-[#050026] via-[#11002D] to-[#002A52] text-white h-full w-full min-h-screen flex flex-col font-sans">
			<div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
				<motion.h1 className="text-center mb-4 text-[2.2em] sm:text-[2.4em] md:text-[2.6em] lg:text-[2.8em] xl:text-[3em] font-extrabold 
					text-[#D4EBF8] font-[Font2] tracking-wider" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
				>
					Tournament & Player Analytics
				</motion.h1>
			</div>

			{/* Tab Navigation */}
			<div className="flex z-[50] justify-center space-x-6 group">
				{["history", "leaderboard", "tournaments", "charts"].map((tab) => (
					<motion.button onClick={() => setActiveTab(tab as "history" | "leaderboard" | "tournaments" | "charts")} whileTap={{ scale: 0.95 }} key={tab}
						whileHover={{ scale: 1.10 }} className={`w-[200px] py-3 text-xl font-semibold rounded-lg shadow-lg transition-all text-center font-[Font4] 
						duration-300 group-hover:blur-sm hover:!blur-none ${activeTab === tab ? "bg-gradient-to-r from-blue-700 to-blue-800 text-white scale-105"
							: "bg-gray-800 text-gray-300 scale-90 group-hover:bg-gradient-to-r group-hover:from-blue-800 group-hover:to-blue-900 hover:text-white"}`}
					>
						{tab.charAt(0).toUpperCase() + tab.slice(1)}
					</motion.button>
				))}
			</div>

			{/* Tab Content */}
			<div className="mt-4 px-6 lg:px-20">
				<motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
					{activeTab === "history" && <GameHistoryTabs gameHistory={gameHistory} />}
					{activeTab === "leaderboard" && <LeaderboardTable leaderboard={leaderboard} />}
					{activeTab === "tournaments" && <TournamentCards tournaments={tournaments} />}
					{activeTab === "charts" && <ChartsData leaderboard={leaderboard} />}
				</motion.div>
			</div>
		</div>
	);
};

export default PageHistoryGame;