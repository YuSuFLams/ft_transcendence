"use client";

import { buttonStyles, handleInputChange, InputFields, inputStyles, SocialLoginButton } from "../auth-utils";
import { FaGoogle, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { Google, Intra42 } from "@/components/api/auth";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginAccount } from "../auth-sub";
import { motion } from "framer-motion";
import { Si42 } from "react-icons/si";
import Link from "next/link";
import Image from "next/image";

interface SignInProps {
    toggleView: () => void;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignIn: React.FC<SignInProps> = ({ toggleView, setIsLogin }) => {
    const input = useRef<HTMLInputElement | null>(null);
    const inputPassword = useRef<HTMLInputElement | null>(null);
    const [data, setData] = useState<Record<string, string>>({ username: "", password: "" });
    const [error, setError] = useState<Record<string, string>>({});
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    return (
        <div className="flex items-center justify-center max-w-7xl w-full min-h-screen">
            <div className="flex sm:flex-row w-full max-w-[100rem] bg-[#1a1a2e] rounded-xl shadow-2xl shadow-[#5650f0]/20 overflow-hidden min-h-[80vh] max-h-7xl">
                {/* Left Side: Hidden on small screens, visible on lg and above */}
                <div className="hidden sm:flex w-[60%] items-center justify-center p-6">
                    <Image src={'/tennis-amico.svg'} alt="Sign Up Illustration" width={500} height={500} className="object-contain" priority/>
                </div>

                {/* Right Side: Form */}
                <motion.div className="w-full sm:w-1/2 p-6 md:p-8 flex flex-col justify-center space-y-6 bg-[#141424]" initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl md:text-4xl text-[#5650f0] font-extrabold text-center uppercase tracking-wide">Sign In</h1>

                    <div className="flex justify-around gap-4">
                        <SocialLoginButton icon={FaGoogle} label="Google" onClick={() => Google(router, setError)} />
                        <SocialLoginButton icon={Si42} label="Intra" onClick={() => Intra42(router, setError)} />
                    </div>

                    <div className="flex items-center justify-center gap-4">
						<div className="flex-grow border-t border-[#5650f0]/50"></div>
						<span className="text-[#e0e0e0] text-sm">Or use social login</span>
						<div className="flex-grow border-t border-[#5650f0]/50"></div>
					</div>

                    <form onSubmit={(e) => LoginAccount(e, setError, input, data, router, setLoading, inputPassword, setIsLogin)}
                        className="space-y-6" method="POST">

                        <InputFields setError={setError} setData={setData} input={input} error={error.username} badge={FaUser} name="username" placeholder="Email Or Username"/>

                        <div className="relative">
                            <InputFields placeholder="Password" name="password" setError={setError} setData={setData} input={inputPassword} error={error.password} 
                                badge={hidePass ? FaEyeSlash : FaEye} type={hidePass ? "password" : "text"}
                            />
                            <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#5650f0]"
                                onClick={() => setHidePass(!hidePass)} aria-label="Toggle Password Visibility"
                            >
                                {hidePass ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                            </span>
                        </div>

                        {(error.password || error.username || error.general) && (
                            <div className="flex items-center justify-center text-red-500 text-sm sm:text-base font-mono bg-gray-900/50 px-4 py-2 border border-red-500/50"> 
                            [ERROR] : {error.password || error.username || error.general} 
                            </div>
                        )}

                        <p className="flex justify-end items-center">
                            <Link className="text-[#5650f0] font-bold text-md md:text-md underline hover:text-[#564ff1]" href="/reset-password">
                                Forgot password?
                            </Link>
                        </p>

                        <motion.button className={`${buttonStyles} w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`} type="submit" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </motion.button>
                    </form>
                    
                    <div className="z-[50] flex items-center justify-center">
                        <p className="text-[#c0c0c0] text-extrabold text-sm md:text-md"> Don't have an account?{" "}
                            <button className="text-[#5650f0] underline text-sm md:text-md hover:text-[#564ff1]" onClick={toggleView}> Sign Up </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SignIn;