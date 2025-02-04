"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookie from "js-cookie";
import { getTournamentLocalByID, TournamentCard4Plalyers, TournamentCard8Plalyers } from "./cardTournament";
import picture1 from "@/../public/Image/picture1.jpg";
import picture2 from "@/../public/Image/picture2.jpg";
import picture3 from "@/../public/Image/picture3.jpg";
import picture4 from "@/../public/Image/picture4.jpg";
import picture5 from "@/../public/Image/picture5.jpg";
import picture6 from "@/../public/Image/picture6.jpg";
import picture7 from "@/../public/Image/picture7.jpg";
import picture8 from "@/../public/Image/picture8.jpg";
import default_img from "@/../public/Image/default_img.png";
import { motion } from "framer-motion";
import Image from "next/image";
import { HiRefresh } from "react-icons/hi";
import { user } from "@nextui-org/react";
import { Point } from "@/app/utils/background";

interface PlayerGame {
  username: string;
  picture: any;
}

export interface PlayersProps {
  player1?: PlayerGame;
  player2?: PlayerGame;
  player3?: PlayerGame;
  player4?: PlayerGame;
  player5?: PlayerGame;
  player6?: PlayerGame;
  player7?: PlayerGame;
  player8?: PlayerGame;
  winner1?: PlayerGame;
  winner2?: PlayerGame;
  winner3?: PlayerGame;
  winner4?: PlayerGame;
  finalWinner1?: PlayerGame;
  finalWinner2?: PlayerGame;
}


