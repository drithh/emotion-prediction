/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#050f2e',
        secondary: '#fafbfe',
        'primary-button': '#f395ab',
        'secondary-button': '#dae2fb',
        accent: '#63e93a',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
