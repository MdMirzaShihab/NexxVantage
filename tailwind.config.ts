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
          midnight: {
            DEFAULT: "#0F1E35",
            50: "#E8EBF0",
            100: "#C5CCD8",
            200: "#8B99B1",
            300: "#516689",
            400: "#1A3352",
            500: "#0F1E35",
            600: "#0C1829",
            700: "#09121E",
            800: "#060C14",
            900: "#030609",
          },
          gold: {
            DEFAULT: "#C9A84C",
            50: "#FBF7EC",
            100: "#F5ECD0",
            200: "#EBDA9F",
            300: "#E0C76F",
            400: "#D4B55D",
            500: "#C9A84C",
            600: "#B89539",
            700: "#96792E",
            800: "#745D23",
            900: "#524119",
          },
          charcoal: "#1A1A2E",
          warmgray: "#8B8680",
          parchment: "#F7F6F4",
        },
      },
      fontFamily: {
        display: ["var(--nv-font-display)"],
        body: ["var(--nv-font-body)"],
        mono: ["var(--nv-font-mono)"],
      },
      boxShadow: {
        "neu": "var(--nv-neu-shadow)",
        "neu-sm": "var(--nv-neu-shadow-sm)",
        "neu-lg": "var(--nv-neu-shadow-lg)",
        "neu-inset": "var(--nv-neu-inset)",
        "neu-inset-sm": "var(--nv-neu-inset-sm)",
        "neu-gold": "var(--nv-neu-gold-glow)",
        "gold": "0 4px 16px -2px rgba(201,168,76,0.3)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 10s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
