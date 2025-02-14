import Cookie from "js-cookie";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MdOutlineVerifiedUser, MdErrorOutline } from "react-icons/md";
import { removeAllData } from "../first/first-step";

const initialData = (
    initializedRef: React.MutableRefObject<boolean>,
    setIsSuccessful: React.Dispatch<React.SetStateAction<boolean>>,
    setIsError: React.Dispatch<React.SetStateAction<boolean>>,
    router: ReturnType<typeof useRouter>
) => {
    if (!initializedRef.current) {
        initializedRef.current = true;
        
        const isSuccess = Cookie.get("isSuccessful");

        if (isSuccess) {
            setIsSuccessful(true);
            setTimeout(() => {
                router.push("/login-signup");
                removeAllData()
            }, 2000);                
        } else {
            setIsError(true);            
            setTimeout(() => {
                router.push("/login-signup");
                removeAllData()
            }, 2000);
        }
    }
}

interface FinalStepProps {
    isSuccessful: boolean;
    isError:boolean;
}

const FinalStep: React.FC<FinalStepProps> = ({ isSuccessful, isError }) => {
    return (
        <div>
            {isSuccessful && (
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl mt-8 md:text-5xl font-[Borias] font-extrabold text-white mb-8">Success!</h1>
                    <MdOutlineVerifiedUser className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 text-center text-green-400" />
                    <p className="text-gray-500 font-[Font6] text-xl md:text-xl lg:text-2xl font-bold mt-8 mb-4 text-center"> Your Password Has been reset successfully</p>
                </div>
            )}
            {isError && (
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl mt-8 md:text-5xl font-[Borias] font-extrabold text-white mb-8">Error</h1>
                    <MdErrorOutline className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 text-center text-red-600" />
                    <p className="text-gray-500 font-[Font6] text-xl md:text-xl lg:text-2xl font-bold mt-8 mb-4 text-center"> Something went wrong. Please try again.</p>
                </div>
            )}
        </div>
    );
};
 
const Success = () => {
    const router = useRouter();
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false); 
    const initializedRef = useRef<boolean>(false);

    useEffect(() => {
        initialData(initializedRef, setIsSuccessful, setIsError, router);
    }, []);

    return <FinalStep isSuccessful={isSuccessful} isError={isError} />
};

export default Success;
