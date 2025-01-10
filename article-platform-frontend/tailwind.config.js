/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // Matches all JS/TS/JSX/TSX files in the src folder
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(-20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        slideIn: "slideIn 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
