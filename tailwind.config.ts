export default {
    darkMode: "class",
    content: [
      "./app/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
    ],
    theme: {
      extend: {
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
  