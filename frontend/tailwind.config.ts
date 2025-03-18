import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-slow-reverse': 'spin 3s linear infinite reverse',
        'fade-in-out': 'fadeInOut 3s ease-in infinite',
      },
      keyframes: {
          fadeInOut: {
              '0%, 100%': { opacity: '0.5' },
              '50%': { opacity: '1' },
          },
      },
    },
  },
  plugins: [],
} satisfies Config;
