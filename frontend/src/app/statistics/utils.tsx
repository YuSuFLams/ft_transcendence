import React from "react";
import classNames from "classnames";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarX } from "lucide-react"; 
import { GameHistoryItem, LeaderboardItem, TournamentItem } from "../components/api/statisticsGame";


const GameHistoryList: React.FC<{ title: string; games: GameHistoryItem[] }> = ({ title, games }) => {
	return (
		<div className="z-[50] relative">
			<h2 className="text-4xl font-semibold font-[Font3] text-center text-blue-300 mb-3">{title}</h2>
			<div className="overflow-auto max-h-96 rounded-lg shadow-lg ">
				{games.length === 0 ? (
					<div className="flex flex-col items-center justify-center p-10">
						<CalendarX className="w-20 h-20 text-gray-300 mb-4" />
						<p className="text-2xl font-[Font3] font-bold text-gray-300 mb-2">No {title.toLowerCase()} games available</p>
						<p className="text-md font-[TORAJA] font-semibold text-gray-400">Please check back later for upcoming games</p>
					</div>
				) : (
					<GameTable games={games} />
				)}
			</div>
		</div>
	);
};

const GameTable: React.FC<{ games: GameHistoryItem[] }> = ({ games }) => (
	<table className="w-full bg-gray-900 text-lg font-extrabold">
		<thead className="bg-gradient-to-r from-blue-800 to-blue-900 text-[1.3em] font-[TORAJA]">
			<tr className="border-b-2 border-blue-700">
				<th className="px-4 py-4 text-center">Player 1</th>
				<th className="px-4 py-4 text-center">Score</th>
				<th className="px-4 py-4 text-center">Player 2</th>
			</tr>
		</thead>

		<tbody>
		{games.map((game) => (
			<tr key={game.gameId} className={classNames('border-b border-blue-700 hover:bg-[#082751] hover:transition-all')}>
				<td className={classNames('px-4 py-3 text-center ', game.winner === game.player1 ? 'text-[#F2E205]' : 'text-[#b0b8c1]')}> {game.player1} </td>
				<td className="px-4 py-3 text-center text-white">{game.score}</td>
				<td className={classNames( 'px-4 py-3 text-center ', game.winner === game.player2 ? 'text-[#F2E205]' : 'text-[#b0b8c1]')} > {game.player2}</td>
			</tr>
		))}
		</tbody>
	</table>
);

const GameHistoryTabs: React.FC<{ gameHistory: GameHistoryItem[] }> = ({ gameHistory }) => {
	const localGames = gameHistory.filter((game) => game.type === "local");
	const onlineGames = gameHistory.filter((game) => game.type === "online");

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
			<GameHistoryList title="Local Matches" games={localGames} />
			<GameHistoryList title="Online Matches" games={onlineGames} />
		</div>
	);
};

