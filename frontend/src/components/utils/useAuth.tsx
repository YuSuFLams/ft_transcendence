import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface AuthResult {
	isAuthenticated: boolean;
	loading: boolean;
	error?: string;
}

const useAuth = (): AuthResult => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | undefined>(undefined);
	const router = useRouter();
	const pathname = usePathname();

	const checkTokenValidity = async (): Promise<boolean> => {
        try {
            const token = Cookies.get('access');
            if (!token) return false;
            return true;
        } catch (err) {
            setError('Failed to validate token');
            return false;
        }
    };

	// Fetch user data after token validation
	useEffect(() => {
		const checkAuth = async () => {
		setLoading(true);

		try {
			const isValidToken = await checkTokenValidity();
			if (!isValidToken) {
			setIsAuthenticated(false);
			const allowedPaths = ['/login-signup', '/reset-password', '/', '/oauth', '/oauth/google'];
			if (!allowedPaths.includes(pathname)) router.push('/login-signup');
			} else {
			setIsAuthenticated(true);
			}
		} catch (err) {
			setError('Authentication failed');
		} finally {
			setLoading(false);
		}
		};

		checkAuth();
	}, [pathname, router]);

	return { isAuthenticated, loading, error };
};

export { useAuth };