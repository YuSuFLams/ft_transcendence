import { checkTokenValidity } from "@/components/api/check";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthResult {
    isAuthenticated: boolean;
    loading: boolean;
    error?: string;
}

const checkAuth = async (
    signal?: AbortSignal, setLoading: React.Dispatch<React.SetStateAction<boolean>> = () => {},
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>> = () => {},
    setError: React.Dispatch<React.SetStateAction<string | undefined>> = () => {},
    router: any = {}, pathname: string = ''
) => {
    setLoading(true);

    try {
        const isValidToken = await checkTokenValidity(signal, setError);
        if (!isValidToken) {
            setIsAuthenticated(false);
            const allowedPaths = ['/login-signup', '/reset-password', '/', '/oauth', '/oauth/google'];
            if (!allowedPaths.includes(pathname)) {
                router.push('/login-signup');
            }
        } else {
            setIsAuthenticated(true);
        }
    } catch (err) {
        setError('Authentication failed');
    } finally {
        setLoading(false);
    }
};

const useAuth = (): AuthResult => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        checkAuth(signal, setLoading, setIsAuthenticated, setError, router, pathname);

        return () => {
            abortController.abort();
        };
    }, [pathname, router]);

    return { isAuthenticated, loading, error };
};

export { useAuth };