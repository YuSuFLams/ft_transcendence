"use client";

import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import { FaHome, FaRegSadTear } from 'react-icons/fa';

import { motion } from "framer-motion";
import { Point } from '@/app/utils/background';

interface NotFounProps {
	router:any; 
	handleReturn: () => void
}

const NotFoun:React.FC<NotFounProps> = ({router, handleReturn}) => {
	return (
		<div className="flex flex-col items-center justify-center z-10 space-y-6 text-center">
        
			<motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} >
				<motion.div className="text-6xl text-yellow-400 mb-6" animate={{ y: [0, -20, 0], color: ["#FFDC00", "#FFD700", "#FF6F00"],}}
					transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut",}}>
				<FaRegSadTear />
				</motion.div>
			</motion.div>


			<motion.h1 className="text-4xl font-[Font6] font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F00] 
				to-[#FF6F00]" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
				404 - Page Not Found
			</motion.h1>

			<motion.p className="text-lg font-[Font1] text-[#aaabbc]/2 mb-8 max-w-lg mx-auto" initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
			>
				Oops! The page you are looking for doesn't exist. Let's get you back on track.
			</motion.p>

			<motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}>
				<motion.button className="mt-4 py-4 px-8 rounded-xl text-2xl bg-[#F5EFE7] shadow-xl tracking-wide text-[#213555] font-bold 
					font-[Font2] border-2 border-transparent relative overflow-hidden" onClick={handleReturn} whileTap={{ scale: 0.95 }} 
					whileHover={{ scale: 1.05, backgroundColor: "#F3F3E0", color: "#2A3663", }} transition={{ scale: { duration: 0.3, ease: "easeInOut" },
					backgroundColor: { duration: 0.3, ease: "easeInOut" }, color: { duration: 0.3, ease: "easeInOut" },
					borderColor: { duration: 0.3, ease: "easeInOut" },}}
				>
					<span className="relative z-10"> {Cookie.get("access") ? "Back to Dashboard" : "Go to Login/Signup"} </span>
					<span className="absolute top-0 left-0 w-full h-full bg-[#FF9F00] opacity-30 transform scale-0 group-hover:scale-100 
						transition-all duration-300"></span>
				</motion.button>
			</motion.div>


			<motion.div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center" initial={{ opacity: 0 }} 
				animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
			>
				<FaHome className="text-3xl text-[#FBF5DD] opacity-80 hover:text-gray-200 cursor-pointer transition-colors duration-300 
					ease-in-out" style={{ width: 60, height: 60 }} onClick={() => router.push("/")}
				/>
			</motion.div>

			<div className="absolute top-4 left-0 right-0 text-center mt-4 text-xs text-gray-300">
				<p className="text-lg font-[Font2] font-semibold text-transparent text-[#DBD3D3] shadow-lg mb-4">
					Error 404: This page is lost in the void!
				</p>
			</div>

		</div>
	)
}

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
		<div className="relative w-screen h-screen bg-[#050A30] overflow-hidden flex items-center justify-center">
			<NotFoun router={router} handleReturn={handleReturn} />
			<Point />
		</div>
	);
};

export default NotFound;
