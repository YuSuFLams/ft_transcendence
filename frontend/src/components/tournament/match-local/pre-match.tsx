import { PlayerCard } from "@/components/game/match-local/pre-match/card";
import Cookie from "js-cookie";

const handleStartGame = (
    socket: React.RefObject<WebSocket | null>,
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
    player1: string,
    player2: string,
) => {
    const isStart = Cookie.get("gameStarted");
    if (socket.current && socket.current.readyState === WebSocket.OPEN && !isStart) {
        const idTournament = Cookie.get("idTournament");
        if (!idTournament) {
            console.error("Tournament ID not found in cookies.");
            return;
        }
        const idMatch = Cookie.get("idMatch");
        if (!idMatch) {
            console.error("Match ID not found in cookies.");
            return;
        }
        socket.current.send(JSON.stringify({ action: "start-game", idMatch: idMatch, idTournament: idTournament, player1: player1, player2: player2 }));
        Cookie.set("gameStarted", "true");
        setGameStarted(true);
    } else {
        console.warn("Socket is not ready or game already started.");
    }
};

interface ButtonGameProps {
    playerLeft: string;
    playerRight: string;
    socket: React.RefObject<WebSocket | null>;
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

const ButtonGame: React.FC<ButtonGameProps> = ({ playerLeft, playerRight, socket, setGameStarted }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center">
            <button onClick={() => handleStartGame(socket, setGameStarted, playerLeft, playerRight)} className="mt-6 px-6 py-2 bg-transparent 
                border-2 text-lg md:text-xl lg:text-2xl font-bold rounded-sm hover:text-black transition-all duration-300 ease-out uppercase 
                tracking-wide border-blue-600 text-blue-600 hover:bg-blue-600 hover:border-blue-700 focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
            >
                Start Game
            </button>
        </div>
    )
}

interface cardPlayersProps {
    playerLeft: string;
    playerRight: string;
    socket: React.RefObject<WebSocket | null>;
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CardPlayers: React.FC<cardPlayersProps> = ({playerLeft, playerRight, socket, setGameStarted}) => {
    const p1 = Cookie.get("p1");
    const p2 = Cookie.get("p2");
    return (
        <div className="w-full flex-1 font-mono flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative">
            <h1 className="absolute top-10 text-3xl md:text-4xl lg:text-6xl font-bold text-blue-600 tracking-widest animate-pulse">[TOURNAMENT:GAME]</h1>
        
            <div className="w-full max-w-[90%] sm:max-w-3xl md:max-w-5xl lg:max-w-6xl flex flex-col items-center space-y-8 py-10 px-4 sm:px-6 md:px-8 
                bg-gray-900/20 rounded-2xl border border-gray-700/50 shadow-xl backdrop-blur-sm">
                
                {/* Players Container */}
                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
                    {/* Player 1 Card */}
                    <div className="w-full max-w-sm bg-gray-800/30 border border-gray-600/50 p-4 rounded-xl hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                        <PlayerCard player={playerLeft} picture={`/Image/picture${p1}.jpg`} />
                    </div>

                    {/* VS Separator */}
                    <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-600">VS</div>

                    {/* Player 2 Card */}
                    <div className="w-full max-w-sm bg-gray-800/30 border border-gray-600/50 p-4 rounded-xl hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                        <PlayerCard player={playerRight} picture={`/Image/picture${p2}.jpg`} />
                    </div>
                </div>

                {/* Action Buttons Section */}
                <ButtonGame playerLeft={playerLeft} playerRight={playerRight} socket={socket} setGameStarted={setGameStarted} />
            </div>

        </div>
    );
};