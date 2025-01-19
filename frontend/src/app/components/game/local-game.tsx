"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton, PreGameLocal, RulesButton, RulesGameLocal } from "@/app/components/game/local-game_utils"
import Cookie from 'js-cookie';

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
        <div className="w-screen h-screen bg-[#050A30]  text-white flex flex-col font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0.8)_100%)]/2"></div>

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

            <div className="absolute w-[300px] h-[300px] bg-purple-400 rounded-full opacity-30 blur-3xl animate-move-up left-10 top-10"></div>
            <div className="absolute w-[200px] h-[200px] bg-blue-500 rounded-full opacity-30 blur-3xl animate-move-down right-20 bottom-20"></div>
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

export {PageGameLocal};
