/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-dark': '#0f172a',
        'brand-card': '#1e293b',
        'brand-accent': '#f97316', // Orange
        'brand-light': '#f8fafc',
      }
    },
  },
  plugins: [],
}
