const colors = require('./ui/colours');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}', 
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './ui/**/*.{js,jsx,ts,tsx}'
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.625rem',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors,
    },
  },
  plugins: [],
};

