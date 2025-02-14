import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { ChangeEvent } from "react";
import Cookie from "js-cookie";
import { sendPassWord } from "../../api/reset-password2";
import { handleInputChange } from "../../auth/sign-up/sign-up_utils";

const isAllSpaces = (str: string): boolean => {
    return str.trim().length === 0;
};

const isValidInput = (input: React.RefObject<HTMLInputElement>) => {
    const value = input.current?.value || "";

    if (input.current?.type === "password") {
        if (value.length === 0) return { valid: false, error: "Both Fields are required" };

        if (isAllSpaces(value)) return { valid: false, error: "Field does not accept all spaces" };

        if (value.length < 6) return { valid: false, error: "Password must be at least 6 characters long" };
    }
    return { valid: true, error: "" };
};

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
    inputPassword: React.RefObject<HTMLInputElement>,
    inputConfirmPassword: React.RefObject<HTMLInputElement>,
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
    inputPassword: React.RefObject<HTMLInputElement>;
    inputConfirmPassword: React.RefObject<HTMLInputElement>;
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    setData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    hidePass: boolean;
    loading: boolean;
    error: Record<string, string>;
    hideConfirmPass: boolean;
    setHidePass: React.Dispatch<React.SetStateAction<boolean>>;
    setHideConfirmPass: React.Dispatch<React.SetStateAction<boolean>>;
    inputClassName: string;
    inputClassName1: string;
    setInputClassName: React.Dispatch<React.SetStateAction<string>>;
    setInputClassName1: React.Dispatch<React.SetStateAction<string>>;
}

const PostVisible: React.FC<PostVisibleProps> = ({
    isPasswordVisible, inputPassword, inputConfirmPassword, setError, setData, hidePass, loading, error, hideConfirmPass, 
    setHidePass, setHideConfirmPass, inputClassName, inputClassName1, setInputClassName, setInputClassName1
}) => {
    return (
        <div className="w-full max-w-[500px] mx-auto space-y-4 px-4 py-6">
            <div className="w-full flex flex-col items-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-[Borias] font-extrabold text-center text-[#9AB5D9]"> Enter New Password </h1>
            </div>

            <form className="space-y-4" onSubmit={(e) => handleSubmitPassword(e, isPasswordVisible, inputPassword, inputConfirmPassword, setError, setData) } method="POST">
                <div>
                    <div className="relative w-full">
                        <span className="absolute text-black top-1/2 right-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setHidePass(!hidePass)}>
                            {hidePass ? <FaEyeSlash className="w-6 h-6" /> : <FaEye className="w-6 h-6" />}
                        </span>

                        <input className={`${error.password ? "border-2 border-red-500" : ""} ${inputClassName}`} type={hidePass ? "password" : "text"} name="password" placeholder="Password" 
                            ref={inputPassword} onChange={(e) => handleInputChange(e, setError, setData, inputPassword, inputConfirmPassword, setInputClassName, setInputClassName1)}
                        />
                    </div>
                </div>

                <div className="relative w-full">
                    <span className="absolute text-black top-1/2 right-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setHideConfirmPass(!hideConfirmPass)}>
                        {hideConfirmPass ? <FaEyeSlash className="w-6 h-6" /> : <FaEye className="w-6 h-6" />}
                    </span>
                    <input onChange={(e) => handleInputChange(e, setError, setData, inputPassword, inputConfirmPassword, setInputClassName, setInputClassName1)} ref={inputConfirmPassword} 
                        type={hideConfirmPass ? "password" : "text"} placeholder="Confirm Password" className={`${error.confirmPassword ? "border-2 border-red-500" : ""} ${inputClassName1}`}
                    />
                </div>

                {(error.repassword || error.password || error.general) && (
                    <div className="text-center"> <p className="text-red-600 font-[Font6] text-sm font-bold line-clamp-2">{error.repassword || error.password || error.general}</p></div>
                )}

                <motion.div className="flex items-center justify-center">
                    <motion.button className={`relative flex items-center justify-center w-full sm:w-[40%] md:w-[50%] px-6 py-3 md:py-4 text-[#050A30] text-lg sm:text-xl md:text-2xl 
                        font-[Font4] rounded-xl shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 whitespace-nowrap ${ loading ? "bg-gray-400 cursor-not-allowed": 
                        "bg-[#9AB5D9] hover:shadow-2xl hover:scale-105 focus:ring-[#0e213f] focus:ring-opacity-50"} `} whileHover={{ scale: loading ? 1 : 1.05 }} 
                        disabled={loading} whileTap={{ scale: loading ? 1 : 0.95 }} 
                    >
                        {loading ?  " Submitting..." : "Change Password"}
                    </motion.button>
                </motion.div>
            </form>
        </div>
    );
};

export { PostVisible, checkVisibility };