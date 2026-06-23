import { Icon } from "./icons";
import { useSystem } from "../SystemProvider";

// Tray button group that opens the Quick Settings menu (GNOME system menu).
export default function SystemTray({ open, onClick }) {
  const { volume } = useSystem();

  return (
    <button
      data-no-drag
      onClick={onClick}
      aria-label="System menu"
      aria-expanded={open}
      className={`flex items-center gap-2.5 rounded-control px-2 py-0.5 text-text-dim transition-colors hover:text-text ${
        open ? "bg-surface-hover text-text" : ""
      }`}
    >
      <Icon name="volume" size={16} className={volume === 0 ? "opacity-40" : ""} />
      <Icon name="wifi" size={16} />
      <Icon name="battery" size={18} />
      <Icon name="chevronDown" size={13} />
    </button>
  );
}
