import { useEffect, useState } from "react";
import TopPanel from "./shell/TopPanel";
import Dock from "./shell/Dock";
import Window from "./shell/Window";
import QuickSettings from "./shell/QuickSettings";
import Overview from "./shell/Overview";
import { useDesktop } from "./DesktopProvider";
import { useSystem } from "./SystemProvider";
import { APP_MAP } from "./apps/registry";
import { installCursors } from "./cursors";

export default function Desktop() {
  const { windows, openApp } = useDesktop();
  const { wallpaper, brightness } = useSystem();
  const [menuOpen, setMenuOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);

  // Open Bio by default once the desktop mounts (behind the boot screen).
  useEffect(() => {
    installCursors();
    openApp("bio");
  }, [openApp]);

  return (
    <div
      className="desktop-root relative h-screen w-screen overflow-hidden text-text-body"
      style={{ background: wallpaper.css }}
    >
      <TopPanel
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((o) => !o)}
        overviewOpen={overviewOpen}
        onToggleOverview={() => setOverviewOpen((o) => !o)}
      />
      <Dock onShowApps={() => setOverviewOpen((o) => !o)} />

      {windows.map((win) =>
        win.minimized ? null : <Window key={win.id} win={win} app={APP_MAP[win.id]} />
      )}

      {/* overlays rendered at desktop level (NOT inside the blurred panel) so they layer correctly */}
      {overviewOpen && <Overview onClose={() => setOverviewOpen(false)} />}
      {menuOpen && <QuickSettings onClose={() => setMenuOpen(false)} />}

      {/* Brightness dim overlay — dims the whole screen like a real display. */}
      <div
        className="pointer-events-none fixed inset-0 z-[195] bg-black transition-opacity"
        style={{ opacity: 1 - brightness }}
      />
    </div>
  );
}
