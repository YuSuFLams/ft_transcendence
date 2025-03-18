import pictureUser from "@/../public/Image/picture1.jpg";
import { Profile } from "./second/second-step";
import { motion } from "framer-motion";
import Image from "next/image";
import Cookie from "js-cookie";
import { message } from "antd";

const getData = (
    initializedRef: React.RefObject<boolean>, setProfile: React.Dispatch<React.SetStateAction<Profile>>, setIsMe: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (!initializedRef.current) {
        initializedRef.current = true;

        const fullName = Cookie.get("full_name") || "";
        const picture = Cookie.get("picture") || "";
        const email = Cookie.get("email") || "";
        const username = Cookie.get("username") || "";

        if (!Cookie.get("is_me")) {
            Cookie.set("is_me", JSON.stringify(0));
        }

        setProfile({ fullName, picture, email, username });
    }
    const isMeValue = Cookie.get("is_me");
    if (isMeValue && isMeValue === "1") {
        setIsMe(true);
    }
    if (isMeValue && isMeValue !== "1" && isMeValue !== "0") {
        message.error("something went wrong");
    }
};

const PreVisible: React.FC<{}> = ({}) => {
    return (
        <div className="absolute inset-0 mt-8 space-y-12 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div className="absolute inset-0 w-full h-full bg-blue-500 opacity-30 blur-xl rounded-full" 
                    animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                ></motion.div>

                <motion.div className="w-20 h-20 border-[6px] border-gray-700 border-t-blue-500 rounded-full shadow-lg" 
                    animate={{ rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                ></motion.div>
            </div>

            <motion.h1 className="text-[1.3em] md:text-[1.5em] lg:text-[1.7em] text-[1.8em] font-extrabold text-center text-white tracking-wide"
                animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
                Checking your information...
            </motion.h1>
        </div>
    );
};

interface PreSendCodeProps {
    profile: Profile;
    isNotMe: () => void;
    handleContinue: () => void;
    error: { [key: string]: string };
}

const PreSendCode: React.FC<PreSendCodeProps> = ({ profile, isNotMe, handleContinue, error }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 mb-4 duration-300">
            <div className="flex w-full p-2 items-center justify-between space-y-8 flex-wrap md:flex-nowrap space-x-0 md:space-x-20">
                <div className="flex items-center w-full sm:w-[50%] flex-col">
                    <h1 className="text-xl sm:text-2xl md:text-3xl text-white">Send Code via Email</h1>
                    <div className="flex mt-2 items-center">
                        <input type="radio" checked className="text-white bg-white" readOnly />
                        <span className="ml-2 text-sm sm:text-base md:text-lg text-gray-300 line-clamp-1">
                            {profile.email}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-center md:space-y-6 justify-center text-center w-full sm:w-[50%]">
                    <Image
                        src={pictureUser || "/Image/default_img.png"}
                        width={128}
                        height={128}
                        alt="User Image"
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-gradient-to-r border-[#DAE1E7] shadow-2xl"
                    />
                    <p className="text-xl sm:text-2xl md:text-3xl mt-4 font-semibold text-white">
                        {profile.fullName !== " " ? profile.fullName : profile.username}
                    </p>
                </div>
            </div>

            <motion.div className="flex-col space-y-4 justify-center items-center w-full">
                <motion.div className="flex justify-center lg:space-x-60 md:space-x-20 space-x-4 sm:space-x-12 items-center w-full">
                    <motion.button
                        className="w-[100px] sm:w-[120px] h-[40px] sm:h-[44px] bg-white text-black text-sm sm:text-md md:text-xl rounded-lg shadow flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={isNotMe}
                    >
                        It's not me
                    </motion.button>

                    <motion.button
                        className="w-[100px] sm:w-[120px] h-[40px] sm:h-[44px] bg-[#1778ff] text-white text-sm sm:text-md md:text-xl rounded-lg shadow flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={handleContinue}
                    >
                        Continue
                    </motion.button>
                </motion.div>
                {error.general && (
                    <p className="text-red-600 text-center text-sm lg:mt-1 font-bold line-clamp-2">
                        {error.general}
                    </p>
                )}
            </motion.div>
        </div>
    );
};


export { PreSendCode, getData, PreVisible };