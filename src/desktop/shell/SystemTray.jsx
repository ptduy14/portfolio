import { Icon } from "./icons";
import { useTheme } from "../../context/ThemeContext";

export default function SystemTray() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-3 text-text-dim">
      <Icon name="volume" size={16} />
      <Icon name="wifi" size={16} />
      <Icon name="battery" size={20} />
      <button
        data-no-drag
        onClick={toggleTheme}
        title={isDark ? "Switch to light" : "Switch to dark"}
        aria-label="Toggle theme"
        className="transition-colors hover:text-text"
      >
        <Icon name={isDark ? "sun" : "moon"} size={16} />
      </button>
    </div>
  );
}
