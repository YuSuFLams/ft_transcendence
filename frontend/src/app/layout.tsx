"use client";

import { LoadingError, LoadingSpinner, Pages } from '../components/utils/loading';
import { useAuth } from '../components/utils/useAuth';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const pathname = usePathname();
	const [showSpinner, setShowSpinner] = useState<boolean>(true);
	const currentPage = pathname.split('/').pop() || 'Home';
	const formattedTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1).replace(/-/g, ' ');
	const { loading, error } = useAuth();

	useEffect(() => {
		if (!loading) {
			const spinnerTimeout = setTimeout(() => { setShowSpinner(false); }, 500);
			return () => clearTimeout(spinnerTimeout);
		}
	}, [loading]);

	if (loading || showSpinner) return <LoadingSpinner formattedTitle={formattedTitle} />;

	if (error) return <LoadingError error={error || 'Unknown error'} />;

	return <Pages formattedTitle={formattedTitle}>{children}</Pages>;
}