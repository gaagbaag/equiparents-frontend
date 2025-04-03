/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Asegura que Tailwind escanee todos tus archivos
  ],
  theme: {
    extend: {
      colors: {
        primary: "#a5dc6f",
        secondary: "#67146d",
        accent: "#67146d",
        success: "#a5dc6f",
        background: "#fff",
        foreground: "#171717",
        border: "#cccccc",
        text: "#222222",
      },
      borderRadius: {
        DEFAULT: "6px",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0, 0, 0, 0.15)",
      },
      fontFamily: {
        sans: ["Lato", "Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
