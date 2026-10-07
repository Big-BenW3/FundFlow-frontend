/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FFFFFF",
        soft: "#F7F7F3",
        card: "#FFFFFF",
        ink: "#0A0A0A",
        body: "#55555F",
        muted: "#8A8A85",
        hairline: "#E8E8E0",
        voltage: "#FAFF69",
        "voltage-deep": "#E4E952",
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#E5484D",
        info: "#2563EB",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,10,10,0.04), 0 8px 24px -12px rgba(10,10,10,0.12)",
        pop: "0 12px 40px -12px rgba(10,10,10,0.22)",
      },
    },
  },
  plugins: [],
};
