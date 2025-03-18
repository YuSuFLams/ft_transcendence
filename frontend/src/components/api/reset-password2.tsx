import { removeAllData } from "../reset-password/first/first-step";
import Cookie from 'js-cookie';
import { message } from "antd";
import axios from "axios";

const sendPassWord = async (newData: Record<string, string>, setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,) => {
    
    try {
        const email = Cookie.get("email");
        const code = Cookie.get("code");
    
        const data_data = { email: email, code : code, new_password1: newData.password, new_password2: newData.repassword,};
    
        const response = await axios.post("http://localhost:8000/api/users/reset_mail_success/", data_data,{
                headers: { "Content-Type": "application/json"},
            }
        );
    
        if (response.status === 200) {
            Cookie.set("step", "3");
            message.success("Password changed successfully");
            Cookie.set("isSuccessful", "true");
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            message.error(`Error: ${error.response?.data?.error || "Something went wrong"}`);
            setError({general: error.response?.data?.error || "Something went wrong"});
            if (error.response?.data?.error === "Something went wrong") {setTimeout(() => {removeAllData();}, 2000);}
        } else {
            message.error("An unexpected error occurred.");
            setError({ general: "An unexpected error occurred." });
        }
    }
}

export { sendPassWord };