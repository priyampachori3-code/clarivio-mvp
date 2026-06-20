/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#EEF2FF",
          100: "#E0E7FF",
          500: "#4F46E5",
          600: "#4338CA",
          700: "#3730A3",
          900: "#1E1B4B",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      }
    },
  },
  plugins: [],
}
