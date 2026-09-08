/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        compliance: { pass: "#16a34a", warn: "#f59e0b", fail: "#dc2626" },
        paper: { DEFAULT: "#f6f1e4", dark: "#ece3cd" },
        ink: { DEFAULT: "#1a1a1a" },
        maroon: { DEFAULT: "#6b1e23", dark: "#4a1418" },
        navy: { DEFAULT: "#11213d", light: "#1c3059" },
        gold: { DEFAULT: "#c9a227", light: "#e8cf7a" },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        ui: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
