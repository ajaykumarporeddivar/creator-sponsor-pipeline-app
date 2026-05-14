/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#6B46C1', // Deep purple
        'brand-secondary': '#805AD5', // Lighter purple accent
        'accent-orange': '#FF8C00', // Bright orange for highlights
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}