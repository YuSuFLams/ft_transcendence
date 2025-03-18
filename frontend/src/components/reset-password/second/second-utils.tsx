import React from "react";
import { message } from "antd";
import Image from "next/image";
import Cookie from "js-cookie";
import { motion } from "framer-motion";
import pictureUser from "@/../public/Image/picture1.jpg";
import { handleSendCode, reSendCode } from "../../api/reset-password";
import { Profile } from "./second-step";

const getData = (
initializedRef: React.MutableRefObject<boolean>,
    setProfile: React.Dispatch<React.SetStateAction<Profile>>,
    setIsMe: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (!initializedRef.current) {
        initializedRef.current = true;

        const fullName = Cookie.get("full_name") || "";
        const picture = Cookie.get("picture") || "";
        const email = Cookie.get("email") || "";
        const username = Cookie.get("username") || "";

        if (!Cookie.get("is_me")) Cookie.set("is_me", JSON.stringify(0));

        setProfile({ fullName, picture, email, username });
    }
    const isMeValue = Cookie.get("is_me");

    if (isMeValue && isMeValue === "1") setIsMe(true);

    if (isMeValue && isMeValue !== "1" && isMeValue !== "0") message.error("something went wrong");
};

interface VerificationViewProps {
    code: string[];
    inputRefs: React.RefObject<(HTMLInputElement | null)[]>;
    error: Record<string, string>;
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
    handleFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    resetCode: () => void;
}

const VerificationView: React.FC<VerificationViewProps> = ({
    code, inputRefs, error, setError, handleInput, handleKeyDown, handleFocus, handlePaste, resetCode,
}) => (
    <div className="flex flex-col items-center justify-center mt-8 space-y-6 mb-12 md:mb-2 duration-300">
        <div className="flex flex-col space-y-4 items-center">
            <h1 className="text-2xl sm:text-3xl font-[Borias] font-extrabold text-white">Verify Code</h1>
            <p className="text-sm sm:text-base text-gray-300 m-2">Enter your Code here</p>
        </div>

        <div className="flex space-x-2 sm:space-x-4 items-center justify-center">
            {code.map((_, index) => (
                <input className="text-xl sm:text-2xl border border-gray-300 rounded-lg w-10 h-10 sm:w-12 sm:h-12 p-1 text-center focus:outline-none 
                    focus:ring-2 focus:ring-[#9AB5D9] text-white bg-[#142c5c] focus:border-[#9AB5D9] transition-shadow" key={index} maxLength={1}
                    onChange={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} onFocus={handleFocus} onPaste={handlePaste}
                    autoFocus={index === 0} ref={(el: HTMLInputElement | null) => {if (el && inputRefs.current) inputRefs.current[index] = el;}}
                />
            ))}
        </div>
        <div className="flex flex-col space-y-4 items-center">
            {(error.enough || error.general) && (
                <div className="flex items-center justify-center text-red-500 text-sm sm:text-base font-mono bg-gray-900/50 px-4 py-2 border border-red-500/50"> 
                [ERROR] : {error.enough || error.general} 
                </div>
            )}
            <motion.button className="px-8 py-3 bg-[#5650f0] text-[#1a1a2e] font-bold rounded-md text-[1.1em] sm:text-[1.1em] md:text-[1.2em] font-semibold
                    hover:bg-[#1a1a2e] hover:text-[#5650f0] hover:border-[#5650f0] border-2 border-transparent transition-all duration-300 ease-out uppercase tracking-wider 
                    shadow-lg shadow-[#5650f0]/30 "
                whileTap={{ scale: 0.95 }} onClick={() => handleSendCode(setError, code)}
            >
                SEND CODE
            </motion.button>

            <button className="text-[#5650f0] font-semibold underline text-sm md:text-md hover:text-[#564ff1]" onClick={() => reSendCode(setError, resetCode)}>
                Resend Code
            </button>
        </div>
    </div>
);

interface PreSendCodeProps {
    isNotMe: () => void;
    handleContinue: () => void;
    error: Record<string, string>;
    profile: Profile;
}

const PreSendCode: React.FC<PreSendCodeProps> = ({ isNotMe, handleContinue, error, profile }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 mb-4 duration-300">
            <div className="flex w-full p-2 items-center justify-between space-y-8 flex-wrap md:flex-nowrap space-x-0 md:space-x-20">
                <div className="flex items-center w-full sm:w-[50%] flex-col">
                    <h1 className="text-lg sm:text-xl md:text-2xl text-gray-300">Send Code via Email</h1>
                    
                    <div className="flex mt-2 items-center">
                        <input type="radio" checked className="text-white bg-white" readOnly />
                        <span className="ml-2 text-sm sm:text-base md:text-lg text-gray-400 line-clamp-1"> {profile.email} </span>
                    </div>
                </div>

                <div className="flex flex-col items-center md:space-y-6 justify-center text-center w-full sm:w-[50%]">
                    <Image className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-gradient-to-r border-[#DAE1E7] shadow-2xl"
                        src={pictureUser || "https://media1.tenor.com/m/tNfwApVE9RAAAAAC/orange-cat-laughing.gif"} alt="User Image" width={128} height={128}
                    />
                    <p className="text-lg sm:text-xl md:text-2xl mt-4 font-semibold text-[#B2C2D1]"> {profile.fullName !== " " ? profile.fullName : profile.username} </p>
                </div>
            </div>

            {/* Social Login Buttons */}
            <motion.div className="flex z-[50] space-x-4 md:space-x-6 justify-center mb-6 w-full">
                <motion.button className="px-4 py-2 bg-red-700 text-white border-red-900 font-bold rounded-md text-[1.1em] sm:text-[1.1em] md:text-[1.2em] font-semibold
                    hover:bg-red-900 hover:text-white hover:border-red-700 border-2 border-transparent transition-all duration-300 ease-out uppercase tracking-wider 
                    shadow-lg shadow-[#ff4d4d]/30" transition={{ type: 'spring', stiffness: 200 }} whileTap={{ scale: 0.95 }} onClick={isNotMe}
                >
                    It's not me
                </motion.button>
                <motion.button className="px-4 py-2 bg-[#5650f0] text-[#1a1a2e] font-bold rounded-md text-[1.1em] sm:text-[1.1em] md:text-[1.2em] font-semibold
                    hover:bg-[#1a1a2e] hover:text-[#5650f0] hover:border-[#5650f0] border-2 border-transparent transition-all duration-300 ease-out uppercase tracking-wider 
                    shadow-lg shadow-[#5650f0]/30" transition={{ type: 'spring', stiffness: 200 }} whileTap={{ scale: 0.95 }} onClick={handleContinue}
                >
                    Continue
                </motion.button>
            </motion.div>
            {error.general && ( <p className="text-red-600 text-center text-sm lg:mt-1 font-bold line-clamp-2"> {error.general} </p> )}
        </div>
    );
};

export { PreSendCode, VerificationView, getData };