import Cookie from 'js-cookie';
import axios, { AxiosError } from 'axios';
import React from 'react';
import { isValidInput } from '../reset-password/first-step';
import { message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>,
    inputRef: React.RefObject<HTMLInputElement>,
    setError: React.Dispatch<React.SetStateAction<{ input?: string; general?: string; }>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    e.preventDefault();

    const value = inputRef.current?.value || "";
    const inputValidation = isValidInput(value);

    if (!inputValidation.valid) {
        setError((prev) => ({ ...prev, input: inputValidation.error, general: ''}));
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
        const data = { "email": value };
        setError((prev) => ({ ...prev, enough: '', general: '' }));
        const response = await axios.post(`http://localhost:8000/api/users/reset_mail_pub/`, data, {
            headers: {
                "Content-Type": "application/json",
            }
        });
    
        if (response.status !== 200) {
            const errorData = response.data;
            setError({ 
                general: errorData.error || "An unexpected error occurred.", 
            });
            return;
        }
    
        const responseData = response.data;
        const fullname = responseData.first_name + " " + responseData.last_name;
    
        Cookie.set("step", "1");
        Cookie.set("username", responseData.username);
        Cookie.set("full_name", fullname);
        Cookie.set("email", value);
        setError({ general: '' });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            setError({ general: error.response?.data?.error || "An unexpected error occurred." });
        } else {
            setError({ general: "An unexpected error occurred." });
        }
    }
     finally {
        setLoading(false);
    }
    
};

const handleSendCode = async (
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    code: string[], 
) => {
    if (code.some(digit => digit === '')) {
        setError((prev) => ({ ...prev, enough: 'Not enough digits', general: '' }));
        return;
    }

    if (code.some(digit => !/^\d$/.test(digit))) {
        setError((prev) => ({ ...prev, enough: 'Invalid character. Only digits are allowed.', general: '', time: '' }));
        return;
    }

    const email = Cookie.get('email');
    if (!email) {
        setError({ general: "Email is missing. Please try again." });
        return;
    }

    const code_reset = code.join('');
    if (code_reset.length !== 6) {
        setError({ general: "Code must be 6 digits long." });
        return;
    }

    const data_data = { "email": email, "code": code_reset };
    console.log("Sending Data:", data_data);

    try {
        setError((prev) => ({ ...prev, enough: '', general: '' }));
        const response = await axios.post("http://localhost:8000/api/users/reset_password_check/", data_data, {
            headers: { "Content-Type": "application/json" },
        });

        console.log(response.data);
        Cookie.set("step", "2");
        Cookie.set("code", code_reset);
        message.info("Your code has been successfully sent. Please hold on for the next step.", 3);
    } catch (error: unknown) {
        console.error("Axios error:", error);

        if (error instanceof AxiosError) {
            setError({ general: error.response?.data.error || "An unexpected error occurred." });
        } else if (axios.isAxiosError(error) && error.request) {
            setError({ general: "No response from server. Please check your connection." });
        } else {
            setError({ general: "Something went wrong. Please try again later." });
        }
    }
};

const handleContinue = async (
    toggleView: () => void, resetCode: () => void,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
    try {
        const data_data = { email: Cookie.get("email") };
        setError((prev) => ({ ...prev, enough: '', general: '' }));
        const response = await axios.post("http://localhost:8000/api/users/reset_password/", data_data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        
        const responseData = response.data;
        if (response.status === 200) {
            toggleView();
            console.log("response", response.data);
            Cookie.set("is_me", JSON.stringify(1));
            message.success(responseData);
        } else {
            setError({general: responseData.error || "An unexpected error occurred."});
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            setError({ general: error.response?.data?.error || "An unexpected error occurred."});
            resetCode();
        } else {
            setError({ general: "An unexpected error occurred." });
        }
    }
};

const reSendCode = async (
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    resetCode: () => void
) => {
    setError((prev) => ({ ...prev, enough: '', general: '' }));
    
    const data_data = {"email": Cookie.get('email')};
    const response = await axios.post(`http://localhost:8000/api/users/reset_password/`,data_data, {
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (response.status !== 200) {
        const errorData = response.data;
        setError({ general: errorData.Error || "An unexpected error occurred."});
        return;
    }

    resetCode();
    const data = await response.data;
    message.info({
        content: data || "Code sent successfully",
        icon: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />,
        duration: 5,
    });
};

export { handleSubmit, handleSendCode, handleContinue, reSendCode };