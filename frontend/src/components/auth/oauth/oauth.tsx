"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle, FaGamepad } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Cookie from "js-cookie";
import { handleOAuth } from "@/components/api/oauth";

const LoadingState: React.FC = () => (
	<div className="text-center">
		<motion.div className="text-green-400 flex flex-col items-center text-6xl md:text-7xl mb-6" initial={{ scale: 0.8 }}
			animate={{ scale: 1.2 }} transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut", repeatType: "reverse" }}
		>
			<FaGamepad className="drop-shadow-lg" />
		</motion.div>
		
		<h1 className="text-2xl md:text-4xl font-bold font-[Font6] text-yellow-500 mb-5 tracking-wide"> Authenticating... </h1>
		
		<p className="text-lg md:text-2xl font-[TORAJA] text-[#aaabbc] mb-12 mx-auto text-center leading-relaxed">
			Securing your session. Just a moment...
		</p>
		<motion.div className="h-3 bg-gradient-to-r from-[#3674B5] via-[#578FCA] to-[#A1E3F9] rounded-full shadow-md" 
			transition={{ duration: 3, ease: "easeInOut" }} initial={{ width: "0%" }} animate={{ width: "100%" }}
		/>
	</div>
);

interface ErrorStateProps {
	router: ReturnType<typeof useRouter>;
}

const ErrorState: React.FC<ErrorStateProps> = ({ router }) => (
	<div className="z-[50] space-y-6 flex flex-col items-center">
		<motion.div className="text-red-500 flex flex-col items-center text-6xl md:text-7xl" initial={{ scale: 0.8 }}
			animate={{ scale: 1 }} transition={{ duration: 0.5, ease: "easeInOut" }}
		>
			<FaExclamationTriangle className="drop-shadow-lg" />
		</motion.div>

		<h1 className="text-2xl md:text-4xl font-bold font-[Font6] text-yellow-500 tracking-wide"> Error! </h1>
		<p className="text-lg md:text-2xl font-[TORAJA] text-[#aaabbc]  mx-auto text-center leading-relaxed"> Oops, an error occurred! </p>
		<motion.button className="w-[80%] md:w-[50%] max-w-[180px] h-[56px] bg-[#aaabbc] text-[#050A30] text-xl md:text-2xl font-[Font4] 
			rounded-xl shadow flex items-center justify-center px-4 py-2 hover:bg-[#8a8b9c]" onClick={() => router.push("/login-signup")}
			whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
		>
			Go Back
		</motion.button>
	</div>
);

const SuccessState: React.FC = () => (
	<div className="z-[50] text-center">
		<motion.div className="text-green-500 flex flex-col items-center text-5xl md:text-6xl mb-6" initial={{ scale: 0.8 }}
			animate={{ scale: 1 }} transition={{ duration: 0.5, ease: "easeInOut" }}
		>
			<FaCheckCircle className="drop-shadow-lg" />
		</motion.div>
		<h1 className="text-2xl md:text-4xl font-bold font-[Font6] text-yellow-500 mb-5 tracking-wide"> Success! </h1>
		<p className="text-lg md:text-2xl font-[TORAJA] text-[#aaabbc] mb-12 mx-auto text-center leading-relaxed">
			Redirecting to your dashboard...
		</p>
	</div>
);

interface OauthPageProps {
	loading: boolean;
	errorMessage: string;
	router: ReturnType<typeof useRouter>;
}

const OauthPage: React.FC<OauthPageProps> = ({ loading, errorMessage, router }) => (
	<div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-[#050026] via-[#11002D] to-[#002A52] text-white">
		<div className="z-50 hover:scale-105 transition-transform duration-300 ease-in-out px-4 md:px-8 py-8 md:py-12 relative bg-[#022859] 
			space-y-6 md:space-y-8 text-center rounded-2xl  shadow-[2px_2px_2px_2px] shadow-[#0597F2] max-w-[90%] md:max-w-xl w-full">
			{loading ? <LoadingState /> : errorMessage ? <ErrorState router={router} /> : <SuccessState />}
		</div>
	</div>
);

const OAuthPage: React.FC<{ url: string }> = ({ url }) => {
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
			const authUrl = `${url}${code}`;
			handleOAuth(code, setErrorMessage, setLoading, authUrl);
		}
	}, [code, url]);

	useEffect(() => {
		if (!loading && !errorMessage) {
		const timeout = setTimeout(() => router.push("/dashboard"), 2000);
		return () => clearTimeout(timeout);
		}
	}, [loading, errorMessage, router]);

	return <OauthPage loading={loading} errorMessage={errorMessage} router={router} />;
};

export default OAuthPage;