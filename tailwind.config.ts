import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          ink: "#fafafa",
            surface: "#f0f0f3",
              line: "rgba(17,17,18,0.08)",
                linestrong: "rgba(17,17,18,0.16)",
                  bone: "#131313",
                    mute: "#68676c",
                      accent: "#5148e5",
                      },
      
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      letterSpacing: {
        tightest2: "-0.035em",
      },
      transitionTimingFunction: {
        expensive: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
