import Image from "next/image";
import { motion } from "framer-motion";
import { LeaderboardItem } from "../../utils/interface";

const LeaderboardTable: React.FC<{ leaderboard: LeaderboardItem[] }> = ({ leaderboard }) => {
    const sortedLeaderboard = [...leaderboard].sort((a, b) => b.wins - a.wins);

    return (
        <div className="overflow-auto font-extrabold max-h-[70vh] rounded-2xl shadow-lg bg-[#000957] border-2 border-[#1E3A5F]">
            <table className="w-full h-full z-[50]  relative text-gray-200">
                <thead className="border-2 border-[#1E3A5F]  bg-[#010D26] text-white text-[1.3em] font-[Font6]">
					<tr className="border-b-2 border-[#2E4E7F]">
                        <th className="px-4 py-4 text-center text-blue-200 text-sm sm:text-md md:text-lg lg:text-xl"> Rank </th>
						<th className="px-4 py-4 text-center text-blue-200 text-sm sm:text-md md:text-lg lg:text-xl"> Avatar </th>
                        <th className="px-4 py-4 text-center text-blue-200 text-sm sm:text-md md:text-lg lg:text-xl"> Player </th>
                        <th className="px-4 py-4 text-center text-blue-200 text-sm sm:text-md md:text-lg lg:text-xl"> Wins </th>
						<th className="px-4 py-4 text-center text-blue-200 text-sm sm:text-md md:text-lg lg:text-xl"> Losses </th>
                    </tr>
                </thead>

                <tbody>
                    {sortedLeaderboard.map((player, index) => (
                        <motion.tr className={`border-b border-[#1E3A5F] hover:bg-[#00013E] hover:opacity-90 hover:transition-all ${index % 2 === 0 ? "bg-[#022859]" : "bg-[#010D26]"}`} key={player.player || index}>
                            <td className="py-3 text-center text-sm sm:text-md md:text-lg font-bold text-[#6BB5FF]"> #{index + 1} </td>
                            <td className="py-3 flex justify-center items-center">
                                <Image className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover hover:scale-110 transition transform duration-300"
                                    src={player.avatar} alt={`${player.player}'s avatar`} width={64} height={64}/>
                            </td>
                            <td className="py-3 text-center text-sm sm:text-md md:text-lg"> {player.player} </td>
                            <td className="py-3 text-center text-sm sm:text-md md:text-lg text-green-400"> {player.wins} </td>
                            <td className="py-3 text-center text-sm sm:text-md md:text-lg text-red-400"> {player.losses}</td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaderboardTable;