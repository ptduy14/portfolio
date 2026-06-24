// Self-designed macOS-style cursors as data-URI (same approach as wallpaperArt):
// self-contained, no asset files, no license concerns, exact hotspot control.
// macOS convention: arrow for default AND clickable UI; I-beam only for text fields.

// Drawing uses a 24-unit viewBox but renders smaller (scaled down) for a compact cursor.
const arrowSvg =
  `<svg xmlns='http://www.w3.org/2000/svg' width='19' height='19' viewBox='0 0 24 24'>` +
  `<path d='M3 2 L3 18.5 L7.4 14.2 L10.2 20.6 L12.9 19.4 L10.1 13.1 L15.8 13.1 Z' ` +
  `fill='#000' stroke='#fff' stroke-width='1.4' stroke-linejoin='round'/></svg>`;

const textSvg =
  `<svg xmlns='http://www.w3.org/2000/svg' width='10' height='19' viewBox='0 0 12 24'>` +
  `<g fill='none' stroke-linecap='round'>` +
  `<path d='M3 3 H9 M3 21 H9 M6 3 V21' stroke='#fff' stroke-width='3.6'/>` +
  `<path d='M3 3 H9 M3 21 H9 M6 3 V21' stroke='#000' stroke-width='1.3'/>` +
  `</g></svg>`;

// Pointing-hand for clickable elements (matches the arrow's black-fill / white-outline style).
const handSvg =
  `<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24'>` +
  `<path d='M8 5 a1.6 1.6 0 0 1 3.2 0 v4.8 c0 .3 .2 .5 .5 .5 h3.4 a3.4 3.4 0 0 1 3.4 3.4 ` +
  `v3.1 a4 4 0 0 1 -4 4 h-4.2 a3.8 3.8 0 0 1 -2.7 -1.13 l-3.5 -3.5 ` +
  `a1.5 1.5 0 0 1 2.12 -2.12 l1.5 1.5 V5 z' ` +
  `fill='#000' stroke='#fff' stroke-width='1.3' stroke-linejoin='round'/></svg>`;

const uri = (svg, hx, hy) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hx} ${hy}`;

// Hotspots in rendered (scaled) pixels: arrow tip ≈ (2,2), I-beam center ≈ (5,9), hand index-tip ≈ (7,2).
export const CURSOR_ARROW = uri(arrowSvg, 2, 2);
export const CURSOR_TEXT = uri(textSvg, 5, 9);
export const CURSOR_POINTER = uri(handSvg, 7, 5);

// Set CSS variables once; index.css references them (var keeps data-URIs out of CSS file).
export function installCursors() {
  if (typeof document === "undefined") return;
  const s = document.documentElement.style;
  s.setProperty("--cursor-arrow", CURSOR_ARROW);
  s.setProperty("--cursor-text", CURSOR_TEXT);
  s.setProperty("--cursor-pointer", CURSOR_POINTER);
}
