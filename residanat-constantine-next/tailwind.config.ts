import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0f172a",
          soft: "#111827",
          light: "#f8fafc"
        },
        card: {
          dark: "#0b1220",
          light: "#ffffff"
        },
        text: {
          dark: "#e6edf3",
          light: "#0f172a",
          muted: "#6b7280"
        },
        primary: "#2563eb",
        accent: "#16a34a",
        warn: "#d97706",
        danger: "#dc2626"
      },
      boxShadow: {
        glass: "0 10px 30px rgba(0,0,0,.25)"
      }
    }
  },
  plugins: []
}
export default config;
