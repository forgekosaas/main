import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hub: {
          bg: "#F7F4EE",
          panel: "#FFFFFF",
          ink: "#1B1B18",
          muted: "#69675F",
          line: "#E3DDD2",
          accent: "#245E4F",
          amber: "#B86B18",
          blue: "#2E5E8C"
        }
      },
      boxShadow: {
        panel: "0 18px 45px rgba(36, 31, 23, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
