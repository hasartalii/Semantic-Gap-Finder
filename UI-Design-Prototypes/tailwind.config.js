/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'akade-blue': '#38bdf8',
        'akade-dark': '#0f172a',
      }
    },
  },
  plugins: [],
}