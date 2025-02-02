
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { sendPassWord } from "../api/resetPass2";
import { motion } from "framer-motion";
import { ChangeEvent } from "react";
import Cookie from "js-cookie";


const isAllSpaces = (str: string): boolean => {return str.trim().length === 0;};

const isValidInput = (input: React.RefObject<HTMLInputElement>) => {
    const value = input.current?.value || "";

    if (input.current?.type === 'password') {
        if (value.length === 0) {
            return { valid: false, error: 'Both Fields is required' };
        }
        if (isAllSpaces(value)) {
            return { valid: false, error: 'Field does not accept all spaces' };
        }
        if (value.length < 6) { // Adjusted the message to match the validation
            return { valid: false, error: 'Password must be at least 6 characters long' };
        }
    }
    return { valid: true, error: '' };
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

const handleInputChange = (e: ChangeEvent<HTMLInputElement>,
    inputPassword: React.RefObject<HTMLInputElement>,
    inputConfirmPassword: React.RefObject<HTMLInputElement>,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    setData: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    setInputClassName: React.Dispatch<React.SetStateAction<string>>,
    setInputClassName1: React.Dispatch<React.SetStateAction<string>>,
) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));

    // Handle password validation within the change handler
    if (name === "password") {
        if (value.length > 0 && value.length < 6 && inputPassword.current) {
            inputPassword.current.focus();
            setInputClassName("w-[100%] p-3 pl-4 rounded-lg shadow-md focus:outline-none  placeholder:text-lg border-2 border-red-500 \
                focus:ring-2 focus:ring-[#aaabbc]  focus:ring-opacity-50 font-extrabold font-[Font8] text-black text-2xl text-left");
        } else {
            setInputClassName("w-full p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2 \
                focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold font-[Font8] text-black text-2xl text-left");
        }
    }
    else if (name === "repassword") { 
        if (value.length > 0 && value.length < 6 && inputConfirmPassword.current) {
            inputConfirmPassword.current.focus();
            setInputClassName1("w-[100%] p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg border-2 border-red-500  \
                focus:ring-2 focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold font-[Font8] text-black text-2xl text-left");
        } else {
            setInputClassName1("w-full p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2  \
                focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold font-[Font8] text-black text-2xl text-left");
        }
    }
};

const handleSubmitPassword = async (e: React.FormEvent<HTMLFormElement>,
    isPasswordVisible: boolean,
    inputPassword: React.RefObject<HTMLInputElement>,
    inputConfirmPassword: React.RefObject<HTMLInputElement>,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    setData: React.Dispatch<React.SetStateAction<Record<string, string>>>,
) => {
    e.preventDefault();

    let isFormValid = true;
    const newError: Record<string, string> = {};
    const newData: Record<string, string> = {};

    // Validate password
    const passwordValidation = isValidInput(inputPassword);
    if (!passwordValidation.valid) {
        isFormValid = false;
        newError.password = passwordValidation.error;
    } else {
        newData.password = inputPassword.current?.value || "";
    }

    // Validate confirm password
    const confirmPasswordValidation = isValidInput(inputConfirmPassword);
    if (!confirmPasswordValidation.valid) {
        isFormValid = false;
        newError.repassword = confirmPasswordValidation.error; // Changed to repassword
    } else {
        newData.repassword = inputConfirmPassword.current?.value || ""; // Change confirmPassword to repassword
    }

    setError(newError);
    setData(newData);
    console.log(newData);

    if (!isFormValid) {
        for (const ref of [inputPassword, inputConfirmPassword]) {
            if (ref.current && isAllSpaces(ref.current.value)) {
                ref.current.focus();
                break;
            }
        }
        return;
    }

    // Check if passwords match
    if (newData.password !== newData.repassword) {
        setError((prev: any) => ({ ...prev, repassword: 'Passwords do not match' })); // Changed to repassword
        return;
    }
    
    
    if (isPasswordVisible) sendPassWord(newData, setError);
};


interface PostVisibleProps {
    isPasswordVisible: boolean;
    inputPassword: React.RefObject<HTMLInputElement>,
    inputConfirmPassword: React.RefObject<HTMLInputElement>,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    setData: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    hidePass: boolean;
    loading: boolean;
    error: Record<string, string>;
    hideConfirmPass: boolean;
    setHidePass: React.Dispatch<React.SetStateAction<boolean>>;
    setHideConfirmPass: React.Dispatch<React.SetStateAction<boolean>>
    inputClassName: string;
    inputClassName1:string
}

const PostVisible:React.FC<PostVisibleProps> = ({
    isPasswordVisible, inputPassword, inputConfirmPassword, setError, setData, hidePass, loading, error, hideConfirmPass,
    setHidePass, setHideConfirmPass, inputClassName, inputClassName1
}) => {
    return (
        <div className="w-full max-w-[500px] mx-auto space-y-4 px-4 py-6">
            <div className="w-full  flex flex-col items-center ">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-[Borias] font-extrabold text-center text-[#9AB5D9]">
                    Enter New Password
                </h1>
            </div>
    
            <form className="space-y-6" onSubmit={(e) => handleSubmitPassword(e, isPasswordVisible, inputPassword, inputConfirmPassword, setError, setData)} method="POST">
                <div>
                    <div className="relative w-full">
                        <span className="absolute text-black top-1/2 right-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setHidePass(!hidePass)}>
                            {hidePass ? <FaEyeSlash className="w-6 h-6" /> : <FaEye className="w-6 h-6" />}
                        </span>
                        
                        <input type={hidePass ? "password" : "text"} name="password" placeholder="Password" className={`${inputClassName} w-full`} ref={inputPassword} onChange={() => handleInputChange}/>
                    </div>
                </div>
    
                <div>
                    <div className="relative w-full">
                        <span className="absolute text-black top-1/2 right-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setHideConfirmPass(!hideConfirmPass)}>
                            {hideConfirmPass ? <FaEyeSlash className="w-6 h-6" /> : <FaEye className="w-6 h-6" />}
                        </span>
                        <input type={hideConfirmPass ? "password" : "text"} name="repassword" placeholder="Confirm Password" className={`${inputClassName1} w-full`} ref={inputConfirmPassword} onChange={() => handleInputChange}/>
                    </div>
                </div>
    
                {/* General Error Message */}
                {(error.repassword || error.password) && (<p className="text-red-600 text-center font-[Font6] text-sm font-bold line-clamp-2">{error.repassword}</p>)}
                
                {error.general && ( <p className="text-red-600 text-center font-[Font6] text-sm font-bold line-clamp-2">{error.general}</p>)}
        
                {/* Submit Button */}
                <motion.div className="flex items-center justify-center mb-4">
                    <motion.button className={`relative flex  items-center justify-center w-full sm:w-[50%] md:w-[60%] px-6 py-3 md:py-4 text-white 
                        text-[1.3em] md:text-[1.5em] font-[Font4] rounded-xl shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 
                        ${loading? "bg-gray-400 cursor-not-allowed" : "bg-[#08428C] hover:shadow-2xl hover:scale-105 focus:ring-[#0e213f] focus:ring-opacity-50"
                        } whitespace-nowrap`} whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: loading ? 1 : 0.95 }} disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                                    <path d="M12 2a10 10 0 0 1 10 10h-4" strokeOpacity="0.75"></path>
                                </svg>
                                Submitting...
                            </div>
                        ) : (
                                "Change Password"
                        )}
                    </motion.button>
                </motion.div>
            </form>
        </div>
    )
}


export {PostVisible, checkVisibility}