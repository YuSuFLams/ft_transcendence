"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Cookie from 'js-cookie';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaCheckCircle, FaExclamationTriangle, FaGamepad } from 'react-icons/fa';

const handleOAuth = async (
    code: string | null,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (code) {
      const url = `http://localhost:8000/api/users/42/callback/?code=${code}`;
  
      try {
		const response = await axios.get(url, {
			headers: {
				'Content-Type': 'application/json',
			},
			});
  
        if (response.status === 200) {
			const result = response.data;
			Cookie.set('access', result.access_token);
			Cookie.set('refresh', result.refresh_token);
			setLoading(false)
        } else {
          	setErrorMessage(response.data.message || 'Authentication failed. Please try again.');
        	}
      	} catch (error) {
        	setErrorMessage('An error occurred. Please check your internet connection and try again.');
      	} finally {
        	setLoading(false);
    	}
	}
};



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
	router: any;
}

const SecondFunc: React.FC <SecondFuncProps> = ({
	errorMessage, router
}) => {
	return (
		<div className='flex flex-col justufy-center items-center'>
          
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
		<div>
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



const OAuthPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const code = searchParams.get('code');
	const initializedRef = useRef<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);
  
	useEffect(() => {
		const token = Cookie.get("access");
		if (token) router.push("/dashboard")
	}, []);

	useEffect(() => {
		if (!initializedRef.current) {
			initializedRef.current = true;
			handleOAuth(code, setErrorMessage, setLoading);
		}
	}, [code, router]);

	useEffect(()=> {
		if (!loading && !errorMessage) {
			setTimeout(() => {
				router.push('/game');
			}, 2000);
		}
	},[loading, errorMessage, router]);

  	return (
		<div className="relative flex justify-center overflow-hidden items-center min-h-screen bg-[#050A30] text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0%,rgba(0,0,0,0.4)_100%)]/2"></div>

			<div className="px-8 py-12 relative bg-gray-800 space-y-8 text-center rounded-lg shadow-lg max-w-xl mx-auto w-full">
				{loading ? (
					<FirstFunc />
				) : errorMessage ? (
					<SecondFunc errorMessage={errorMessage} router={router} />
				) : (
					<ThirsFunc />
				)}
			</div>

			<motion.div className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-50 blur-sm animate-particle left-[30%] top-[20%]"
				animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
			></motion.div>

			<motion.div className="absolute w-3 h-3 bg-pink-500 rounded-full opacity-60 blur-md animate-particle right-[25%] bottom-[15%]"
				animate={{ x: [0, -30, 30, 0], y: [0, -30, 30, 0] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
			></motion.div>

			<motion.div className="absolute w-3 h-3 bg-pink-500 rounded-full opacity-60 blur-md animate-particle right-[15%] bottom-[45%]"
				animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0] }} transition={{ duration: 5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
			></motion.div>
		</div>
	);
};


const Intra42 = async (
	router:any, setError: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
	try {
		const response = await fetch('http://localhost:8000/api/users/42/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const result = await response.json(); // Only call json() once
		console.log(result)
		const url_42 = result.authorize_link;
		router.push(url_42);
		
	} catch (error) {
		console.error('Error during login:', error);
		setError((prev: any) => ({ ...prev, general: 'An unexpected error occurred. Please try again.' }));
	}
};

export { Intra42 };

export default OAuthPage