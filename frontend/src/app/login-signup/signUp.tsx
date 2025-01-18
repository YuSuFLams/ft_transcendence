"use client"

import { HalfSideSignIn, handleInputChange, handleSubmit } from "../components/auth/sign-up";


import { motion } from "framer-motion";
import { message } from 'antd';
import { FaEye, FaGoogle } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import React, { useRef, useState, ChangeEvent } from "react";
import { useRouter } from 'next/navigation';
import { Si42 } from "react-icons/si";
import axios, { AxiosError } from 'axios';

interface SignUpProps {
    toggleView: () => void; // Change according to your toggle view logic
    isMobile: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ toggleView, isMobile }) => {
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [hideConfirmPass, setHideConfirmPass] = useState<boolean>(true);
    const router = useRouter();
    const inputFname = useRef<HTMLInputElement | null>(null);
    const inputLname = useRef<HTMLInputElement | null>(null);
    const inputEmail = useRef<HTMLInputElement | null>(null);
    const inputUsername = useRef<HTMLInputElement | null>(null);
    const inputPassword = useRef<HTMLInputElement | null>(null);
    const inputConfirmPassword = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<Record<string, string>>({});
    const [data, setData] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [inputClassName, setInputClassName] = useState("w-full p-3 pl-4 rounded-lg placeholder:text-gray-500 shadow-md focus:outline-none placeholder:text-lg focus:ring-2 \
                                    focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold font-[Font6] text-black text-2xl text-left");
    const [inputClassName1, setInputClassName1] = useState("w-full p-3 pl-4 placeholder:text-gray-500 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2 \
                                    focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold font-[Font6] text-black text-2xl text-left");

    
    
    
    

    
        

    const handleIntraLogin = async () => {
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
            console.log(url_42)
            router.push(url_42);
            // window.location.href = url_42;
        } catch (error) {
            console.error('Error during login:', error);
            setError((prev: any) => ({ ...prev, general: 'An unexpected error occurred. Please try again.' }));
        }
    }

    return (
        <>
            <div className="flex w-full h-full ">
                <motion.div className="w-[50%]  lg:mt-0 h-full bg-[#aaabbc] rounded-l-2xl flex flex-col items-center justify-center p-8 
                xl:space-y-4 space-y-2 mb-10">

                    <h2 className="lg:text-5xl text-3xl font-[Font3] text-black font-extrabold text-center lg:mb-2 xl:mb-6 ">Create Account.</h2>
                    
                    <form className="xl:space-y-4 lg:space-y-3 sm:space-y-3 space-y-1 w-[100%] lg:w-[90%]" onSubmit={ (e) => {
                        handleSubmit(e, inputFname, inputLname, inputEmail, inputUsername, inputPassword,
                            inputConfirmPassword, setError, setData, setLoading, toggleView)}}>
                    
                        <div className="flex flex-col lg:flex-row sm:space-y-6 xl:space-x-6 space-y-4 lg:space-y-0 lg:space-x-4">
                            <div className="flex-1">
                                <input type="text" name="firstName" placeholder="First Name" ref={inputFname} onChange={(e) => {
                                    handleInputChange(e, setData, setError, inputPassword, inputConfirmPassword, setInputClassName, 
                                        setInputClassName1)}}
                                    className="w-full p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2 
                                    focus:ring-[#aaabbc] placeholder:text-gray-500
                                     focus:ring-opacity-50 font-extrabold font-[Font6] text-black text-2xl text-left"
                                />
                                
                                {error.firstName && <p className="text-red-600 font-[Font6] text-sm mt-1 lg:mt-1 font-bold line-clamp-2">{error.firstName}</p>}
                            </div>
                            <div className="flex-1">
                                <input type="text" name="lastName" placeholder="Last Name" ref={inputLname} onChange={(e) =>{
                                    handleInputChange(e, setData, setError, inputPassword, inputConfirmPassword, setInputClassName, 
                                        setInputClassName1)}}
                                    className="w-full p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2
                                    placeholder:text-gray-500 
                                    focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold font-[Font6] text-black text-2xl text-left" 
                                />

                                {error.lastName && <p className="text-red-600 font-[Font6] text-sm mt-1 lg:mt-1 font-bold line-clamp-2">{error.lastName}</p>}
                            </div>
                        </div>
                    
                        <div>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                className="w-full p-3 pl-3 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2
                                placeholder:text-gray-500
                                focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold font-[Font6] text-black text-2xl text-left" 
                                ref={inputUsername}
                                onChange={(e) =>{ handleInputChange(e, setData, setError, inputPassword, inputConfirmPassword, 
                                    setInputClassName, setInputClassName1)}}
                            />
                            {error.username && <p className="text-red-600 font-[Font6] text-sm mt-1 lg:mt-1 font-bold line-clamp-2 ">{error.username}</p>}
                        </div>
                        
                        <div>
                            <input type="email" name="email" placeholder="Email" ref={inputEmail} 
                                onChange={(e) =>{handleInputChange(e, setData, setError, inputPassword, inputConfirmPassword, 
                                    setInputClassName, setInputClassName1)}}
                                className="w-full p-3 pl-3 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2 
                                placeholder:text-gray-500
                                focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold font-[Font6] text-black text-2xl text-left"
                            />

                            {error.email && <p className="text-red-600 font-[Font6] text-sm mt-0 lg:mt-1 font-bold line-clamp-2">{error.email}</p>}
                        </div>
                        
                        <div className="flex w-full flex-col lg:flex-row sm:space-y-6 space-y-4 xl:space-x-6 lg:space-y-0 lg:space-x-4">
                            <div className="flex-1">
                                <div className="flex-1 w-full relative">
                                    <span
                                        className="absolute  top-1/2 right-3 text-black font-[Font4] text-black transform -translate-y-1/2 cursor-pointer"
                                        onClick={() => setHidePass(!hidePass)}
                                    >
                                        {hidePass ? (
                                            <FaEyeSlash style={{ width: 22, height: 22 }} />
                                        ) : (
                                            <FaEye style={{ width: 22, height: 22 }} />
                                        )}
                                    </span>
                                    <input
                                        type={hidePass ? 'password' : 'text'}
                                        name="password"
                                        placeholder="Password"
                                        className={inputClassName} // Use the dynamic class name
                                        ref={inputPassword}
                                        onChange={(e) =>{handleInputChange(e, setData, setError, inputPassword, inputConfirmPassword, 
                                            setInputClassName, setInputClassName1)}}
                                    />
                                </div>
                                {error.password && (
                                    <p className="text-red-600 font-[Font6] text-sm mt-0 lg:mt-1 font-bold line-clamp-2">{error.password}</p>
                                )}
                            </div>

                            <div className="flex-1 w-full relative">
                                <div className="flex-1 w-full relative">
                                    <span
                                        className="absolute top-1/2 right-3 text-black transform -translate-y-1/2 cursor-pointer"
                                        onClick={() => setHideConfirmPass(!hideConfirmPass)}
                                        >
                                        {hideConfirmPass ? (
                                            <FaEyeSlash style={{ width: 22, height: 22 }} />
                                        ) : (
                                            <FaEye style={{ width: 22, height: 22 }} />
                                        )}
                                    </span>
                                    <input
                                        type={hideConfirmPass ? 'password' : 'text'}
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        className={inputClassName1}
                                        ref={inputConfirmPassword}
                                       onChange={(e) =>{handleInputChange(e, setData, setError, inputPassword, inputConfirmPassword, 
                                    setInputClassName, setInputClassName1)}}
                                        />
                                </div>
                                {error.confirmPassword && (
                                    <p className="text-red-600 font-[Font6] text-sm mt-0 lg:mt-1 font-bold line-clamp-2">{error.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        {/* Add Sign-In Form Elements Here */}
                        <motion.div className="flex items-center justify-center">
                            <motion.button className="sm:mt-2 lg:mt-0 items-center w-[40%] text-white bg-[#0e213f] px-4 py-2 lg:px-8 
                                lg:py-3 rounded-lg font-[Font4] text-2xl shadow-md transition-transform duration-300 ease-in-out hover:scale-105 
                                hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0e213f] focus:ring-opacity-50"
                                whileHover={{ scale: 1.05 }} type="submit" style={loading ? { opacity: 0.5 } : {}} disabled={loading}
                                whileTap={{ scale: 0.95 }} aria-label="Sign Up"
                            >
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </motion.button>
                        </motion.div>
                        {error.general && <p className=" text-center text-red-600 text-sm mt-0 lg:mt-1 font-bold line-clamp-2">{error.general}</p>}
                    </form>
                    {isMobile && <div className=" flex items-center justify-center">
                        <p className="text-[#0e213f]  lg:text-xl">Already have an account? <button className="text-black underline text-xl" onClick={toggleView}>Sign In</button></p>
                    </div>}

                    {/* Sign Up View */}
                    <div className="xl:my-6 flex items-center  w-full">
                        <div className="flex-grow border-t border-t-2 border-[#0e213f]"></div>
                        <span className="mx-4 text-lg text-[#0e213f]">Or sign in with email</span>
                        <div className="flex-grow border-t border-t-2 border-[#0e213f]"></div>
                    </div>
                    <motion.div className="flex xl:px-20 px-8 justify-between items-center w-full">
                        <motion.button
                            className="w-[50%] justify-center font-[Font4] max-w-[150px] h-[56px] bg-[#0e213f] text-white text-lg 
                                space-x-4 rounded-xl shadow flex items-center mr-4 p-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <FaGoogle style={{ width: 24, height: 24 }} />
                            <span className="text-2xl">Google</span>
                        </motion.button>
                        <motion.button
                            className="w-[50%] justify-center font-[Font4] max-w-[150px] p-2 h-[56px] bg-[#0e213f] text-white text-lg rounded-xl shadow
                            space-x-4 flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            onClick={handleIntraLogin}
                        >
                            <Si42 style={{ width: 24, height: 24 }} />
                            <span className="text-2xl ">Intra</span>
                        </motion.button>
                    </motion.div>

                </motion.div>


                {!isMobile && <HalfSideSignIn toggleView={toggleView} />}

            </div>
        </>
    );
}

export default SignUp;