/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./App.tsx",
    "./main.tsx"
  ],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0f2744", light: "#1a3a5c" },
        gold: { DEFAULT: "#c9920a", light: "#f5e6c0", dark: "#a07208" },
        teal: { DEFAULT: "#0a6e55", light: "#dff2ec" },
        primary: "#3B82F6",
        secondary: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
        ethiopic: ['"Noto Sans Ethiopic"', '"DM Sans"', "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 12px rgba(245, 158, 11, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "fade-in-up": "fadeInUp 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "bounce-in": "bounceIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
}
