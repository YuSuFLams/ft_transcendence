"use client";
// pages/oauth.js
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import './waiting.modue.css'

const OAuthPage = () => {
  const searchParams = useSearchParams();

  const router = useRouter();
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const initializedRef = useRef(false);

  useEffect(() => {
    const handleOAuth = async () => {
      if (code && state) {
        console.log(`OAuth code: ${code}, state: ${state}`);

        // Construct the URL with query parameters
        const url = `http://localhost:8000/api/users/42/callback/?code=${code}`;

        try {
          // Make the GET request
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result = await response.json(); // Await the response to parse it as JSON
            console.log(result);
            // Optionally, redirect after a successful callback
            router.push('/game');
          } else {
            console.error('Failed to fetch OAuth callback:', response.status);
          }
        } catch (error) {
          console.error('Error during OAuth callback:', error);
        }
      }
    };
    if (!initializedRef.current) {
      initializedRef.current = true;
      handleOAuth();
    }
  }, [code, state]);

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-[700px] h-[500px] bg-[#b6a972] text-[#142c5c] rounded-lg flex flex-col space-y-8 justify-center items-center' style={{ fontFamily: 'Titillium Web, sans-serif' }}>
        <p className='text-5xl font-semibold'>Please wait</p>
        <h2 className='text-4xl'>Redirecting to profile page...</h2>
        <div className='progress flex space-x-5'>
          <span className='indicator w-5 h-5 bg-[#142c5c] rounded-full animate-bounce'></span>
          <span className='indicator w-5 h-5 bg-[#142c5c] rounded-full animate-bounce delay-150'></span>
          <span className='indicator w-5 h-5 bg-[#142c5c] rounded-full animate-bounce delay-300'></span>
          <span className='indicator w-5 h-5 bg-[#142c5c] rounded-full animate-bounce delay-450'></span>
        </div>
      </div>
    </div>



  );
};

export default OAuthPage;
