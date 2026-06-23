import { useEffect, useState } from "react";

export default function LockScreen({ onUnlock }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 20);
    const unlock = () => onUnlock();
    window.addEventListener("keydown", unlock);
    return () => {
      clearInterval(t);
      window.removeEventListener("keydown", unlock);
    };
  }, [onUnlock]);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      onClick={onUnlock}
      className="fixed inset-0 z-[198] flex cursor-pointer select-none flex-col items-center justify-center gap-2 bg-black/80 text-text backdrop-blur-xl"
    >
      <div className="font-sans text-7xl font-bold tabular-nums">
        {hh}:{mm}
      </div>
      <div className="text-lg text-text-body">{date}</div>
      <div className="mt-8 text-sm text-text-dim">Click or press any key to unlock</div>
    </div>
  );
}
