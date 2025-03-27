// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", 

  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],

  theme: {
    extend: {
      backgroundImage: {
        mist: "url('/bg-mist.jpg')",
      },
      animation: {
        mist: "mist 60s linear infinite",
      },
      keyframes: {
        mist: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 0%" },
        },
      },
    },
  },

  plugins: [],
};

export default config;