const LeaderboardTable: React.FC<{ leaderboard: LeaderboardItem[] }> = ({ leaderboard }) => {
	return (
		<div className="overflow-auto max-h-96 rounded-lg shadow-lg">
			<table className="w-full z-[50] relative text-gray-300 bg-gray-900 text-lg font-extrabold">
				<thead className="bg-gradient-to-r from-blue-800 to-blue-900 text-white text-[1.3em] font-[TORAJA]">
					<tr className="border-b-2 border-blue-700">
						<th className="px-4 py-4 text-center">Avatar</th>
						<th className="px-4 py-4 text-center">Player</th>
						<th className="px-4 py-4 text-center">Wins</th>
						<th className="px-4 py-4 text-center">Losses</th>
					</tr>
				</thead>
				<tbody>
					{leaderboard.map((player, index) => (
						<tr className="border-b border-blue-700 hover:bg-[#082751] hover:transition-all" key={player.player || index}>
							<td className="py-3 flex justify-center items-center">
								<Image className="w-16 h-16 rounded-full object-cover hover:scale-110 transition transform duration-300"
									src={player.avatar} alt={`${player.player}'s avatar`} width={40} height={40}
								/>
							</td>
							<td className="py-3 text-center"> {player.player} </td>
							<td className="py-3 text-center">{player.wins}</td>
							<td className="py-3 text-center">{player.losses}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

interface TournamentPupUpProps {
	handleClose: () => void;
	selectedTournament: TournamentItem;
}

const TournamentPupUp: React.FC<TournamentPupUpProps> = ({ handleClose, selectedTournament }) => {
	return (
		<motion.div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-lg flex items-center justify-center z-550" animate={{ opacity: 1 }}
			initial={{ opacity: 0 }} transition={{ duration: 0.3 }}>

			<motion.div className="bg-gray-900 rounded-2xl p-8 shadow-lg w-full max-w-4xl flex flex-col space-y-6" transition={{ duration: 0.3 }}
				initial={{ scale: 0.8 }} animate={{ scale: 1 }}>

				<div className="relative flex justify-center items-center">
					<h2 className="text-5xl text-center font-extrabold font-[Borias] text-indigo-400"> Tournament Details </h2>

					<button className="text-gray-400 absolute top-[-2] right-0 hover:text-white text-5xl transition" onClick={handleClose}> &times;</button>
				</div>

				{/* Players Section */}
				<div>
					<h3 className="text-2xl text-center font-[Font6] font-bold text-[#DCE6F2] mb-4"> Players </h3>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
						{selectedTournament.players.map((player, index) => (
							<div key={index} className="bg-indigo-800 text-2xl font-[Rock] text-[#DCE6F2] py-2 px-4 rounded-lg text-center 
								shadow-md hover:scale-105 transition-transform" >
								{player}
							</div>
						))}
					</div>
				</div>

				{/* Matches Section */}
				<div className="flex flex-col w-full justify-center items-center">
					<h3 className="text-2xl font-bold font-[Font6] text-[#DCE6F2]">Matches</h3>
					<div className="flex justify-around flex-wrap items-center w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12">
						{Object.entries(selectedTournament.matches).map(([round, matchData]) => (
							<div className="flex flex-col justify-center items-center rounded-lg shadow-md hover:shadow-lg transition-shadow" key={round}>
								<h4 className="text-2xl font-bold font-[Font6] text-indigo-200 mb-4 capitalize"> {round.replace("-", " ")} </h4>

								<ul className="flex flex-col justify-center items-center text-gray-300 space-y-4">
									{/* Ensure matchData is an array or object and render accordingly */}
									{(Array.isArray(matchData) ? matchData : [matchData]).map((match: any, idx) => (
										<li className="bg-indigo-800 py-2 px-2 rounded-lg shadow-sm flex flex-col w-full text-left" key={idx}>
											<div className="flex text-xl justify-between items-center space-x-2 flex-raw">
												<p className={`font-[Rock] text-[#DCE6F2]` + (match.winner === match.player1 ? ' text-[#F2E205]' : '') }> {match.player1} </p>
												<p className="font-[Rock] text-[#DCE6F2]"> VS </p>
												<p className={`font-[Rock] text-[#DCE6F2]` + (match.winner === match.player2 ? ' text-[#F2E205]' : '') }> {match.player2} </p>
											</div>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

interface TournamentPreCardProps {
	tournaments: TournamentItem[];
	handleViewDetails: (tournament: TournamentItem) => void;
}
  
const TournamentPreCard: React.FC<TournamentPreCardProps> = ({ tournaments, handleViewDetails }) => {

	const renderTournament = (tournament: TournamentItem) => (
		<motion.div className="bg-gradient-to-r from-[#103778] via-[#1659CC] to-[#103778] rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all 
			transform hover:scale-105 ease-out duration-500 flex flex-col" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
			key={tournament.date} transition={{ duration: 0.5 }}
		>
			<div className="mb-6">
				<p className="text-gray-100 font-[Font6] text-sm"> <span className="font-medium font-[Font2] text-white">Date:</span>{" "}{new Date(tournament.date).toDateString()} </p>
			</div>
  
			<div className="flex flex-col gap-4 text-semibold font-[TORAJA] mb-8">
				<div className="flex justify-between items-center space-x-4">
					<p className="text-gl text-white"> <span className="font-semibold font-[Font2] text-white">Type:</span>{" "}{tournament.type}</p>

					<span className="text-white text-[#DBF227] font-semibold text-xl"> {tournament.winner} </span>
				</div>

				<p className="text-gray-100 text-sm truncate"> <span className="font-medium font-[Font2] text-white">Players:</span>{" "} {tournament.players.join(", ")}</p>
			</div>
  
			<motion.button className="text-lg font-[Font6] bg-[#011C40] font-bold rounded-full py-3 hover:bg-[#011126] shadow-md transition-all 
				ease-in-out duration-300 text-white px-1" onClick={() => handleViewDetails(tournament)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
			>
				View Details
			</motion.button>
		</motion.div>
	);
  
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[60vh] overflow-auto p-6">
			{tournaments.length === 0 ? (
				<div className="absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/8 flex flex-col items-center justify-center p-10">
					<CalendarX className="w-28 h-28 text-gray-300 mb-4" />
					<p className="text-4xl font-[Font6] font-bold text-gray-300 mb-2"> No Tournaments Available </p>
					<p className="text-md font-[TORAJA] font-semibold text-gray-400"> Please check back later for upcoming tournaments. </p>
				</div>
			) : (
				tournaments.map(renderTournament)
		  	)}
		</div>
	);	  
};  

const TournamentCards: React.FC<{ tournaments: TournamentItem[] }> = ({ tournaments }) => {
	const [selectedTournament, setSelectedTournament] = React.useState<TournamentItem | null>(null);

	const handleViewDetails = (tournament: TournamentItem) => setSelectedTournament(tournament);

	const handleCloseModal = () => setSelectedTournament(null);

	return (
		<div className="z-[50] relative flex flex-col items-center justify-center w-full ">
			<TournamentPreCard tournaments={tournaments} handleViewDetails={handleViewDetails} />

			{selectedTournament && ( <TournamentPupUp handleClose={handleCloseModal} selectedTournament={selectedTournament} />)}
		</div>
	);
};
export { GameHistoryTabs, LeaderboardTable, TournamentPupUp, TournamentCards };
