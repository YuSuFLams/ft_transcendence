import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const checkTokenValidity = async (signal?: AbortSignal, setError: (error: string) => void = () => {}): Promise<boolean> => {
    try {
        const token = Cookies.get('access');
        if (!token) return false;

        const response = await axios.get('http://localhost:8000/api/users/verify/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            signal,
        });
        return response.status === 200;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
                setError('Authentication failed');
            } else if (error.name === 'AbortError') {
                console.log('Request aborted');
            } else {
                setError('Network error: Could not connect to the server.');
            }
            Cookies.remove('access');
            Cookies.remove('refresh');
        } else {
            setError('An unexpected error occurred.');
        }
        return false;
    }
};

export { checkTokenValidity };