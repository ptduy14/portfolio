import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "./shell/icons";

// GNOME-style desktop context menu. Positioned at the pointer, clamped to the viewport.
export default function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x, y });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: Math.max(8, Math.min(x, window.innerWidth - r.width - 8)),
      y: Math.max(8, Math.min(y, window.innerHeight - r.height - 8)),
    });
  }, [x, y]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    const onScroll = () => onClose();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onClose);
    window.addEventListener("blur", onClose);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("blur", onClose);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 z-[180]"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      <div
        ref={ref}
        role="menu"
        style={{ left: pos.x, top: pos.y, borderColor: "var(--mat-border)" }}
        className="mat-popover animate-windowIn fixed z-[181] min-w-[210px] rounded-xl border p-1.5 shadow-float"
      >
        {items.map((it, i) =>
          it.sep ? (
            <div key={`sep-${i}`} className="my-1 h-px bg-white/10" />
          ) : (
            <button
              key={it.label}
              role="menuitem"
              onClick={() => {
                it.run();
                onClose();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] text-text transition-colors hover:bg-surface-hover"
            >
              <Icon name={it.icon} size={15} className="flex-none text-text-dim" />
              <span className="flex-1">{it.label}</span>
              {it.shortcut && <span className="font-mono text-[10px] text-text-dim">{it.shortcut}</span>}
            </button>
          )
        )}
      </div>
    </>
  );
}
