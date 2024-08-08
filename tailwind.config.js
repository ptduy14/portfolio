/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "var(--primary-color)",
        "secondary-color": "var(--secondary-color)",
        "tertiary-color": "var(--tertiary-color)",
        "hover-color": "var(--hover-color)",
        "text-color": "var(--text-color)",
        "text-color-error": "var(--text-color-error)",
      },
      boxShadow: {
        custom: "rgba(79, 86, 89, 0.2) 0px 8px 24px",
      },
      keyframes: {
        slideUpFadeIn: {
          '0%': { transform: 'translateY(30%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        slideUpFadeIn: 'slideUpFadeIn 0.4s ease forwards',
      },
    },
  },
  plugins: [],
};
