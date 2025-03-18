"use client";
import Image from "next/image";
import default_img from "@/../public/Image/default_img.png";
import { motion } from "framer-motion";
import { PlayerGame, PlayersProps } from "@/components/utils/interface";


const PlayerCard: React.FC<{ player?: PlayerGame; isWinner?: boolean }> = ({ player, isWinner }) => (
    <motion.div className={`w-20 sm:w-24 md:w-28 lg:w-28 relative group z-10 ${isWinner ? "border-4 border-green-500" : ""}`}
        whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
        <div className="relative">
            <Image className="rounded-t-lg border-2 border-gray-700 shadow-lg object-cover transition-all duration-300" 
                alt={player?.username || "Player"} src={player?.picture || default_img} width={160} height={100} priority
            />
            <div className="bg-gray-700 p-2 rounded-b-lg"> 
                <h1 className="text-white text-xs sm:text-sm md:text-base font-semibold truncate text-center">{player?.username || "?"}</h1>
            </div>

            {isWinner && (<div className="absolute top-0 right-0 bg-green-500 text-white px-1 py-1 rounded-bl-lg text-xs">W</div>)}
        </div>
    </motion.div>
);

interface MatchProps {
    player1?: PlayerGame;
    player2?: PlayerGame;
    winner?: PlayerGame;
}

const MatchCard: React.FC<MatchProps> = ({ player1, player2, winner }) => {
    return( 
        <div className="bg-gray-800 bg-opacity-80 p-4 shadow-xl flex flex-col items-center justify-between w-full max-w-md border-2 border-white">
        <div className="w-full flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8">
            <div className="flex flex-col items-center">
                <PlayerCard player={player1} isWinner={winner?.username === player1?.username && winner?.username !== "?"} />
            </div>
            <span className="text-white font-bold text-lg">VS</span>
            <div className="flex flex-col items-center">
                <PlayerCard player={player2} isWinner={winner?.username === player2?.username && winner?.username !== "?"} />
            </div>
        </div>
    </div>
    )
};

const PageTournamentCard8Players: React.FC<{ Players: PlayersProps; }> = ({ Players }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <h1 className=" absolute top-10 relative text-5xl font-extrabold font-[Rock] text-[#0349A8] tracking-wide drop-shadow-md">
                Local Tournament
            </h1>
            <div className="relative w-full max-w-8xl flex-grow flex items-center justify-center">
                <div className=" relative w-full h-full flex flex-row justify-between items-center">
                    <div className="flex flex-col justify-center gap-6 w-1/3 items-center">
                        {[1, 2, 3, 4].map((i) => (
                            <MatchCard key={i} player1={Players[`player${i * 2 - 1}` as keyof PlayersProps] as PlayerGame | undefined}
                                player2={Players[`player${i * 2}` as keyof PlayersProps] as PlayerGame | undefined}
                                winner={Players[`winner${i}` as keyof PlayersProps] as PlayerGame | undefined}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col gap-12 w-1/3 items-center">
                        {[1, 2].map((i) => (
                            <MatchCard key={i} player1={Players[`winner${i * 2 - 1}` as keyof PlayersProps] as PlayerGame | undefined}
                                player2={Players[`winner${i * 2}` as keyof PlayersProps] as PlayerGame | undefined}
                                winner={Players[`finalWinner${i}` as keyof PlayersProps] as PlayerGame | undefined}
                            />
                        ))}
                    </div>
                    <div className="w-1/3 flex flex-col items-center">
                        <MatchCard player1={Players.finalWinner1} player2={Players.finalWinner2}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PageTournamentCard4Players: React.FC<{ Players: PlayersProps; }> = ({ Players }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="absolute top-10 relative text-6xl font-extrabold font-[Rock] text-[#0349A8] tracking-wide drop-shadow-md">
                Local Tournament
            </h1>
            <div className="relative w-full max-w-8xl flex-grow flex items-center justify-center">
                <div className="relative w-full h-full flex flex-row justify-between items-center">
                    {/* Left side matches */}
                    <div className="flex flex-col gap-y-40 w-1/2 items-center py-10">
                        {[1, 2].map((i) => (
                            <MatchCard key={i} player1={Players[`winner${i * 2 - 1}` as keyof PlayersProps] as PlayerGame | undefined}
                                player2={Players[`winner${i * 2}` as keyof PlayersProps] as PlayerGame | undefined}
                                winner={Players[`finalWinner${i}` as keyof PlayersProps] as PlayerGame | undefined}
                            />
                        ))}
                    </div>

                    {/* Right side final match */}
                    <div className="w-1/2 flex flex-col items-center py-10">
                        <MatchCard player1={Players.finalWinner1} player2={Players.finalWinner2} />
                    </div>
                </div>
            </div>
        </div>
    );
};


export {PageTournamentCard8Players, PageTournamentCard4Players};
