/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          'base': '#2C46B1',
          'dark': '#2C4091',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F9F9FB',
          200: '#E4E6EC',
          300: '#CDCFD5',
          400: '#74798B',
          500: '#4D505C',
          600: '#1F2025',
        },
        red: {
          'danger': '#B12C4D',
        },
        'blue-base': '#2B6CB0',
        'blue-dark': '#2C5282',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
      keyframes: {
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
} 