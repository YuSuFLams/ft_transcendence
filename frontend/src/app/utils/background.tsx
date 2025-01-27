import { motion } from "framer-motion";
import React from "react";

const Point: React.FC<{}> = ({}) => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <motion.div className="absolute inset-0"
                animate={{ opacity: [0, 0.2, 0.3, 0.4, 0.3, 0.2, 0], x: [0, 20, 0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            >
                <div className="absolute w-[400px] h-[400px] bg-purple-500 opacity-20 blur-[120px] left-[-100px] top-[-100px] animate__fadeIn animate__delay-0.3s"></div>
                <div className="absolute w-[300px] h-[300px] bg-blue-500 opacity-15 blur-[100px] right-[-50px] bottom-[-50px] animate__fadeIn animate__delay-0.4s"></div>
                <div className="absolute w-[300px] h-[300px] bg-blue-500 opacity-15 blur-[100px] right-[1200px] bottom-[800px] animate__fadeIn animate__delay-0.5s"></div>
            </motion.div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0%,rgba(0,0,0,0.4)_100%)]/2"></div>

            {/* Particle Points */}
            <motion.div className="absolute w-2 h-2 bg-blue-400 rounded-full blur-sm animate-particle left-[40%] top-[20%]"
                animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            ></motion.div>

            <motion.div className="absolute w-3 h-3 bg-pink-500 rounded-full blur-md animate-particle right-[25%] bottom-[15%]"
                animate={{ x: [0, -30, 30, 0], y: [0, -30, 30, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            ></motion.div>

            <motion.div className="absolute w-3 h-3 bg-pink-500 rounded-full blur-md animate-particle right-[15%] bottom-[45%]"
                animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0] }}
                transition={{ duration: 5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            ></motion.div>

            <motion.div className="absolute w-4 h-4 bg-teal-400 rounded-full blur-sm animate-particle left-[60%] top-[40%]"
                animate={{ x: [0, -25, 25, 0], y: [0, -25, 25, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
            ></motion.div>

            {/* New Points */}
            <motion.div className="absolute w-2 h-2 bg-yellow-400 rounded-full blur-sm animate-particle left-[30%] top-[60%]"
                animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            ></motion.div>

            <motion.div className="absolute w-3 h-3 bg-orange-400 rounded-full blur-md animate-particle right-[35%] top-[10%]"
                animate={{ x: [0, -40, 40, 0], y: [0, -30, 30, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
            ></motion.div>

            <motion.div className="absolute w-2.5 h-2.5 bg-teal-500 rounded-full blur-sm animate-particle left-[70%] bottom-[30%]"
                animate={{ x: [0, -20, 20, 0], y: [0, -25, 25, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
            ></motion.div>

            <motion.div className="absolute w-3.5 h-3.5 bg-green-400 rounded-full blur-sm animate-particle left-[20%] bottom-[50%]"
                animate={{ x: [0, 25, -25, 0], y: [0, -30, 30, 0] }}
                transition={{ duration: 4.3, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
            ></motion.div>

            <motion.div className="absolute w-4 h-4 bg-pink-300 rounded-full blur-sm animate-particle right-[50%] top-[50%]"
                animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
            ></motion.div>
        </div>
    );
};

export { Point };
