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
      }
    },
  },
  plugins: [],
}
