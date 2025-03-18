"use client";

import { motion } from "framer-motion";
import Cookie from 'js-cookie';
import { useEffect, useRef, useState } from "react";
import { handleSubmit } from "../../api/reset-password";
import { buttonStyles, InputFields } from "@/components/auth/auth-utils";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

export const removeAllData = () => {
    Cookie.remove("step");
    Cookie.remove("username");
    Cookie.remove("full_name");
    Cookie.remove("email");
    Cookie.remove("code");
    Cookie.remove("picture");
    Cookie.remove("is_me");
    Cookie.remove("isPasswordVisible");
    Cookie.remove("isSuccessful");
};

const FirstStep = () => {
    const input = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Record<string, string>>({});
    const [error, setError] = useState<Record<string, string>>({});
    const router = useRouter();

    useEffect(() => {
        removeAllData();
    }, []);

    return (
        <div className="flex h-full relative bg-[#011C40] rounded-b-xl flex-col space-y-2 items-center justify-center">
            <motion.div className="w-[90%] max-w-[600px] space-y-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

                <div className="text-[1.2em] mt-4 sm:text-[1.3em] md:text-[1.8em] lg:text-[2em] text-[#c0c0c0] font-extrabold text-center"> Forgot Your Password? </div>

                <form className="space-y-4" onSubmit={(e) => handleSubmit(e, input, setError, setLoading)}>
                    <InputFields setError={setError} setData={setData} input={input} error={error.email || error.general} badge={FaUser} name="email" placeholder="Email" />

                    {(error.email || error.general) && (
                        <div className="flex items-center justify-center text-red-500 text-sm sm:text-base font-mono bg-gray-900/50 px-4 py-2 border border-red-500/50"> 
                        [ERROR] : {error.email || error.general} 
                        </div>
                    )}
                        
                    <div>
                        <motion.div className="flex items-center justify-center">
                            <motion.button className={`${buttonStyles} ${loading ? "cursor-not-allowed text-sm px-2" : ""}`}
                                style={loading ? { opacity: 0.5 } : {}} whileTap={{ scale: 0.95 }} aria-label="Sign In" disabled={loading} type="submit"
                            >
                                {loading ? "Processing..." : "Send"}
                            </motion.button>
                        </motion.div>
                    </div>
                </form>

                <div className="z-[50] flex items-center justify-center">
                    <p className="text-[#c0c0c0] text-extrabold text-sm md:text-md"> Wait, I remember my password... {" "}
                        <button className="text-[#5650f0] underline text-sm md:text-md hover:text-[#564ff1]" onClick={() => router.push("/login-signup")}> Click here </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default FirstStep;