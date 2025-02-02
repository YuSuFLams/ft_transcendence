import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { handleContinue } from "../api/resetPass";
import { PreSendCode, VerificationView, getData } from "./second-utils";
import { removeAllData } from "./first-step";

export interface Profile {
  picture: string;
  username: string;
  fullName: string;
  email: string;
}

const SecondStep: React.FC = () => {
    const [isMe, setIsMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Record<string, string>>({});
    const [profile, setProfile] = useState<Profile>({} as Profile);
    const initializedRef = useRef(false);
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

    useEffect(() => {
        getData(initializedRef, setProfile, setIsMe);
    }, []);

    const isNotMe = () => removeAllData();
    const toggleView = () => setIsMe((prev) => !prev);
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

    const resetCode = () => {
        inputRefs.current.forEach((ref) => {
            if (ref) ref.value = '';
        });
        setCode(Array(6).fill(''));
        inputRefs.current[0]?.focus();
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const input = e.target;
        const nextInput = inputRefs.current[index + 1];
        const newCode = [...code];

        newCode[index] = input.value;
        setCode(newCode);

        if (input.value && nextInput) nextInput.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const input = e.currentTarget;
        const previousInput = inputRefs.current[index - 1];

        if ((e.key === 'Backspace' || e.key === 'Delete') && !input.value) {
        e.preventDefault();
        setCode((prevCode) => {
            const newCode = [...prevCode];
            newCode[index] = '';
            return newCode;
        });
        if (previousInput) previousInput.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedCode = e.clipboardData.getData('text').slice(0, 6);
        if (pastedCode.length === 6) {
        setCode([...pastedCode.split('')]);
        inputRefs.current.forEach((inputRef, index) => {
            if (inputRef) inputRef.value = pastedCode.charAt(index);
        });
        }
    };

    return (
        <div className="flex flex-col items-center">
            {!isMe ? (
                <PreSendCode isNotMe={isNotMe} handleContinue={() => handleContinue(toggleView, resetCode, setError)} error={error} profile={profile} />
            ) : (
                <VerificationView code={code} inputRefs={inputRefs} error={error} loading={loading} setError={setError} resetCode={resetCode}
                    handleInput={handleInput} handleKeyDown={handleKeyDown} handleFocus={handleFocus} handlePaste={handlePaste}
                />
            )}
        </div>
    );
};

export default SecondStep;
