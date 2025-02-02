import React, { ChangeEvent } from "react";
import { handleLogin } from "../api/auth";
import { motion } from "framer-motion";

const isValidInput = (input: React.RefObject<HTMLInputElement>) => {
    const isAllSpaces = (str: string): boolean => str.trim().length === 0;
    const value = input.current?.value || "";
    
    if (input.current?.type !== "password") {
        if (value.trim() === "") {
            return { valid: false, error: "Field is required" };
        }
    } else {
        if (value.length === 0) {
            return { valid: false, error: "Field is required" };
        }
       if (isAllSpaces(value)) {
            return { valid: false, error: "Field cannot be all spaces" };
        }
        if (value.length < 8) {
                return { valid: false, error: "Password must be at least 6 characters long" };
        }
    }
    return { valid: true, error: "" };
};

const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>, 
    setData: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    inputPassword: React.RefObject<HTMLInputElement | null>,
    setInputClassName: React.Dispatch<React.SetStateAction<string>>
) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: "" }));

        if (name === "password") {
            if (value.length > 0 && value.length < 8 && inputPassword.current) {
                inputPassword.current.focus();
                setInputClassName("w-[100%] p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg border-2 border-red-500 \
                focus:ring-2 focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold font-[Font8] text-black text-2xl text-left");
            } else {
                setInputClassName("w-full p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2 \
                    focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold font-[Font8] text-black text-2xl text-left");
            }
        }
};



const handleSubmit = async ( e: React.FormEvent<HTMLFormElement>,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    input: React.RefObject<HTMLInputElement | null>, data: Record<string, string>,
    router: any, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    inputPassword: React.RefObject<HTMLInputElement | null>,
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
) => {
    e.preventDefault();
    
    setLoading(true);
    
    const emailValidation = isValidInput(input as React.RefObject<HTMLInputElement>);
    const passwordValidation = isValidInput(inputPassword as React.RefObject<HTMLInputElement>);
    const newError: Record<string, string> = {};
    
    if (!emailValidation.valid) {
        newError.email = emailValidation.error;
    }
    if (!passwordValidation.valid) {
        newError.password = passwordValidation.error;
    }

    setError(newError);

    if (Object.keys(newError).length === 0) {
        setLoading(true);
        handleLogin(data, setError, setLoading, router, setIsLogin);
        
    } else {
        setLoading(false);
    }    
};


interface LoginProps {
    toggleView: () => void;
}

const HalfSideSignUp: React.FC<LoginProps> = ({ toggleView }) => {
    return (
        <div className="flex-1 h-full bg-gradient-to-r from-[#0e213f] to-[#1a345d] rounded-l-2xl flex flex-col items-center justify-center p-8 space-y-6 shadow-lg relative">
            <div className="absolute rounded-l-2xl inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.005)_0%,rgba(0,0,0,0.4)_100%)]"></div>
            <motion.div className="flex-1 flex flex-col items-center rounded-l-2xl justify-center p-8 space-y-6 shadow-lg relative z-10"
                animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <h1 className="font-[Font3] text-3xl font-extrabold">
                    👋 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffcc00] to-[#ff6600]">Welcome Back, Champion!</span>
                </h1>
                <p className="text-white font-[Font3] text-3xl text-center max-w-md">
                    🌟 Continue your journey, connect with friends, and compete in thrilling <span className="text-[#ffcc00]">ping pong</span> matches!
                </p>
                <motion.button className="text-[#001219] bg-[#aaabbc] font-[Font3] text-3xl font-extrabold px-6 py-2 rounded-lg shadow-md 
                    transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-opacity-50 relative z-20"
                    onClick={toggleView} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} aria-label="Toggle to Sign Up"
                >
                    Sign Up
                </motion.button>
            </motion.div>
        </div>
    );
};


export {isValidInput, handleInputChange, handleSubmit, HalfSideSignUp};