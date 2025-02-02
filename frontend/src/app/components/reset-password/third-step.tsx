"use client";

import { useEffect, useRef, useState } from "react";
import { PreVisible } from "./utils";
import { PostVisible, checkVisibility } from "./third-utils";

const ThirdStep = () => {
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [hideConfirmPass, setHideConfirmPass] = useState<boolean>(true);
    const [data, setData] = useState<Record<string, string>>({});
    const [error, setError] = useState<Record<string, string>>({});
    const inputPassword = useRef<HTMLInputElement>(null);
    const inputConfirmPassword = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [inputClassName, setInputClassName] = useState<string>(
        "w-full p-2 pl-4 lg:p-2 placeholder:truncate rounded-lg placeholder:text-gray-400 shadow-md focus:outline-none placeholder:text-lg focus:ring-2 \
        focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold placeholder:font-[Font6] text-black text-2xl text-left"
    );
    const [inputClassName1, setInputClassName1] = useState<string>(
        "w-full p-2 pl-4  placeholder:truncate lg:p-2 placeholder:text-gray-400 rounded-lg shadow-md focus:outline-none placeholder:text-lg focus:ring-2 \
        focus:ring-[#aaabbc] focus:ring-opacity-50 font-extrabold placeholder:font-[Font6] text-black text-2xl text-left"
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
                    loading={loading}
                />
            ) : (
                <PreVisible />
                
            )}
        </div>
    );
};

export default ThirdStep;
