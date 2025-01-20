"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ButtonGameTournament, InputPlayersTournament } from "./utilsTournament";
import axios from "axios";
import Cookie from "js-cookie";

export interface ErrorState {
    nameTournament?: string;
    players?: Record<string, string>;
    duplicatePlayer?: string;
}

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

const handleCreateTournament = async (
    nameTournament: string, players: Record<string, string>, numPlayers: number,
    setErrors: React.Dispatch<React.SetStateAction<ErrorState>>, router: ReturnType<typeof useRouter>
) => {
    if (validateInput(nameTournament, players, setErrors)) {
        const token = Cookie.get("access");
        if (!token) {
        console.error("No token found");
        return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/tournament/local-tournament/",
                {
                    numberPlayers: numPlayers,
                    nameTournament,
                    playerNames: players,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data) {
                console.log("Tournament created:", response.data);
                Cookie.set("idTournament", response.data.tournament_id);
                router.push(`/game/tournament-local/${response.data.tournament_id}`);
            }
        } catch (error) {
            console.error("Error creating the tournament:", error);
        }
    }
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
        if (id) router.push(`/game/tournament-local/${id}`);
    }, [router]);

    const handlePlayerChange = (key: string, value: string) => {
        setPlayers((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-[#0A2C57] via-[#1A3B6B] to-gray-600 text-white flex flex-col font-sans relative">
            <main className="flex min-h-screen flex-col font-[ssb] items-center justify-center flex-grow px-4 py-8 z-10 relative">
                <div className="w-full max-w-4xl bg-[#1A2B47] p-8 rounded-xl shadow-lg">
                    <div className="flex items-center justify-center mb-6">
                        <h1 className="text-3xl md:text-6xl font-extrabold text-indigo-600"> Game Tournament Local </h1>
                    </div>

                    <div className="space-y-6">
                        <InputPlayersTournament errors={errors} nameTournament={nameTournament} setNameTournament={setNameTournament}
                            handleNumPlayersChange={(e) => handleNumPlayersChange(e, setNumPlayers, setPlayers, setErrors)}
                            handlePlayerChange={handlePlayerChange} players={players} numPlayers={numPlayers}
                        />

                        {errors.duplicatePlayer && (<p className="mt-2 text-xl text-red-500">{errors.duplicatePlayer}</p>)}

                        <ButtonGameTournament handleCreateTournament={() => handleCreateTournament(nameTournament, players,
                            numPlayers, setErrors, router)} router={router}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PageTournamentLocal;
