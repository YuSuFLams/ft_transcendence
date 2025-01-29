// src/app/layout.tsx

"use client";

import { usePathname, useRouter } from 'next/navigation';
import "./globals.css";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Point } from './utils/background';

interface AuthResult {
	isAuthenticated: boolean;
	loading: boolean;
}

export const useAuth = (): AuthResult => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const router = useRouter();
	const pathname = usePathname();

	// Check the token validity
	const checkTokenValidity = async (): Promise<boolean> => {
		const token = Cookies.get('access');
		return !!token; // Returns true if token exists, false otherwise.
	};

	// Fetch user data after token validation
  	useEffect(() => {
		const checkAuth = async () => {
			setLoading(true); // Start loading

			const isValidToken = await checkTokenValidity();
			if (!isValidToken) {
				setIsAuthenticated(false);
			if (pathname !== '/login-signup' && pathname !== '/reset-password' && pathname !== '/' && pathname !== '/oauth' && pathname !== '/oauth/google') {
				router.push('/login-signup');
			}
		} else {
			setIsAuthenticated(true);
		}

	      setLoading(false);
    	};

    	checkAuth();
  	}, [pathname, router]);

  	return { isAuthenticated, loading };
};


const Spinner = () => {
	return (
		<div className="fixed w-screen h-screen flex overflow-hidden flex-col justify-center items-center bg-[#050A30] ">

			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0%,rgba(0,0,0,0.4)_100%)]/2"></div>

			<div className="w-24 h-24 border-4 border-t-4 border-blue-400 rounded-full animate-spin ring-4 ring-blue-500 shadow-xl"></div>

			<p className="text-purple-400 mt-4 text-xl font-bold animate-pulse text-shadow-xl">Hold tight, the page is loading... Get ready for an epic adventure!</p>

			<Point />
		</div>
	);
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
	const pathname = usePathname();
	const currentPage = pathname.split('/').pop() || 'Home';
	const formattedTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1).replace(/-/g, ' ');
	const { loading } = useAuth(); 
	const [showSpinner, setShowSpinner] = useState<boolean>(true);

	useEffect(() => {
		// Adding a delay for the spinner to rest longer
		if (!loading) {
		const spinnerTimeout = setTimeout(() => {
			setShowSpinner(false); // Hide spinner after a short delay (e.g., 1s after loading is complete)
		}, 1000); // Adjust the delay duration (1000ms = 1 second)
		
		return () => clearTimeout(spinnerTimeout); // Cleanup timeout on unmount or re-render
		}
	}, [loading]);


	if (loading || showSpinner) {
		return (
			<html lang="en">
				<head>
					<title>{formattedTitle === 'Home' ? 'Ping Pong | Your Ultimate Table Tennis Experience' : `Ping Pong | ${formattedTitle} - Explore More`}</title>
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta name="description" content={`Explore the ${formattedTitle} page of Ping Pong, your ultimate table tennis experience.`} />
					<link rel="icon" href="/favicon.ico" />
				</head>
	
				<body>
					<Spinner />
				</body>
			</html>
		);
	}

	return (
		<html lang="en">
			<head>
				<title>{formattedTitle === 'Home' ? 'Ping Pong | Your Ultimate Table Tennis Experience' : `Ping Pong | ${formattedTitle} - Explore More`}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="description" content={`Explore the ${formattedTitle} page of Ping Pong, your ultimate table tennis experience.`} />
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body>
				{children}
			</body>
		</html>
	);
}
