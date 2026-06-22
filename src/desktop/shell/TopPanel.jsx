import Clock from "./Clock";
import SystemTray from "./SystemTray";

export default function TopPanel() {
  return (
    <div className="absolute inset-x-0 top-0 z-[150] flex h-8 items-center justify-between border-b bg-panel px-3 text-[13px] font-semibold text-text">
      <div className="cursor-pointer rounded-control px-2.5 py-0.5 hover:bg-surface-hover">
        Activities
      </div>
      <div className="absolute left-1/2 -translate-x-1/2">
        <Clock />
      </div>
      <SystemTray />
    </div>
  );
}
