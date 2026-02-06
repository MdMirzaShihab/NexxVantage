import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#00C853",
          "primary-dark": "#00391A",
          "primary-light": "#B9F6CA",
          secondary: "#0A0A0A",
          slate: "#1A1A2E",
          "off-white": "#F5F5F7",
          lime: "#76FF03",
          gray: "#9E9E9E",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 200, 83, 0.3)",
        "glow-lg": "0 0 40px rgba(0, 200, 83, 0.4)",
        "glow-lime": "0 0 20px rgba(118, 255, 3, 0.3)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 10s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 200, 83, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 200, 83, 0.6)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-cta": "linear-gradient(135deg, #00391A 0%, #0A0A0A 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
