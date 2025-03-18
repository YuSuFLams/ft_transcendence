import { CreateAccount, handleLogin } from "../api/auth";
import { isAllSpaces, isValidInput } from "./auth-utils";

const validateInput = (
    inputRef: React.RefObject<HTMLInputElement | null>, fieldName: string, newError: Record<string, string>, newData: Record<string, string>
): boolean => {
    const validation = isValidInput(inputRef);

    if (!validation.valid) {
        newError[fieldName] = validation.error;
        return false;
    } else {
        newData[fieldName] = inputRef.current?.value || "";
        return true;
    }
};

const focusOnEmptyField = (
    refs: React.RefObject<HTMLInputElement | null>[]
) => {
    for (const ref of refs) {
        if (ref.current && isAllSpaces(ref.current.value)) {
            ref.current.focus();
            break;
        }
    }
};

const CreateAccountAuth = async (
    e: React.FormEvent<HTMLFormElement>, inputFname: React.RefObject<HTMLInputElement | null>,
    inputLname: React.RefObject<HTMLInputElement | null>, inputEmail: React.RefObject<HTMLInputElement | null>,
    inputUsername: React.RefObject<HTMLInputElement | null>, inputPassword: React.RefObject<HTMLInputElement | null>,
    inputConfirmPassword: React.RefObject<HTMLInputElement | null>, setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    setData: React.Dispatch<React.SetStateAction<Record<string, string>>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    toggleView: () => void, setIsCreated: React.Dispatch<React.SetStateAction<boolean>>
) => {
    e.preventDefault();

    let isFormValid = true;
    const newError: Record<string, string> = {}; 
    const newData: Record<string, string> = {}; 

    isFormValid = validateInput(inputFname, 'first_name', newError, newData) && isFormValid;
    isFormValid = validateInput(inputLname, 'last_name', newError, newData) && isFormValid;
    isFormValid = validateInput(inputEmail, 'email', newError, newData) && isFormValid;
    isFormValid = validateInput(inputUsername, 'username', newError, newData) && isFormValid;
    isFormValid = validateInput(inputPassword, 'password', newError, newData) && isFormValid;
    isFormValid = validateInput(inputConfirmPassword, 'repassword', newError, newData) && isFormValid;
    setData(newData); 
    setError(newError); 

    if (!isFormValid) {
        focusOnEmptyField([inputFname, inputLname, inputEmail, inputUsername, inputPassword, inputConfirmPassword]);
        return; 
    }

    if (newData.password !== newData.repassword) {
        setError((prev: any) => ({ ...prev, repassword: 'Passwords do not match', general: '' }));
        return;
    }

    CreateAccount(newData, setLoading, setError, toggleView, setIsCreated);
};

const focusOnInvalidField = (inputRef: React.RefObject<HTMLInputElement | null>, isValid: boolean) => {if (!isValid)  inputRef.current?.focus();};

const LoginAccount = async (
    e: React.FormEvent<HTMLFormElement>,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    input: React.RefObject<HTMLInputElement | null>, data: Record<string, string>,
    router: any, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    inputPassword: React.RefObject<HTMLInputElement | null>,
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
) => {
    e.preventDefault();
    setLoading(true);

    let isFormValid = true;
    const newError: Record<string, string> = {};

    const isUsernameValid = validateInput(input, "username", newError, data);
    focusOnInvalidField(input, isUsernameValid);
    isFormValid = isFormValid && isUsernameValid;

    const isPasswordValid = validateInput(inputPassword, "password", newError, data);
    if (isUsernameValid) focusOnInvalidField(inputPassword, isPasswordValid);
    isFormValid = isFormValid && isPasswordValid;

    setError(newError);

    if (isFormValid && Object.keys(newError).length === 0) handleLogin(data, setError, setLoading, router, setIsLogin);
    else setLoading(false);
};

export {CreateAccountAuth, LoginAccount};