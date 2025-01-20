import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import default_img from "@/../public/Image/default_img.png";
import { PlayersProps } from './page';

interface CardGame {
    username: string;
    picture: any;
}

const CardTournamentPlayers: React.FC<{ Players: CardGame }> = ({ Players }) => {
    return (
        <div className="w-[7rem] flex items-center justify-center relative group">
            <motion.div className="rounded-full overflow-hidden shadow-2xl border-4 border-indigo-500 relative"  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Image src={Players.picture || default_img} alt={Players.username} width={90} height={90} priority className="rounded-full"/>
                {/* This div contains the username */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <h1 className="text-[#f4e8c1] text-white text-lg font-[ssb]">{Players.username}</h1>
                </div>
            </motion.div>
        </div>
    );
};

const LeftSide: React.FC<{ Players: PlayersProps }> = ({ Players }) => {
    return (
        <div className="flex flex-col items-center space-y-16">
            {/* Player 1 vs Player 2 */}
            <div className='w-[10rem] flex flex-col items-center space-y-8'>
                <div className='flex justify-center items-center'>
                    <CardTournamentPlayers Players={{ username: Players.player1?.username || "", picture: Players.player1?.picture }} />
                    <div className= "xs:hidden sm:hidden block h-1 font-[ssb] w-12 bg-gray-300"></div>
                </div>
                
                <div className='flex justify-center items-center'>
                    <CardTournamentPlayers Players={{ username: Players.player2?.username || "", picture: Players.player2?.picture }} />
                    <div className= "xs:hidden sm:hidden block h-1 font-[ssb] w-12 bg-gray-300"></div>    
                </div>
            </div>

            {/* Player 5 vs Player 6 */}
            <div className='flex flex-col items-center space-y-8'>
                <div className='flex justify-center items-center'>
                    <CardTournamentPlayers Players={{ username: Players.player3?.username || "", picture: Players.player3?.picture }} />
                    <div className= "xs:hidden sm:hidden block h-1 font-[ssb] w-12 bg-gray-300"></div>
                </div>
                <div className='flex justify-center items-center'>
                    <CardTournamentPlayers Players={{ username: Players.player4?.username || "", picture: Players.player4?.picture }} />
                    <div className= "xs:hidden sm:hidden block h-1 font-[ssb] w-12 bg-gray-300"></div>    
                </div>
            </div>
        </div>
    );
};

const RightSide: React.FC<{ Players: PlayersProps }> = ({ Players }) => {
    return (
        <div className="flex flex-col items-center space-y-16">
            {/* Player 3 vs Player 4 */}
            <div className='flex flex-col items-center space-y-8'>
                <div className='flex justify-center items-center'>
                    <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
                    <CardTournamentPlayers Players={{ username: Players.player5?.username || "", picture: Players.player5?.picture }} />
                </div>
                <div className='flex justify-center items-center'>
                    <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
                    <CardTournamentPlayers Players={{ username: Players.player6?.username || "", picture: Players.player6?.picture }} />
                </div>
            </div>

            {/* Player 7 vs Player 8 */}
            <div className='flex flex-col items-center space-y-8'>
                <div className='flex justify-center items-center'>
                    <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
                    <CardTournamentPlayers Players={{ username: Players.player7?.username || "", picture: Players.player7?.picture }} />
                </div>
                <div className='flex justify-center items-center'>
                    <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
                    <CardTournamentPlayers Players={{ username: Players.player8?.username || "", picture: Players.player8?.picture }} />
                </div>
            </div>
        </div>
    );
}

const SimeFinaleLeft: React.FC<{ Players: PlayersProps }> = ({ Players }) => {
    return (
        <div className='flex flex-col h-full  items-center justify-around '>
            <div className='flex justify-center items-center'>
                <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
                <CardTournamentPlayers Players={{ username: Players.winner1?.username || "", picture: Players.winner1?.picture }} />
                <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
            </div>
            <div className='flex justify-center items-center'>
                <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
                <CardTournamentPlayers Players={{ username: Players.winner2?.username || "", picture: Players.winner2?.picture }} />
                <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
            </div>
        </div>
    )
}

const SemiFinaleRight: React.FC<{ Players: PlayersProps }> = ({ Players }) => {
    return (
        <div className='flex flex-col h-full  items-center justify-around'>
            <div className='flex justify-center items-center'>
                <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
                <CardTournamentPlayers Players={{ username: Players.winner3?.username || "", picture: Players.winner3?.picture }} />
                <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
            </div>
                
            <div className='flex justify-center items-center'>
                <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
                <CardTournamentPlayers Players={{ username: Players.winner4?.username || "", picture: Players.winner4?.picture }} />
                <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
            </div>
        </div>
    )
}

const FinalMatch: React.FC<{ Players: PlayersProps }> = ({ Players }) => {
    return (
        <div className="flex items-center  justify-center space-x-8 relative">
            <div className='flex justify-center items-center'>
                <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
                <CardTournamentPlayers Players={{ username: Players.finalWinner1?.username || "", picture: Players.finalWinner1?.picture }} />
            </div>
            <div className='flex justify-center items-center font-[ssb] text-7xl'> - </div>
            <div className='flex justify-center items-center'>
                <CardTournamentPlayers Players={{ username: Players.finalWinner2?.username || "", picture: Players.finalWinner2?.picture }} />
                <div className="h-1 font-[ssb]  xs:hidden sm:hidden block w-12 bg-gray-300"></div>    
            </div>
        </div>
    )
}


export { CardTournamentPlayers, LeftSide, RightSide, SimeFinaleLeft, SemiFinaleRight, FinalMatch };