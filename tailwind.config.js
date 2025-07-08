/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5624d0",
        secondary: "#1c1d1f",
        accent: "#f9ba00",
        surface: "#ffffff",
        background: "#f7f9fa",
        success: "#46c756",
        warning: "#f9ba00",
        error: "#e74c3c",
        info: "#3498db",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        'bounce-badge': 'bounce 0.5s ease-in-out 2',
      },
    },
  },
  plugins: [],
}