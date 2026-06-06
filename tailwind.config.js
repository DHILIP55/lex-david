/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /* ── Fonts ─────────────────────────────────────────────────────
         To swap a font: update --font-primary / --font-secondary in
         index.css and update the Google Fonts import in index.html.
         ─────────────────────────────────────────────────────────────── */
      fontFamily: {
        primary: ["var(--font-primary)", "sans-serif"],
        secondary: ["var(--font-secondary)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },

      /* ── Semantic font-size tokens ─────────────────────────────────
         Sizes come from fluid CSS vars in index.css (no breakpoints).
         Line-heights are unitless ratios — they scale automatically
         with font-size, so no separate --lh-* variables are needed.
         To resize a token: edit its --base-* in index.css.
         ─────────────────────────────────────────────────────────────── */
      fontSize: {
        navbar: [
          "var(--text-navbar)",
          { lineHeight: "1.25", fontWeight: "500" },
        ],
        hero: [
          "var(--text-hero)",
          { lineHeight: "1.1", fontWeight: "var(--fw-hero)" },
        ],
        head: [
          "var(--text-display)",
          { lineHeight: "1.15", fontWeight: "var(--fw-display)" },
        ],
        subhead: [
          "var(--text-subdisplay)",
          { lineHeight: "1.2", fontWeight: "var(--fw-subdisplay)" },
        ],
        midhead: [
          "var(--text-middisplay)",
          { lineHeight: "1.2", fontWeight: "var(--fw-middisplay)" },
        ],
        sectionhead: [
          "var(--text-sectionhead)",
          { lineHeight: "1.3", fontWeight: "var(--fw-sectionhead)" },
        ],
        body: [
          "var(--text-body)",
          { lineHeight: "1.3", fontWeight: "var(--fw-body)" },
        ],
        power: [
          "var(--text-power)",
          { lineHeight: "1.0", fontWeight: "var(--fw-power)" },
        ],
        vertical: [
          "var(--text-vertical)",
          { lineHeight: "1.3", fontWeight: "var(--fw-vertical)" },
        ],
      },

      // /* ── Max-width boundary (all sections except hero) ─────────── */
      // maxWidth: {
      //   site: "1440px",
      // },
    },
  },
  plugins: [],
};
