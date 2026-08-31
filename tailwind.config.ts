import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#faf7f2",
        bark: "#3c2a21",
        espresso: "#5c3d2e",
        clay: "#a9744f",
        sage: "#7a8b6f",
        line: "#e5ddd2",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
