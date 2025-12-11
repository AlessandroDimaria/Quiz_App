/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}", // se usi ancora /pages
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
  "0%, 100%": { transform: "translateY(0px)" },
  "50%": { transform: "translateY(-50px)" },
},
      },
      animation: {
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};