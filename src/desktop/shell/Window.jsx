import { useRef } from "react";
import { Icon } from "./icons";
import { useDesktop } from "../DesktopProvider";
import { useDragMove } from "./useDrag";

export default function Window({ win, app }) {
  const ref = useRef(null);
  const { focusedId, focusApp, closeApp, toggleMax, minimize, moveWindow } = useDesktop();
  const focused = focusedId === win.id;
  const Body = app.Component;

  const onHeaderDown = useDragMove(ref, {
    disabled: win.maximized,
    onCommit: (x, y) => moveWindow(win.id, x, y),
  });

  const style = win.maximized
    ? { left: 92, top: 40, right: 14, bottom: 14, width: "auto", height: "auto" }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={app.title}
      onMouseDown={() => focusApp(win.id)}
      style={style}
      className={`absolute flex animate-windowIn flex-col overflow-hidden rounded-window border bg-window ${
        focused ? "border-strong shadow-window-focus" : "shadow-window"
      }`}
    >
      {/* header bar */}
      <div
        onMouseDown={onHeaderDown}
        onDoubleClick={() => toggleMax(win.id)}
        className="flex h-11 flex-none cursor-grab select-none items-center justify-between border-b bg-headerbar px-3 active:cursor-grabbing"
      >
        <div className="pointer-events-none flex items-center gap-2 text-text">
          <Icon name={app.icon} size={17} />
          <span className="text-sm font-bold">{app.title}</span>
        </div>
        <div className="flex items-center gap-2" data-no-drag>
          <button onClick={() => minimize(win.id)} title="minimize" aria-label="minimize" className="h-3 w-3 rounded-full bg-warning" />
          <button onClick={() => toggleMax(win.id)} title="maximize" aria-label="maximize" className="h-3 w-3 rounded-full bg-success" />
          <button onClick={() => closeApp(win.id)} title="close" aria-label="close" className="h-3 w-3 rounded-full bg-destructive" />
        </div>
      </div>

      {/* body */}
      <div className={`flex-1 overflow-auto ${app.bare ? "" : "px-7 py-6 text-text-body"}`}>
        <Body />
      </div>
    </div>
  );
}
