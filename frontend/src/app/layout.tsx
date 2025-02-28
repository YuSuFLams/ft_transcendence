// src/app/layout.tsx

"use client";

import { usePathname, useRouter } from 'next/navigation';
import "./globals.css";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

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


        if (pathname !== '/login-signup' && pathname !== '/' && pathname !== '/oauth') {
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
    <div className="fixed w-screen h-screen flex flex-col justify-center items-center bg-[#050A30] overflow-hidden">
      
      {/* Background Animation (moving gradients and blur) */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0, 0.2, 0.3, 0.4, 0.3, 0.2, 0],
          x: [0, 20, 0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut",
        }}
      >
        <div className="absolute w-[400px] h-[400px] bg-purple-500 opacity-20 blur-[120px] left-[-100px] top-[-100px] animate__fadeIn animate__delay-0.3s"></div>
        <div className="absolute w-[300px] h-[300px] bg-blue-500 opacity-15 blur-[100px] right-[-50px] bottom-[-50px] animate__fadeIn animate__delay-0.4s"></div>
        <div className="absolute w-[300px] h-[300px] bg-blue-500 opacity-15 blur-[100px] right-[1200px] bottom-[800px] animate__fadeIn animate__delay-0.5s"></div>
      </motion.div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0%,rgba(0,0,0,0.4)_100%)]/2"></div>

      {/* Spinner with glowing, neon effect */}
      <div className="w-24 h-24 border-4 border-t-4 border-blue-400 rounded-full animate-spin ring-4 ring-blue-500 shadow-xl"></div>

      {/* Loading Message */}
      <p className="text-purple-400 mt-4 text-xl font-bold animate-pulse text-shadow-xl">Hold tight, the page is loading... Get ready for an epic adventure!</p>

      {/* Animated Particles */}
      <motion.div
        className="absolute w-2 h-2 bg-teal-400 rounded-full blur-sm animate-particle left-[40%] top-[20%]"
        animate={{
          x: [0, 20, -20, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
      ></motion.div>

      <motion.div
        className="absolute w-3 h-3 bg-pink-500 rounded-full blur-md animate-particle right-[25%] bottom-[15%]"
        animate={{
          x: [0, -30, 30, 0],
          y: [0, -30, 30, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
      ></motion.div>

      <motion.div
        className="absolute w-3 h-3 bg-pink-500 rounded-full blur-md animate-particle right-[15%] bottom-[45%]"
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -40, 40, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut",
        }}
      ></motion.div>

      {/* Additional Glowing Particles */}
      <motion.div
        className="absolute w-4 h-4 bg-teal-400 rounded-full blur-sm animate-particle left-[60%] top-[40%]"
        animate={{
          x: [0, -25, 25, 0],
          y: [0, -25, 25, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
      ></motion.div>
    </div>
  );
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const currentPage = pathname.split('/').pop() || 'Home';
  const formattedTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1).replace(/-/g, ' ');
  const [isLog, setIsLog] = useState<string | null>(null)
  const { loading } = useAuth(); 
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const router = useRouter();


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
          <link rel="icon" href="@/public/favicon.ico" />
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
        <link rel="icon" href="@/public/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
