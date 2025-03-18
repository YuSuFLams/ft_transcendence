"use client";

import { buttonStyles, handleInputChange, InputFields, SocialLoginButton } from "../auth-utils";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaIdBadge, FaGoogle } from "react-icons/fa";
import { Si42 } from "react-icons/si";
import { Google, Intra42 } from "@/components/api/auth"; // Ensure this path is correct
import React, { useRef, useState } from "react";
import { CreateAccountAuth } from "../auth-sub"; // Ensure this path is correct
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

interface SignUpProps {
  toggleView: () => void;
  setIsCreated: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUp: React.FC<SignUpProps> = ({ toggleView, setIsCreated }) => {
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

  	return (
		<div className="flex items-center justify-center max-w-8xl w-full min-h-screen">
			<div className="flex sm:flex-row-reverse w-full max-w-[100rem] bg-[#1a1a2e] rounded-xl shadow-2xl shadow-[#5650f0]/20 overflow-hidden min-h-[80vh] max-h-7xl">
				{/* Left Side: Gaming Illustration */}
				<div className="hidden sm:flex w-[60%] items-center justify-center  p-6">
					<Image src="/tennis-rafiki.svg" alt="Sign Up Illustration" width={500} height={500} className="object-contain" priority/>
				</div>

				{/* Right Side: Form */}
				<motion.div className="w-full sm:w-1/2 p-6 md:p-8 flex flex-col justify-center space-y-6 bg-[#141424]" initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
				>
					<h1 className="text-3xl md:text-4xl text-[#5650f0] font-extrabold text-center uppercase tracking-wide">Join the Game</h1>

					<form className="space-y-6" onSubmit={(e) => CreateAccountAuth(e, inputFname, inputLname, inputEmail, inputUsername, inputPassword, 
						inputConfirmPassword, setError, setData, setLoading, toggleView, setIsCreated)}
					>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<InputFields placeholder="First Name" name="first_name" setError={setError} setData={setData} input={inputFname} error={error.first_name} badge={FaIdBadge}/>
				
							<InputFields placeholder="Last Name" name="last_name" setError={setError} setData={setData} input={inputLname} error={error.last_name} badge={FaIdBadge}/>
						</div>

						<InputFields placeholder="Username" name="username" setError={setError} setData={setData} input={inputUsername} error={error.username} badge={FaUser}/>
					
						<InputFields placeholder="Email" name="email" setError={setError} setData={setData} input={inputEmail} error={error.email} badge={FaEnvelope}/>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="relative">
					
								<InputFields placeholder="Password" name="password" setError={setError} setData={setData} input={inputPassword} error={error.password} 
									badge={hidePass ? FaEyeSlash : FaEye} type={hidePass ? "password" : "text"}
								/>
						
								<button type="button" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#5650f0]" onClick={() => setHidePass(!hidePass)}>
									{hidePass ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
								</button>
							</div>
				
							<div className="relative">
								
								<InputFields placeholder="Confirm Password" name="repassword" setError={setError} setData={setData} input={inputConfirmPassword}
									error={error.repassword} badge={hideConfirmPass ? FaEyeSlash : FaEye} type={hideConfirmPass ? "password" : "text"}
								/>
						
								<button type="button" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#5650f0]" onClick={() => setHideConfirmPass(!hideConfirmPass)}>
									{hideConfirmPass ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
								</button>
							</div>
						</div>

						{Object.values(error).some((e) => e) && 
							(<div className="flex items-center justify-center text-red-500 text-sm sm:text-base font-mono bg-gray-900/50 px-4 py-2 border border-red-500/50"> 
								[ERROR] : {Object.values(error).find((e) => e) || "Please fix the errors above."}
							</div>
						)}

						<motion.button className={`${buttonStyles} w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`} type="submit" disabled={loading}>
							{loading ? "Signing Up..." : "Sign Up"}
						</motion.button>
					</form>

					<p className="text-center text-[#e0e0e0] text-sm"> Already in the game?{" "}
						<button className="text-[#5650f0] underline hover:text-blue-700" onClick={toggleView}> Sign In </button>
					</p>

					<div className="flex items-center justify-center gap-4">
						<div className="flex-grow border-t border-[#5650f0]/50"></div>
						<span className="text-[#e0e0e0] text-sm">Or use social login</span>
						<div className="flex-grow border-t border-[#5650f0]/50"></div>
					</div>

					<div className="flex justify-around gap-4">
						<SocialLoginButton icon={FaGoogle} label="Google" onClick={() => Google(router, setError)} />
						<SocialLoginButton icon={Si42} label="Intra" onClick={() => Intra42(router, setError)} />
					</div>
				</motion.div>
      		</div>
    	</div>
  	);
};

export default SignUp;