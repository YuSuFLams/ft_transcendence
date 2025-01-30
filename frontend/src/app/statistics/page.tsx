"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GameHistoryTabs, LeaderboardTable, TournamentCards } from "./utils";
import { Point } from "../utils/background";
import avatar from "@/../public/Image/picture2.jpg";
import axios from "axios";
import Cookie from 'js-cookie';
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { BackButton } from "../components/game/game-local/local-game_utils";
import { useRouter } from "next/navigation";
import { GameHistoryItem, GameLocalData, GameTournamentLocalData, LeaderboardItem, TournamentItem } from "../components/api/statisticsGame";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);




const ChartsData :React.FC<{leaderboard: LeaderboardItem[];}> = ({leaderboard}) => {
	const doughnutChartData = {
		labels: leaderboard.map((item) => item.player),
		datasets: [
			{
				data: leaderboard.map((item) => item.wins),
				backgroundColor: ["#FFB6C1", "#FFD700", "#87CEEB"],
			},
		],
	};
	
	const pieChartData = {
		labels: leaderboard.map((item) => item.player),
		datasets: [
			{
				data: leaderboard.map((item) => item.losses),
				backgroundColor: ["#FF6347", "#32CD32", "#8A2BE2"],
			},
		],
	};
	const chartOptions = {
		responsive: true,
		plugins: {
			tooltip: {
				backgroundColor: "rgba(191, 42, 42, 0.7)",
				titleColor: "#fff",
				bodyColor: "#fff",
				borderColor: "#fff",
				borderWidth: 1,
			},
		},
	};

	return (
		<div className="z-[50] relative">
			<div className="flex flex-wrap justify-center items-center mt-12">
			<div className="w-full sm:w-1/2 lg:w-1/3 flex flex-col justify-center space-y-8 items-center h-[300px] px-4">
				<h3 className="text-3xl font-[Font6] text-[#D9C0A3] text-center mb-4">Wins Distribution</h3>
				{leaderboard.length > 0 && <Doughnut data={doughnutChartData} options={chartOptions} />}
			</div>

			<div className="w-full sm:w-1/2 lg:w-1/3 flex flex-col justify-center space-y-8 items-center h-[300px] px-4">
				<h3 className="text-3xl font-[Font6] text-[#D9C0A3] text-center mb-4">Losses Distribution</h3>
				{leaderboard.length > 0 && <Pie data={pieChartData} options={chartOptions} />}
			</div>
			</div>
		</div>
	)
}

const PageHistoryGame = () => {
	const [activeTab, setActiveTab] = useState<"history" | "leaderboard" | "tournaments" | "charts">("history");
	const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
	const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
	const [tournaments, setTournaments] = useState<TournamentItem[]>([]);
	const router = useRouter();

	useEffect(() => {
		GameLocalData(setGameHistory);
		GameTournamentLocalData(setTournaments);
	},[]);

	useEffect(() => {
		setGameHistory([{
			gameId: "2", winner: "Youssef", player1: "Youssef", score: "8 - 7", player2: "ok", type: "online" 
		},]);
		setLeaderboard([
			{ player: "Player1", wins: 10, losses: 2, avatar: avatar },
			{ player: "Player1", wins: 10, losses: 2, avatar: avatar },
			{ player: "Player1", wins: 10, losses: 2, avatar: avatar },
			{ player: "Player1", wins: 10, losses: 2, avatar: avatar },
			{ player: "Player1", wins: 10, losses: 2, avatar: avatar },
			{ player: "Player1", wins: 10, losses: 2, avatar: avatar },
			{ player: "Player5", wins: 1, losses: 23, avatar: avatar }]);
	}, []);

  	return (
    	<div className="bg-[#050A30] text-white min-h-screen flex flex-col font-sans">
			<div className="flex justify-center mt-8">
				<motion.h1 className="text-center text-[3.4em] lg:text-[3em] font-extrabold text-indigo-600 font-[Borias] tracking-wider" 
					initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
					Player Rankings & Game Records
				</motion.h1>
			</div>

			{/* Tab Navigation */}
			<div className="flex z-[50] justify-center mt-6 space-x-6 group">
				{["history", "leaderboard", "tournaments", "charts"].map((tab) => (
					<motion.button key={tab} onClick={() => setActiveTab(tab as "history" | "leaderboard" | "tournaments" | "charts")}
						whileHover={{ scale: 1.10 }} whileTap={{ scale: 0.95 }} className={`w-[200px] px-8 py-3 text-xl font-semibold rounded-lg shadow-lg 
						transition-all duration-300 group-hover:blur-sm hover:!blur-none ${ activeTab === tab? "bg-gradient-to-r from-blue-700 to-blue-800 \
						text-white scale-105": "bg-gray-800 text-gray-300 scale-90 group-hover:bg-gradient-to-r group-hover:from-blue-800 \
						group-hover:to-blue-900 hover:text-white"}`} 
					>
					{tab.charAt(0).toUpperCase() + tab.slice(1)}
					</motion.button>
				))}
			</div>

			<div className="z-[50]"> <BackButton router={router} /> </div>  
			{/* Tab Content */}
			<div className="mt-8 px-6 lg:px-20">
				<motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
					{activeTab === "history" && <GameHistoryTabs gameHistory={gameHistory} />}
					{activeTab === "leaderboard" && <LeaderboardTable leaderboard={leaderboard} />}
					{activeTab === "tournaments" && <TournamentCards tournaments={tournaments} />}
					{activeTab === "charts" && <ChartsData leaderboard={leaderboard} />}
				</motion.div>
			</div>
			<Point />
		</div>
  	);
};



export default PageHistoryGame;
