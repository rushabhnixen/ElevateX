/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        surface: '#1a1a1a',
        accent: '#6366f1',
        'accent-hover': '#4f46e5',
        muted: '#888888',
        border: '#2a2a2a',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      maxWidth: { mobile: '430px' },
    },
  },
  plugins: [],
};
