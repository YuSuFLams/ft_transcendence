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
        'move-up': 'moveUp 5s infinite alternate ease-in-out',
        'move-down': 'moveDown 5s infinite alternate ease-in-out',
        'fade-in': 'fadeIn 2s ease-in-out',
        'blob': "blobAnimation infinite alternate ease-in-out",
      },
      keyframes: {
        moveUp: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-20px)' },
        },
        moveDown: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blobAnimation: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(10px, -10px) scale(1.2)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
