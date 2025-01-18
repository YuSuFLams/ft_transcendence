"use client"

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SignIn from "./signIn";
import SignUp from "./signUp";


export type Size = {
    width: number;
    height: number;
};

const LogInUp = () => {

    const [isSignIn, setIsSignIn] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });

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
        }
        else {
            setIsMobile(false);
        }
    };

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

    return (
        <div className="fixed w-[100vw] h-[100vh] bg-gradient-to-br from-[#001219] via-[#031D44] to-[#062A78] top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            {/* Glowing Overlay */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0.8)_100%)]"></div>

            <div className={` ${isMobile ? "fixed mt-auto w-[95dvw] h-[95dvh] min-w-[340px] min-h-[660px] max-w-[500px] max-h-[800px] rounded-2xl" : 
            "fixed rounded-2xl w-[95dvw] h-[95dvh] min-w-[750px]  min-h-[590px] max-w-[1300px] max-h-[800px]"} 
            transform ease-in-out flex overflow-hidden `}>

                {!isMobile ? (
                    <AnimatePresence mode="wait">
                        {isSignIn ? (
                            <motion.div
                                key="signIn"
                                initial={{ x: 500, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -500, opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="w-full h-[100%] rounded-2xl "
                            >
                                <SignIn toggleView={toggleView} isMobile={isMobile} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signUp"
                                initial={{ x: -500, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 500, opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="w-full h-[100%] rounded-2xl"
                                style={{ background: "#b6a972" }}
                            >
                                <SignUp toggleView={toggleView} isMobile={isMobile} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                ):(
                    <>
                        {isSignIn ? (
                            <SignIn toggleView={toggleView} isMobile={isMobile} />
                        ) : (
                            
                            <SignUp toggleView={toggleView} isMobile={isMobile} />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default LogInUp;