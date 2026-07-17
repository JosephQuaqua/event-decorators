/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF6E9', 100: '#F5EAC8', 200: '#EDD89A', 300: '#E0C168',
          400: '#D4AE45', 500: '#C9A227', 600: '#A8861E', 700: '#876A18',
          800: '#655113', 900: '#443A0E', 950: '#2A2308',
        },
        ivory: {
          50: '#FDFCFA', 100: '#F8F5F0', 200: '#F1EBE0', 300: '#E6DCC9',
          400: '#D4C5A8', 500: '#BFA982', 600: '#A48E64', 700: '#82704E',
          800: '#65533D', 900: '#4D3F30', 950: '#2E2419',
        },
        emerald: {
          50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7',
          400: '#34D399', 500: '#10B981', 600: '#059669', 700: '#0F5132',
          800: '#065F46', 900: '#064E3B', 950: '#052E1F',
        },
        charcoal: {
          50: '#F7F7F7', 100: '#E3E3E3', 200: '#C8C8C8', 300: '#A4A4A4',
          400: '#818181', 500: '#666666', 600: '#515151', 700: '#434343',
          800: '#2D2D2D', 900: '#1C1C1C', 950: '#0D0D0D',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.7s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInDown: { '0%': { opacity: '0', transform: 'translateY(-24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E0C168 0%, #C9A227 50%, #A8861E 100%)',
        'hero-overlay': 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
      },
      boxShadow: {
        'luxury': '0 20px 60px -15px rgba(0, 0, 0, 0.15)',
        'gold': '0 8px 30px -8px rgba(201, 162, 39, 0.3)',
      },
    },
  },
  plugins: [],
};
