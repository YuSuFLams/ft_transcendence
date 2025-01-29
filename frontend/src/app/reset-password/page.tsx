"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Cookie from 'js-cookie';
import axios from 'axios';

const FirstStep = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ account: "" });
    const [error, setError] = useState<Record<string, string>>({});

    useEffect(() => {
        Cookie.remove("step");
        Cookie.remove("username");
        Cookie.remove("full_name");
        Cookie.remove("picture");
        Cookie.remove("email");
    }, []);

    const isValidInput = (value: string) => {
        if (value.trim() === "") return { valid: false, error: "Field is required" };
        return { valid: true, error: "" };
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setData({ account: value });
        setError((prev) => ({ ...prev, input: "" }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const value = inputRef.current?.value || "";
        const inputValidation = isValidInput(value);

        if (!inputValidation.valid) {
            setError((prev) => ({ ...prev, input: inputValidation.error }));
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const token = Cookie.get("access");
            if (!token) {
                setError({ general: "An unexpected error occurred." });
                return;
            }
            const response = await axios.get(`http://localhost:8000/secure/reset-password/locate/?account=${value}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status !== 200) {
                const errorData = response.data;
                setError({ general: errorData.error || "An unexpected error occurred.", time: errorData.time || "",});
                return;
            }

            const responseData = response.data;

            Cookie.set("step", "1");
            Cookie.set("username", value);
            Cookie.set("full_name", responseData.success.full_name);
            Cookie.set("picture", responseData.success.picture);
            Cookie.set("email", responseData.success.email);
        } catch (error) {
            console.error("Error during fetch:", error);
            setError({ general: "An unexpected error occurred." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 flex flex-col space-y-2 items-center justify-center mb-8">
            <motion.div className="w-[90%] max-w-[600px] space-y-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                
                <div> <h2 className="text-4xl font-[Borias] font-bold text-black text-center">Reset Password</h2> </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center space-y-2">
                        <input className="w-[90%] px-4 py-3 text-2xl font-[Font6] text-gray-800 rounded-lg border border-gray-300 focus:ring-[#142c5c]
                            focus:outline-none focus:ring-2 font-extrabold focus:ring-opacity-50" placeholder=" Email or username" type="text"
                            ref={inputRef} name="input" value={data.account} onChange={handleInputChange}
                        />
                        <div>
                        {error.input && <p className="text-red-600 text-center font-[Font6] text-sm font-bold line-clamp-2">{error.input}</p>}
                        </div>
                    </div>

                    <motion.div className="flex items-center justify-center">
                        <motion.button className="items-center w-[40%] h-[56px] font-[Font6] text-white bg-[#0e213f] px-8 py-3 rounded-xl 
                            font-semibold shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg focus:outline-none 
                            focus:ring-2 focus:ring-[#aaabbc] focus:ring-opacity-50" whileHover={{ scale: 1.05 }} style={{ opacity: loading ? 0.5 : 1 }}
                            type="submit" whileTap={{ scale: 0.95 }} disabled={loading} aria-label="Reset Password"
                        >
                            {loading ? "Processing..." : "Send"}
                        </motion.button>
                    </motion.div>
                </form>

                <div className="flex font-[Font6] items-center text-white space-x-1 mb-4 ml-6">
                    <p className="text-md">Remember your password?</p>
                    <Link className="text-lg font-semibold text-blue-500 hover:text-blue-600 hover:underline transition duration-300 ease-in-out" href="/login-signup">
                        Sign In
                    </Link>
                </div>
            </motion.div>
            <div>
                {error.general && (<p className="text-red-600 text-center space-x-2 font-[Font6] text-lg font-bold line-clamp-2"> {error.general} {error.time}</p>)}
            </div>
        </div>
    );
};

export default FirstStep;
