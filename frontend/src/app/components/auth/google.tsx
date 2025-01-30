"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { OuthPage } from './oauth';

const handleGoogleOAuth = async (
    code: string | null,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (code) {
      const url = `http://localhost:8000/api/users/google/callback/?code=${code}`;
  
      try {
        console.log("response");
		const response = await axios.get(url, {
			headers: {
				'Content-Type': 'application/json',
			},
			});
        if (response.status === 200) {
			const result = response.data;
			Cookie.set('access', result.access_token);
			Cookie.set('refresh', result.refresh_token);
			setLoading(false)
        } else {
          	setErrorMessage(response.data.message || 'Authentication failed. Please try again.');
        	}
      	} catch (error) {
        	setErrorMessage('An error occurred. Please check your internet connection and try again.');
      	} finally {
        	setLoading(false);
    	}
	}
};

const OAuthGooglePage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const initializedRef = useRef<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);
	const code = searchParams.get('code');
  
	useEffect(() => {
		const token = Cookie.get("access");
		if (token) router.push("/dashboard")
	}, []);

    console.log(code)
	useEffect(() => {
		if (!initializedRef.current) {
			initializedRef.current = true;
			handleGoogleOAuth(code, setErrorMessage, setLoading);
		}
	}, [code, router]);

	useEffect(()=> {
		if (!loading && !errorMessage) {
			setTimeout(() => {
				router.push('/game');
			}, 2000);
		}
	},[loading, errorMessage, router]);

  	return <OuthPage loading={loading} errorMessage={errorMessage} router={router} />;
};


export default OAuthGooglePage;