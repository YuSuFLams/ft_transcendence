"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { message } from "antd";
import Cookie from 'js-cookie';
import { CheckCircleOutlined } from '@ant-design/icons';
import axios, { AxiosError } from "axios";
import pictureUser from "@/../public/Image/picture1.jpg";
import { removeAllData } from "../page";

interface Profile {
    picture: string;
    username: string;
    fullName: string;
    email: string;
}

const SecondStep = () => {
    const [isMe, setIsMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Record<string, string>>({});
    const [profile, setProfile] = useState<Profile>({} as Profile);
    const initializedRef = useRef(false);
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;
    
            const fullName = Cookie.get('full_name') || '';
            const picture = Cookie.get('picture') || '';
            const email = Cookie.get('email') || '';
            const username = Cookie.get('username') || '';
    
            // Only set 'is_me' if it hasn't been set yet
            if (!Cookie.get('is_me')) {
                Cookie.set('is_me', JSON.stringify(0));  
            }
    
            setProfile({ fullName, picture, email, username });
        }
    }, []);
    
    useEffect(() => {
        const isMeValue = Cookie.get('is_me');
        if (isMeValue && isMeValue === '1') {
            setIsMe(true); // Parse the value or set default to 0
        }
        if (isMeValue && (isMeValue !== '1' && isMeValue !== '0')) {
            
            message.error('something went wrong');
        }
    }, []); // Empty dependency array ensures this runs only on mount
    
            

    const toggleView = () => setIsMe((prev) => !prev);

    const resetCode = () => {
        inputRefs.current.forEach((ref) => {
            if (ref) ref.value = '';
        });
        setCode(Array(6).fill(''));
        inputRefs.current[0]?.focus();
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const input = e.target;
        const nextInput = inputRefs.current[index + 1];
        const newCode = [...code];

        newCode[index] = input.value;
        setCode(newCode);

        if (input.value && nextInput) nextInput.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const input = e.currentTarget;
        const previousInput = inputRefs.current[index - 1];

        if ((e.key === 'Backspace' || e.key === 'Delete') && !input.value) {
            e.preventDefault();
            setCode((prevCode) => {
                const newCode = [...prevCode];
                newCode[index] = '';
                return newCode;
            });
            if (previousInput) previousInput.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedCode = e.clipboardData.getData('text').slice(0, 6);
        if (pastedCode.length === 6) {
            setCode([...pastedCode.split('')]);
            inputRefs.current.forEach((inputRef, index) => {
                if (inputRef) inputRef.value = pastedCode.charAt(index);
            });
        }
    };
    const handleSendCode = async () => {
        if (code.some(digit => digit === '')) {
            setError((prev) => ({ ...prev, enough: 'Not enough digits', general: '' }));
            return;
        }
    
        if (code.some(digit => !/^\d$/.test(digit))) {
            setError((prev) => ({ ...prev, enough: 'Invalid character. Only digits are allowed.', general: '', time: '' }));
            return;
        }
    
        const email = Cookie.get('email');
        if (!email) {
            setError({ general: "Email is missing. Please try again." });
            return;
        }
    
        const code_reset = code.join('');
        if (code_reset.length !== 6) {
            setError({ general: "Code must be 6 digits long." });
            return;
        }
    
        const data_data = { "email": email, "code": code_reset };
        console.log("Sending Data:", data_data);
    
        try {
            const response = await axios.post("http://localhost:8000/api/users/reset_password_check/", data_data, {
                headers: { "Content-Type": "application/json" },
            });
    
            console.log(response.data);
            Cookie.set("step", "2");
            Cookie.set("code", code_reset);
            message.info("Your code has been successfully sent. Please hold on for the next step.", 3);
        } catch (error: unknown) {
            console.error("Axios error:", error);
    
            if (error instanceof AxiosError) {
                setError({ general: error.response?.data.error || "An unexpected error occurred." });
            } else if (axios.isAxiosError(error) && error.request) {
                setError({ general: "No response from server. Please check your connection." });
            } else {
                setError({ general: "Something went wrong. Please try again later." });
            }
        }
    };
    

    const reSendCode = async () => {
        setError((prev) => ({ ...prev, enough: '', general: '' }));
        // const username = Cookie.get('username');
        const data_data = {"email": Cookie.get('email')};
        const response = await axios.post(`http://localhost:8000/api/users/reset_password/`,data_data, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.status !== 200) {
            const errorData = response.data;
            setError({ general: errorData.Error || "An unexpected error occurred."});
            return;
        }

        console.log("response", response.data);
        resetCode();
        const data = await response.data;
        message.info({
            content: data || "Code sent successfully",
            icon: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />,
            duration: 5,
        });
    };

    const isNotMe = () => {
        removeAllData();
    };

    const handleContinue = async () => {
        try {
            const data_data = { email: Cookie.get("email") };
            const response = await axios.post("http://localhost:8000/api/users/reset_password/",
                data_data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            
            const responseData = response.data;
            if (response.status === 200) {
                console.log("response", response.data);
                Cookie.set("is_me", JSON.stringify(1));
                message.success(responseData);
                toggleView();
            } else {
                setError({
                    general: responseData.Error || "An unexpected error occurred.",
                    time: responseData.time || "",
                });
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data);
                setError({
                    general:
                        error.response?.data?.Error || "An unexpected error occurred.",
                });
            } else {
                console.error("Unexpected error:", error);
                setError({ general: "An unexpected error occurred." });
            }
        }
    };
    

    return (
        <div className="flex flex-col items-center">
            {!isMe ? (
                <div className="flex flex-col items-center justify-center space-y-8 mb-4 duration-300">
                    
                    
                    <div className="flex w-full p-2 items-center justify-between space-y-8 flex-wrap md:flex-nowrap space-x-0 md:space-x-20"> {/* Space-x-0 for mobile, md:space-x-8 for larger screens */}
                        <div className="flex items-center w-full sm:w-[50%] flex-col">
                            <h1 className="lg:text-2xl md:text-3xl sm:text-lg text-white">Send Code via Email</h1>
                            <div className="flex mt-2 items-center">
                                <input type="radio" checked className="text-white bg-white" readOnly />
                                <span className="ml-2 md:text-lg text-gray-300 line-clamp-1">{profile.email}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:space-y-6 justify-center text-center w-full sm:w-[50%]">
                            <Image
                                width={128}
                                height={128}
                                src={pictureUser || "https://media1.tenor.com/m/tNfwApVE9RAAAAAC/orange-cat-laughing.gif"}
                                alt="User Image"
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gradient-to-r border-[#DAE1E7] shadow-2xl"
                            />
                            <p className="lg:text-3xl md:text-2xl text-xl  mt-4 font-semibold text-white">{profile.fullName !== ' '? profile.fullName : profile.username}</p>
                        </div>
                    </div>



                    <motion.div className="flex-col space-y-4 justify-center items-center w-full">
                        <motion.div className="flex justify-center  lg:space-x-60 md:space-x-20 space-x-12 items-center w-full">
                            <motion.button
                                className="w-[120px] h-[44px] bg-white text-black text-md md:text-xl rounded-lg shadow flex items-center justify-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                onClick={isNotMe}
                            >
                                It's not me
                            </motion.button>
                            <motion.button
                                className="w-[120px] h-[44px] bg-[#1778ff] text-white text-md md:text-xl rounded-lg shadow flex items-center justify-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                onClick={handleContinue}
                            >
                                Continue
                            </motion.button>
                        </motion.div>
                        {error.general && <p className="text-red-600 text-center text-sm lg:mt-1 font-bold line-clamp-2">{error.general}</p>}
                    </motion.div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center mt-8 space-y-6 mb-12 md:mb-2 duration-300">
                    <div className="flex flex-col space-y-4 items-center">
                        <h1 className="text-3xl font-extrabold text-white">Verify Code</h1>
                        <p className="text-base text-gray-300 m-2">Enter your Code here</p>
                    </div>
                    <div className="flex md:space-x-4 space-x-2 items-center justify-center">
                        {code.map((_, index) => (
                            <input
                                key={index}
                                className="text-2xl border border-gray-300 rounded-lg md:w-12 md:h-12 w-10 h-10 p-1 text-center focus:outline-none 
                                focus:ring-2 focus:ring-[#9AB5D9] text-white bg-[#142c5c]
                                focus:border-[#9AB5D9] transition-shadow"
                                maxLength={1}
                                ref={(el: HTMLInputElement | null) => {
                                    if (el) inputRefs.current[index] = el;
                                }}
                                onChange={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onFocus={handleFocus}
                                onPaste={handlePaste}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col space-y-4 items-center">
                        {error.enough && (
                            <p className="text-sm font-semibold text-red-600 text-center">{error.enough}</p>
                        )}
                        {error.general && <p className="text-red-600 text-center text-sm lg:mt-1 font-bold line-clamp-2">{error.general}</p>}
                        <motion.button
                            className="w-[150px] bg-[#b6a972] text-[#142c5c] px-4 py-3 rounded-lg font-semibold shadow-md transition-transform"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSendCode}
                            disabled={loading}
                            >
                            {loading ? 'Loading...' : 'SEND CODE'}
                        </motion.button>
                        <button className="text-base font-medium text-gray-400 underline hover:text-white transition" 
                        onClick={reSendCode}
                        >
                            Resend Code
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecondStep;
