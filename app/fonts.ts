import localFont from "next/font/local";

/**
 * Primary typeface — Matimo Humanist Sans.
 * Self-hosted from the licensed package (Web-TT/*.woff2). Only the four
 * weights actually used on the site are loaded: 400 / 500 / 600 / 700.
 */
export const matimo = localFont({
  src: [
    { path: "./fonts/matimo/Matimo-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/matimo/Matimo-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/matimo/Matimo-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/matimo/Matimo-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-matimo",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

/**
 * Secondary / accent typeface — Neral Soft Humanist Sans.
 * Used sparingly (eyebrow labels, project metadata, pull quotes). Supplied as
 * TTF only, converted to WOFF2 for delivery. Not preloaded: it never appears
 * in the critical first paint, so it is fetched on demand.
 */
export const neral = localFont({
  src: [
    { path: "./fonts/neral/NeralSoft-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/neral/NeralSoft-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-neral",
  display: "swap",
  preload: false,
  adjustFontFallback: "Arial",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
