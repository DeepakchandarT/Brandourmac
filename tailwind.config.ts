import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          ink: "#f6f4ef",
            surface: "#edeae2",
              line: "rgba(17,17,18,0.08)",
                linestrong: "rgba(17,17,18,0.16)",
                  bone: "#131313",
                    mute: "#68676c",
                      accent: "#4640de",
                      },
      
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      letterSpacing: {
        tightest2: "-0.045em",
      },
      transitionTimingFunction: {
        expensive: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
