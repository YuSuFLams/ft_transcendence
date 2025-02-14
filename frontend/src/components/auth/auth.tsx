"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SignIn from "./sign-in/sign-in";
import SignUp from "./sign-up/sign-up";
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Notigication } from './sign-in/sign-in_utils';

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

    const toggleView = () => setIsSignIn((prev) => !prev);

    // Function to handle resizing
    const updateSize = () => {
        setSize({width: window.innerWidth, height: window.innerHeight, });

        if (window.innerWidth < 1000) setIsMobile(true);
        else setIsMobile(false);
    };

    useEffect(() => {
        const isLog = Cookie.get("access");
        if (isLog) router.push("/dashboard");
    },[])

    useEffect(() => {
        updateSize();

        window.addEventListener("resize", updateSize);

        return () =>  window.removeEventListener("resize", updateSize);
    }, [isMobile]);

    useEffect(() => {
        if (isCreated || isLogin) {
            setShowNotification(true);
            setTimeout(() => {setShowNotification(false);}, 3000);
        }
    }, [isCreated, isLogin]);

    return (
        <div className="fixed w-full h-full bg-gradient-to-br from-[#050026] via-[#11002D] to-[#002A52] top-0 left-0 right-0 bottom-0 
            flex  items-center justify-center overflow-hidden">
            <div className={`${isMobile ? "fixed mt-auto w-[95dvw] h-[95dvh] min-w-[340px] min-h-[660px] max-w-[500px] max-h-[800px] rounded-2xl"
                : "fixed rounded-2xl w-[95dvw] h-[95dvh] min-w-[750px]  min-h-[590px] max-w-[1300px] max-h-[800px]"} transform ease-in-out flex`}
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
                        {isSignIn ? <SignIn toggleView={toggleView} isMobile={isMobile} setIsLogin={setIsLogin} />
                         : <SignUp toggleView={toggleView} isMobile={isMobile} setIsCreated={setIsCreated} />}
                    </div>
                )}
            </div>

            <Notigication showNotification={showNotification} isLogin={isLogin} /> 
        </div>

    );
};

export default LogInUp;
