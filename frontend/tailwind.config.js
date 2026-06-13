/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "375px",
        tab: "1023px",
        afterPro: "1025px",
        "2xlplus": "1685px", // custom breakpoint
      },
      colors: {
        primary: {
          DEFAULT: "#FAFAFA",
          light: "#3b82f6",
          dark: "#1e40af",
          blue: "#0BA9EF",
        },
        secondary: {
          DEFAULT: "#202020",
          light: "#94a3b8",
          dark: "#222222",
        },
        accent: "#f4ed4f",
        host: "#212529",
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
        comic: ["Comic Sans MS", "cursive", "ui-sans-serif"],
        heading: ["Poppins", "ui-sans-serif", "system-ui"],
        mono: ["Fira Code", "ui-monospace"],
        hero: ["Bebas Neue", "ui-sans-serif", "system-ui"],
        cursive: ["Bilbo Swash Caps"],
        play: ["Playwrite US Modern"],
        comic: ["Comic Relief", "system-ui"],
      },
      fontSize: {
        nano: ["0.65rem", { lineHeight: "0.75rem" }], // ~10px
        micro: ["0.71rem", { lineHeight: "0.7rem" }], // ~10px
        tiny: ["0.75rem", { lineHeight: "1rem" }], // ~12px
        small: ["0.875rem", { lineHeight: "1.5rem" }], // 16px
        content: ["1rem", { lineHeight: "1.5rem" }], // 16px
        "card-title": ["1.5rem", { lineHeight: "1rem" }], // ~20px
        subtitle: ["1.25rem", { lineHeight: "1.75rem" }], // ~20px
        title: ["2rem", { lineHeight: "1" }], // 48px
        hero: ["2rem", { lineHeight: "1" }], // 48px
        "main-header": ["6rem", { lineHeight: "4rem" }], // ~24px
        "mobile-main-header": ["3rem", { lineHeight: "3rem" }], // ~24px
        "mega-header": ["16rem", { lineHeight: "2rem" }], // ~24px
        "mega-desc": ["5rem", { lineHeight: "8rem" }], // ~24px
        "mobile-mega-desc": ["3rem", { lineHeight: "2rem" }], // ~24px
        "mobile-mega-header": ["6rem", { lineHeight: "6rem" }], // ~24px
        "clamp-heading": "clamp(1.3rem, 2.5vw, 2.3rem)",
        giant: "clamp(1.5rem, 20.6vw, 21rem)",
      },
      // etc...
    },
  },
};
