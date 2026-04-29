/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Bu satır manuel tema değişimi için şart!
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'akade-purple': '#a855f7',
        'akade-dark': '#020617',
      },
    },
  },
  plugins: [],
}