"use client";
import Link from "next/link";
import { Spinner } from '@chakra-ui/react'
import { motion } from "framer-motion";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Make sure to import FaEye
import { Flex, Spin, message } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import Cookie from 'js-cookie';
import axios from "axios";
import { circle } from "framer-motion/m";
import { removeAllData } from "../page";


const ThirdStep = () => {
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [hideConfirmPass, setHideConfirmPass] = useState<boolean>(true);
    const [data, setData] = useState<Record<string, string>>({});
    const [error, setError] = useState<Record<string, string>>({});
    const inputPassword = useRef<HTMLInputElement>(null);
    const inputConfirmPassword = useRef<HTMLInputElement>(null); // Fixed typo here
    const [loading, setLoading] = useState(false);
    const [inputClassName, setInputClassName] = useState("w-full p-2 pl-4 lg:p-3 placeholder:truncate rounded-lg placeholder:text-gray-400 shadow-md focus:outline-none placeholder:text-lg focus:ring-2 \
                                    focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold font-[Font6] text-black text-2xl text-left");
    const [inputClassName1, setInputClassName1] = useState("w-full p-2 pl-4  placeholder:truncate lg:p-3 placeholder:text-gray-400 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2 \
                                    focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold font-[Font6] text-black text-2xl text-left");
    const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
    const initializedRef = useRef(false);

    useEffect(() => {
        setTimeout(() => {
            setPasswordVisible(true);
            Cookie.set('isPasswordVisible', '1');
        }, 2000);
    
        const isVisible = Cookie.get('isPasswordVisible');
        if (!initializedRef.current && isVisible !== '1') {
            initializedRef.current = true; // Set to true after the first run
            setTimeout(() => {
                Cookie.set('isPasswordVisible', '1');  
            }, 2000);
        }
    }, []);
    
    
    

    const isAllSpaces = (str: string): boolean => {
        return str.trim().length === 0;
    };

    const isValidInput = (input: React.RefObject<HTMLInputElement>, isConfirm: boolean = false) => {
        const value = input.current?.value || "";

        if (input.current?.type === 'password') {
            if (value.length === 0) {
                return { valid: false, error: 'Field is required' };
            }
            if (isAllSpaces(value)) {
                return { valid: false, error: 'Field does not accept all spaces' };
            }
            if (value.length < 6) { // Adjusted the message to match the validation
                return { valid: false, error: 'Password must be at least 6 characters long' };
            }
        }
        return { valid: true, error: '' };
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: "" }));

        // Handle password validation within the change handler
        if (name === "password") {
            if (value.length > 0 && value.length < 6 && inputPassword.current) {
                inputPassword.current.focus();
                setInputClassName("w-[100%] p-3 pl-4 rounded-lg shadow-md focus:outline-none  placeholder:text-lg border-2 border-red-500 \
                    focus:ring-2 focus:ring-[#aaabbc]  focus:ring-opacity-50 font-extrabold font-[Font8] text-black text-2xl text-left");
            } else {
                setInputClassName("w-full p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2 \
                    focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold font-[Font8] text-black text-2xl text-left");
            }
        }
        else if (name === "repassword") { // Changed name to repassword
            if (value.length > 0 && value.length < 6 && inputConfirmPassword.current) {
                inputConfirmPassword.current.focus();
                setInputClassName1("w-[100%] p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg border-2 border-red-500  \
                    focus:ring-2 focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold font-[Font8] text-black text-2xl text-left");
            } else {
                setInputClassName1("w-full p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2  \
                    focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold font-[Font8] text-black text-2xl text-left");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        let isFormValid = true;
        const newError: Record<string, string> = {};
        const newData: Record<string, string> = {};
    
        // Validate password
        const passwordValidation = isValidInput(inputPassword);
        if (!passwordValidation.valid) {
            isFormValid = false;
            newError.password = passwordValidation.error;
        } else {
            newData.password = inputPassword.current?.value || "";
        }
    
        // Validate confirm password
        const confirmPasswordValidation = isValidInput(inputConfirmPassword, true);
        if (!confirmPasswordValidation.valid) {
            isFormValid = false;
            newError.repassword = confirmPasswordValidation.error; // Changed to repassword
        } else {
            newData.repassword = inputConfirmPassword.current?.value || ""; // Change confirmPassword to repassword
        }
    
        setError(newError);
        setData(newData);
        console.log(newData);
    
        // Check for form validity and handle focusing on input
        if (!isFormValid) {
            for (const ref of [inputPassword, inputConfirmPassword]) {
                if (ref.current && isAllSpaces(ref.current.value)) {
                    ref.current.focus();
                    break;
                }
            }
            return;
        }
    
        // Check if passwords match
        if (newData.password !== newData.repassword) {
            setError((prev: any) => ({ ...prev, repassword: 'Passwords do not match' })); // Changed to repassword
            return;
        }
        
        // Fetch request for updating the password
        // const token = Cookie.get('token');
        if (isPasswordVisible) {  
            try {
                const email = Cookie.get("email");
                const code = Cookie.get("code");
            
                const data_data = {
                    email,
                    code,
                    new_password1: newData.password,
                    new_password2: newData.repassword,
                };
            
                console.log(data_data);
            
                const response = await axios.post(
                    "http://localhost:8000/api/users/reset_mail_success/",
                    data_data,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            
                console.log("response", response.data);
            
                if (response.status === 200) {
                    Cookie.set("step", "3"); // Mark step 1 as completed
                    Cookie.set("isSuccessful", "true");
                } else {
                    message.error(`Error: ${response.data.Error}`);
                    setError({
                        general: response.data.Error || "An unexpected error occurred.",
                    });
                }
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    console.error("Axios error:", error.response?.data);
                    message.error(`Error: ${error.response?.data?.error || "An error occurred"}`);
                    setError({
                        general: error.response?.data?.error || "An unexpected error occurred.",
                    });
                    if (error.response?.data?.error === "Something went wrong") {
                        setTimeout(() => {
                            removeAllData();
                        }, 2000);
                    }
                } else {
                    console.error("Unexpected error:", error);
                    message.error("An unexpected error occurred.");
                    setError({ general: "An unexpected error occurred." });
                }
            }
            
        }
    };
    
    useEffect(() => {
        const isPasswordVisibleValue = Cookie.get('isPasswordVisible');
        if (isPasswordVisibleValue && isPasswordVisibleValue === '1') {
            setPasswordVisible(true);
        }
        if (isPasswordVisibleValue && (isPasswordVisibleValue !== '1' && isPasswordVisibleValue !== '0')) {
            Cookie.remove('isPasswordVisible');
        }
    }, [setPasswordVisible]); // Empty dependency array ensures this runs only on mount

    return (
        <div className="w-full h-full md:mt-0 rounded-r-2xl flex flex-col items-center justify-center space-y-6 mb-8">
        
            {isPasswordVisible ? (
                <div className="w-full max-w-[500px] mx-auto space-y-4 px-4 py-6">
                <div className="w-full flex flex-col items-center ">
                    <h1 className="text-2xl md:text-4xl font-[Borias] font-extrabold text-center text-[#9AB5D9]">
                        Enter New Password
                    </h1>
                </div>
            
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Password Input */}
                    <div>
                        <div className="relative w-full">
                            <span
                                className="absolute text-black top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                                onClick={() => setHidePass(!hidePass)}
                            >
                                {hidePass ? <FaEyeSlash className="w-6 h-6" /> : <FaEye className="w-6 h-6" />}
                            </span>
                            <input
                                type={hidePass ? "password" : "text"}
                                name="password"
                                placeholder="Password"
                                className={`${inputClassName} w-full`}
                                ref={inputPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        {error.password && (
                            <p className="text-red-600 text-sm mt-1 font-bold">{error.password}</p>
                        )}
                    </div>
            
                    {/* Confirm Password Input */}
                    <div>
                        <div className="relative w-full">
                            <span
                                className="absolute text-black top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                                onClick={() => setHideConfirmPass(!hideConfirmPass)}
                            >
                                {hideConfirmPass ? <FaEyeSlash className="w-6 h-6" /> : <FaEye className="w-6 h-6" />}
                            </span>
                            <input
                                type={hideConfirmPass ? "password" : "text"}
                                name="repassword"
                                placeholder="Confirm Password"
                                className={`${inputClassName1} w-full`}
                                ref={inputConfirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        {error.repassword && (
                            <p className="text-red-600 text-sm mt-1 font-bold">{error.repassword}</p>
                        )}
                    </div>
            
                    {/* General Error Message */}
                    {error.general && (
                        <p className="text-center text-red-600 text-sm mt-1 font-bold">{error.general}</p>
                    )}
            
                    {/* Submit Button */}
                    <motion.div className="flex items-center justify-center">
    <motion.button
        className={`relative flex items-center justify-center w-full sm:w-[50%] md:w-[60%] px-6 py-2 
            md:py-3 text-white 
            text-[1.5em] md:text-[2em] font-[Font4] rounded-xl shadow-lg transition-all 
            duration-300 ease-in-out focus:outline-none focus:ring-4 ${
            loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#08428C] hover:shadow-2xl hover:scale-105 focus:ring-[#0e213f] focus:ring-opacity-50"
        } whitespace-nowrap`}  // Add this line to prevent text wrapping
        whileHover={{ scale: loading ? 1 : 1.05 }}
        whileTap={{ scale: loading ? 1 : 0.95 }}
        disabled={loading}
    >
        {loading ? (
            <div className="flex items-center">
                <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10h-4" strokeOpacity="0.75"></path>
                </svg>
                Submitting...
            </div>
        ) : (
            "Change Password"
        )}
    </motion.button>

                    </motion.div>
                </form>
            </div>
            
            ) :(
                <div className="flex flex-col items-center justify-center"> {/* Full viewport height */}
                <div className="flex flex-col items-center space-y-4 gap-4"> {/* Flex layout */}
                    <div className="loader" style={{ width: '89px', height: '89px' }}></div> {/* Custom spinner */}
                    <h1 className="text-3xl font-extrabold text-center text-white animate-pulse">
                        Please wait while we check your information
                    </h1>
                </div>
                <style jsx>{`
                    .loader {
                        border: 8px solid #f3f3f3; /* Light gray */
                        border-top: 8px solid #3498db; /* Blue */
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>


            )}
            
        </div>
    );
};

export default ThirdStep;
