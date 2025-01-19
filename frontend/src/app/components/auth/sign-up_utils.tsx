import React, { ChangeEvent } from "react";
import Cookie from 'js-cookie';
import { motion } from "framer-motion";
import axios, {AxiosError} from 'axios';


interface SignInProps {
    toggleView: () => void
}

const HalfSideSignIn:React.FC <SignInProps> = ({toggleView}) => {
    return (
        <div className="w-[50%] h-full bg-[#0e213f] rounded-r-2xl flex flex-col items-center justify-center p-8 space-y-6 shadow-lg relative">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0.8)_100%)]"></div>

            <motion.div className="h-full rounded-r-2xl space-y-8 flex flex-col items-center justify-center p-8 space-y-6 shadow-lg 
                relative z-10" animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            >
                <div>
                    <h1 className="text-[2.9em] font-[Font3]">
                        🌟 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffcc00] to-[#ff6600]">Welcome to Ping Pong Universe!</span> 🎮
                    </h1>
                </div>

                <div>
                    <p className="text-[#f3f3f3] text-3xl font-[Font4] font-extrabold text-center max-w-md">
                        <span className="text-gray-300"> Get in the game, make new friends, and enjoy some 
                            <span className="text-[#ffcc00]">ping pong</span> fun!</span> 🏓💥
                    </p>
                </div>
        
                <div>

                <motion.button className="text-[#001219] bg-[#aaabbc] font-[Font3] text-3xl font-extrabold px-6 py-2 rounded-lg 
                    shadow-md transition-transform duration-300 ease-in-out hover:scale-105 z-20" whileHover={{ scale: 1.15 }}
                    onClick={toggleView} whileTap={{ scale: 0.15 }} aria-label="Toggle to Sign In"
                >
                    Sign In 
                </motion.button>
                </div>
            </motion.div>
        </div>
    )
}

const isAllSpaces = (str: string): boolean => {
    return str.trim().length === 0;
};

const isValidInput = (input: React.RefObject<HTMLInputElement | null>) => {
    const value = input.current?.value || "";

    if (input.current?.type !== 'password') {
        if (value === "") {
            return { valid: false, error: 'Field is required' };
        }
        if (isAllSpaces(value)) {
            return { valid: false, error: 'Field does not accept all spaces' };
        }
    } else if (input.current?.type === 'password') {
        if (value.length === 0) {
            return { valid: false, error: 'Field is required' };
        }
        if (isAllSpaces(value)) {
            return { valid: false, error: 'Field does not accept all spaces' };
        }
        if (value.length < 8) {
            return { valid: false, error: 'Password must be at least 8 characters long' };
        }
    }
    return { valid: true, error: '' };
};



const CreateAccount = async (
    newData:any, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    toggleView: () => void,
    setIsCreated: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        const response = await axios.post( 'http://localhost:8000/api/users/register/', newData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    
        setIsCreated(true);
        toggleView();
        setLoading(false);
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.log("Backend Error Response:", error.response?.data['0']);
          setError((prev: any) => ({ ...prev, general: error.response?.data['0'] || 'Registration failed.' }));
        } else {
          setError((prev: any) => ({ ...prev, general: 'Network error: Could not connect to the server.' }));
        }
    }
}

const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    inputFname: React.RefObject<HTMLInputElement | null>,
    inputLname: React.RefObject<HTMLInputElement | null>,
    inputEmail: React.RefObject<HTMLInputElement | null>,
    inputUsername: React.RefObject<HTMLInputElement | null>,
    inputPassword: React.RefObject<HTMLInputElement | null>,
    inputConfirmPassword: React.RefObject<HTMLInputElement | null>,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    setData: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    toggleView: () => void,
    setIsCreated: React.Dispatch<React.SetStateAction<boolean>>
) => {
    e.preventDefault();

    let isFormValid = true;
    const newError: Record<string, string> = {}; // Initialize an empty error object
    const newData: Record<string, string> = {}; // Initialize an empty data object

    // Check for each field
    const fnameValidation = isValidInput(inputFname);
    if (!fnameValidation.valid) {
        isFormValid = false;
        newError.firstName = fnameValidation.error; // Assign the error message
    } else {
        newData.first_name = inputFname.current?.value || "";
    }

    const lnameValidation = isValidInput(inputLname);
    if (!lnameValidation.valid) {
        isFormValid = false;
        newError.lastName = lnameValidation.error;
    } else {
        newData.last_name = inputLname.current?.value || "";
    }

    const emailValidation = isValidInput(inputEmail);
    if (!emailValidation.valid) {
        isFormValid = false;
        newError.email = emailValidation.error;
    } else {
        newData.email = inputEmail.current?.value || "";
    }

    const usernameValidation = isValidInput(inputUsername);
    if (!usernameValidation.valid) {
        isFormValid = false;
        newError.username = usernameValidation.error;
    } else {
        newData.username = inputUsername.current?.value || "";
    }

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
        newError.confirmPassword = confirmPasswordValidation.error;
    } else {
        newData.repassword = inputConfirmPassword.current?.value || ""; // Use repassword for consistency
    }

    setData(newData); 
    setError(newError); 

    if (!isFormValid) {
        // If the form is not valid, focus on the first invalid field with all spaces
        for (const ref of [inputFname, inputLname, inputEmail, inputUsername, inputPassword, inputConfirmPassword]) {
            if (ref.current && isAllSpaces(ref.current.value)) {
                ref.current.focus();
                break;
            }
        }
        return; // Exit early if the form is not valid
    }

    // Check if password and confirm password match
    if (newData.password !== newData.repassword) {
        setError((prev: any) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        return;
    }
    CreateAccount(newData, setLoading, setError, toggleView, setIsCreated);
}

const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    setData: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    inputPassword: React.RefObject<HTMLInputElement | null>,
    inputConfirmPassword: React.RefObject<HTMLInputElement | null>,
    setInputClassName: React.Dispatch<React.SetStateAction<string>>,
    setInputClassName1: React.Dispatch<React.SetStateAction<string>>
) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));

    // Handle password validation within the change handler
    if (name === "password") {
        if (value.length > 0 && value.length < 6 && inputPassword.current) {
            inputPassword.current.focus();
            setInputClassName("w-[100%] p-3 pl-4 rounded-lg shadow-md focus:outline-none  placeholder:text-lg border-2 border-red-500 \
            focus:ring-2 focus:ring-[#aaabbc]  focus:ring-opacity-50 font-extrabold font-[Font6] text-black text-2xl text-left");
        } else {
            setInputClassName("w-full p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2 \
                focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold font-[Font6] text-black text-2xl text-left");
        }
    }
    else if (name === "confirmPassword") {
        if (value.length > 0 && value.length < 6 && inputConfirmPassword.current) {
            inputConfirmPassword.current.focus();
            setInputClassName1("w-[100%] p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg border-2 border-red-500  \
                focus:ring-2 focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold font-[Font6] text-black text-2xl text-left");
        } else {
            setInputClassName1("w-full p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2  \
                focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold font-[Font6] text-black text-2xl text-left");
        }
    }
};

export {HalfSideSignIn, isValidInput, handleSubmit, handleInputChange};