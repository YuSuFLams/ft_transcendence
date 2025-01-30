"use client"

import { handleSubmit, handleInputChange, HalfSideSignUp, Intra42, Google } from "./sign-in_utils";



import React, { useRef, useState, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Uncomment this line
import { Si42 } from "react-icons/si";
import { message } from "antd";
import Cookie from 'js-cookie';
import { Point } from "@/app/utils/background";

interface SignInProps {
    toggleView: () => void;
    isMobile: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignIn: React.FC<SignInProps> = ({ toggleView, isMobile, setIsLogin }) => {
    const input = useRef<HTMLInputElement | null>(null);
    const inputPassword = useRef<HTMLInputElement | null>(null);
    const [data, setData] = useState<Record<string, string>>({ username: "", password: "" });
    const [error, setError] = useState<Record<string, string>>({});
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [inputClassName, setInputClassName] = useState<string>("w-full p-3 pl-4 rounded-lg shadow-md focus:outline-none font-[Font6] placeholder:text-lg focus:ring-2 placeholder:text-gray-500 focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold text-black text-2xl text-left");

    return (
        <div className="fixed flex flex-row w-full h-full items-center">
            {!isMobile && <HalfSideSignUp toggleView={toggleView} />}
            <motion.div className={`flex-1 h-full bg-[#aaabbc] rounded-r-2xl flex flex-col items-center justify-center p-8 space-y-4 
                lg:space-y-6 ${isMobile ? "rounded-l-2xl" : ""}`}>
                <h2 className="  text-6xl font-[Font3] text-black font-extrabold text-center mb-4 lg:mb-6">Sign In</h2>
                <motion.div className="flex z-[50] space-x-6 justify-center mb-6 w-full">
                    <motion.button className="w-[50%] justify-center font-[Font4] max-w-[180px] h-[56px] bg-[#0e213f] text-white text-lg space-x-4 rounded-xl shadow flex items-center mr-4 p-2" transition={{ type: 'spring', stiffness: 300 }}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => Google(router, setError)}>
                        <FaGoogle style={{ width: 24, height: 24 }} />
                        <span className="text-2xl">Google</span>
                    </motion.button>
                    <motion.button className="w-[50%] justify-center font-[Font4] max-w-[180px] h-[56px] bg-[#0e213f] text-white text-lg space-x-4 rounded-xl shadow flex items-center mr-4 p-2" transition={{ type: 'spring', stiffness: 300 }}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => Intra42(router, setError)}>
                        <Si42 style={{ width: 24, height: 24 }} />
                        <span className="text-2xl">Intra</span>
                    </motion.button>
                </motion.div>
                <div className="my-6 z-[50] flex items-center w-full">
                    <div className="flex-grow border-t border-t-2 border-[#0e213f]"></div>
                    <span className="mx-4 text-lg text-[#0e213f]">Or sign in with email</span>
                    <div className="flex-grow border-t border-t-2 border-[#0e213f]"></div>
                </div>
                <form className="space-y-3 z-[50] md:space-y-6 w-[100%] lg:w-[80%]" onSubmit={(e) => handleSubmit(e, setError, input, data, router, setLoading, inputPassword, setIsLogin)}>
                    <div>
                        <input className="w-full p-3 pl-3 rounded-lg shadow-md focus:outline-none placeholder:text-lg 
                        focus:ring-2 focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold 
                        font-[Font6] text-black text-2xl text-left" ref={input} type="text" name="username" 
                        placeholder="Email Or Username" value={data.username} 
                        onChange={(e) => { handleInputChange(e, setData, setError, inputPassword, setInputClassName) }} />
                        {error.username && <p className="text-red-600 font-[Font6] text-sm mt-1 lg:mt-1 font-bold line-clamp-2">{error.username}</p>}
                    </div>
                    <div>
                        <div className="relative">
                            <input ref={inputPassword} type={hidePass ? "password" : "text"} name="password" placeholder="Password" value={data.password} className={inputClassName} onChange={(e) => { handleInputChange(e, setData, setError, inputPassword, setInputClassName) }} />
                            <span className="absolute top-1/2 right-2 transform text-black -translate-y-1/2 cursor-pointer mr-2" onClick={() => setHidePass(!hidePass)} aria-label="Toggle Password Visibility">
                                {hidePass ? <FaEyeSlash style={{ width: 24, height: 24 }} /> : <FaEye style={{ width: 24, height: 24 }} />}
                            </span>
                        </div>
                        {error.password && <p className="text-red-600 font-[Font6] text-sm mt-1 lg:mt-1 font-bold line-clamp-2">{error.password}</p>}
                    </div>
                    <div>
                        <motion.div className="flex items-center justify-center">
                            <motion.button className="items-center w-[40%] h-[56px] font-[Font6] text-white bg-[#0e213f] px-8 py-3 rounded-lg font-semibold shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#aaabbc] focus:ring-opacity-50" type="submit" whileHover={{ scale: 1.05 }} style={loading ? { opacity: 0.5 } : {}} whileTap={{ scale: 0.95 }} disabled={loading} aria-label="Sign Up">
                                {loading ? 'Loading...' : 'Sign In'}
                            </motion.button>
                        </motion.div>
                        {error.general && <p className="text-center text-red-600 font-[Font6] text-sm mt-1 lg:mt-1 font-bold line-clamp-2">{error.general}</p>}
                    </div>
                    <div className="flex justify-center items-center">
                        <Link className="text-black font-[Font6] font-extrabold text-xl underline" href="/reset-password">
                            Forgot password?
                        </Link>
                    </div>
                </form>
                {isMobile && <div className="z-[50] flex items-center justify-center">
                    <p className="text-[#0e213f] text-xl">Don't have an account? <button className="text-black underline text-xl" onClick={toggleView}>Sign Up</button></p>
                </div>}
            </motion.div>
            <Point />
        </div>
    );
};

export default SignIn;
