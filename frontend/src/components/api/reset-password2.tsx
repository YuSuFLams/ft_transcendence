import axios from "axios";
import Cookie from 'js-cookie';
import { message } from "antd";
import { removeAllData } from "../reset-password/first/first-step";

const sendPassWord = async (newData: Record<string, string>, setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,) => {
    
    try {
        const email = Cookie.get("email");
        const code = Cookie.get("code");
    
        const data_data = { email: email, code : code, new_password1: newData.password, new_password2: newData.repassword,};
    
        const response = await axios.post("http://localhost:8000/api/users/reset_mail_success/", data_data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    
    
        if (response.status === 200) {
            Cookie.set("step", "3");
            Cookie.set("isSuccessful", "true");
        } else {
            message.error(`Error: ${response.data.error}`);
            setError({general: response.data.error || "An unexpected error occurred.",});
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            message.error(`Error: ${error.response?.data?.error || "An error occurred"}`);
            setError({general: error.response?.data?.error || "An unexpected error occurred.",});
            if (error.response?.data?.error === "Something went wrong") {setTimeout(() => {removeAllData();}, 2000);}
        } else {
            message.error("An unexpected error occurred.");
            setError({ general: "An unexpected error occurred." });
        }
    }
}

export { sendPassWord };