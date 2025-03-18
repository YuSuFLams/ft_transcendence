"use client";

import { PostVisible, checkVisibility } from "../third/third-utils";
import { useEffect, useRef, useState } from "react";
import { PreVisible } from "../utils";

const ThirdStep = () => {
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [hideConfirmPass, setHideConfirmPass] = useState<boolean>(true);
    const [data, setData] = useState<Record<string, string>>({});
    const [error, setError] = useState<Record<string, string>>({});
    const inputPassword = useRef<HTMLInputElement | null>(null);
    const inputConfirmPassword = useRef<HTMLInputElement | null>(null);
    const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
    const initializedRef = useRef(false);

    useEffect(() => {
        checkVisibility(setPasswordVisible, initializedRef);
    }, []);

    return (
        <div className="w-full h-full bg-[#011C40] rounded-b-xl relative flex justify-center items-center md:mt-0 rounded-r-2xl flex flex-col items-center justify-center space-y-6 mb-8">
            {isPasswordVisible ? (
                <PostVisible inputConfirmPassword={inputConfirmPassword} setHideConfirmPass={setHideConfirmPass} 
                    setHidePass={setHidePass} isPasswordVisible={isPasswordVisible} hideConfirmPass={hideConfirmPass} 
                    error={error} inputPassword={inputPassword} hidePass={hidePass} setError={setError} setData={setData}
                />
            ) : (
                <PreVisible />
            )}
        </div>
    );
};

export default ThirdStep;
