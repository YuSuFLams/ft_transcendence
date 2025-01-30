import { ErrorState } from "./page";

const ButtonGameTournament:React.FC<{handleCreateTournament: () => void, router: any}> = ({handleCreateTournament, router}) => {
    return (
        <div className="mt-12 w-full flex justify-center space-x-6">
            <button className="bg-blue-800 text-2xl text-white font-extrabold px-6 py-4 rounded-xl shadow-lg duration-300
                hover:bg-gradient-to-l hover:from-blue-900 hover:to-blue-700 hover:scale-105 transition ease-in-out 
                focus:outline-none focus:ring-4 focus:ring-blue-600" onClick={handleCreateTournament}
            >
                Create
            </button>

            <button className="px-6 py-4 text-2xl font-extrabold text-white bg-red-800 rounded-xl hover:bg-gradient-to-l shadow-lg 
                hover:from-red-800 hover:to-red-600 hover:scale-105 transition duration-300 ease-in-out focus:outline-none 
                focus:ring-4 focus:ring-red-600" onClick={() => router.push("/game")}
            >
                Cancel
            </button>
        </div>
    )
}

interface InputPlayersTournamentProps {
    nameTournament: string;
    setNameTournament: (nameTournament: string) => void;
    numPlayers: number;
    handleNumPlayersChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    errors: ErrorState;
    handlePlayerChange: (key: string, value: string) => void;
    players: Record<string, string>;
}
  
const InputPlayersTournament: React.FC<InputPlayersTournamentProps> = ({
    nameTournament, setNameTournament, numPlayers, handleNumPlayersChange, errors, handlePlayerChange, players,
}) => {
    return (
        <div>
            {/* Tournament Name Input */}
            <div className="mb-6">
                <label className="block text-lg font-[Borias] font-bold mb-2 text-indigo-300"> Tournament Name </label>
            
                <input placeholder="Tournament Name" onChange={(e) => setNameTournament(e.target.value)} value={nameTournament}
                    className="w-full p-2 pl-3 rounded-lg shadow-md focus:outline-none placeholder:text-lg 
                        focus:ring-2 focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold 
                        font-[Font6] text-black text-2xl text-left" type="text" />

                {errors.nameTournament && ( <p className="mt-2 ml-2 text-sm text-red-500">{errors.nameTournament}</p> )}
            </div>
  
            {/* Number of Players Selection */}
            <div className="mb-6">
                <label className="block text-lg font-bold mb-2 text-indigo-300"> Number of Players </label>
          
                <select className="w-full p-3 font-[Font6] rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none 
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 shadow-sm" value={numPlayers}
                    onChange={handleNumPlayersChange}
                >
                    <option value={4}>4 Players</option>
                    <option value={8}>8 Players</option>
                </select>
            </div>
  
            {/* Player Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(players).map(([key, player]) => (
                    <div key={key} className="flex flex-col">
                    
                        <label className="block text-lg font-bold mb-2 text-indigo-300"> {key.replace("player", "Player ")} </label>
                
                        <input className="w-full p-2 pl-3 rounded-lg shadow-md focus:outline-none placeholder:text-lg 
                        focus:ring-2 focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold 
                        font-[Font6] text-black text-2xl text-left" type="text" placeholder={`${key.replace("player", "Player ")} Name`} value={player}
                            onChange={(e) => handlePlayerChange(key, e.target.value)}
                        />

                        {errors.players && errors.players[key] && ( <p className="mt-2 ml-2 text-xs text-red-500"> {errors.players[key]} </p> )}
                    </div>
                ))}
            </div>
        </div>
    );
};
  

export { ButtonGameTournament, InputPlayersTournament }