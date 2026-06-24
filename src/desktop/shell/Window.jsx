import { useCallback, useRef } from "react";
import { Icon } from "./icons";
import { useDesktop } from "../DesktopProvider";
import { useDragMove } from "./useDrag";

const MIN_W = 320;
const MIN_H = 200;

export default function Window({ win, app }) {
  const ref = useRef(null);
  const { focusedId, focusApp, closeApp, toggleMax, minimize, moveWindow, resizeWindow } =
    useDesktop();
  const focused = focusedId === win.id;
  const Body = app.Component;

  const onHeaderDown = useDragMove(ref, {
    disabled: win.maximized,
    onCommit: (x, y) => moveWindow(win.id, x, y),
  });

  // Resize from edges/corner ('e' = right, 's' = bottom, 'se' = corner).
  const onResizeStart = useCallback(
    (dir) => (e) => {
      if (win.maximized) return;
      e.preventDefault();
      e.stopPropagation();
      const el = ref.current;
      const sx = e.clientX;
      const sy = e.clientY;
      const sw = el.offsetWidth;
      const sh = el.offsetHeight;
      const prevTransition = el.style.transition;
      el.style.transition = "none";

      const move = (ev) => {
        if (dir.includes("e")) el.style.width = Math.max(MIN_W, sw + ev.clientX - sx) + "px";
        if (dir.includes("s")) el.style.height = Math.max(MIN_H, sh + ev.clientY - sy) + "px";
      };
      const up = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        el.style.transition = prevTransition;
        resizeWindow(win.id, el.offsetWidth, el.offsetHeight);
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    },
    [win.id, win.maximized, resizeWindow]
  );

  // Explicit px for both states so width/height/left/top can transition smoothly.
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const style = win.maximized
    ? { left: 92, top: 40, width: vw - 92 - 14, height: vh - 40 - 14 }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={app.title}
      onMouseDown={() => focusApp(win.id)}
      style={style}
      className={`absolute flex animate-windowIn flex-col overflow-hidden rounded-window border bg-window transition-[left,top,width,height,opacity] duration-200 ease-out ${
        focused ? "border-strong shadow-window-focus" : "opacity-90 shadow-window"
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
        {/* macOS traffic-lights: gray when inactive, reveal glyphs on hover */}
        <div className="group/lights flex items-center gap-2" data-no-drag>
          <button
            onClick={() => minimize(win.id)}
            title="minimize"
            aria-label="minimize"
            className={`flex h-[15px] w-[15px] items-center justify-center rounded-full ${focused ? "bg-warning" : "bg-white/25"}`}
          >
            <span className="text-[11px] font-bold leading-none text-black/55 opacity-0 group-hover/lights:opacity-100">−</span>
          </button>
          <button
            onClick={() => toggleMax(win.id)}
            title="maximize"
            aria-label="maximize"
            className={`flex h-[15px] w-[15px] items-center justify-center rounded-full ${focused ? "bg-success" : "bg-white/25"}`}
          >
            <span className="text-[10px] font-bold leading-none text-black/55 opacity-0 group-hover/lights:opacity-100">+</span>
          </button>
          <button
            onClick={() => closeApp(win.id)}
            title="close"
            aria-label="close"
            className={`flex h-[15px] w-[15px] items-center justify-center rounded-full ${focused ? "bg-destructive" : "bg-white/25"}`}
          >
            <span className="text-[11px] font-bold leading-none text-black/55 opacity-0 group-hover/lights:opacity-100">×</span>
          </button>
        </div>
      </div>

      {/* body */}
      <div className={`flex-1 overflow-auto ${app.bare ? "" : "px-7 py-6 text-text-body"}`}>
        <Body />
      </div>

      {/* resize handles (hidden when maximized) */}
      {!win.maximized && (
        <>
          <div onMouseDown={onResizeStart("e")} className="absolute right-0 top-0 bottom-3 w-1.5 cursor-ew-resize" />
          <div onMouseDown={onResizeStart("s")} className="absolute bottom-0 left-0 right-3 h-1.5 cursor-ns-resize" />
          <div onMouseDown={onResizeStart("se")} className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize" />
        </>
      )}
    </div>
  );
}
