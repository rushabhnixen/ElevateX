/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#6366f1',
        'accent-hover': '#4f46e5',
        surface: '#1a1a1a',
        background: '#0f0f0f',
        muted: '#71717a',
        border: '#27272a',
      },
      maxWidth: {
        mobile: '430px',
      },
    },
  },
  plugins: [],
};