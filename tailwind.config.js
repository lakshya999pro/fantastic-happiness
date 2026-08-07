/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '/data/data/com.termux/files/home/build-work/netflix-ui/index.html',
    '/data/data/com.termux/files/home/build-work/netflix-ui/src/**/*.{js,ts,jsx,tsx}',
    '/storage/emulated/0/NewFlix/netflix-ui/index.html',
    '/storage/emulated/0/NewFlix/netflix-ui/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Netflix Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']
      },
      colors: {
        nfred: '#E50914',
        nfdark: '#141414',
        nfcard: '#1A1A1A',
        nfrow: '#232323',
        nfgrey: '#8C8C8C',
        nflight: '#B3B3B3'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        slideDown: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fadeIn .25s ease-out both',
        'slide-up': 'slideUp .28s cubic-bezier(.2,.8,.2,1) both',
        'slide-down': 'slideDown .18s ease-out both'
      }
    }
  },
  plugins: []
};
