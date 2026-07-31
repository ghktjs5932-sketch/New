import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // Deep Navy
        foreground: "#f8fafc",
        neonCyan: "#22d3ee",
        pixelPink: "#f472b6",
        brightYellow: "#facc15",
      },
    },
  },
  plugins: [],
};
export default config;
