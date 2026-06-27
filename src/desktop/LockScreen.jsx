import { useEffect, useState } from "react";
import { useSystem } from "./SystemProvider";

export default function LockScreen({ onUnlock }) {
  const { wallpaper } = useSystem();
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
      className="fixed inset-0 z-[198] flex cursor-pointer select-none flex-col items-center justify-center text-white"
    >
      {/* blurred wallpaper background + dark scrim */}
      <div
        className="absolute inset-0 scale-110 blur-2xl"
        style={{ background: wallpaper.css }}
      />
      <div className="absolute inset-0 bg-black/55" />

      {/* clock */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <div className="text-8xl font-bold tabular-nums tracking-tight">
          {hh}:{mm}
        </div>
        <div className="text-lg text-white/80">{date}</div>

        {/* avatar + greeting */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-extrabold text-text-on-accent shadow-float">
            D
          </div>
          <div className="text-center">
            <div className="text-base font-semibold">Phan Tan Duy</div>
            <div className="text-sm text-white/70">Welcome back</div>
          </div>
        </div>

        <div className="mt-10 text-sm text-white/60">Click or press any key to unlock</div>
      </div>
    </div>
  );
}
