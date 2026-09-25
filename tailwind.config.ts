import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // BSYNC institutional palette — deep survey-blue base with a
        // seal-gold accent (municipal/official, not generic SaaS blue).
        ink: {
          950: "#070C16",
          900: "#0B1526",
          800: "#111E33",
          700: "#182842",
          600: "#233657",
        },
        slate: {
          400: "#7C8AA3",
          300: "#9CA8BE",
          200: "#C4CCDB",
          100: "#E8ECF3",
        },
        seal: {
          DEFAULT: "#C79A3D",
          light: "#E0B968",
          dark: "#8F6E26",
        },
        status: {
          approved: "#2E9E5B",
          "approved-dim": "#173B27",
          anomaly: "#D9A62B",
          "anomaly-dim": "#3B310F",
          violation: "#C6432F",
          "violation-dim": "#3D160F",
        },
      },
      fontFamily: {
        serif: ["'IBM Plex Serif'", "Georgia", "serif"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
        md: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
