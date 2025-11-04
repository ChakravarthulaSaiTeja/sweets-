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
        // Theme colors - Warm sweets colors
        cream: "#FFF7EE",
        burgundy: "#8B1A1A",
        gold: "#D4AF37",
        amber: "#FFB347",
        
        // Legacy color mappings for compatibility
        background: "#FFF7EE",
        primary: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#8B1A1A",
          600: "#7A1515",
          700: "#6B1111",
          800: "#5C0E0E",
          900: "#4D0B0B",
        },
        accent: {
          50: "#fffdf7",
          100: "#fff9e6",
          200: "#fff3cc",
          300: "#ffedb3",
          400: "#ffe799",
          500: "#D4AF37",
          600: "#B8941F",
          700: "#9C7A17",
          800: "#7F600F",
          900: "#634607",
        },
        secondary: {
          50: "#fffbf0",
          100: "#fff7e0",
          200: "#ffeec0",
          300: "#ffe6a0",
          400: "#ffdd80",
          500: "#FFB347",
          600: "#E69A2E",
          700: "#CC8015",
          800: "#B36600",
          900: "#994D00",
        },
        text: {
          primary: "#2D2D2D",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-slow": "bounce 2s infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "scale-102": "scale102 0.2s ease-in-out",
        "scale-105": "scale105 0.2s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(139, 26, 26, 0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)" },
        },
        scale102: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.02)" },
        },
        scale105: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
      },
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "medium": "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "strong": "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)",
        "3xl": "0 35px 60px -12px rgba(0, 0, 0, 0.25)",
        "inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
