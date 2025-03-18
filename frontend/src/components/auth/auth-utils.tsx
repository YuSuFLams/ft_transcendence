import React from "react"
import { ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BiSolidLogIn, BiSolidUserPlus } from "react-icons/bi";

// Input styles with a gaming vibe
export const inputStyles = (error: boolean) => `
	w-full px-4 py-3 rounded-md focus:outline-none placeholder:text-md placeholder:text-[#8a8a8a] text-[#e0e0e0] text-md md:text-lg bg-[#1a1a2e] 
	border  transition-all duration-200 ${error ? "border-red-500" : "border-[#5650f0] shadow-md shadow-[#5650f0]/20 focus:ring-2 focus:ring-[#5650f0] focus:ring-opacity-50"}  
`;

// Button styles with neon glow and gaming flair
export const buttonStyles = `
	w-full px-6 py-2 bg-[#5650f0] text-[#1a1a2e] font-bold rounded-md text-lg md:text-xl hover:bg-[#1a1a2e] hover:text-[#5650f0] hover:border-[#5650f0] 
	border-2 border-transparent transition-all duration-300 ease-out uppercase tracking-wider shadow-lg shadow-[#5650f0]/30
`;

interface NotificationProps {
	showNotification: boolean;
	isLogin: boolean;
}

export const Notification: React.FC<NotificationProps> = ({ showNotification, isLogin }) => {
	return (
		<AnimatePresence>
			{showNotification && (
				<motion.div className="fixed top-10 right-10 bg-[#1a1a2e] text-[#e0e0e0] px-6 py-3 rounded-md shadow-xl border border-[#5650f0]/50"
          			initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}
        		>
          			<div className="flex items-center gap-3">
						<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} >
              				{isLogin ? <BiSolidLogIn className="text-[#5650f0] w-6 h-6" /> : <BiSolidUserPlus className="text-[#5650f0] w-6 h-6" />}
            			</motion.div>
            			<p className="text-md font-semibold"> {isLogin ? "Logged In Successfully!" : "Account Created!"}</p>
          			</div>
        		</motion.div>
      		)}
    	</AnimatePresence>
  	);
};

export const isAllSpaces = (str: string): boolean => {return str.trim().length === 0;};

export const isValidInput = (input: React.RefObject<HTMLInputElement | null>) => {
	const value = input.current?.value || "";
	if (input.current?.type !== "password" && input.current?.type !== "repassword") {
		if (value.trim() === "") return { valid: false, error: "Field is required" };
		if (isAllSpaces(value)) return { valid: false, error: "Field does not accept all spaces" };
	}
	if (input.current?.name === "repassword" || input.current?.name === "password") {
		if (value.length === 0) return { valid: false, error: "Field is required" };
		if (isAllSpaces(value)) return { valid: false, error: "Field cannot be all spaces" };
		if (value.length < 8) return { valid: false, error: "Password must be at least 8 characters long" };
	}
	return { valid: true, error: "" };
};

export const handleInputChange = (
  e: ChangeEvent<HTMLInputElement>,
  setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  setData: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
  const { name, value } = e.target;
  setData((prev) => ({ ...prev, [name]: value }));
  setError((prev) => ({ ...prev, [name]: "", general: "" }));
};

interface SocialLoginButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ icon: Icon, label, onClick }) => (
    <motion.button className="w-[35%] xs:w-auto px-4 py-2 bg-[#1a1a2e] text-[#5650f0] border-2 border-[#5650f0] rounded-md hover:bg-[#5650f0] hover:text-[#1a1a2e] 
        transition-all duration-300 md:text-lg font-bold uppercase tracking-wide flex items-center justify-center gap-2 shadow-md shadow-[#5650f0]/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      	onClick={onClick} aria-label={`Sign in with ${label}`}
    >
      	<Icon className="w-7 h-7" />
      	<span>{label}</span>
    </motion.button>
);

interface InputFieldsProps {
	setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	setData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	input: React.RefObject<HTMLInputElement | null>;
	error: string;
	badge: React.ComponentType<{ className?: string }>;
	name: string;
	placeholder: string;
	type?: string;
}

export const InputFields: React.FC<InputFieldsProps> = ({
  	setError, setData, input, error, badge: Badge, name, placeholder, type = "text",
}) => (
	<div className="relative">
		<input onChange={(e) => handleInputChange(e, setError, setData)} className={inputStyles(!!error)} placeholder={placeholder} name={name} ref={input} type={type}/>
		<span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#5650f0]"> <Badge className="w-5 h-5" /> </span>
	</div>
);