import { useState } from "react";
import { APPS, APP_MAP } from "../apps/registry";
import { Icon } from "./icons";
import { useDesktop } from "../DesktopProvider";

export default function Dock({ onShowApps }) {
  const { openApp, openIds } = useDesktop();
  const [bouncing, setBouncing] = useState(null);

  // Pinned apps always; plus any unpinned app that is currently running.
  const pinned = APPS.filter((a) => a.pinned !== false);
  const runningUnpinned = openIds
    .map((id) => APP_MAP[id])
    .filter((a) => a && a.pinned === false);
  const dockApps = [...pinned, ...runningUnpinned];

  const launch = (id) => {
    openApp(id);
    setBouncing(id);
    setTimeout(() => setBouncing((b) => (b === id ? null : b)), 600);
  };

  return (
    <nav
      aria-label="Dock"
      className="mat-popover absolute left-2.5 top-1/2 z-[140] flex -translate-y-1/2 flex-col gap-2 rounded-[18px] border p-2 shadow-float"
    >
      {dockApps.map((app) => {
        const running = openIds.includes(app.id);
        return (
          <div key={app.id} className={bouncing === app.id ? "animate-dockBounce" : ""}>
            <button
              onClick={() => launch(app.id)}
              title={app.title}
              aria-label={app.title}
              className={`group relative flex h-12 w-12 items-center justify-center rounded-icon border bg-surface transition-transform hover:scale-105 ${
                running ? "text-text" : "text-text-dim hover:text-text"
              }`}
            >
              <span
                className={`absolute -left-1 top-1/2 w-1 -translate-y-1/2 rounded-full bg-accent transition-all ${
                  running ? "h-4" : "h-0"
                }`}
              />
              <Icon name={app.icon} size={22} />
              <span className="pointer-events-none absolute left-[60px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-control border bg-panel px-2.5 py-1 text-xs font-semibold text-text opacity-0 transition-opacity group-hover:opacity-100">
                {app.title}
              </span>
            </button>
          </div>
        );
      })}

      {/* separator + show-apps (Activities Overview / Launchpad) */}
      <div className="mx-auto my-1 h-px w-7 bg-white/15" />
      <button
        onClick={onShowApps}
        title="Show Applications"
        aria-label="Show Applications"
        className="group relative flex h-12 w-12 items-center justify-center rounded-icon border bg-surface text-text-dim transition-transform hover:scale-105 hover:text-text"
      >
        <Icon name="apps" size={22} />
        <span className="pointer-events-none absolute left-[60px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-control border bg-panel px-2.5 py-1 text-xs font-semibold text-text opacity-0 transition-opacity group-hover:opacity-100">
          Show Applications
        </span>
      </button>
    </nav>
  );
}
