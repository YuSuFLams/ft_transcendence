"use client";

import { useEffect, useRef, useState } from "react";
import { PostVisible, checkVisibility } from "../third/third-utils";
import { PreVisible } from "../utils";

const ThirdStep = () => {
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [hideConfirmPass, setHideConfirmPass] = useState<boolean>(true);
    const [data, setData] = useState<Record<string, string>>({});
    const [error, setError] = useState<Record<string, string>>({});
    const inputPassword = useRef<HTMLInputElement>(null);
    const inputConfirmPassword = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [inputClassName, setInputClassName] = useState<string>(
        "w-full p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2 text-left\
        focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold font-[Font8] text-black text-lg sm:text-2xl "
    );
    const [inputClassName1, setInputClassName1] = useState<string>(
        "w-full p-3 pl-4 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2 text-left\
        focus:ring-[#aaabbc] placeholder:text-gray-500 focus:ring-opacity-50 font-extrabold font-[Font8] text-black text-lg sm:text-2xl "
    );
    const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
    const initializedRef = useRef(false);

    useEffect(() => {
        checkVisibility(setPasswordVisible, initializedRef);
    }, []);

    return (
        <div className="w-full h-full md:mt-0 rounded-r-2xl flex flex-col items-center justify-center space-y-6 mb-8">
            {isPasswordVisible ? (
                <PostVisible inputConfirmPassword={inputConfirmPassword} setHideConfirmPass={setHideConfirmPass} setHidePass={setHidePass}
                    isPasswordVisible={isPasswordVisible} hideConfirmPass={hideConfirmPass} inputClassName1={inputClassName1} error={error}
                    inputClassName={inputClassName} inputPassword={inputPassword} hidePass={hidePass} setError={setError} setData={setData} 
                    loading={loading} setInputClassName={setInputClassName} setInputClassName1={setInputClassName1}
                />
            ) : (
                <PreVisible />
                
            )}
        </div>
    );
};

export default ThirdStep;
