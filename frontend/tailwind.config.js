import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif","Poppins"],
        cyber: ["Orbitron", "sans-serif"],
        horror: ["Nosifer", "cursive"],
        metal: ["Metal Mania"],
        manga: ["Rock Salt"],
        reggae: ["Reggae One"],

      }
    },
  },
  plugins: [typography],
}
