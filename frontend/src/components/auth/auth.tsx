"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SignIn from "./sign-in/sign-in";
import SignUp from "./sign-up/sign-up";
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Notification } from './auth-utils';

const LogInUp = () => {
    const [isSignIn, setIsSignIn] = useState<boolean>(true);
    const [isCreated, setIsCreated] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState(false);
    const router = useRouter();

    const toggleView = () => setIsSignIn((prev) => !prev);

    useEffect(() => {
        const isLog = Cookie.get("access");
        if (isLog) router.push("/dashboard");
    },[])

    useEffect(() => {
        if (isCreated || isLogin) {
            setShowNotification(true);
            setTimeout(() => {setShowNotification(false);}, 3000);
        }
    }, [isCreated, isLogin]);



    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
            <div className={`rounded-2xl h-full max-h-[5xl]  w-full flex items-center justify-center bottom-0 transform ease-in-out flex`}>
                <AnimatePresence mode="wait">
                    <motion.div className="w-[90dvw] h-[95dvh] rounded-2xl flex items-center justify-center" initial={{ x: 500, opacity: 0 }} 
                        key={`${isSignIn ?"signIn" : "signUp"}`} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }}
                        exit={{ x: isSignIn ? -500 : 500, opacity: 0 }}   
                    >
                        {isSignIn ? <SignIn toggleView={toggleView} setIsLogin={setIsLogin} /> : <SignUp toggleView={toggleView} setIsCreated={setIsCreated} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            <Notification showNotification={showNotification} isLogin={isLogin}/>
        </div>
    );
};

export default LogInUp;