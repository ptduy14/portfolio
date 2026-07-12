import { useEffect, useRef, useState } from "react";
import TopPanel from "./shell/TopPanel";
import Dock from "./shell/Dock";
import Window from "./shell/Window";
import QuickSettings from "./shell/QuickSettings";
import Overview from "./shell/Overview";
import GuidedTour from "./GuidedTour";
import DevActivityWidget from "./DevActivityWidget";
import CommandPalette from "./CommandPalette";
import ContextMenu from "./ContextMenu";
import { useDesktop } from "./DesktopProvider";
import { useSystem } from "./SystemProvider";
import { APP_MAP } from "./apps/registry";
import { installCursors } from "./cursors";

// "g"-leader → open app (Linear-style). Mirrors APP_KEYS in CommandPalette.
const GO = { b: "bio", s: "skills", p: "projects", e: "experience", t: "askme", c: "contact", ",": "settings" };

export default function Desktop() {
  const { windows, openApp } = useDesktop();
  const { wallpaper, brightness, booting, locked, shouldAutoTour, startTour } = useSystem();
  const [menuOpen, setMenuOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [ctx, setCtx] = useState(null);
  const autoStarted = useRef(false);

  // Right-click on empty desktop → context menu (ignore windows/dock/panel/links).
  const onContextMenu = (e) => {
    if (e.target.closest('[role="dialog"], nav, .mat-panel, a, button, input, textarea')) return;
    e.preventDefault();
    setCtx({ x: e.clientX, y: e.clientY });
  };

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

  // Global keyboard shortcuts: ⌘K/Ctrl+K command palette, and a "g"-leader to jump to apps.
  useEffect(() => {
    let leader = false;
    let timer;
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      const typing =
        /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable;
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (leader) {
        leader = false;
        clearTimeout(timer);
        const id = GO[e.key.toLowerCase()];
        if (id) {
          e.preventDefault();
          openApp(id);
        }
        return;
      }
      if (e.key.toLowerCase() === "g") {
        leader = true;
        timer = setTimeout(() => (leader = false), 900);
      } else if (e.key === "?") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, [openApp]);

  return (
    <div
      className="desktop-root relative h-screen w-screen overflow-hidden text-text-body"
      style={{ background: wallpaper.css }}
      onContextMenu={onContextMenu}
    >
      <TopPanel
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((o) => !o)}
        overviewOpen={overviewOpen}
        onToggleOverview={() => setOverviewOpen((o) => !o)}
        onOpenPalette={() => setPaletteOpen(true)}
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
      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onOpenOverview={() => setOverviewOpen(true)}
          onOpenQuickSettings={() => setMenuOpen(true)}
        />
      )}

      {ctx && (
        <ContextMenu
          x={ctx.x}
          y={ctx.y}
          onClose={() => setCtx(null)}
          items={[
            { label: "Command palette…", icon: "search", shortcut: "⌘K", run: () => setPaletteOpen(true) },
            { label: "New terminal", icon: "terminal", run: () => openApp("askme") },
            { label: "Show all windows", icon: "apps", run: () => setOverviewOpen(true) },
            { sep: true },
            { label: "Change background", icon: "projects", run: () => openApp("settings") },
            { label: "Settings", icon: "gear", run: () => openApp("settings") },
            { sep: true },
            { label: "Take the guided tour", icon: "bell", run: startTour },
          ]}
        />
      )}

      <GuidedTour />

      {/* Brightness dim overlay — dims the whole screen like a real display. */}
      <div
        className="pointer-events-none fixed inset-0 z-[195] bg-black transition-opacity"
        style={{ opacity: 1 - brightness }}
      />
    </div>
  );
}
