import { motion } from "framer-motion";
import { TournamentItem } from "../../utils/interface";

interface TournamentPopupProps {
    handleClose: () => void;
    selectedTournament: TournamentItem;
}

const TournamentPopup: React.FC<TournamentPopupProps> = ({ handleClose, selectedTournament }) => {

    return (
        <motion.div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-lg flex items-center justify-center z-550" animate={{ opacity: 1 }}
            initial={{ opacity: 0 }} transition={{ duration: 0.3 }}>

            <motion.div className="bg-gray-900 rounded-2xl p-8 shadow-lg w-full max-w-4xl flex flex-col space-y-6" transition={{ duration: 0.3 }}
                initial={{ scale: 0.8 }} animate={{ scale: 1 }}>

                <div className="relative flex justify-center items-center">
                    <h2 className="text-5xl text-center font-extrabold font-[Borias] text-indigo-400"> Tournament Details </h2>
                    <button className="text-gray-400 absolute top-[-2] right-0 hover:text-white text-5xl transition" onClick={handleClose}> &times;</button>
                </div>

                <div>
                    <h3 className="text-2xl text-center font-[Font6] font-bold text-[#DCE6F2] mb-4"> Players </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {selectedTournament.players.map((player, index) => (
                            <div key={index} className="bg-indigo-800 text-2xl font-[Rock] text-[#DCE6F2] py-2 px-4 rounded-lg text-center shadow-md hover:scale-105 transition-transform" > {player} </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col w-full justify-center items-center">
                    <h3 className="text-2xl font-bold font-[Font6] text-[#DCE6F2]">Matches</h3>
                    <div className="flex justify-around flex-wrap items-center w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12">
                        {Object.entries(selectedTournament.matches).map(([round, matchData]) => (
                            <div className="flex flex-col justify-center items-center rounded-lg shadow-md hover:shadow-lg transition-shadow" key={round}>
                                <h4 className="text-2xl font-bold font-[Font6] text-indigo-200 mb-4 capitalize"> {round.replace("-", " ")} </h4>

                                <ul className="flex flex-col justify-center items-center text-gray-300 space-y-4">
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

export { TournamentPopup };