import { useCallback } from "react";

// Drag a window by its header. Mutates element style live for smoothness,
// then commits the final (x, y) once on mouse-up.
export function useDragMove(winRef, { disabled, onCommit }) {
  return useCallback(
    (e) => {
      if (disabled) return;
      if (e.target.closest("[data-no-drag]")) return;
      const el = winRef.current;
      if (!el) return;
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;
      const originX = el.offsetLeft;
      const originY = el.offsetTop;
      const prevTransition = el.style.transition;
      el.style.transition = "none";

      const move = (ev) => {
        el.style.left = Math.max(0, originX + ev.clientX - startX) + "px";
        el.style.top = Math.max(34, originY + ev.clientY - startY) + "px";
      };
      const up = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        el.style.transition = prevTransition;
        onCommit(el.offsetLeft, el.offsetTop);
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    },
    [disabled, onCommit, winRef]
  );
}