const PageTournamentLocal = () => {
    const router = useRouter();
    const [idTournament, setIdTournament] = useState<number | null>(null);
    const [tournamentData, setTournamentData] = useState<any | null>(null);
  
    const [nameTournament, setNameTournament] = useState<string | null>(null);
    const [players8, setPlayers8] = useState<PlayersProps>({} as PlayersProps);


    const [numberPlayers, setNumberPlayers] = useState<number>(4);

    const [winnerTournament, setWinnerTournament] = useState<string | null>(null);
    
    useEffect(() => {
        const id = Cookie.get("idTournament");
        if (id) {
            const parsedId = parseInt(id, 10);
            if (!isNaN(parsedId)) {
                setIdTournament(parsedId);
                getTournamentLocalByID(id).then((data) => {
                if (data) {
                    setTournamentData(data);
                    console.log("Tournament Data:", JSON.stringify(data, null, 2));
                }
                });
            } else {
                console.error("Invalid tournament ID in cookie");
            }
        } else {
            console.error("No tournament ID found in cookies");
            router.push("/game/tournament-local");
        }
    }, []);

    useEffect(() => {
        if (tournamentData) {
            // Set tournament name
            if (tournamentData.nameTournament) {
                setNameTournament(tournamentData.nameTournament);
            }
    
            if (tournamentData.winner_team) {
                setWinnerTournament(tournamentData.winner_team);
            }
            if (tournamentData.number_players) {
                setNumberPlayers(tournamentData.number_players);
            }

            // Set players and match data
            if (tournamentData.players && tournamentData.number_players === 8 && tournamentData.matches) {
                const players8 = {
                    player1: {
                        username: tournamentData.matches['1']?.player1 || "Unknown",
                        picture: picture1,
                    },
                    player2: {
                        username: tournamentData.matches['1']?.player2 || "Unknown",
                        picture: picture2,
                    },
                    player3: {
                        username: tournamentData.matches['2']?.player1 || "Unknown",
                        picture: picture3,
                    },
                    player4: {
                        username: tournamentData.matches['2']?.player2 || "Unknown",
                        picture: picture4,
                    },
                    player5: {
                        username: tournamentData.matches['3']?.player1 || "Unknown",
                        picture: picture5,
                    },
                    player6: {
                        username: tournamentData.matches['3']?.player2 || "Unknown",
                        picture: picture6,
                    },
                    player7: {
                        username: tournamentData.matches['4']?.player1 || "Unknown",
                        picture: picture7,
                    },
                    player8: {
                        username: tournamentData.matches['4']?.player2 || "Unknown",
                        picture: picture8,
                    },
                    winner1: {
                        username: tournamentData.matches['5']?.player1 || "Unknown",
                        picture: tournamentData.matches['5'] !== undefined ? (tournamentData.matches['1'].player1 === tournamentData.matches['1'].player1 ? picture1 : picture2) : default_img,
                    },
                    winner2: {
                        username: tournamentData.matches['5']?.player2 || "Unknown",
                        picture: tournamentData.matches['5'] !== undefined ? (tournamentData.matches['5'].player1 === tournamentData.matches['2'].player1 ? picture3 : picture4) : default_img,
                    },
                    winner3: {
                        username: tournamentData.matches['6']?.player1 || "Unknown",
                        picture:  tournamentData.matches['6'] ? (tournamentData.matches['6'].player1 === tournamentData.matches['3'].player1 ? picture5 : picture6) : default_img,
                    },
                    winner4: {
                        username: tournamentData.matches['6']?.player2 || "Unknown",
                        picture: tournamentData.matches['6'] ? (tournamentData.matches['6'].player1 === tournamentData.matches['4'].player1 ? picture7 : picture8) : default_img,
                    },
                    finalWinner1: {
                        username: tournamentData.matches['7']?.player1 || "Unknown",
                        picture: tournamentData.matches['7'] ? (
                            tournamentData.matches['7'].player1 === tournamentData.matches['5'].player1 ? (
                                tournamentData.matches['5'].player1 === tournamentData.matches['1'].player1 ? picture1 : picture2
                            ):(
                                tournamentData.matches['5'].player1 === tournamentData.matches['2'].player1 ? picture3 : picture4
                            )
                        ) : default_img,
                    },
                    finalWinner2: {
                        username: tournamentData.matches['7']?.player2 || "Unknown",
                        picture: tournamentData.matches['7'] ? (
                            tournamentData.matches['7'].player2 === tournamentData.matches['6'].player1 ? (
                                tournamentData.matches['6'].player1 === tournamentData.matches['3'].player1 ? picture5 : picture6
                            ):(
                                tournamentData.matches['6'].player1 === tournamentData.matches['4'].player1 ? picture7 : picture8
                            )
                        ) : default_img,
                    },
                };
                setPlayers8(players8);
            }
            if (tournamentData.players && tournamentData.number_players === 4 && tournamentData.matches) {
                console.log("matches")
                const players4 = {
                    winner1: {
                        username: tournamentData.matches['1']?.player1 || "Unknown",
                        picture: picture1,
                    },
                    winner2: {
                        username: tournamentData.matches['1']?.player2 || "Unknown",
                        picture: picture2,
                    },
                    winner3: {
                        username: tournamentData.matches['2']?.player1 || "Unknown",
                        picture: picture3,
                    },
                    winner4: {
                        username: tournamentData.matches['2']?.player2 || "Unknown",
                        picture: picture4,
                    },
                    finalWinner1: {
                        username: tournamentData.matches['3']?.player1 || "Unknown",
                        picture: tournamentData.matches['3'] ? (
                            tournamentData.matches['3'].player1 === tournamentData.matches['1'].player1 ? picture1 : picture2
                        ) : default_img,
                    },
                    finalWinner2: {
                        username: tournamentData.matches['3']?.player2 || "Unknown",
                        picture: tournamentData.matches['3'] ? (
                            tournamentData.matches['3'].player2 === tournamentData.matches['2'].player1 ? picture3 : picture4
                        ) : default_img,
                    },
                };
                setPlayers8(players4);
            }
        }
    }, [tournamentData]);

    useEffect(() => {
        if (players8){
            console.log("===> Players:", players8);
        }
    }, [players8]);
    const [isDone, setIsDone] = useState<boolean>(false);

    useEffect(() => {

        let elapsedTime = 0;
        const intervalId = setInterval(() => {
            if (winnerTournament && !isDone) {
                elapsedTime += 1000;
                if (elapsedTime >= 10000) {
                    setIsDone(true);
                    clearInterval(intervalId);
                    router.push("/game");
                    Cookie.remove("idTournament")
                    Cookie.remove("idMatch")
                }
            } else if (isDone) {
                clearInterval(intervalId);
            }
        
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [winnerTournament, isDone]);

    
    const [numberMatch, setNumberMatch] = useState<number>(0);

    useEffect(() => {
        if (tournamentData) {
            const len = Object.keys(tournamentData.matches).length;
    
            for (let i = 0; i < len; i++) { // Corrected loop condition
                if (tournamentData.matches[String(i + 1)]["winner"] === null) {
                    setNumberMatch(i + 1);
                    break;
                }
            }
        }
    }, [tournamentData]);
    
    
    const PlayesMatches = () => {
        Cookie.set("idMatch", String(numberMatch));
        router.push("/game/tournament-local/match-local");
    }

    return (
        <div className="w-screen z-50 bg-[#050A30] h-screen max-h-screen items-center justify-center text-white flex flex-col font-sans relative">
            
            {/* Title */}
    
            {
                !winnerTournament ? (
                    <div className="w-screen z-[50] h-screen max-h-screen items-center justify-center text-white flex flex-col font-sans relative">
                        <div className="flex items-center justify-center mt-12">
                            <h1 className="text-6xl font-extrabold font-[Borias] tracking-wider text-indigo-600">Tournament Local</h1>
                        </div>
                        <div className="flex flex-col w-full items-center justify-center flex-grow">
                            {
                                numberPlayers === 8 ? 
                                <TournamentCard8Plalyers Players={players8} /> :
                                <TournamentCard4Plalyers Players={players8} />
                            }
                        </div>
                        
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                            <motion.button className="text-white bg-[#8C1F28] font-[ssb] text-2xl px-6 py-4 rounded-lg"
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => PlayesMatches()}
                            >
                                Play Match {numberMatch}
                            </motion.button>
                        </div>
                    </div>
                ) : (
                    <motion.div className="flex z-50 border-4 border-[#EDE4C5] flex-col items-center w-[420px] h-[510px] rounded-2xl justify-center 
                        bg-gradient-to-br from-gray-900 via-indigo-900 via-blue-900 via-indigo-900 to-gray-900 text-white shadow-lg"
                        transition={{ duration: 0.8, ease: 'easeOut' }} animate={{ scale: 1, opacity: 1 }} initial={{ scale: 0.5, opacity: 0 }}
                    >
                        <motion.div className="rounded-full bg-gray-900 shadow-lg">
                            <Image className="w-[10em] h-[10em] rounded-full border-4 border-[#EDE4C5] shadow-md" alt={`${winnerTournament}'s Avatar`}
                                src={default_img} width={200} height={200} />
                        </motion.div>
            
                        {/* Winner Message */}
                        <h1 className="mt-6 font-[ssb] text-3xl text-center text-gray-100">🏆 Congratulations! 🏆</h1>
                        <p className="text-2xl mt-2 text-center font-[ssb] text-gray-300">
                            🎉 <span className="font-bold text-[#7F00FF]">{winnerTournament}</span> is the winner! 🎉
                        </p>
                        {/* Play Again Button */}
                        <motion.button className="px-8 py-4 font-[ssb] text-2xl font-extrabold border-2 border-[#EDE4C5] bg-gradient-to-br flex mt-12 
                            from-gray-900 via-indigo-900 to-gray-900 text-white items-center justify-center group rounded-full shadow-lg transform 
                            transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 "
                            onClick={() => {router.push("/game")
                                Cookie.remove("idTournament")
                                Cookie.remove("idMatch")
                            }} aria-label="Play Again" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        >
                            {/* Spinning Icon */}
                            <HiRefresh size={24} className="mr-2 text-white group-hover:animate-spin transition-all duration-300 animate-spin" />
                            Play Again
                        </motion.button>
                    </motion.div>
                )
            }
            <Point />
        </div>
    );
    
  
};

export default PageTournamentLocal;