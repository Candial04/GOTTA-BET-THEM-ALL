/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        glow: 'glow 4s ease-in-out infinite',
        'slow-pulse': 'slow-pulse 15s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 10px #fbbf24, 0 0 20px #fbbf24, 0 0 30px #fbbf24' },
          '50%': { textShadow: '0 0 20px #fbbf24, 0 0 40px #fbbf24, 0 0 60px #fbbf24' },
        },
        'slow-pulse': {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '0.55' },
        },
      },
    },
  },
  plugins: [],
}