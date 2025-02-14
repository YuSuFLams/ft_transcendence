import { motion } from "framer-motion";
import { FaCalendarAlt, FaTrophy, FaUsers } from "react-icons/fa";

interface TournamentPreCardProps {
  tournament: TournamentItem;
  handleViewDetails: (tournament: TournamentItem) => void;
}

import { LuTypeOutline } from "react-icons/lu";
import { TournamentItem } from "../../utils/interface";

export const TournamentPreCard: React.FC<TournamentPreCardProps> = ({ tournament, handleViewDetails }) => {
  return (
        <motion.div className="w-full  max-w-[300px] h-full min-h-[300px] transition duration-300 ease-in-out"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }}
        >
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#1E3A5F] h-full bg-gradient-to-b from-[#010D26] to-[#022859] 
                text-white shadow-lg hover:shadow-xl p-4 flex flex-col justify-between">

                <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center space-x-2">
                        <div className="w-[30px] h-[30px] bg-gray-300 rounded-full flex items-center justify-center"> <FaCalendarAlt className="text-[1.3em] text-gray-700" /> </div>
                        <span className="text-sm font-[Font1] text-gray-300">{new Date(tournament.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric",})}</span>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-[30px] h-[30px] bg-gray-300 rounded-full flex items-center justify-center"> <LuTypeOutline className="text-black"/> </div>
                                <span className="text-[#FFF2F2] font-[Font4]">Type </span>: {tournament.type == "4-player"? " 4" : " 8"}
                            </div>
                            
                            <div className="flex items-center bg-[#FFB22C] font-[Font1] text-amber-800 font-bold rounded-full py-1 px-2 space-x-2">
                                <div className="w-6 h-6 bg-amber-700 rounded-full flex items-center justify-center"> <FaTrophy className="text-white" /></div>
                                <span>{tournament.winner}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="w-[30px] h-[30px] bg-gray-300 rounded-full flex items-center justify-center"> <FaUsers className="w-[20px] h-[20px] text-gray-900" /> </div>
                            <span className="text-md text-gray-300 truncate font-[Font6]"> <span className="font-extrabold md:text-lg font-[Font3] text-white">Players </span>: {tournament.players.join(", ")}</span>
                        </div>
                    </div>

                    <motion.div className="flex items-center justify-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <button className="w-[50%] min-w-[100px] max-w-[200px] bg-[#D9BCA3] rounded-full hover:scale-105  py-1 text-3xl font-[Font3] 
                            font-extrabold text-blue-900 transition-all" onClick={() => handleViewDetails(tournament)}>
                            View
                        </button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};