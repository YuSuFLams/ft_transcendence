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
  const currentPage = pathname.split('/').pop() || 'Home';
  const formattedTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1).replace(/-/g, ' ');

  return (
    <html lang="en">
      <head>
        <title>{formattedTitle === 'Home' ? 'Ping Pong | Your Ultimate Table Tennis Experience' : `Ping Pong | ${formattedTitle} - Explore More`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={`Explore the ${formattedTitle} page of Ping Pong, your ultimate table tennis experience.`} />
        <link rel="icon" href="@/public/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
