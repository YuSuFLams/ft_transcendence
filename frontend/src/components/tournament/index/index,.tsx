"use client";

import { ButtonGameTournament, ErrorState, handleNumPlayersChange } from "@/components/tournament/index/index-utils";
import { InputPlayersTournament } from "@/components/tournament/index/input-player";
import { handleCreateTournament } from "@/components/api/tournament";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

const PageTournamentLocal = () => {
    const router = useRouter();
    const [errors, setErrors] = useState<ErrorState>({});
    const [numPlayers, setNumPlayers] = useState<number>(4);
    const [nameTournament, setNameTournament] = useState<string>("");
    const [players, setPlayers] = useState<Record<string, string>>(
        Array.from({ length: 4 }, (_, index) => [`player${index + 1}`, ""]).reduce(
            (obj, [key, value]) => {
                obj[key as string] = value as string;
                return obj;
            },
            {} as Record<string, string>
        )
    );

    useEffect(() => {
        const id = Cookie.get("idTournament");
        if (id) router.push(`/game/tournament/competition`);
    }, [router]);

    const handlePlayerChange = (key: string, value: string) => { setPlayers((prev) => ({ ...prev, [key]: value }));};

    return (
        <div className="w-full min-h-screen text-white flex flex-col font-['Inter'] relative overflow-hidden">
            <main className="flex flex-col items-center justify-center flex-grow p-4 sm:p-8 z-10">
                <div className="max-w-7xl w-full space-y-8 p-6 sm:p-8 rounded-lg border border-gray-600/50 relative">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-blue-600 tracking-widest animate-pulse">[TOURNAMENT:LOCAL]</h1>
                    
                    <div className="space-y-8 relative">
                        <InputPlayersTournament errors={errors} nameTournament={nameTournament} setNameTournament={setNameTournament} players={players} numPlayers={numPlayers}
                            handleNumPlayersChange={(e) => handleNumPlayersChange(e, setNumPlayers, setPlayers, setErrors)} handlePlayerChange={handlePlayerChange}
                        />
                        {/* Centered Error Message */}
                        {errors.duplicatePlayer && (
                            <div className=" inset-0 flex items-center justify-center z-10">
                                <div className="text-red-400 text-md sm:text-lg font-mono px-6 py-3 rounded-lg border border-red-500/50 max-w-md text-center"> [ERROR] : {errors.duplicatePlayer} </div>
                            </div>
                        )}
                        <ButtonGameTournament handleCreateTournament={() => handleCreateTournament(nameTournament, players, numPlayers, setErrors, router)} router={router}/>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PageTournamentLocal;