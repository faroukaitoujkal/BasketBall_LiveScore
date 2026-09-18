/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        sports: ['Oswald', 'sans-serif'], // Or 'Teko'
      },
      colors: {
        'brand-dark': 'var(--brand-dark)',
        'brand-card': 'var(--brand-card)',
        'brand-card-hover': 'var(--brand-card-hover)',
        'brand-text': 'var(--brand-text)',
        'brand-text-muted': 'var(--brand-text-muted)',
        'brand-border': 'var(--brand-border)',
        'brand-accent': '#FF5722', // Deep Orange
        'brand-accent-hover': '#FF7043',
        'brand-light': '#F8FAFC',
        'brand-success': '#10B981',
        'brand-danger': '#EF4444',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(255, 87, 34, 0.4)',
        'glow-lg': '0 0 25px rgba(255, 87, 34, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
