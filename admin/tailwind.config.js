/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--font-primary)", "sans-serif"],
        secondary: ["var(--font-secondary)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        navbar: ["var(--text-navbar)", { lineHeight: "1.25", fontWeight: "500" }],
        hero: ["var(--text-hero)", { lineHeight: "1.1", fontWeight: "var(--fw-hero)" }],
        head: ["var(--text-display)", { lineHeight: "1.15", fontWeight: "var(--fw-display)" }],
        subhead: ["var(--text-subdisplay)", { lineHeight: "1.2", fontWeight: "var(--fw-subdisplay)" }],
        midhead: ["var(--text-middisplay)", { lineHeight: "1.2", fontWeight: "var(--fw-middisplay)" }],
        sectionhead: ["var(--text-sectionhead)", { lineHeight: "1.3", fontWeight: "var(--fw-sectionhead)" }],
        body: ["var(--text-body)", { lineHeight: "1.3", fontWeight: "var(--fw-body)" }],
        power: ["var(--text-power)", { lineHeight: "1.0", fontWeight: "var(--fw-power)" }],
        vertical: ["var(--text-vertical)", { lineHeight: "1.3", fontWeight: "var(--fw-vertical)" }],
      },
      maxWidth: {
        site: "1440px",
      },
    },
  },
  plugins: [],
};
