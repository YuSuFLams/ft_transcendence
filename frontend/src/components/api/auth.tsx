import Cookie from 'js-cookie';
import axios, {AxiosError} from 'axios';
import { useRouter } from 'next/navigation';

const CreateAccount = async (
    newData:any, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    toggleView: () => void,
    setIsCreated: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        const response = await axios.post( 'http://localhost:8000/api/users/register/', newData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 200) {
            setIsCreated(true);
            toggleView();
            setLoading(false);
        }
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setError((prev: any) => ({ ...prev, general: error.response?.data.error || 'Registration failed.' }));
        } else {
          setError((prev: any) => ({ ...prev, general: 'Network error: Could not connect to the server.' }));
        }
    }
}


const Intra42 = async (
	router:any, setError: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
    try {
		const response = await fetch('http://localhost:8000/api/users/42/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const result = await response.json();
		const url_42 = result.authorize_link;
		router.push(url_42);
		
	} catch (error) {
		setError((prev: any) => ({ ...prev, general: 'An unexpected error occurred. Please try again.' }));
	}
};


const Google = async (
    router: ReturnType<typeof useRouter>, setError: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
	try {
		const response = await fetch('http://localhost:8000/api/users/google/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const result = await response.json();
		const url_42 = result.authorize_link;
		router.push(url_42);
		
	} catch (error) {
		setError((prev: any) => ({ ...prev, general: 'An unexpected error occurred. Please try again.' }));
	}
};

const handleLogin = async (    
    data: Record<string, string>, setError: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    router: ReturnType<typeof useRouter>, setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        const response = await axios.post('http://localhost:8000/api/users/login/', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        const result = response.data;
        if (result.Success && result.access && result.refresh) {
            Cookie.set("access", result.access);
            Cookie.set("refresh", result.refresh);
            setIsLogin(true);
            setTimeout(() => router.push('/dashboard'), 3000);
        } else {
            const errorMsg = result.error || 'Login failed. Please try again.';
            setError((prev: any) => ({ ...prev, general: errorMsg }));
        }
    } catch (error) {
        setError((prev: any) => ({ ...prev, general: 'An unexpected error occurred. Please try again.' }));
    } finally {
        setLoading(false);
    }
}


export {CreateAccount, Intra42, Google, handleLogin};