import { useEffect } from "react";
import { Icon } from "./icons";
import { useSystem } from "../SystemProvider";
import { useTheme } from "../../context/ThemeContext";
import { useDesktop } from "../DesktopProvider";

// macOS Control Center–style toggle tile
function Tile({ icon, label, sub, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-colors ${
        active
          ? "border-transparent bg-accent text-text-on-accent"
          : "bg-white/[0.06] text-text hover:bg-white/[0.12]"
      }`}
    >
      <span
        className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${
          active ? "bg-white/25" : "bg-white/10"
        }`}
      >
        <Icon name={icon} size={16} />
      </span>
      <div className="min-w-0">
        <div className="truncate text-[13px] font-semibold leading-tight">{label}</div>
        {sub && <div className="truncate text-[11px] opacity-70">{sub}</div>}
      </div>
    </button>
  );
}

function SliderRow({ icon, value, min, max, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <Icon name={icon} size={16} className="flex-none text-text-dim" />
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer rounded-full accent-accent"
      />
    </div>
  );
}

function ActionRow({ icon, label, value, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-white/[0.08] ${
        danger ? "text-destructive" : "text-text"
      }`}
    >
      <Icon name={icon} size={17} className="flex-none" />
      <span className="flex-1 font-medium">{label}</span>
      {value && <span className="text-xs text-text-dim">{value}</span>}
      <Icon name="chevronRight" size={14} className="text-text-dim" />
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
      <div className="fixed inset-0 z-[158]" onClick={onClose} />

      <div
        role="menu"
        className="mat-popover absolute right-2 top-[38px] z-[160] w-[330px] space-y-2.5 rounded-2xl border p-3 shadow-float"
        style={{ borderColor: "var(--mat-border)" }}
      >
        <div
          className="mat-popover absolute -top-1.5 right-5 h-3 w-3 rotate-45 border-l border-t"
          style={{ borderColor: "var(--mat-border)" }}
        />

        {/* toggle tiles */}
        <div className="grid grid-cols-2 gap-2.5">
          <Tile icon="wifi" label="Wi-Fi" sub={network.name} active />
          <Tile
            icon={isDark ? "moon" : "sun"}
            label={isDark ? "Dark" : "Light"}
            sub="Appearance"
            active={isDark}
            onClick={toggleTheme}
          />
        </div>

        {/* sliders module */}
        <div className="space-y-3 rounded-xl border bg-white/[0.05] p-3">
          <SliderRow icon="sun" value={Math.round(brightness * 100)} min={40} max={100} onChange={(v) => setBrightness(v / 100)} />
          <SliderRow icon="volume" value={volume} min={0} max={100} onChange={setVolume} />
        </div>

        {/* actions module */}
        <div className="rounded-xl border bg-white/[0.05] p-1">
          <ActionRow icon="battery" label="Battery" value={`${battery.percent}%`} onClick={() => {}} />
          <ActionRow icon="gear" label="Settings" onClick={go(() => openApp("settings"))} />
          <ActionRow icon="lock" label="Lock" onClick={go(lock)} />
          <ActionRow icon="power" label="Power Off / Log Out" danger onClick={go(reboot)} />
        </div>
      </div>
    </>
  );
}
