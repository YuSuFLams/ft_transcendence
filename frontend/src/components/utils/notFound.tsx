"use client";

import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import { FaHome } from 'react-icons/fa';
import { LuAngry } from 'react-icons/lu';
import { motion } from "framer-motion";

interface NotFounProps {
    router: ReturnType<typeof useRouter>;
    handleReturn: () => void;
}

const NotFoun: React.FC<NotFounProps> = ({ router, handleReturn }) => {
    return (
        <div className="flex flex-col items-center justify-center z-10 space-y-4 sm:space-y-6 text-center p-4 sm:p-6">

            {/* Animated Angry Icon */}
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                <motion.div className="text-6xl sm:text-8xl text-[#4299E1] mb-4 sm:mb-6"> <LuAngry /> </motion.div>
            </motion.div>

            {/* 404 Heading */}
            <motion.h1 initial={{ opacity: 0, y: -20 }} className="z-132 text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-transparent 
                bg-clip-text bg-[#4299E1]" animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
            >
                404 - Page Not Found
            </motion.h1>

            {/* Description */}
            <motion.p className="text-base sm:text-lg text-[#c0c0c0] mb-6 sm:mb-8 max-w-md sm:max-w-lg mx-auto" initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
            >
                We can’t seem to find the page you are looking for!
            </motion.p>

            {/* Return Button */}
            <motion.div className="mb-6 sm:mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}>
                <motion.button className="mt-4 py-3 sm:py-4 px-4 sm:px-6 rounded-[0.3em] text-sm sm:text-md bg-[#1d2939] shadow-xl relative
                    tracking-wide text-[#d6d7d8] font-semibold border-2 border-transparent overflow-hidden" onClick={handleReturn} 
                    whileHover={{ scale: 1.02, backgroundColor: "#3182CE", color: "#ffffff" }} whileTap={{ scale: 0.95 }}
                >
                    <span className="relative z-10"> {Cookie.get("access") ? "Back to Dashboard" : "Go to Login/Signup"} </span>
                </motion.button>
            </motion.div>

            {/* Home Icon */}
            <motion.div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
            >
                <FaHome className="text-3xl sm:text-4xl text-[#4299E1] opacity-80 hover:text-[#3182CE] cursor-pointer transition-colors 
                    duration-300 ease-in-out" style={{ width: 50, height: 50 }} onClick={() => router.push("/")}
                />
            </motion.div>
        </div>
    );
};

const NotFound = () => {
    const router = useRouter();

    const handleReturn = () => {
        const token = Cookie.get("access");
        if (token) {
            router.push("/dashboard");
        } else {
            router.push("/login-signup");
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-[#101828]">
            <NotFoun router={router} handleReturn={handleReturn} />
        </div>
    );
};

export default NotFound;