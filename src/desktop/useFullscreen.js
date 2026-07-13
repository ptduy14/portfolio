import { useCallback, useEffect, useState } from "react";

// Fullscreen must be triggered by a user gesture — browsers block auto-fullscreen,
// so this is only ever called from a click / command (never on boot).
export function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
  } else {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }
}

export function useFullscreen() {
  const [isFull, setIsFull] = useState(
    () => typeof document !== "undefined" && !!document.fullscreenElement
  );
  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  return [isFull, useCallback(toggleFullscreen, [])];
}
