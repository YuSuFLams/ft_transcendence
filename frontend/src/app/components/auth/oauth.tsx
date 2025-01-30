"use client";
import { motion } from 'framer-motion';
import { Point } from '@/app/utils/background';
import { FaCheckCircle, FaExclamationTriangle, FaGamepad } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Cookie from 'js-cookie';
import { handleOAuth } from '../api/oauth';


const FirstFunc: React.FC <{}> = ({}) => {
	return (
		<div>
			<motion.div className="text-green-400 flex flex-col items-center text-7xl mb-6" initial={{ scale: 0.8 }}
				transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut', repeatType: 'reverse' }} animate={{ scale: 1.2 }}
			>
				<FaGamepad className="drop-shadow-lg" />
			</motion.div>
		
			<h1 className="text-4xl font-bold font-[Font6] text-yellow-500 mb-5 tracking-wide"> Authenticating... </h1>
		
			<p className="text-2xl font-[TORAJA] text-[#aaabbc] mb-12 mx-auto text-center leading-relaxed">
				Hold tight! We're loading your adventure. Just a moment more...
			</p>
			
			<motion.div className="h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-md" initial={{ width: '0%' }}
				animate={{ width: '100%' }} transition={{ duration: 3, ease: 'easeInOut' }}
			>
				<div className="h-full bg-green-400 rounded-full"></div>
			</motion.div>
		</div>
	)
}

interface SecondFuncProps {
	errorMessage: string;
	router: ReturnType<typeof useRouter>;
}

const SecondFunc: React.FC <SecondFuncProps> = ({ errorMessage, router}) => {
	return (
		<div className='z-[50] flex flex-col justufy-center items-center'>
          
			<motion.div className="text-red-500 flex flex-col items-center text-8xl mb-6" initial={{ scale: 0.8 }}
				animate={{ scale: 1 }} transition={{ duration: 0.5, ease: 'easeInOut' }}
			>
				<FaExclamationTriangle className="drop-shadow-lg" />
			</motion.div>
	
			<h1 className="text-3xl font-bold font-[Font6] text-yellow-500 mb-5 tracking-wide"> Oops, an error occurred! </h1>
			
			<p className="text-2xl font-[TORAJA] text-[#aaabbc] mb-12 mx-auto text-center leading-relaxed"> {errorMessage} </p>

			<motion.button className="w-[50%] max-w-[180px] h-[56px] bg-[#aaabbc] text-[#050A30] text-2xl font-[Font4] rounded-xl 
				shadow flex items-center justify-center px-4 py-2 hover:bg-[#8a8b9c]" onClick={() => router.push('/login-signup')}
				transition={{ type: 'spring', stiffness: 300 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
			>
				Go Back
			</motion.button>

		</div>
	)
}

const ThirsFunc: React.FC <{}> = ({}) => {
	return (
		<div className='z-[50]'>
			<motion.div className="text-green-500 flex flex-col items-center text-5xl mb-6" initial={{ scale: 0.8 }} animate={{ scale: 1 }}
				transition={{ duration: 0.5, ease: 'easeInOut' }}
			>
				<FaCheckCircle className="drop-shadow-lg" />
			</motion.div>

			<h1 className="text-4xl font-bold font-[Font6] text-yellow-500 mb-5 tracking-wide"> Success! </h1>
			<p className="text-2xl font-[TORAJA] text-[#aaabbc] mb-12 mx-auto text-center leading-relaxed"> Redirecting to your dashboard... </p>
		</div>
	)
}

interface OuthPageProps {
	loading: boolean;
	errorMessage: string;
	router: ReturnType<typeof useRouter>;
}

const OuthPage: React.FC<OuthPageProps> = ({ loading, errorMessage, router }) => {
	return (
	  <div className="relative flex justify-center overflow-hidden items-center min-h-screen bg-[#050A30] text-white">
		<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0%,rgba(0,0,0,0.4)_100%)]/2"></div>
			<div className="z-[50] px-8 py-12 relative bg-gray-800 space-y-8 text-center rounded-lg shadow-lg max-w-xl mx-auto w-full">
			{loading ? (
				<FirstFunc />
			) : errorMessage ? (
				<SecondFunc errorMessage={errorMessage} router={router} />
			) : (
				<ThirsFunc />
			)}
			</div>
  
			<Point />
	  	</div>
	);
};


const OAuthPage:React.FC<{ url: string }> = ({url}) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const initializedRef = useRef<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);
	const code = searchParams.get("code");
  
	useEffect(() => {
        const token = Cookie.get("access");
        if (token) router.push("/dashboard");
	}, [router]);
  
	useEffect(() => {
	  if (!initializedRef.current && code) {
		initializedRef.current = true;
		const url42 = url.concat(code);
		console.log(url42);
		handleOAuth(code, setErrorMessage, setLoading, url42);
	  }
	}, [code, url]);
  
	useEffect(() => {
        if (!loading && !errorMessage) {
            const timeout = setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
            return () => clearTimeout(timeout);
        }
	}, [loading, errorMessage, router]);
  
	return <OuthPage loading={loading} errorMessage={errorMessage} router={router} />;
};
  
export default OAuthPage;

