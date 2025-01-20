import Image from "next/image";
import Cookie from "js-cookie";
import { motion } from "framer-motion";
import { HiRefresh } from 'react-icons/hi';
import { removeData } from "./clickEvent";
import pictureLeft from "@/../public/Image/picture1.jpg";
import pictureRight from "@/../public/Image/picture2.jpg";

const checkInfoMatch = (
    setPlayerLeft: React.Dispatch<React.SetStateAction<string>>,
    setPlayerRight: React.Dispatch<React.SetStateAction<string>>,
    setPositionPlayerPaddleLeft: React.Dispatch<React.SetStateAction<number>>,
    setPositionPlayerPaddleRight: React.Dispatch<React.SetStateAction<number>>,
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
    router: any,
) => {
    const playerleft = Cookie.get("player1");
    if (playerleft) setPlayerLeft(playerleft);
    const playerright = Cookie.get("player2");
    if (playerright) setPlayerRight(playerright);
    const paddleLeft = Cookie.get("left_paddle");
    if (paddleLeft) setPositionPlayerPaddleLeft(parseFloat(paddleLeft));
    const paddleRight = Cookie.get("right_paddle");
    if (paddleRight) setPositionPlayerPaddleRight(parseFloat(paddleRight));
    const game_started = Cookie.get("gameStarted");
    if (game_started) setGameStarted(true);
    const isCreate = Cookie.get("gameCreated");
    if (!isCreate) router.push("/game/game-local");   
}


interface WinnerCardProps {
    playerLeft: string;
    winner: string;
    router: any;
    setIsDone: React.Dispatch<React.SetStateAction<boolean>>;
}


const WinnerCard: React.FC<WinnerCardProps> = ({ playerLeft, winner, router, setIsDone }) => {

    const picture = winner === playerLeft ? pictureLeft : pictureRight;
    const handlePlayAgain = () => {
        removeData();
        setIsDone(true)
        router.push('/game/game-local')
    };

    return (
        <motion.div className="flex border-4 border-[#EDE4C5] flex-col items-center w-[420px] h-[510px] rounded-2xl justify-center 
            bg-gradient-to-br from-gray-900 via-indigo-900 via-blue-900 via-indigo-900 to-gray-900 text-white shadow-lg"
            transition={{ duration: 0.8, ease: 'easeOut' }} animate={{ scale: 1, opacity: 1 }} initial={{ scale: 0.5, opacity: 0 }}
        >
            {/* Avatar Section */}
            <motion.div className="rounded-full bg-gray-900 shadow-lg">
                <Image className="w-[10em] h-[10em] rounded-full border-4 border-[#EDE4C5] shadow-md" alt={`${winner}'s Avatar`}
                    src={picture} width={200} height={200} />
            </motion.div>

            {/* Winner Message */}
            <h1 className="mt-6 font-[ssb] text-3xl text-center text-gray-100">🏆 Congratulations! 🏆</h1>
            <p className="text-2xl mt-2 text-center font-[ssb] text-gray-300">
                🎉 <span className="font-bold text-[#7F00FF]">{winner}</span> is the winner! 🎉
            </p>

            {/* Play Again Button */}
            <motion.button className="px-8 py-4 font-[ssb] text-2xl font-extrabold border-2 border-[#EDE4C5] bg-gradient-to-br flex mt-12 
                from-gray-900 via-indigo-900 to-gray-900 text-white items-center justify-center group rounded-full shadow-lg transform 
                transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 "
                onClick={handlePlayAgain} aria-label="Play Again" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
                {/* Spinning Icon */}
                <HiRefresh size={24} className="mr-2 text-white group-hover:animate-spin transition-all duration-300 animate-spin" />
                Play Again
            </motion.button>

        </motion.div>
    );
};


export { checkInfoMatch, WinnerCard }