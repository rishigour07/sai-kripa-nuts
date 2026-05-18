/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#061913",
          emerald: "#0c2b22",
          forest: "#123a2e",
          cream: "#f6f1e6",
          gold: "#c8a96b",
          brass: "#9e7b3f",
          mist: "#d6c8a8",
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      }
    },
  },
  plugins: [],
}
