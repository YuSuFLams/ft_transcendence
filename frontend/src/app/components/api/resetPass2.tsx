import axios from "axios";
import Cookie from 'js-cookie';
import { message } from "antd";
import { removeAllData } from "../reset-password/first-step";

const sendPassWord = async (
    newData: Record<string, string>,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
) => {
    try {
        const email = Cookie.get("email");
        const code = Cookie.get("code");
    
        const data_data = {
            email: email,
            code : code,
            new_password1: newData.password,
            new_password2: newData.repassword,
        };
    
        console.log(data_data);
    
        const response = await axios.post("http://localhost:8000/api/users/reset_mail_success/", data_data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    
        console.log("response", response.data);
    
        if (response.status === 200) {
            Cookie.set("step", "3"); // Mark step 1 as completed
            Cookie.set("isSuccessful", "true");
        } else {
            message.error(`Error: ${response.data.error}`);
            setError({
                general: response.data.error || "An unexpected error occurred.",
            });
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", error.response?.data);
            message.error(`Error: ${error.response?.data?.error || "An error occurred"}`);
            setError({
                general: error.response?.data?.error || "An unexpected error occurred.",
            });
            if (error.response?.data?.error === "Something went wrong") {
                setTimeout(() => {
                    removeAllData();
                }, 2000);
            }
        } else {
            console.error("Unexpected error:", error);
            message.error("An unexpected error occurred.");
            setError({ general: "An unexpected error occurred." });
        }
    }
}

export { sendPassWord };