/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF4EA",
        ivory: "#FFFAF2",
        blush: "#F6D9DB",
        rose: "#C98A93",
        "rose-deep": "#A8626E",
        cocoa: "#5B3A2E",
        "cocoa-soft": "#7A5648",
        night: "#2A1719",
        "night-soft": "#3B2326",
        gold: "#C9A45C",
        "gold-soft": "#E4CB94",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', "Georgia", "serif"],
        display: ['"Playfair Display"', '"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px -18px rgba(91, 58, 46, 0.35)",
        glow: "0 0 40px 6px rgba(201, 138, 147, 0.35)",
        gold: "0 0 30px 2px rgba(201, 164, 92, 0.45)",
      },
      keyframes: {
        bar: {
          "0%, 100%": { transform: "scaleY(0.25)" },
          "50%": { transform: "scaleY(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201,164,92,0.0), 0 10px 30px -10px rgba(168,98,110,0.55)" },
          "50%": { boxShadow: "0 0 0 10px rgba(201,164,92,0.18), 0 14px 40px -10px rgba(168,98,110,0.7)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        caret: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        bar: "bar 1s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.8s ease-in-out infinite",
        bob: "bob 2s ease-in-out infinite",
        caret: "caret 1s steps(1) infinite",
      },
    },
  },
  plugins: [],
};
