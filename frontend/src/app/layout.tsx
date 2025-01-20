// src/app/layout.tsx

"use client";

import { usePathname } from 'next/navigation';

import "./globals.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const currentPage = pathname.split('/').pop() || '';

  return (
    <html lang="en">
      <head>
        <title>{`ft_transcendence ${currentPage}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
