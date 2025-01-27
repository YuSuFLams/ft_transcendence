"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { message } from "antd";
import { CheckCircleOutlined } from '@ant-design/icons';

interface Profile {
    picture: string;
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
    
            const fullName = sessionStorage.getItem('full_name') || '';
            const picture = sessionStorage.getItem('picture') || '';
            const email = sessionStorage.getItem('email') || '';
    
            // Only set 'is_me' if it hasn't been set yet
            if (!sessionStorage.getItem('is_me')) {
                sessionStorage.setItem('is_me', JSON.stringify(0));  
            }
    
            setProfile({ fullName, picture, email });
        }
    }, []);
    
    useEffect(() => {
        const isMeValue = sessionStorage.getItem('is_me');
        if (isMeValue && isMeValue === '1') {
            setIsMe(true); // Parse the value or set default to 0
        }
        if (isMeValue && (isMeValue !== '1' && isMeValue !== '0')) {
            sessionStorage.clear();
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
        // Check if any of the inputs are empty
        if (code.some(digit => digit === '')) {
            setError((prev) => ({ ...prev, enough: 'Not enough digits', general: '', time: ''  }));
            return;
        }
    
        // Check if any of the inputs are not digits
        if (code.some(digit => !/^\d$/.test(digit))) {
            setError((prev) => ({ ...prev, enough: 'Invalid character. Only digits are allowed.', general: '', time: '' }));
            return;
        }
    
        // Clear the error if inputs are valid
        setError((prev) => ({ ...prev, enough: '' }));
        const username = sessionStorage.getItem('username');
        console.log("username", username);
        const response = await fetch('http://127.0.0.1:9003/secure/reset-password/verify/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"account": username, "code": code.join('') }),
        });
        
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            // Set error message from response or default message
            setError({ general: errorData.error || "An unexpected error occurred.", time: errorData.time || '' });
            return;
        }
        
        // Parse the response JSON if the request was successful
        const responseData = await response.json();
        sessionStorage.setItem('token', responseData.token);
        console.log(responseData); // Handle success response if needed
        sessionStorage.setItem('step', '2'); // Mark step 1 as completed
        message.info("Your code has been successfully sent. Please hold on for the next step.", 3); // 2 seconds duration
        
        // Log the current code state to the console
        console.log("Entered Code:", code.join(''));
    };

    const reSendCode = async () => {
        setError((prev) => ({ ...prev, enough: '', general: '' }));
        const username = sessionStorage.getItem('username');
        const response = await fetch('http://127.0.0.1:9003/secure/reset-password/send/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ account: username }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            setError({ general: errorData.error || "An unexpected error occurred.", time: errorData.time || '' });
            return;
        }

        resetCode();
        const data = await response.json();
        message.info({
            content: data.success,
            icon: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />,
            duration: 5,
        });
    };

    const isNotMe = () => {
        sessionStorage.clear();
    };

    const handleContinue = async () => {
        try {
            const username = sessionStorage.getItem('username');
            const response = await fetch('http://127.0.0.1:9003/secure/reset-password/send/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ account: username }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError({ general: errorData.error || "An unexpected error occurred.", time: errorData.time || '' });
                return;
            }

            const responseData = await response.json();
            if (responseData.success){
                sessionStorage.setItem('is_me', JSON.stringify(1));
                message.success(responseData.success);
            }
            toggleView();
            console.log(responseData);
        } catch (error) {
            console.error("Error during fetch:", error);
            setError({ general: "An unexpected error occurred." });
        }
    };

    return (
        <div className="flex flex-col items-center">
            {!isMe ? (
                <div className="flex flex-col items-center justify-center md:space-y-12 space-y-8 mb-4 duration-300">
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
                                src={profile.picture || "https://media1.tenor.com/m/tNfwApVE9RAAAAAC/orange-cat-laughing.gif"}
                                alt="User Image"
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gradient-to-r border-[#DAE1E7] shadow-2xl"
                            />
                            <p className="lg:text-3xl md:text-2xl text-xl  mt-4 font-semibold text-white">{profile.fullName}</p>
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
                        {error.general && <p className="text-red-600 text-center text-sm lg:mt-1 font-bold line-clamp-2">{error.general} {error.time}</p>}
                    </motion.div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center mt-8 space-y-6 mb-12 md:mb-2 duration-300">
                    <div className="flex flex-col space-y-4 items-center">
                        <h1 className="text-3xl font-extrabold text-white">Verify Code</h1>
                        <p className="text-base text-gray-300 m-2">Enter your Code here</p>
                    </div>
                    <div className="flex md:space-x-2 space-x-1 items-center justify-center">
                        {code.map((_, index) => (
                            <input
                                key={index}
                                className="text-2xl border border-gray-300 rounded-lg md:w-12 md:h-12 w-10 h-10 p-0 text-center focus:outline-none focus:ring-2 focus:ring-[#b6a972] 
                                focus:border-[#b6a972] transition-shadow"
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
                        {error.general && <p className="text-red-600 text-center text-sm lg:mt-1 font-bold line-clamp-2">{error.general} {error.time}</p>}
                        <motion.button
                            className="w-[150px] bg-[#b6a972] text-[#142c5c] px-4 py-3 rounded-lg font-semibold shadow-md transition-transform"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSendCode}
                            disabled={loading}
                            >
                            {loading ? 'Loading...' : 'SEND CODE'}
                        </motion.button>
                        <button className="text-base font-medium text-gray-400 underline hover:text-white transition" onClick={reSendCode}>
                            Resend Code
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecondStep;
