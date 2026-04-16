import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        display: ["var(--font-bebas-neue)", "cursive"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        void: "hsl(var(--void))",
        surface: "hsl(var(--surface))",
        panel: "hsl(var(--panel))",
        border: "hsl(var(--border))",
        spark: "hsl(var(--spark))",
        glow: "hsl(var(--glow))",
        ice: "hsl(var(--ice))",
        mint: "hsl(var(--mint))",
        crimson: "hsl(var(--crimson))",
        muted: "hsl(var(--muted))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [],
}
export default config
