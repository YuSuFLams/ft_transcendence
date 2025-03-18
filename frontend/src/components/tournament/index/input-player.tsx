import { ErrorState } from "./index-utils";
import { motion } from "framer-motion";

interface InputPlayersTournamentProps {
    nameTournament: string;
    setNameTournament: (nameTournament: string) => void;
    numPlayers: number;
    handleNumPlayersChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    errors: ErrorState;
    handlePlayerChange: (key: string, value: string) => void;
    players: Record<string, string>;
}

export const InputPlayersTournament: React.FC<InputPlayersTournamentProps> = ({
    nameTournament, setNameTournament, numPlayers, handleNumPlayersChange, errors, handlePlayerChange, players,
}) => {

    const style = (error: boolean) => `w-full px-3 py-4 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-md bg-gray-900 text-white text-sm sm:text-md 
        md:text-lg font-bold border ${error ? "border-red-500" : "border-gray-700"} focus:border-blue-600 focus:ring-2 
        focus:ring-blue-600/50 focus:outline-none placeholder:text-gray-500 transition-all duration-200`

    return (
        <motion.div initial="hidden" animate="visible" className="p-6  bg-[#132031] border border-gray-600/50 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            {/* Tournament Name */}
            <div className="mb-6">
                <label htmlFor="tournament-name" className="block text-xl font-bold text-gray-300 mb-2"> Tournament Name</label>

                <motion.input className={style(!!errors.nameTournament)} placeholder="Enter Tournament Name" 
                    id="tournament-name" value={nameTournament} autoFocus initial="rest" whileHover="hover" whileFocus="focus"
                    onChange={(e) => setNameTournament(e.target.value)}
                />

                {errors.nameTournament && ( <p id="tournament-name-error" className="text-red-500 text-sm sm:text-base font-mono px-2 py-2">{errors.nameTournament}</p>)}
            </div>

            {/* Number of Players */}
            <div className="mb-6">
                <label htmlFor="num-players" className="block text-xl font-semibold text-gray-300 mb-2"> Number of Players </label>

                <motion.select className="w-full px-2 py-4 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-md text-lg bg-gray-900 text-white" id="num-players"
                    value={numPlayers} onChange={handleNumPlayersChange} initial="rest" whileHover="hover" whileFocus="focus"
                >
                    <option value={4}>4 Players</option>
                    <option value={8}>8 Players</option>
                </motion.select>
            </div>

            {/* Player Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(players).map(([key, player]) => (
                    <motion.div transition={{ duration: 0.2, delay: 0.1 * parseInt(key.replace("player", "")) }} key={key} initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }} className="flex flex-col"
                    >
                        <label htmlFor={key} className="text-lg font-semibold text-gray-300 mb-1"> {key.replace("player", "Player ")} </label>
                        
                        <motion.input id={key} placeholder={`Name for ${key.replace("player", "Player ")}`} onChange={(e) => handlePlayerChange(key, e.target.value)}
                            value={player} initial="rest" whileHover="hover" whileFocus="focus" className={style(!!errors.players?.[key])}
                        />
                        {errors.players?.[key] && ( <p id={`${key}-error`} className="text-red-500 text-sm sm:text-base font-mono px-2 py-2">{errors.players[key]}</p>)}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};