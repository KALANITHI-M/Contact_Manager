/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '375px',
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      boxShadow: {
        'nav': '0 -10px 30px rgba(0,0,0,0.08)',
        'fab': '0 10px 20px rgba(16,185,129,0.35)',
        'card': '0 6px 18px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
}
