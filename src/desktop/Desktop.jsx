import { useEffect } from "react";
import TopPanel from "./shell/TopPanel";
import Dock from "./shell/Dock";
import Window from "./shell/Window";
import { useDesktop } from "./DesktopProvider";
import { APP_MAP } from "./apps/registry";

export default function Desktop() {
  const { windows, openApp } = useDesktop();

  // Open Bio by default once the desktop mounts (behind the boot screen).
  useEffect(() => {
    openApp("bio");
  }, [openApp]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-wall text-text-body">
      <TopPanel />
      <Dock />
      {windows.map((win) =>
        win.minimized ? null : <Window key={win.id} win={win} app={APP_MAP[win.id]} />
      )}
    </div>
  );
}
