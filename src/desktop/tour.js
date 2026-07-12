// Guided-tour config. Bump TOUR_VERSION after shipping new features to re-greet
// returning visitors (unless they permanently opted out via the welcome checkbox).
export const TOUR_VERSION = 3;

// Each step spotlights a REAL element resolved by selector at runtime. If an
// element is missing (viewport, minimised), GuidedTour skips that step rather
// than pointing at nothing. `prefer` is the preferred card side; it falls back
// automatically when there isn't room.
export const TOUR_STEPS = [
  {
    selector: '[data-tour="dock"]',
    title: "Your apps live here",
    body: "Bio, Projects, Skills, Contact — click any icon to open a window. The dock is always one click away.",
    prefer: "right",
  },
  {
    selector: '[data-tour="terminal"]',
    title: "Ask Me — the AI terminal",
    body: 'Ask my assistant anything about my experience, or type "help" for commands. This is the heart of the portfolio.',
    prefer: "left",
  },
  {
    selector: '[data-tour="activities"]',
    title: "Activities & search",
    body: "See every open window and search everything from one place — like GNOME's overview.",
    prefer: "bottom",
  },
  {
    selector: '[data-tour="palette"]',
    title: "Command palette",
    body: "Press ⌘K (or Ctrl+K) — or click here — to jump to any app or run an action. Tip: press G then B/S/P/E/T/C.",
    prefer: "bottom",
  },
  {
    selector: '[data-tour="terminal"] [data-tour="window-controls"]',
    title: "It's a real window",
    body: "Drag the title bar to move, pull the edges to resize, and use these to minimise, maximise, or close.",
    prefer: "bottom",
  },
  {
    selector: '[data-tour="tray"]',
    title: "Make it yours",
    body: "Open Control Center for theme, accent colour, wallpaper, and dark mode.",
    prefer: "bottom",
  },
  {
    selector: '[data-tour="widget"]',
    title: "My live GitHub activity",
    body: "A live contribution heatmap and stats, refreshed daily. Not your thing? Turn it off in Settings → Appearance → Desktop.",
    prefer: "left",
  },
];
