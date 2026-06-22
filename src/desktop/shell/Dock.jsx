import { APPS } from "../apps/registry";
import { Icon } from "./icons";
import { useDesktop } from "../DesktopProvider";

export default function Dock() {
  const { openApp, openIds } = useDesktop();

  return (
    <nav
      aria-label="Dock"
      className="absolute left-2.5 top-1/2 z-[140] flex -translate-y-1/2 flex-col gap-2 rounded-[18px] border bg-dock p-2"
    >
      {APPS.map((app) => {
        const running = openIds.includes(app.id);
        return (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            title={app.title}
            aria-label={app.title}
            className={`group relative flex h-12 w-12 items-center justify-center rounded-icon border bg-surface transition-transform hover:scale-110 ${
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
        );
      })}
    </nav>
  );
}
