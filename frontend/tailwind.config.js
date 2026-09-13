/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff3e8',
          100: '#ffe4c4',
          200: '#ffc68a',
          300: '#ffa050',
          400: '#ff7a20',
          500: '#f97316',
          600: '#e05e00',
          700: '#b84a00',
          800: '#903a00',
          900: '#6b2b00',
        },
        dark: {
          50:  '#f0f0f5',
          100: '#d0d0e0',
          200: '#a0a0c0',
          300: '#70709a',
          400: '#505075',
          500: '#303058',
          600: '#22223d',
          700: '#1a1a2e',
          800: '#121220',
          900: '#0c0c14',
          950: '#080810',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'orb-gradient': 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(249,115,22,0.35) 0%, rgba(249,115,22,0.08) 40%, transparent 70%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        'hero-gradient': 'radial-gradient(ellipse 90% 70% at 50% 100%, rgba(249,115,22,0.28) 0%, rgba(180,40,0,0.12) 40%, transparent 65%)',
      },
      boxShadow: {
        'glow-orange': '0 0 24px rgba(249,115,22,0.25)',
        'glow-orange-sm': '0 0 12px rgba(249,115,22,0.18)',
        'card-dark': '0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.4)',
        'card-dark-hover': '0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
