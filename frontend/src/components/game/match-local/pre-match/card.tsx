import Image from "next/image";

interface PlayerCardProps {
    player: string;
    picture: any;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, picture }) => {
    return (
        <div className="flex flex-col items-center w-full bg-[#1a2a44] p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all 
            duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-2">
            
            {player && (
                <>
                <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-blue-600 hover:border-blue-400 transition-colors duration-300">
                    <Image className="object-cover w-full h-full hover:scale-105 transition-transform duration-500 ease-in-out" 
                        alt={`${player}'s profile`}src={picture} width={192} height={192} priority
                    />
                </div>
        
                <h2 className="mt-4 sm:mt-5 md:mt-6 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-mono text-gray-300 tracking-wide">{player}</h2>
                </>
            )}
        </div>
    );
};

export { PlayerCard }