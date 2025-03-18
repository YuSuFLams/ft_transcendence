import { handleInputChange, inputStyles, isAllSpaces, isValidInput } from "@/components/auth/auth-utils";
import { sendPassWord } from "@/components/api/reset-password2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import Cookie from "js-cookie";

const checkVisibility = (
    setPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>,
    initializedRef: React.MutableRefObject<boolean>
) => {
    const isVisible = Cookie.get("isPasswordVisible");

    if (isVisible === "1") {
        setPasswordVisible(true);
    } else if (!initializedRef.current) {
        initializedRef.current = true;
        setTimeout(() => {
            setPasswordVisible(true);
            Cookie.set("isPasswordVisible", "1");
        }, 2000);
    }
};

const handleSubmitPassword = async (
    e: React.FormEvent<HTMLFormElement>,
    isPasswordVisible: boolean,
    inputPassword: React.RefObject<HTMLInputElement | null>,
    inputConfirmPassword: React.RefObject<HTMLInputElement | null>,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    setData: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
    e.preventDefault();

    let isFormValid = true;
    const newError: Record<string, string> = {};
    const newData: Record<string, string> = {};

    const passwordValidation = isValidInput(inputPassword);
    if (!passwordValidation.valid) {
        isFormValid = false;
        newError.password = passwordValidation.error;
    } else {
        newData.password = inputPassword.current?.value || "";
    }

    const confirmPasswordValidation = isValidInput(inputConfirmPassword);
    if (!confirmPasswordValidation.valid) {
        isFormValid = false;
        newError.repassword = confirmPasswordValidation.error;
    } else {
        newData.repassword = inputConfirmPassword.current?.value || "";
    }

    setError(newError);
    setData(newData);

    if (!isFormValid) {
        for (const ref of [inputPassword, inputConfirmPassword]) {
            if (ref.current && isAllSpaces(ref.current.value)) {
                ref.current.focus();
                break;
            }
        }
        return;
    }

    if (newData.password !== newData.repassword) {
        setError((prev: any) => ({ ...prev, repassword: "Passwords do not match", general: "" }));
        return;
    }

    if (isPasswordVisible) sendPassWord(newData, setError);
};

interface PostVisibleProps {
    isPasswordVisible: boolean;
    inputPassword: React.RefObject<HTMLInputElement | null>;
    inputConfirmPassword: React.RefObject<HTMLInputElement | null>;
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    setData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    hidePass: boolean;
    error: Record<string, string>;
    hideConfirmPass: boolean;
    setHidePass: React.Dispatch<React.SetStateAction<boolean>>;
    setHideConfirmPass: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostVisible: React.FC<PostVisibleProps> = ({
    isPasswordVisible, inputPassword, inputConfirmPassword, setError, setData, hidePass, error, hideConfirmPass, 
    setHidePass, setHideConfirmPass
}) => {
    return (
        <div className="w-full h-full lg:mt-6 max-w-[600px] mx-auto space-y-6 px-4 py-6">
            <div className="text-[1.2em] sm:text-[1.3em] md:text-[1.5em] lg:text-[2em] text-[#c0c0c0] font-extrabold text-center">Enter New Password</div>

            <form className="space-y-4" method="POST"
                onSubmit={(e) => handleSubmitPassword(e, isPasswordVisible, inputPassword, inputConfirmPassword, setError, setData) } >
                <div className="flex flex-col  lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
                    <div className="flex-1">
                        <div className="relative">
                            <span className="absolute top-1/2 right-2 transform text-[#c0c0c0] -translate-y-1/2 cursor-pointer mr-2" onClick={() => setHidePass(!hidePass)}>
                                {hidePass ? <FaEyeSlash style={{ width: 20, height: 20 }} /> : <FaEye style={{ width: 20, height: 20 }} />}
                            </span>
                            <input className={inputStyles(!!error.password || !!error.general)} onChange={(e) => handleInputChange(e, setError, setData)} 
                                type={hidePass ? 'password' : 'text'} name="password" placeholder="Password" ref={inputPassword} 
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="relative">
                            <span className="absolute top-1/2 right-2 transform text-[#c0c0c0] -translate-y-1/2 cursor-pointer mr-2" onClick={() => setHideConfirmPass(!hideConfirmPass)}>
                                {hideConfirmPass ? <FaEyeSlash style={{ width: 20, height: 20 }} /> : <FaEye style={{ width: 20, height: 20 }} />}
                            </span>
                            <input onChange={(e) => handleInputChange(e, setError, setData)} type={hideConfirmPass ? 'password' : 'text'} name="repassword"
                                placeholder="Confirm Password"  ref={inputConfirmPassword} className={inputStyles(!!error.repassword || !!error.general)}
                            />
                        </div>
                    </div>
                </div>

                {(error.repassword || error.password || error.general) && (
                    <p className="text-red-600 text-sm mt-1 font-semibold line-clamp-4">{error.repassword || error.password || error.general}</p>
                )}

                <motion.div className="flex items-center justify-center">
                    <motion.button className={`relative mt-2 flex items-center justify-center w-full sm:w-[40%] md:w-[50%] px-6 py-2 md:py-3 
                        bg-gradient-to-r from-[#5650f0] to-[#564ff1] text-[#142c5c] text-lg sm:text-xl md:text-2xl rounded-[0.3em]
                        font-bold shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 whitespace-nowrap 
                        bg-[#9AB5D9] hover:shadow-2xl hover:scale-105 focus:ring-[#0e213f] focus:ring-opacity-50"} `} whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}  
                    >
                        Change Password
                    </motion.button>
                </motion.div>
            </form>
        </div>
    );
};

export { PostVisible, checkVisibility };