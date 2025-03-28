import { AnimatePresence, motion } from "framer-motion";
import { HiQuestionMarkCircle, HiX } from "react-icons/hi";

const RulesButton: React.FC<{ setIsClicked: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsClicked }) => {
    return (
        <motion.button className={`relative p-4 bg-black/90 border-2 neon-blue-dark rounded-xl cursor-pointer group overflow-hidden transition-transform duration-300 
            hover:scale-105 text-white font-['Orbitron'] tracking-wider`} onClick={() => setIsClicked(true)} whileHover={{ boxShadow: "0 0 10px #1E90FF" }}
        >
            {/* Neon Border Effect */}
            <div className="absolute inset-0 neon-blue-dark-glow opacity-50 group-hover:opacity-100 transition-opacity" />
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-center gap-3">
                <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }} className="text-blue-400 group-hover:animate-pulse">
                    <HiQuestionMarkCircle size={32} />
                </motion.div>
                <span className="text-xl font-[Font7] text-blue-400 hidden md:block">Rules</span>
            </div>
            
            {/* Scanline Effect */}
            <div className="absolute top-0 left-0 w-full h-full scanline opacity-20" />
        </motion.button>
    );
};

const RulesGameLocal: React.FC<{ isClicked: boolean; setIsClicked: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isClicked, setIsClicked }) => {
    const rules = [
        "Two players compete against each other.",
        "Score points if opponent fails to return properly.",
        "First to 5 points wins the match.",
        'Player 1: "A" to move Left, "D" to move Right.',
        'Player 2: Use "Left" and "Right" arrows.'
    ];

    return (
        <AnimatePresence>
            {isClicked && (
                <motion.div className="fixed inset-0 bg-opacity-70 backdrop-blur-lg flex items-center justify-center z-50 overflow-auto"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && setIsClicked(false)}
                >
                    {/* Grid Background */}
                    <div className="fixed inset-0 opacity-10 pointer-events-none"> <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px]" /></div>

                    {/* Modal Content */}
                    <motion.div className="relative p-8 bg-black/90 border-2 neon-blue rounded-xl max-w-3xl w-full text-white font-['Orbitron'] overflow-hidden"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }} onClick={(e) => e.stopPropagation()}
                    >
                        {/* Neon Border Effect */}
                        <div className="absolute inset-0 neon-blue-glow opacity-50 transition-opacity" />
                        
                        {/* Close Button */}
                        <motion.button className="absolute top-8 right-8 p-2 bg-black/90 border-2 neon-blue-light rounded-full text-blue-300 hover:scale-105 transition-transform z-50"
                            onClick={() => setIsClicked(false)} whileHover={{ boxShadow: "0 0 10px #4169E1" }}
                        >
                            <HiX size={24} /> <div className="absolute inset-0 neon-blue-light-glow opacity-50 group-hover:opacity-100 transition-opacity" />
                        </motion.button>

                        {/* Title */}
                        <h1 className="text-4xl font-[Font7] font-bold text-center mb-8 tracking-wider relative z-10"> <span className="text-blue-500">Game</span> <span className="text-white">Rules</span></h1>

                        {/* Rules List */}
                        <ul className="space-y-6 relative z-10">
                            {rules.map((rule, index) => (
                                <motion.li className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-lg border-2 neon-blue-dark hover:scale-[0.98] transition-transform duration-300"
                                    key={index} whileHover={{ boxShadow: "0 0 10px #1E90FF" }}
                                >
                                    <span className="w-10 h-10 flex items-center justify-center bg-blue-400/20 rounded-full text-blue-400 font-bold border-2 neon-blue-dark"> {index + 1}</span>
                                    <p className="text-gray-200 text-lg tracking-wide">{rule}</p>
                                </motion.li>
                            ))}
                        </ul>

                        {/* Scanline Effect */}
                        <div className="absolute top-0 left-0 w-full h-full scanline opacity-20" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { RulesButton, RulesGameLocal };