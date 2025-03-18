"use client";


import React from "react";
import Cookie from "js-cookie";
import { motion } from "framer-motion";
import { WinnerCard } from "@/components/game/after-game/winner";
import { useWinnerHandler } from "@/components/game/match-local/during-match/useWinnerHandler";
import { useTournamentData } from "@/components/tournament/playersTournament/useTournamentData";
import { useTournamentLogic } from "@/components/tournament/playersTournament/useTournamentLogic";
import { useSetPlayersMatch } from "@/components/tournament/playersTournament/useSetPlayersMatch";
import {PageTournamentCard8Players, PageTournamentCard4Players} from "@/components/tournament/playersTournament/utilsTournament";

const PageTournamentLocalPlayers = () => {
    const { 
        numberPlayers, setNumberPlayers, tournamentData, players8, setPlayers8, winnerTournament, 
        setWinnerTournament, isDone, setIsDone, numberMatch, setNumberMatch, router, round, setRound
    } = useTournamentLogic();
    
    
    useTournamentData(tournamentData, setNumberPlayers, setPlayers8, setWinnerTournament, setNumberMatch);
    useWinnerHandler(winnerTournament, isDone, setIsDone);
    useSetPlayersMatch(players8, numberPlayers, numberMatch, tournamentData, setRound);
    const PlayesMatches = () => {
        router.push("/game/tournament-local/match-local");
        Cookie.set("idMatch", String(numberMatch));
    };
    return (
        <div className="w-screen z-50 h-screen max-h-screen flex flex-col items-center justify-center text-white font-sans relative">
            {/* Tournament Card */}
            {!winnerTournament ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                        {/* {numberPlayers === 8 ? <TournamentCard8Plalyers Players={players8} /> : <TournamentCard4Plalyers Players={players8} />} */}
                        {numberPlayers === 8 ? <PageTournamentCard8Players Players={players8} />: <PageTournamentCard4Players Players={players8} />}
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={PlayesMatches}
                            className="absolute bottom-10 px-6 py-2 bg-[#5650f0] text-[#1a1a2e] font-bold rounded-md text-xl md:text-2xl 
                            hover:bg-[#1a1a2e] hover:text-[#5650f0] hover:border-[#5650f0] border-2 border-transparent transition-all 
                            duration-300 ease-out uppercase tracking-wider shadow-lg shadow-[#5650f0]/30"
                        >
                            Play Match{" "}{round}
                        </motion.button>
                </div>
                    
            ) : (
                <WinnerCard winner={winnerTournament || ""} router={router} playerLeft={winnerTournament}/>
            )}
        </div>
    );
};

export default PageTournamentLocalPlayers;