import { useEffect } from "react";
import { Icon } from "./icons";
import { useSystem } from "../SystemProvider";
import { useTheme } from "../../context/ThemeContext";
import { useDesktop } from "../DesktopProvider";

function Slider({ icon, value, min, max, onChange }) {
  return (
    <div className="flex items-center gap-3 px-1 py-1.5">
      <Icon name={icon} size={18} className="flex-none text-text-dim" />
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer accent-accent"
      />
    </div>
  );
}

function Row({ icon, label, value, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-control px-2.5 py-2 text-left text-sm transition-colors hover:bg-surface-hover ${
        danger ? "text-destructive" : "text-text"
      }`}
    >
      <Icon name={icon} size={18} className="flex-none" />
      <span className="flex-1 font-medium">{label}</span>
      {value && <span className="text-xs text-text-dim">{value}</span>}
      <Icon name="chevronRight" size={15} className="text-text-dim" />
    </button>
  );
}

export default function QuickSettings({ onClose }) {
  const { brightness, setBrightness, volume, setVolume, network, battery, lock, reboot } =
    useSystem();
  const { isDark, toggleTheme } = useTheme();
  const { openApp } = useDesktop();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const go = (fn) => () => {
    fn();
    onClose();
  };

  return (
    <>
      {/* click-outside catcher */}
      <div className="fixed inset-0 z-[158]" onClick={onClose} />

      <div
        role="menu"
        className="absolute right-2 top-[38px] z-[160] w-[330px] rounded-window border-strong border bg-window p-2.5 shadow-window-focus"
      >
        {/* pointer triangle */}
        <div className="absolute -top-1.5 right-5 h-3 w-3 rotate-45 border-l border-t border-[color:var(--border-strong)] bg-window" />

        {/* sliders */}
        <Slider icon="volume" value={volume} min={0} max={100} onChange={setVolume} />
        <Slider
          icon="sun"
          value={Math.round(brightness * 100)}
          min={40}
          max={100}
          onChange={(v) => setBrightness(v / 100)}
        />

        <div className="my-2 border-t" />

        {/* network + battery (decorative) */}
        <Row icon="wifi" label={network.name} />
        <Row icon="battery" label={`${battery.untilFull} Until Full (${battery.percent}%)`} />

        <div className="my-2 border-t" />

        {/* dark/light quick toggle */}
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-control px-2.5 py-2 text-left text-sm text-text transition-colors hover:bg-surface-hover"
        >
          <Icon name={isDark ? "moon" : "sun"} size={18} className="flex-none" />
          <span className="flex-1 font-medium">{isDark ? "Dark Style" : "Light Style"}</span>
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-text-on-accent">
            {isDark ? "ON" : "OFF"}
          </span>
        </button>

        <div className="my-2 border-t" />

        {/* actions */}
        <Row icon="gear" label="Settings" onClick={go(() => openApp("settings"))} />
        <Row icon="lock" label="Lock" onClick={go(lock)} />
        <Row icon="power" label="Power Off / Log Out" danger onClick={go(reboot)} />
      </div>
    </>
  );
}
