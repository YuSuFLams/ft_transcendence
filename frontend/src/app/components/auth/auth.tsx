"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SignIn from "./sign-in"
import SignUp from "./sign-up";
import Cookie from 'js-cookie';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';

export type Size = {
    width: number;
    height: number;
};

const LogInUp = () => {
    const [isSignIn, setIsSignIn] = useState<boolean>(true);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });
    const [isCreated, setIsCreated] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState(false);
    const router = useRouter();

    const toggleView = () => {
        setIsSignIn((prev) => !prev);
    };

    // Function to handle resizing
    const updateSize = () => {
        setSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        if (window.innerWidth < 768) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        const isLog = Cookie.get("access");
        if (isLog) router.push("/dashboard");
    },[])

    useEffect(() => {
        // Set initial size
        updateSize();

        // Add event listener for window resize
        window.addEventListener("resize", updateSize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("resize", updateSize);
        };
    }, [isMobile]);

    useEffect(() => {
        if (isCreated || isLogin) {
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
        }
    }, [isCreated, isLogin]);

    return (
        <div className="fixed w-full h-full bg-[#050A30] top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            {/* Glowing Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0.8)_100%)]"></div>
            <div
                className={`${
                    isMobile
                        ? "fixed mt-auto w-[95dvw] h-[95dvh] min-w-[340px] min-h-[660px] max-w-[500px] max-h-[800px] rounded-2xl"
                        : "fixed rounded-2xl w-[95dvw] h-[95dvh] min-w-[750px]  min-h-[590px] max-w-[1300px] max-h-[800px]"
                } transform ease-in-out flex overflow-hidden`}
            >
                {!isMobile ? (
                    <AnimatePresence mode="wait">
                        {isSignIn ? (
                            <motion.div key="signIn" initial={{ x: 500, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -500, opacity: 0 }} transition={{ duration: 1 }} className="w-full h-[100%] rounded-2xl"
                            >
                                <SignIn toggleView={toggleView} isMobile={isMobile} setIsLogin={setIsLogin} />
                            </motion.div>
                        ) : (
                            <motion.div className="w-full h-[100%] rounded-2xl" initial={{ x: -500, opacity: 0 }} key="signUp"
                                animate={{ x: 0, opacity: 1 }} exit={{ x: 500, opacity: 0 }} transition={{ duration: 1 }}
                            >
                                <SignUp toggleView={toggleView} isMobile={isMobile} setIsCreated={setIsCreated} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                ) : (
                    <div>
                        {isSignIn ? (
                            <SignIn toggleView={toggleView} isMobile={isMobile} setIsLogin={setIsLogin} />
                        ) : (
                            <SignUp toggleView={toggleView} isMobile={isMobile} setIsCreated={setIsCreated} />
                        )}
                    </div>
                )}
            </div>

            {/* Custom Notification */}
            {!isLogin && showNotification && (
                <motion.div className="fixed top-10 right-10 bg-gradient-to-r from-[#34495e] via-[#2c3e50] to-[#1a252f] text-white px-5 py-3 
                    rounded-md shadow-md transform transition-all duration-250 font-[Font2] text-xs" initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}
                >
                    <p className="text-base font-medium text-center"> 🎉 Successfully Created Your Account! </p>
                </motion.div>        
            )}
            {isLogin && showNotification && (
                <motion.div className="fixed top-10 right-10 bg-gradient-to-r from-[#34495e] via-[#2c3e50] to-[#1a252f] text-white px-5 py-3 
                    rounded-md shadow-md transform transition-all duration-250 font-[Font2] text-xs" initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}
                >
                    <p className="text-base font-medium text-center"> 🎉 Successfully Logged In! </p>
                </motion.div>        
            )}
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

export default LogInUp;
