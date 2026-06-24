/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ===== Desktop design tokens (see design-system.md) =====
        wall: "var(--bg-wall)",
        panel: "var(--bg-panel)",
        dock: "var(--bg-dock)",
        window: "var(--bg-window)",
        headerbar: "var(--bg-headerbar)",
        surface: "var(--bg-surface)",
        "surface-hover": "var(--bg-surface-hover)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        success: "var(--success)",
        warning: "var(--warning)",
        destructive: "var(--destructive)",
        purple: "var(--purple)",
        text: "var(--text)",
        "text-body": "var(--text-body)",
        "text-dim": "var(--text-dim)",
        "text-on-accent": "var(--text-on-accent)",
        // terminal palette
        "term-bg": "var(--term-bg)",
        "term-fg": "var(--term-fg)",
        "term-green": "var(--term-green)",
        "term-blue": "var(--term-blue)",
        "term-yellow": "var(--term-yellow)",
        "term-purple": "var(--term-purple)",
        "term-red": "var(--term-red)",
        // ===== Legacy aliases (migrate-only, remove in Stage F) =====
        "primary-color": "var(--primary-color)",
        "secondary-color": "var(--secondary-color)",
        "tertiary-color": "var(--tertiary-color)",
        "hover-color": "var(--hover-color)",
        "text-color": "var(--text-color)",
        "text-color-error": "var(--text-color-error)",
      },
      borderColor: {
        DEFAULT: "var(--border)",
        strong: "var(--border-strong)",
      },
      borderRadius: {
        window: "var(--r-window)",
        card: "var(--r-card)",
        icon: "var(--r-icon)",
        control: "var(--r-control)",
      },
      fontFamily: {
        sans: ["Inter", "Cantarell", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Cascadia Code'", "Consolas", "monospace"],
      },
      boxShadow: {
        custom: "rgba(79, 86, 89, 0.2) 0px 8px 24px",
        window: "0 20px 60px rgba(0,0,0,.5)",
        "window-focus": "0 26px 74px rgba(0,0,0,.62)",
      },
      transitionTimingFunction: {
        gnome: "cubic-bezier(.2,0,.2,1)",
      },
      keyframes: {
        slideUpFadeIn: {
          '0%': { transform: 'translateY(30%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        windowIn: {
          '0%': { transform: 'scale(.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        dockBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-12px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        blink: {
          '50%': { opacity: '0' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        drawerIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        slideUpFadeIn: 'slideUpFadeIn 0.4s ease forwards',
        // spring easing (macOS-like overshoot)
        windowIn: 'windowIn var(--dur-base) cubic-bezier(.34,1.56,.64,1) forwards',
        dockBounce: 'dockBounce 0.6s ease',
        blink: 'blink 1s steps(1) infinite',
        toastIn: 'toastIn .28s cubic-bezier(.2,0,.2,1) forwards',
        drawerIn: 'drawerIn .25s cubic-bezier(.2,0,.2,1) forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};
