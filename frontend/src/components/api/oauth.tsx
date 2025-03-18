import axios, { AxiosError } from 'axios';
import Cookie from 'js-cookie';

const handleOAuth = async (
    code: string | null,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>, url:string
) => {
    if (code) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                setLoading(false)
                const result = response.data;
                Cookie.set('access', result.access_token);
                Cookie.set('refresh', result.refresh_token);
            }
            
        } catch (error : unknown) {
            if (error instanceof AxiosError) {
                const errorMsg = error.response?.data.error;
                setErrorMessage((prev: any) => (errorMsg || 'Authentication failed. Please try again.'));
            } else {
                setErrorMessage((prev: any) => ({ ...prev, general: 'Network error: Could not connect to the server.' }));
        }
    } finally {
        setLoading(false);
    }
    }
};

export { handleOAuth };