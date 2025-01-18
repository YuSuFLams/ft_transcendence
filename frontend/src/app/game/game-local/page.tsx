"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton, PreGameLocal, RulesButton, RulesGameLocal } from "./utilsGame";

const PageGameLocal = () => {
    const router = useRouter();
    const [playerLeft, setPlayerLeft] = useState<string>("");
    const [playerRight, setPlayerRight] = useState<string>("");
    const [gameCreated, setGameCreated] = useState<boolean>(false);
    const [isClicked, setIsClicked] = useState<boolean>(false);

    useEffect(() => {
        // Redirect to the "my/match-local" page if the game is created
        if (gameCreated) {
            router.push("/my/match-local");
        }
    }, [gameCreated, router]); // Include 'router' in dependency array to prevent potential issues

    return (
        <div className="w-screen h-screen bg-[#050A30] to-gray-600 text-white flex flex-col font-sans">
            {/* Subtle Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0.8)_70%)]"></div>

            <div className="w-full h-full absolute flex flex-col items-center justify-around">
                <div className="flex items-center justify-center mt-12">
                    <h1 className="text-8xl font-extrabold font-[Font3] tracking-wider text-indigo-600">
                        Game Local
                    </h1>
                </div>

                {/* Rules Modal */}
                <div>
                    <RulesGameLocal isClicked={isClicked} onClose={() => setIsClicked(false)} />
                </div>

                {/* Game Local Content */}
                <div>
                    <main className="flex flex-col items-center justify-center flex-grow space-y-8">
                        <PreGameLocal playerLeft={playerLeft} playerRight={playerRight} setGameCreated={setGameCreated}
                            setPlayerLeft={setPlayerLeft} setPlayerRight={setPlayerRight} />
                    </main>
                </div>  

                {/* Go Back Button */}
                <div>
                    <BackButton router={router} />
                </div>  

                {/* Rules Button */}
                <div>
                    <RulesButton setIsClicked={setIsClicked} />
                </div>  
            </div>

            {/* Decorative Animated Circles */}
            <div className="absolute w-[300px] h-[300px] bg-purple-400 rounded-full opacity-30 blur-3xl animate-move-up left-10 top-10"></div>
            <div className="absolute w-[200px] h-[200px] bg-blue-500 rounded-full opacity-30 blur-3xl animate-move-down right-20 bottom-20"></div>
        </div>
    );
};

export default PageGameLocal;
