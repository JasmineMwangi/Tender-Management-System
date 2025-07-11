/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // ✅ All React components
    "./public/index.html",         // ✅ If using CRA
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
