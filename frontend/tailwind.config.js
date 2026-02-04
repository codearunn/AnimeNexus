/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Bebas Neue", "sans-serif","Orbitron"],
        body: ["Inter", "sans-serif","Poppins"],
        cyber: ["Orbitron", "sans-serif"],
      }
    },
  },
  plugins: [],
}
