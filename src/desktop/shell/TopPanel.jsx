import { useState } from "react";
import Clock from "./Clock";
import SystemTray from "./SystemTray";
import QuickSettings from "./QuickSettings";
import { useDesktop } from "../DesktopProvider";
import { APP_MAP } from "../apps/registry";

export default function TopPanel() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { focusedId } = useDesktop();
  const focusedApp = focusedId ? APP_MAP[focusedId] : null;

  return (
    <div className="mat-panel absolute inset-x-0 top-0 z-[150] flex h-8 items-center justify-between border-b px-3 text-[13px] font-semibold text-text">
      <div className="flex items-center gap-1">
        <div className="cursor-pointer rounded-control px-2.5 py-0.5 hover:bg-surface-hover">
          Activities
        </div>
        {focusedApp && (
          <span className="px-1.5 font-bold text-text">{focusedApp.title}</span>
        )}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Clock />
      </div>

      <SystemTray open={menuOpen} onClick={() => setMenuOpen((o) => !o)} />
      {menuOpen && <QuickSettings onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
