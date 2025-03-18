import { motion } from "framer-motion";

export interface ErrorState {
    nameTournament?: string;
    players?: Record<string, string>;
    duplicatePlayer?: string;
}

export const ButtonGameTournament: React.FC<{ handleCreateTournament: () => void, router: any }> = ({ handleCreateTournament, router }) => {

    const buttonStyles = (type: string) => {
        // Base styles shared by both buttons
        let baseStyles = `px-6 py-2 bg-transparent border-2 text-lg md:text-xl lg:text-2xl font-bold rounded-sm hover:text-black transition-all duration-300 ease-out uppercase tracking-wide`;
    
        // Specific styles based on button type
        if (type === "create") {
            return `${baseStyles} border-blue-600 text-blue-600 hover:bg-blue-600 hover:border-blue-700 focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50`;
        } else if (type === "cancel") {
            return `${baseStyles} border-red-600 text-red-600 hover:bg-red-600 hover:border-red-700 focus:ring-4 focus:ring-red-400 focus:ring-opacity-50`;
        }
        
        return baseStyles;
    };
    
    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center">
            <button onClick={handleCreateTournament} className={buttonStyles("create")}> Create </button>
            <button onClick={() => router.push("/game")} className={buttonStyles("cancel")}> Cancel </button>
        </div>
    );
};


const validateInput = (
    nameTournament: string, players: Record<string, string>, setErrors: React.Dispatch<React.SetStateAction<ErrorState>>
): boolean => {
    const newErrors: ErrorState = {};

    if (!nameTournament.trim()) {
        newErrors.nameTournament = "Tournament name is required.";
    }

    const playerErrors: Record<string, string> = {};
        Object.entries(players).forEach(([key, player]) => {
        if (!player.trim()) {
            playerErrors[key] = `${key} name is required.`;
        }
    });

    newErrors.players = playerErrors;

    const uniquePlayers = new Set(Object.values(players).filter((player) => player.trim()));

    if (uniquePlayers.size !== Object.keys(players).length && Object.values(playerErrors).length === 0) {
        newErrors.duplicatePlayer = "Player names must be unique.";
    }


    setErrors(newErrors);

    return ( !newErrors.nameTournament && Object.values(playerErrors).length === 0 && !newErrors.duplicatePlayer);
};

const handleNumPlayersChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setNumPlayers: React.Dispatch<React.SetStateAction<number>>,
    setPlayers: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    setErrors: React.Dispatch<React.SetStateAction<ErrorState>>
) => {
    const newNumPlayers = parseInt(e.target.value, 10);

    setNumPlayers(newNumPlayers);

    setPlayers((prev) => {
        const updatedPlayers = { ...prev };

        if (newNumPlayers > Object.keys(prev).length) {
            for (let i = Object.keys(prev).length; i < newNumPlayers; i++) {
                updatedPlayers[`player${i + 1}`] = "";
            }
        } else {
            Object.keys(prev).slice(newNumPlayers).forEach((key) => delete updatedPlayers[key]);
        }
        return updatedPlayers;
    });

    setErrors((prev) => ({ ...prev, players: {} }));
};

export { validateInput, handleNumPlayersChange };