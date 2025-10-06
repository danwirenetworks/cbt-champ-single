/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // ✅ If using Next.js App Router
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // Tailwind blue-600
        danger: "#dc2626",  // Tailwind red-600
        success: "#16a34a", // Tailwind green-600
        warning: "#facc15", // Tailwind yellow-400
      },
      animation: {
        pulseSlow: "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // ✅ Better form styling
    require("@tailwindcss/typography"), // ✅ Rich text formatting
  ],
};