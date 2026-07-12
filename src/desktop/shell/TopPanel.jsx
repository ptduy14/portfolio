import Clock from "./Clock";
import SystemTray from "./SystemTray";
import { Icon } from "./icons";
import { useDesktop } from "../DesktopProvider";
import { APP_MAP } from "../apps/registry";

export default function TopPanel({ menuOpen, onToggleMenu, overviewOpen, onToggleOverview, onOpenPalette }) {
  const { focusedId } = useDesktop();
  const focusedApp = focusedId ? APP_MAP[focusedId] : null;

  return (
    <div className="mat-panel absolute inset-x-0 top-0 z-[150] flex h-8 items-center justify-between border-b px-3 text-[13px] font-semibold text-text">
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleOverview}
          data-tour="activities"
          className={`rounded-control px-2.5 py-0.5 transition-colors hover:bg-surface-hover ${
            overviewOpen ? "bg-surface-hover" : ""
          }`}
        >
          Activities
        </button>
        {focusedApp && (
          <span className="px-1.5 font-bold text-text">{focusedApp.title}</span>
        )}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Clock />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenPalette}
          data-tour="palette"
          title="Search — Command palette (⌘K)"
          aria-label="Command palette"
          className="flex items-center justify-center rounded-control p-1 text-text-dim transition-colors hover:bg-surface-hover hover:text-text"
        >
          <Icon name="search" size={16} />
        </button>
        <span className="h-4 w-px bg-white/10" aria-hidden="true" />
        <SystemTray open={menuOpen} onClick={onToggleMenu} />
      </div>
    </div>
  );
}
