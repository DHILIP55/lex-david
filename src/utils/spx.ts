/**
 * spx — fluid pixel scaling utility
 *
 * Mirrors the --theme-spx-ratio CSS system in JS.
 * Use this for inline styles, GSAP values, or any case
 * where a Tailwind class isn't flexible enough.
 *
 * Reference width: 1440px  (same as --theme-spx-ratio in index.css)
 *
 * @param basePx  - pixel size at the 1440px design reference
 * @param minPx   - optional floor (prevents shrinking too small)
 * @param maxPx   - optional ceiling (prevents growing too large)
 * @returns CSS calc() / clamp() string, ready for inline style props
 *
 * @example
 *   // As a CSS string (inline style)
 *   <div style={{ fontSize: spx(90, 32, 110) }} />
 *   // → "clamp(32px, calc(90 * (1vw / 14.4)), 110px)"
 *
 *   // Numeric value at current viewport (for GSAP / canvas)
 *   const size = spxValue(90, 32, 110)
 */

const REFERENCE_WIDTH = 1440;

/** Returns a CSS clamp/calc string — use in inline `style` props */
export const spx = (basePx: number, minPx?: number, maxPx?: number): string => {
  const fluid = `calc(${basePx} * (1vw / ${REFERENCE_WIDTH / 100}))`;

  if (minPx !== undefined && maxPx !== undefined) {
    return `clamp(${minPx}px, ${fluid}, ${maxPx}px)`;
  }
  if (minPx !== undefined) return `clamp(${minPx}px, ${fluid}, 9999px)`;
  if (maxPx !== undefined) return `clamp(0px, ${fluid}, ${maxPx}px)`;
  return fluid;
};

/** Returns a numeric px value at the current viewport — use for GSAP / canvas */
export const spxValue = (basePx: number, minPx?: number, maxPx?: number): number => {
  const vw = window.innerWidth;
  let value = (basePx * vw) / REFERENCE_WIDTH;
  if (minPx !== undefined) value = Math.max(value, minPx);
  if (maxPx !== undefined) value = Math.min(value, maxPx);
  return value;
};
