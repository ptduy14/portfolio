import { useEffect, useRef } from "react";
import Clock from "../shell/Clock";
import { Icon } from "../shell/icons";
import { useDesktop } from "../DesktopProvider";
import { useSystem } from "../SystemProvider";
import { APPS, APP_MAP } from "../apps/registry";
import GuidedTour from "../GuidedTour";

function Home({ onOpen }) {
  return (
    <div className="flex-1 overflow-auto p-7">
      <div className="grid grid-cols-3 gap-x-4 gap-y-7">
        {APPS.map((a) => (
          <button key={a.id} onClick={() => onOpen(a.id)} className="flex flex-col items-center gap-2">
            <span className="mat-popover flex h-16 w-16 items-center justify-center rounded-2xl border text-text shadow-float">
              <Icon name={a.icon} size={28} />
            </span>
            <span className="text-center text-xs font-medium text-white/90">{a.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Mobile shell — reuses the window manager as a navigation stack:
// openApp = push a screen, closeApp(top) = back. Only the focused app is shown, full-screen.
export default function MobileShell() {
  const { windows, openApp, closeApp } = useDesktop();
  const { wallpaper, booting, locked, shouldAutoTour, startTour } = useSystem();
  const autoStarted = useRef(false);

  const visible = windows.filter((w) => !w.minimized);
  const top = visible.length ? visible[visible.length - 1] : null;
  const app = top ? APP_MAP[top.id] : null;
  const Body = app?.Component;

  // First-run welcome (shorter track) once the boot screen clears.
  useEffect(() => {
    if (!booting && !locked && shouldAutoTour && !autoStarted.current) {
      autoStarted.current = true;
      const t = setTimeout(startTour, 550);
      return () => clearTimeout(t);
    }
  }, [booting, locked, shouldAutoTour, startTour]);

  return (
    <div
      className="relative flex h-screen w-screen flex-col overflow-hidden text-text-body"
      style={{ background: wallpaper.css }}
    >
      {/* status bar */}
      <div className="mat-panel flex h-9 flex-none items-center justify-center border-b text-[13px] font-semibold text-text">
        <Clock />
      </div>

      {app ? (
        <div className="flex flex-1 flex-col overflow-hidden bg-window">
          <div className="flex h-12 flex-none items-center gap-2 border-b bg-headerbar px-2.5">
            <button
              onClick={() => closeApp(top.id)}
              aria-label="Back"
              className="flex items-center gap-1 rounded-control px-2 py-1.5 text-sm font-medium text-text-dim hover:text-text"
            >
              <Icon name="arrowLeft" size={20} />
            </button>
            <Icon name={app.icon} size={16} className="text-text" />
            <span className="font-bold text-text">{app.title}</span>
          </div>
          <div className={`flex-1 ${app.bare ? "overflow-hidden" : "overflow-auto px-4 py-4"}`}>
            <Body />
          </div>
        </div>
      ) : (
        <Home onOpen={openApp} />
      )}

      <GuidedTour mobile />
    </div>
  );
}
