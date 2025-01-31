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


const ThirdStep = () => {
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [hideConfirmPass, setHideConfirmPass] = useState<boolean>(true);
    const [data, setData] = useState<Record<string, string>>({});
    const [error, setError] = useState<Record<string, string>>({});
    const inputPassword = useRef<HTMLInputElement>(null);
    const inputConfirmPassword = useRef<HTMLInputElement>(null); // Fixed typo here
    const [loading, setLoading] = useState(false);
    const [inputClassName, setInputClassName] = useState("w-[100%] p-3 lg:px-4 lg:py-4 \
        rounded-lg shadow-md focus:outline-none placeholder:text-xl text-black \
        focus:ring-2 focus:ring-[#b6a972] focus:ring-opacity-50");
    const [inputClassName1, setInputClassName1] = useState("w-[100%] p-3 lg:px-4 lg:py-4 \
        rounded-lg shadow-md focus:outline-none \
        placeholder:text-xl focus:ring-2 focus:ring-[#b6a972] focus:ring-opacity-50");
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
                setInputClassName("w-[100%] px-4 py-4 text-black rounded-lg shadow-md focus:outline-none placeholder:text-xl border-2 border-red-500");
            } else {
                setInputClassName("w-[100%] px-4 py-4 text-black rounded-lg shadow-md focus:outline-none placeholder:text-xl focus:ring-2 focus:ring-[#142c5c] focus:ring-opacity-50");
            }
        }
        else if (name === "repassword") { // Changed name to repassword
            if (value.length > 0 && value.length < 6 && inputConfirmPassword.current) {
                inputConfirmPassword.current.focus();
                setInputClassName1("w-[100%] px-4 py-4 text-black rounded-lg shadow-md focus:outline-none placeholder:text-xl border-2 border-red-500");
            } else {
                setInputClassName1("w-[100%] px-4 py-4 text-black rounded-lg shadow-md focus:outline-none placeholder:text-xl focus:ring-2 focus:ring-[#b6a972] focus:ring-opacity-50");
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
                const email = Cookie.get('email');
                const data_data = {
                    'email': email,
                    "new_password1": newData.password,
                    "new_password2": newData.repassword
                }
                console.log(data_data);
                const response = await axios.post(`http://localhost:8000/api/users/reset_mail_success/`,data_data, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
    
                console.log("response", response.data);
                if (response.status === 200) {
                    Cookie.set('step', '3'); // Mark step 1 as completed
                    Cookie.set('isSuccessful', 'true');
                }
                else {
                    const errorData = await response.data;
                    message.error(`Error: ${errorData.error}`);
                    setError({ general: errorData.error || "An unexpected error occurred." });
                }   
                
            } catch (error) {
                message.error(`Error: ${error}`);
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
        <div className="w-full h-full md:mt-0 rounded-r-2xl flex flex-col items-center justify-center space-y-6 mb-16">
        
            {isPasswordVisible ? (
                <div className=" w-[70%]">
                    <div className="w-full flex justify-center items-center flex-col mb-8 ">
                        <h1 className="text-3xl font-extrabold text-center text-white"> Enter New Password </h1>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <div className="flex-1 relative">
                                <span
                                    className="absolute text-black top-1/2 right-2 transform -translate-y-1/2 cursor-pointer mr-2"
                                    onClick={() => setHidePass(!hidePass)}
                                    >
                                    {hidePass ? <FaEyeSlash style={{width:22,height:22}}  /> : <FaEye style={{width:22,height:22}}  />}
                                </span>
                                <input
                                    type={hidePass ? 'password' : 'text'}
                                    name="password"
                                    placeholder="Password"
                                    className={inputClassName} // Use the dynamic class name
                                    ref={inputPassword}
                                    onChange={handleInputChange}
                                    />
                            </div>
                            {error.password && <p className="text-red-600 text-sm mt-2 font-bold line-clamp-2">{error.password}</p>}
                        </div>

                        <div>
                            <div className="flex-1 relative">
                                <span
                                    className="absolute text-black top-1/2 right-2 transform -translate-y-1/2 cursor-pointer mr-2"
                                    onClick={() => setHideConfirmPass(!hideConfirmPass)}
                                    >
                                    {hideConfirmPass ? <FaEyeSlash style={{width:22,height:22}}  /> : <FaEye style={{width:22,height:22}}  />}
                                </span>
                                <input
                                    type={hideConfirmPass ? 'password' : 'text'}
                                    name="repassword"
                                    placeholder="Confirm Password"
                                    className={inputClassName1} // Use the dynamic class name
                                    ref={inputConfirmPassword}
                                    onChange={handleInputChange}
                                    />
                            </div>
                            {error.repassword && <p className="text-red-600 text-sm mt-2 font-bold line-clamp-2">{error.repassword}</p>}
                        </div>
                        {error.general && <p className="text-red-600 text-center text-sm lg:mt-1 font-bold line-clamp-2">{error.general}</p>}
                        <motion.div className="flex items-center justify-center">
                            <motion.button
                                    className="w-[170px] bg-[#b6a972] text-[#142c5c] px-4 py-3 rounded-lg font-semibold shadow-md transition-transform"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={loading}
                                >
                                {loading ? 'Submitting...' : 'Change Password'}
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
