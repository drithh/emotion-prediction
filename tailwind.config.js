/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1d0906',
        secondary: '#fae8e6',
        'primary-button': '#2395a4',
        'secondary-button': '#f3cdc8',
        accent: '#114950',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
