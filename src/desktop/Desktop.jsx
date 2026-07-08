import { useEffect, useRef, useState } from "react";
import TopPanel from "./shell/TopPanel";
import Dock from "./shell/Dock";
import Window from "./shell/Window";
import QuickSettings from "./shell/QuickSettings";
import Overview from "./shell/Overview";
import GuidedTour from "./GuidedTour";
import DevActivityWidget from "./DevActivityWidget";
import { useDesktop } from "./DesktopProvider";
import { useSystem } from "./SystemProvider";
import { APP_MAP } from "./apps/registry";
import { installCursors } from "./cursors";

export default function Desktop() {
  const { windows, openApp } = useDesktop();
  const { wallpaper, brightness, booting, locked, shouldAutoTour, startTour } = useSystem();
  const [menuOpen, setMenuOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const autoStarted = useRef(false);

  // Open the Ask Me terminal by default once the desktop mounts (behind the boot screen).
  useEffect(() => {
    installCursors();
    openApp("askme");
  }, [openApp]);

  // First-run guided tour: start once the desktop is revealed after boot.
  useEffect(() => {
    if (!booting && !locked && shouldAutoTour && !autoStarted.current) {
      autoStarted.current = true;
      const t = setTimeout(startTour, 550); // let the desktop settle after boot
      return () => clearTimeout(t);
    }
  }, [booting, locked, shouldAutoTour, startTour]);

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

      {/* desktop widget (wallpaper layer — rendered before windows so they stack above it) */}
      <DevActivityWidget />

      {windows.map((win) =>
        win.minimized ? null : <Window key={win.id} win={win} app={APP_MAP[win.id]} />
      )}

      {/* overlays rendered at desktop level (NOT inside the blurred panel) so they layer correctly */}
      {overviewOpen && <Overview onClose={() => setOverviewOpen(false)} />}
      {menuOpen && <QuickSettings onClose={() => setMenuOpen(false)} />}

      <GuidedTour />

      {/* Brightness dim overlay — dims the whole screen like a real display. */}
      <div
        className="pointer-events-none fixed inset-0 z-[195] bg-black transition-opacity"
        style={{ opacity: 1 - brightness }}
      />
    </div>
  );
}
