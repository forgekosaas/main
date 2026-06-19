import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forgeko: {
          bg: "#0A0A0A",
          section: "#141414",
          text: "#F5F5F5",
          accent: "#4F46E5",
          border: "#1F1F1F"
        }
      },
      maxWidth: {
        copy: "760px"
      },
      boxShadow: {
        glow: "0 0 70px rgba(79, 70, 229, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
