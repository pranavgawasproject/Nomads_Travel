/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "375px",
        tab: "1023px",
        afterPro: "1025px",
        "2xlplus": "1685px",
      },
      colors: {
        dark: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#102a43",
          950: "#0a1929",
        },
        surface: {
          DEFAULT: "#0f1117",
          50: "#1a1d2e",
          100: "#161826",
          200: "#1e2035",
          300: "#252840",
          400: "#2d3050",
        },
        neon: {
          cyan: "#06d6a0",
          teal: "#06b6d4",
          blue: "#3b82f6",
          purple: "#8b5cf6",
          pink: "#ec4899",
        },
        accent: {
          DEFAULT: "#06b6d4",
          hover: "#22d3ee",
          muted: "rgba(6, 182, 212, 0.15)",
          glow: "rgba(6, 182, 212, 0.4)",
        },
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          hover: "rgba(255, 255, 255, 0.08)",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace"],
      },
      fontSize: {
        nano: ["0.65rem", { lineHeight: "0.75rem" }],
        micro: ["0.71rem", { lineHeight: "0.7rem" }],
        tiny: ["0.75rem", { lineHeight: "1rem" }],
        small: ["0.875rem", { lineHeight: "1.5rem" }],
        content: ["1rem", { lineHeight: "1.5rem" }],
        "card-title": ["1.5rem", { lineHeight: "1.25rem" }],
        subtitle: ["1.25rem", { lineHeight: "1.75rem" }],
        title: ["2rem", { lineHeight: "1" }],
        hero: ["2.5rem", { lineHeight: "1.1" }],
        "main-header": ["4rem", { lineHeight: "1" }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-glow":
          "radial-gradient(ellipse at center, rgba(6,182,212,0.15) 0%, transparent 70%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(6, 182, 212, 0.3)",
        "glow-lg": "0 0 40px rgba(6, 182, 212, 0.4)",
        "glow-sm": "0 0 10px rgba(6, 182, 212, 0.2)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "typing": "typing 1.5s steps(3) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(6,182,212,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(6,182,212,0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        typing: {
          "0%": { opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
};
