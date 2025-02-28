'use client'
import type { NextPage } from 'next';
import React from "react";
import { useRouter } from "next/navigation";

const Home: NextPage = () => {
  const router = useRouter()
 
  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  );
};

export default Home;