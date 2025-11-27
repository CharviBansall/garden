/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-fraunces)", "var(--font-cormorant)", "serif"],
        mono: ["var(--font-space-mono)", "var(--font-jetbrains)", "monospace"],
      },
      colors: {
        rose: {
          50: '#fff1f5',
          100: '#ffe4ef',
          200: '#fecdd6',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        cream: '#fdf6e3',
        pastelYellow: '#fff9c4',
        pastelPink: '#ffd1dc',
        pastelPurple: '#e0bbff',
        pastelBlue: '#bae1ff',
        pastelGreen: '#d4f8e8'
      },
      boxShadow: {
        'soft': '0 4px 24px 0 rgb(0 0 0 / 5%)',
        'pastel': '0 2px 8px 0 #ffd1dc',
      },
      borderRadius: {
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};
