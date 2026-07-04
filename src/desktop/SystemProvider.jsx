import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ACCENTS, COLORS } from "./presets";
import { WALLPAPERS } from "./wallpaperArt";
import { fetchGithubStats } from "./github";
import { TOUR_VERSION } from "./tour";

const PRESET_BACKGROUNDS = [...WALLPAPERS, ...COLORS];

const SystemContext = createContext(null);
const STORAGE_KEY = "portfolio-os";

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function SystemProvider({ children }) {
  const saved = loadSaved();

  // persisted system settings — 'custom' is reset on load (object URL can't survive reload)
  const [wallpaperId, setWallpaperId] = useState(
    saved.wallpaperId && saved.wallpaperId !== "custom" ? saved.wallpaperId : "aurora"
  );
  // session-only custom (uploaded) wallpaper css
  const [customWallpaper, setCustomWallpaperCss] = useState(null);
  const [brightness, setBrightness] = useState(
    typeof saved.brightness === "number" ? saved.brightness : 1
  );
  const [volume, setVolume] = useState(
    typeof saved.volume === "number" ? saved.volume : 65
  );
  const [accentId, setAccentId] = useState(saved.accentId || "blue");

  // guided tour: tourSeenVersion is version-keyed (re-greet on new features);
  // tourOptOut is the "don't show again" checkbox (permanent, survives bumps).
  const [tourSeenVersion, setTourSeenVersion] = useState(
    typeof saved.tourSeenVersion === "number" ? saved.tourSeenVersion : 0
  );
  const [tourOptOut, setTourOptOut] = useState(!!saved.tourOptOut);
  const [tourOpen, setTourOpen] = useState(false);

  // ephemeral session state (not persisted)
  const [booting, setBooting] = useState(true);
  const [locked, setLocked] = useState(false);
  const [github, setGithub] = useState({
    status: "loading",
    byName: {},
    totalStars: 0,
    repoCount: 0,
  });

  // Fetch live GitHub stats once on mount (shown in boot log + Projects app).
  useEffect(() => {
    let alive = true;
    fetchGithubStats().then(
      (data) => alive && setGithub({ status: "ok", ...data }),
      () => alive && setGithub((g) => ({ ...g, status: "error" }))
    );
    return () => {
      alive = false;
    };
  }, []);

  // persist settings
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ wallpaperId, brightness, volume, accentId, tourSeenVersion, tourOptOut })
      );
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [wallpaperId, brightness, volume, accentId, tourSeenVersion, tourOptOut]);

  // apply accent live to CSS variables
  useEffect(() => {
    const a = ACCENTS.find((x) => x.id === accentId) || ACCENTS[0];
    document.documentElement.style.setProperty("--accent", a.accent);
    document.documentElement.style.setProperty("--accent-hover", a.hover);
  }, [accentId]);

  const wallpaper =
    wallpaperId === "custom" && customWallpaper
      ? { id: "custom", name: "Custom", css: customWallpaper }
      : PRESET_BACKGROUNDS.find((w) => w.id === wallpaperId) || COLORS[0];

  // apply an uploaded image as wallpaper (session only)
  const setCustomWallpaper = (css) => {
    setCustomWallpaperCss(css);
    setWallpaperId("custom");
  };

  // Stable identities — auto-start effects depend on startTour, so it must not
  // change every render (else the effect re-runs and clears its pending timeout).
  const startTour = useCallback(() => setTourOpen(true), []);
  const endTour = useCallback((optOut) => {
    setTourOpen(false);
    setTourSeenVersion(TOUR_VERSION);
    if (optOut) setTourOptOut(true);
  }, []);

  const value = {
    // appearance
    wallpaper,
    wallpaperId,
    setWallpaperId,
    setCustomWallpaper,
    accentId,
    setAccentId,
    // sliders
    brightness,
    setBrightness,
    volume,
    setVolume,
    // power / session
    booting,
    finishBoot: () => setBooting(false),
    reboot: () => setBooting(true),
    locked,
    lock: () => setLocked(true),
    unlock: () => setLocked(false),
    // guided tour
    tourOpen,
    startTour,
    endTour,
    shouldAutoTour: tourSeenVersion < TOUR_VERSION && !tourOptOut,
    github,
    // decorative system info
    network: { name: "Blade", connected: true },
    battery: { percent: 98, charging: true, untilFull: "0:17" },
  };

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}

export function useSystem() {
  return useContext(SystemContext);
}
