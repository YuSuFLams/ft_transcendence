import { GameHistoryItem } from "../../utils/interface";
import classNames from "classnames";
import { motion } from "framer-motion";
import { CalendarX } from "lucide-react";

const GameHistoryList: React.FC<{ title: string; games: GameHistoryItem[] }> = ({ title, games }) => {
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="z-[50] rounded-2xl relative">
			<h2 className="text-4xl font-semibold font-[Font3] text-center bg-gradient-to-r from-[#1F509A] via-[#D4EBF8] to-[#1F509A] bg-clip-text text-transparent mb-6">{title}</h2>
            
            {games.length === 0 ? (
                <motion.div transition={{ delay: 0.3, duration: 0.5 }} className="flex flex-col items-center justify-center p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <CalendarX className="w-28 h-28 text-blue-200 mb-4" />
                    <p className="text-3xl font-[Font3] font-bold text-blue-100 mb-2"> No {title.toLowerCase()} games available </p>
                    <p className="text-md font-[TORAJA] font-semibold text-blue-300 text-center"> Please check back later for upcoming games </p>
                </motion.div>
            ) : (
                <div className="overflow-auto max-h-96 rounded-lg shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-2 rounded-2xl border-[#1E3A5F]">
                    <GameTable games={games} />
                </div>
            )}
		</motion.div>
	);
};

const GameTable: React.FC<{ games: GameHistoryItem[] }> = ({ games }) => (
	<table className="w-full text-lg font-extrabold">
		<thead className="border-2 border-[#1E3A5F] bg-[#010D26] text-white text-[1.3em] font-[Font6]">
			<tr className="border-b-2 rounded-2xl border-[#2E4E7F]">
				<th className="px-4 py-4 text-center text-blue-200">Player 1</th>
				<th className="px-4 py-4 text-center text-blue-200">Score</th>
				<th className="px-4 py-4 text-center text-blue-200">Player 2</th>
			</tr>
		</thead>

		<tbody>
			{games.map((game, index) => (
				<motion.tr className={`border-b border-[#1E3A5F] hover:bg-[#00013E] hover:opacity-90 hover:transition-all ${index % 2 === 0 ? "bg-[#022859]" : "bg-[#010D26]"}`}>
					<td className={classNames("px-4 py-3 text-center", game.winner === game.player1 ? "text-blue-400" : "text-blue-100")}>{game.player1}</td>
					<td className="px-4 py-3 text-center text-blue-100">{game.score}</td>
					<td className={classNames("px-4 py-3 text-center", game.winner === game.player2 ? "text-blue-400" : "text-blue-100")}>{game.player2}</td>
				</motion.tr>
			))}
		</tbody>
	</table>
);

const GameHistoryTabs: React.FC<{ gameHistory: GameHistoryItem[] }> = ({ gameHistory }) => {
	const localGames = gameHistory.filter((game) => game.type === "local");
	const onlineGames = gameHistory.filter((game) => game.type === "online");

	return (
		<div className="overflow-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
			<GameHistoryList title="Local Matches" games={localGames} />
			<GameHistoryList title="Online Matches" games={onlineGames} />
		</div>
	);
};

export default GameHistoryTabs;