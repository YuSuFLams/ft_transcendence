

// utils-local.tsx
import pictureRight from "@/../public/Image/picture2.jpg";
import pictureLeft from "@/../public/Image/picture1.jpg";
import { UserCard } from "./utils-game";
import Cookie from "js-cookie";

const handleCreateGame = (
    player1: React.RefObject<HTMLInputElement | null>,
    player2: React.RefObject<HTMLInputElement | null>,
    setGameCreated: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
) => {
    const player1Name = player1.current?.value.trim();
    const player2Name = player2.current?.value.trim();

    let valid = true;

    if (!player1Name) {
        setError((prev) => ({ ...prev, player1: "Enter Player 1", general: "" }));
        valid = false;
    } else {
        setError((prev) => ({ ...prev, player1: "", general: "" }));
    }

    if (!player2Name) {
        setError((prev) => ({ ...prev, player2: "Enter Player 2", general: "" }));
        valid = false;
    } else {
        setError((prev) => ({ ...prev, player2: "", general: "" }));
    }
    
    if (!valid) return;
    
    if (player1Name === player2Name) {
        setError((prev) => ({ ...prev, player1: "", player2: "", general: "Unique names required" }));
        return;
    }

    if (valid && player1Name && player2Name) {
        setGameCreated(true);
        Cookie.set("player1", player1Name);
        Cookie.set("player2", player2Name);
        Cookie.set("gameCreated", "true");
    }
};

interface CreateGameProps {
    player1: React.RefObject<HTMLInputElement | null>;
    player2: React.RefObject<HTMLInputElement | null>;
    setGameCreated: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const CreateGame: React.FC<CreateGameProps> = ({ player1, player2, setGameCreated, setError }) => {
    return (
        <button className="mt-6 px-6 py-2 bg-transparent border-2 border-blue-600 text-blue-600 font-bold rounded-sm text-lg md:text-xl lg:text-2xl
            hover:bg-blue-600 hover:text-black transition-all duration-300 ease-out uppercase tracking-wide"
            onClick={() => handleCreateGame(player1, player2, setGameCreated, setError)}
        >
            Initiate
        </button>
    );
};

interface CardPlayersProps {
    player1: React.RefObject<HTMLInputElement | null>;
    player2: React.RefObject<HTMLInputElement | null>;
    setGameCreated: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    error: Record<string, string>;
}

const CardPlayers: React.FC<CardPlayersProps> = ({ player1, player2, setGameCreated, setError, error }) => {
    return (
        <div className="w-full max-w-[95%] sm:max-w-4xl lg:max-w-7xl flex flex-col items-center space-y-8 py-8 px-4 sm:px-6 md:px-8 rounded-xl border border-gray-600/50">
            {/* Players Container */}
            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-6 sm:gap-8">
                {/* Player 1 Card */}
                <div className="w-full max-w-lg bg-gray-900/50 border border-gray-600/50 p-4 hover:border-blue-600 transition-colors duration-200">
                    <UserCard name="Player_01" picture={pictureLeft} player={player1} error={error.player1} />
                </div>

                {/* VS Separator */}
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-600">VS</div>

                {/* Player 2 Card */}
                <div className="w-full max-w-lg bg-gray-900/50 border border-gray-600/50 p-4 hover:border-blue-600 transition-colors duration-200">
                    <UserCard name="Player_02" picture={pictureRight} player={player2} error={error.player2 || error.general} />
                </div>
            </div>

            {/* Error Message */}
            {error.general && (
                <div className="text-red-500 text-sm sm:text-base font-mono bg-gray-900/50 px-4 py-2 border border-red-500/50">
                    [ERROR] {error.general || error.player1 || error.player2}
                </div>
            )}

            {/* Start Game Button */}
            <CreateGame player1={player1} player2={player2} setError={setError} setGameCreated={setGameCreated} />
        </div>
    );
};

export { CardPlayers };