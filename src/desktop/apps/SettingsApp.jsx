import { useRef, useState } from "react";
import { Icon } from "../shell/icons";
import { useSystem } from "../SystemProvider";
import { useTheme } from "../../context/ThemeContext";
import { COLORS, ACCENTS } from "../presets";
import { WALLPAPERS } from "../wallpaperArt";

const CATEGORIES = [
  { id: "background", label: "Background", icon: "projects" },
  { id: "appearance", label: "Appearance", icon: "skills" },
  { id: "sound", label: "Sound", icon: "volume" },
  { id: "power", label: "Power", icon: "battery" },
  { id: "about", label: "About", icon: "bio" },
];

function SectionTitle({ children }) {
  return <h2 className="mb-4 text-lg font-bold text-text">{children}</h2>;
}

function Thumb({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group overflow-hidden rounded-card border text-left transition-transform hover:scale-[1.03] ${
        active ? "border-strong ring-2 ring-accent" : ""
      }`}
    >
      <div className="h-20 w-full" style={{ background: item.css }} />
      <div className="px-2.5 py-1.5 text-xs text-text-body">{item.name}</div>
    </button>
  );
}

function Background() {
  const { wallpaperId, setWallpaperId, setCustomWallpaper } = useSystem();
  const fileRef = useRef(null);

  const onPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomWallpaper(`url("${url}") center / cover no-repeat`);
    e.target.value = ""; // allow re-picking same file
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle>Background</SectionTitle>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 rounded-control border px-3 py-1.5 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
        >
          <Icon name="projects" size={16} />
          Add Picture…
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
      </div>

      {wallpaperId === "custom" && (
        <p className="mb-4 text-xs text-text-dim">Using a custom picture (kept for this session).</p>
      )}

      <div className="mb-2 text-sm font-medium text-text-body">Wallpapers</div>
      <div className="mb-6 grid grid-cols-3 gap-3">
        {WALLPAPERS.map((w) => (
          <Thumb key={w.id} item={w} active={wallpaperId === w.id} onClick={() => setWallpaperId(w.id)} />
        ))}
      </div>

      <div className="mb-2 text-sm font-medium text-text-body">Colors</div>
      <div className="grid grid-cols-3 gap-3">
        {COLORS.map((c) => (
          <Thumb key={c.id} item={c} active={wallpaperId === c.id} onClick={() => setWallpaperId(c.id)} />
        ))}
      </div>
    </div>
  );
}

function Appearance() {
  const { isDark, toggleTheme } = useTheme();
  const { accentId, setAccentId, showWidgets, setShowWidgets } = useSystem();
  return (
    <div>
      <SectionTitle>Appearance</SectionTitle>

      <div className="mb-6">
        <div className="mb-2 text-sm font-medium text-text-body">Style</div>
        <div className="flex gap-3">
          {[
            { k: true, label: "Dark" },
            { k: false, label: "Light" },
          ].map((o) => (
            <button
              key={o.label}
              onClick={() => isDark !== o.k && toggleTheme()}
              className={`flex-1 rounded-card border px-4 py-3 text-sm font-medium transition-colors ${
                isDark === o.k ? "border-strong bg-surface-hover text-text" : "text-text-dim hover:text-text"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 text-sm font-medium text-text-body">Accent color</div>
        <div className="flex flex-wrap gap-3">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccentId(a.id)}
              title={a.name}
              aria-label={a.name}
              style={{ background: a.accent }}
              className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${
                accentId === a.id ? "ring-2 ring-text ring-offset-2 ring-offset-window" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-text-body">Desktop</div>
        <button
          onClick={() => setShowWidgets(!showWidgets)}
          role="switch"
          aria-checked={showWidgets}
          className="flex w-full items-center justify-between rounded-card border bg-surface px-4 py-3 text-left transition-colors hover:bg-surface-hover"
        >
          <span>
            <span className="block text-sm font-medium text-text">Dev Activity widget</span>
            <span className="block text-xs text-text-dim">GitHub stats &amp; contribution heatmap, bottom-right</span>
          </span>
          <span className={`relative h-6 w-10 flex-none rounded-full transition-colors ${showWidgets ? "bg-accent" : "bg-white/15"}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${showWidgets ? "left-[18px]" : "left-0.5"}`} />
          </span>
        </button>
      </div>
    </div>
  );
}

function Sound() {
  const { volume, setVolume } = useSystem();
  return (
    <div>
      <SectionTitle>Sound</SectionTitle>
      <div className="mb-2 text-sm font-medium text-text-body">Output volume — {volume}%</div>
      <div className="flex items-center gap-3">
        <Icon name="volume" size={20} className="text-text-dim" />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="h-1 w-full max-w-sm cursor-pointer accent-accent"
        />
      </div>
    </div>
  );
}

function Power() {
  const { battery } = useSystem();
  return (
    <div>
      <SectionTitle>Power</SectionTitle>
      <div className="rounded-card border bg-surface p-4">
        <div className="flex items-center gap-3">
          <Icon name="battery" size={22} className="text-success" />
          <div>
            <div className="text-sm font-semibold text-text">Battery — {battery.percent}%</div>
            <div className="text-xs text-text-dim">
              {battery.charging ? `Charging · ${battery.untilFull} until full` : "Discharging"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function About() {
  const { startTour } = useSystem();
  const info = [
    ["Device name", "duy@portfolio"],
    ["OS", "Portfolio OS 1.0 (GNOME-flavored)"],
    ["Processor", "Duy Core™ i9 · full-stack"],
    ["Memory", "16 GB caffeine-backed"],
    ["Stack", "React · Tailwind · NestJS · Solidity"],
    ["Graphics", "Adwaita Flat Renderer"],
  ];
  return (
    <div>
      <SectionTitle>About</SectionTitle>
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-icon bg-accent text-3xl font-extrabold text-text-on-accent">
          D
        </div>
        <div>
          <div className="text-lg font-bold text-text">Portfolio OS</div>
          <div className="text-sm text-text-dim">a desktop you can actually click around</div>
        </div>
      </div>
      <dl className="divide-y divide-[color:var(--border)] rounded-card border">
        {info.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-2.5 text-sm">
            <dt className="text-text-dim">{k}</dt>
            <dd className="font-medium text-text">{v}</dd>
          </div>
        ))}
      </dl>

      <button
        onClick={startTour}
        className="mt-5 flex items-center gap-2 rounded-control border px-3.5 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
      >
        <Icon name="bell" size={16} />
        Replay the guided tour
      </button>
    </div>
  );
}

const PANELS = {
  background: Background,
  appearance: Appearance,
  sound: Sound,
  power: Power,
  about: About,
};

export default function SettingsApp() {
  const [active, setActive] = useState("background");
  const Panel = PANELS[active];

  return (
    <div className="flex h-full">
      {/* sidebar */}
      <nav className="w-48 flex-none border-r bg-headerbar p-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`mb-1 flex w-full items-center gap-2.5 rounded-control px-3 py-2 text-left text-sm transition-colors ${
              active === c.id ? "bg-accent text-text-on-accent" : "text-text-body hover:bg-surface-hover"
            }`}
          >
            <Icon name={c.icon} size={17} className="flex-none" />
            {c.label}
          </button>
        ))}
      </nav>

      {/* content */}
      <div className="flex-1 overflow-auto p-7">
        <Panel />
      </div>
    </div>
  );
}
