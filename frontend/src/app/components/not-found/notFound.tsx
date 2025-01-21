"use client";

import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import { FaHome, FaRegSadTear } from 'react-icons/fa';

import { motion } from "framer-motion";

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
		{/* Subtle Background Effects with Floating Animations */}
			<motion.div className="absolute inset-0" animate={{ opacity: [0, 0.2, 0.3, 0.4, 0.3, 0.2, 0], x: [0, 20, 0, -20, 0] }}
				transition={{ duration: 10, repeat: Infinity, repeatDelay: 2, ease: "easeInOut", }}
			>
				<div className="absolute w-[400px] h-[400px] bg-purple-500 opacity-20 blur-[120px] left-[-100px] top-[-100px] animate__fadeIn animate__delay-0.3s"></div>
				<div className="absolute w-[300px] h-[300px] bg-blue-500 opacity-15 blur-[100px] right-[-50px] bottom-[-50px] animate__fadeIn animate__delay-0.4s"></div>
				<div className="absolute w-[300px] h-[300px] bg-blue-500 opacity-15 blur-[100px] right-[1200px] bottom-[800px] animate__fadeIn animate__delay-0.5s"></div>
			</motion.div>

			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0%,rgba(0,0,0,0.4)_100%)]/2"></div>


			<div>
				<NotFoun router={router} handleReturn={handleReturn} />
			</div>

			<motion.div className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-50 blur-sm animate-particle left-[30%] top-[20%]"
				animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0],}} transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, ease: "easeInOut",}}
				></motion.div>

			<motion.div className="absolute w-3 h-3 bg-pink-500 rounded-full opacity-60 blur-md animate-particle right-[25%] bottom-[15%]"
				animate={{ x: [0, -30, 30, 0], y: [0, -30, 30, 0],}} transition={{ duration: 4, repeat: Infinity, repeatDelay: 1, ease: "easeInOut",}}
			></motion.div>

			<motion.div className="absolute w-3 h-3 bg-pink-500 rounded-full opacity-60 blur-md animate-particle right-[15%] bottom-[45%]"
				animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0], }} transition={{ duration: 5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut",}}
			></motion.div>
		</div>
	);
};

export default NotFound;
