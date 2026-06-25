import { useEffect, useRef, useState } from "react";
import { APPS } from "../apps/registry";
import { Icon } from "./icons";
import { useDesktop } from "../DesktopProvider";

// GNOME Activities Overview / macOS Launchpad — app grid with search.
// (Workspace/screen switcher intentionally omitted.)
export default function Overview({ onClose }) {
  const { openApp } = useDesktop();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const launch = (id) => {
    openApp(id);
    onClose();
  };

  const q = query.trim().toLowerCase();
  const apps = q ? APPS.filter((a) => a.title.toLowerCase().includes(q)) : APPS;

  return (
    <div className="fixed inset-0 z-[145] flex flex-col items-center" onClick={onClose}>
      {/* frost the real desktop behind (windows + wallpaper) */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-2xl" />

      {/* content */}
      <div
        className="relative z-10 mt-20 flex w-full max-w-4xl flex-col items-center px-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* search */}
        <div className="relative mb-12 w-80">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
            <Icon name="search" size={16} />
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search"
            className="w-full rounded-full border border-white/15 bg-white/10 py-2 pl-11 pr-4 text-sm text-white placeholder-white/50 outline-none backdrop-blur focus:border-white/30"
          />
        </div>

        {/* app grid */}
        {apps.length ? (
          <div className="flex max-w-3xl flex-wrap justify-center gap-3">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => launch(app.id)}
                className="flex w-28 flex-col items-center gap-2 rounded-2xl p-3 transition-colors hover:bg-white/10"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-surface text-text">
                  <Icon name={app.icon} size={30} />
                </div>
                <span className="text-sm text-white/90">{app.title}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/60">No results for “{query}”.</p>
        )}
      </div>
    </div>
  );
}
