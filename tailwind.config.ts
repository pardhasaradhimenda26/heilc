import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#080808",
        "bg-2": "#0C0C0C",
        "bg-3": "#111111",
        teal: "#14C5D4",
        "teal-dim": "rgba(20,197,212,0.15)",
        violet: "#7C5CBF",
        "card-bg": "rgba(255,255,255,0.04)",
        "card-border": "rgba(255,255,255,0.08)",
        "card-hover": "rgba(20,197,212,0.15)",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        body: ["var(--font-satoshi)", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-teal": "pulse-teal 2s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 25s linear infinite",
        "marquee-reverse": "marquee-reverse 25s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        "pulse-teal": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(20,197,212,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(20,197,212,0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
