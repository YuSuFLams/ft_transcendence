"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton, PreGameLocal, RulesButton, RulesGameLocal } from "@/app/components/game/game-local/local-game_utils"
import Cookie from 'js-cookie';
import { motion } from "framer-motion";

interface GameLocalPre {
    playerLeft: string; playerRight: string; isClicked:boolean;
    setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
    setPlayerLeft: React.Dispatch<React.SetStateAction<string>>;
    setPlayerRight: React.Dispatch<React.SetStateAction<string>>;
    setGameCreated: React.Dispatch<React.SetStateAction<boolean>>; 
    router: any;
}

const GameLocalPre: React.FC<GameLocalPre> = ({
    playerLeft, playerRight, isClicked, setIsClicked, setPlayerLeft, setPlayerRight, setGameCreated, router
}) => {
    return (
        <div className="w-screen h-screen bg-[#050A30] overflow-hidden text-white flex flex-col font-sans">


            <div className="w-full h-full absolute flex flex-col items-center justify-around">
                <div className="flex items-center justify-center mt-12">
                    <h1 className="text-8xl font-extrabold font-[Font3] tracking-wider text-indigo-600"> Game Local </h1>
                </div>

                <div> <RulesGameLocal isClicked={isClicked} onClose={() => setIsClicked(false)} /> </div>

                <div> <main className="flex flex-col items-center justify-center flex-grow space-y-8">
                    <PreGameLocal playerLeft={playerLeft} playerRight={playerRight} setGameCreated={setGameCreated}
                            setPlayerLeft={setPlayerLeft} setPlayerRight={setPlayerRight} />
                </main> </div>  

                <div> <BackButton router={router} /> </div>  

                <div> <RulesButton setIsClicked={setIsClicked} /> </div>  
            </div>
        </div>
    )
} 

const PageGameLocal = () => {
    const router = useRouter();
    const [playerLeft, setPlayerLeft] = useState<string>("");
    const [playerRight, setPlayerRight] = useState<string>("");
    const [gameCreated, setGameCreated] = useState<boolean>(false);
    const [isClicked, setIsClicked] = useState<boolean>(false);

    useEffect(() => {
        setGameCreated(Cookie.get("gameCreated") === "true");
        if (gameCreated) {
            router.push("/game/match-local");
        }
    }, [gameCreated, router]);

    return (
        <GameLocalPre playerLeft={playerLeft} setIsClicked={setIsClicked} playerRight={playerRight}
            isClicked={isClicked} setGameCreated={setGameCreated} setPlayerLeft={setPlayerLeft}
            setPlayerRight={setPlayerRight} router={router}
        />
    );
};

export default PageGameLocal;
