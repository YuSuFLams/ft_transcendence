"use client"

import { HalfSideSignIn, handleInputChange, handleSubmit } from "./sign-up_utils";
import { motion } from "framer-motion";
import { FaEye, FaGoogle } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import React, { useRef, useState, useEffect } from "react"; // Import useEffect
import { useRouter } from 'next/navigation';
import { Si42 } from "react-icons/si";
import { Google, Intra42 } from "../../api/auth";

interface SignUpProps {
    toggleView: () => void;
    isMobile: boolean;
    setIsCreated: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUp: React.FC<SignUpProps> = ({ toggleView, isMobile, setIsCreated }) => {
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [hideConfirmPass, setHideConfirmPass] = useState<boolean>(true);
    const router = useRouter();
    const inputFname = useRef<HTMLInputElement | null>(null);
    const inputLname = useRef<HTMLInputElement | null>(null);
    const inputEmail = useRef<HTMLInputElement | null>(null);
    const inputUsername = useRef<HTMLInputElement | null>(null);
    const inputPassword = useRef<HTMLInputElement | null>(null);
    const inputConfirmPassword = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<Record<string, string>>({});
    const [data, setData] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [inputClassName, setInputClassName] = useState("w-full shadow-md shadow-[#aaabbc] p-3 pl-4 rounded-lg shadow-md \
        focus:outline-none font-[Borias] placeholder:font-[Font6] placeholder:text-lg focus:ring-2 placeholder:text-gray-500 \
        focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold text-black text-2xl text-left");
    const [inputClassName1, setInputClassName1] = useState("w-full shadow-md shadow-[#aaabbc] p-3 pl-4 rounded-lg shadow-md \
        focus:outline-none font-[Borias] placeholder:font-[Font6] placeholder:text-lg focus:ring-2 placeholder:text-gray-500 \
        focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold text-black text-2xl text-left");

    return (
        <div className="fixed flex flex-row w-full h-full items-center">
            <motion.div className={`flex-1 max-w-[600px] h-full bg-[#F3F8FF] rounded-2xl flex flex-col items-center justify-center p-4 md:p-8 space-y-4 lg:space-y-6`}>

                <h2 className="z-[50] text-3xl md:text-3xl lg:text-5xl font-[Font3] text-black font-extrabold text-center ">Create Account.</h2>
                
                <form className="z-[50] max space-y-2 lg:space-y-5 w-full md:w-[90%]" onSubmit={(e) => { 
                        handleSubmit(e, inputFname, inputLname, inputEmail, inputUsername, inputPassword, inputConfirmPassword, setError, setData, setLoading, toggleView, setIsCreated);
                    }}>
                        <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-6">
                            <div className="flex-1">
                                <input onChange={(e) => handleInputChange(e, setError, setData, inputPassword, inputConfirmPassword, setInputClassName, setInputClassName1)} 
                                    className={`w-full p-3 pl-3 rounded-lg shadow-md focus:outline-none placeholder:text-lg 
                                    focus:ring-2 focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold 
                                    font-[Font6] text-black text-xl md:text-2xl text-left shadow-md shadow-[#aaabbc]
                                    ${error.firstName ? "border-2 border-red-500" : ""}`}
                                    type="text" name="firstName" placeholder="First Name" ref={inputFname} 
                                />
                            </div>

                            <div className="flex-1">
                                <input onChange={(e) => handleInputChange(e, setError, setData, inputPassword, inputConfirmPassword, setInputClassName, setInputClassName1)} 
                                    type="text" name="lastName" placeholder="Last Name" ref={inputLname} 
                                    className={`w-full p-3 pl-3 rounded-lg shadow-md focus:outline-none placeholder:text-lg 
                                    focus:ring-2 focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold 
                                    font-[Font6] text-black text-xl md:text-2xl text-left shadow-md shadow-[#aaabbc]
                                    ${error.lastName ? "border-2 border-red-500" : ""}`}
                                />
                            </div>
                        </div>

                        <div>
                            <input onChange={(e) => handleInputChange(e, setError, setData, inputPassword, inputConfirmPassword, setInputClassName, setInputClassName1)} 
                                className={`w-full p-3 pl-3 rounded-lg shadow-md focus:outline-none placeholder:text-lg 
                                focus:ring-2 focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold 
                                font-[Font6] text-black text-xl md:text-2xl text-left shadow-md shadow-[#aaabbc]
                                ${error.username ? "border-2 border-red-500" : ""}`}
                                type="text" name="username" placeholder="Username" ref={inputUsername}
                            />
                        </div>

                        <div>
                            <input onChange={(e) => handleInputChange(e, setError, setData, inputPassword, inputConfirmPassword, setInputClassName, setInputClassName1)} 
                                type="email" name="email" placeholder="Email" ref={inputEmail} 
                                className={`w-full p-3 pl-3 rounded-lg shadow-md focus:outline-none placeholder:text-lg 
                                focus:ring-2 focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold 
                                font-[Font6] text-black text-xl md:text-2xl text-left shadow-md shadow-[#aaabbc]
                                ${error.email ? "border-2 border-red-500" : ""}`}
                                />
                        </div>

                        <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-6">
                            <div className="flex-1">
                                <div className="relative">
                                    <span className="absolute top-1/2 right-3 text-black font-[Font4] transform -translate-y-1/2 cursor-pointer" onClick={() => setHidePass(!hidePass)}>
                                        {hidePass ? <FaEyeSlash style={{ width: 22, height: 22 }} /> : <FaEye style={{ width: 22, height: 22 }} />}
                                    </span>
                                    <input className={`${error.password ? "border-2 border-red-500" : ""} ${inputClassName}`} onChange={(e) => handleInputChange(e, setError, setData, inputPassword, inputConfirmPassword, setInputClassName, setInputClassName1)} 
                                        type={hidePass ? 'password' : 'text'} name="password" placeholder="Password"ref={inputPassword} 
                                        />
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="relative">
                                    <span className="absolute top-1/2 right-3 text-black transform -translate-y-1/2 cursor-pointer" onClick={() => setHideConfirmPass(!hideConfirmPass)}>
                                        {hideConfirmPass ? <FaEyeSlash style={{ width: 22, height: 22 }} /> : <FaEye style={{ width: 22, height: 22 }} />}
                                    </span>
                                    <input onChange={(e) => handleInputChange(e, setError, setData, inputPassword, inputConfirmPassword, setInputClassName, setInputClassName1)} 
                                        type={hideConfirmPass ? 'password' : 'text'} name="confirmPassword" placeholder="Confirm Password"  ref={inputConfirmPassword} 
                                        className={`${error.confirmPassword ? "border-2 border-red-500" : ""} ${inputClassName1}`}
                                        />
                                </div>
                            </div>
                        </div>
                        {(error.firstName || error.lastName || error.username || error.email || error.password || error.confirmPassword )
                        && <p className="text-red-600 font-[Font6] text-sm mt-1 font-bold line-clamp-4">All fields are required</p>}

                        <motion.div className="flex items-center justify-center">
                            <motion.button className="sm:mt-2 lg:mt-0 items-center w-[40%] text-white bg-[#0e213f] px-4 py-2 lg:px-8 lg:py-3 rounded-lg font-[Font4] text-xl md:text-2xl shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0e213f] focus:ring-opacity-50" 
                                type="submit" whileHover={{ scale: 1.05 }} style={loading ? { opacity: 0.5 } : {}} disabled={loading} aria-label="Sign Up" whileTap={{ scale: 0.95 }}>
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </motion.button>
                        </motion.div>

                        {error.general && <p className="text-center text-red-600 text-sm mt-1 font-extrabold line-clamp-4">{error.general}</p>}
                    </form>
            

                {isMobile && 
                    <div className="z-[50] flex items-center justify-center">
                        <p className="text-[#0e213f] text-lg md:text-xl">Already have an account? 
                        <button className="text-black underline text-xl" onClick={toggleView}>Sign In</button></p>
                    </div>
                }

                <div className="z-[50] my-4 md:my-6 flex items-center w-full">
                    <div className="flex-grow border-t border-t-2 border-[#0e213f]"></div>
                    <span className="mx-4 text-lg text-black">Or sign in with email</span>
                    <div className="flex-grow border-t border-t-2 border-[#0e213f]"></div>
                </div>

                <motion.div className="z-[50] flex px-4 md:px-8 lg:px-20 justify-between items-center w-full">
                    <motion.button className="w-[50%] justify-center font-[Font4] max-w-[150px] h-[56px] bg-[#0e213f] text-white 
                        text-lg space-x-4 rounded-xl shadow flex items-center mr-4 p-2" transition={{ type: 'spring', stiffness: 300 }}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => Google(router, setError)}
                    >
                        <FaGoogle style={{ width: 24, height: 24 }} />
                        <span className="text-xl md:text-2xl">Google</span>
                    </motion.button>

                    <motion.button className="w-[50%] justify-center font-[Font4] max-w-[150px] p-2 h-[56px] bg-[#0e213f] text-white 
                        text-lg rounded-xl shadow space-x-4 flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300 }} onClick={() => Intra42(router, setError)}
                    >
                        <Si42 style={{ width: 24, height: 24 }} />
                        <span className="text-xl md:text-2xl">Intra</span>
                    </motion.button>
                </motion.div>

            </motion.div>


            {!isMobile && <HalfSideSignIn toggleView={toggleView} />}
        </div>
    );
}

export default SignUp;