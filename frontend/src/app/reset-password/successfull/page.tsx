import { message } from "antd";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MdOutlineVerifiedUser, MdErrorOutline } from "react-icons/md"; // Import the error icon

import Cookie from "js-cookie";
import { removeAllData } from "../page";

const Success = () => {
    const router = useRouter();
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [isError, setIsError] = useState(false); // Add error state
    const initializedRef = useRef(false);
    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;
            const isSuccess = Cookie.get("isSuccessful");

            if (isSuccess) {
                setIsSuccessful(true);
                setTimeout(() => {
                    // Cookie.clear();
                    setTimeout(() => {
                        router.push("/login-signup");
                        removeAllData()
                    }, 100); // Delay the Cookie.clear() by 100ms after router.push
                }, 2000);                
            } else {
                setIsError(true); // Set error state
                message.error("An error occurred. Please try again later.");
                
                setTimeout(() => {
                    // Cookie.clear(); // Clear session after 2 seconds
                    removeAllData()
                }, 2000);
            }
        }
    }, []);

    return (
        <>
            {isSuccessful && (
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-5xl font-bold text-white mt-4 mb-8">Success!</h1>
                    <MdOutlineVerifiedUser style={{ textAlign: "center", width: "120px", height: "120px", color: "#4ade80" }} />
                    <p className="text-gray-500 text-2xl font-bold mt-8 mb-4">Your Password Has been reset successfully</p>
                </div>
            )}
            {isError && (
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-5xl font-bold text-red-600 mt-4 mb-8">Error</h1>
                    <MdErrorOutline style={{ textAlign: "center", width: "120px", height: "120px", color: "#f87171" }} />
                    <p className="text-gray-500 text-2xl font-bold mt-8 mb-4">Something went wrong. Please try again.</p>
                </div>
            )}
        </>
    );
};

export default Success;
