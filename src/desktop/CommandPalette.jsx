import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { APPS } from "./apps/registry";
import { Icon } from "./shell/icons";
import { useDesktop } from "./DesktopProvider";
import { useSystem } from "./SystemProvider";
import { useTheme } from "../context/ThemeContext";
import handleBotAction from "../utils/function-calling";

// "g"-leader shortcut per app (mirrors useGlobalShortcuts in Desktop).
const APP_KEYS = { bio: "B", skills: "S", projects: "P", experience: "E", askme: "T", contact: "C", settings: "," };

// Rank a command against the query: prefix > substring > subsequence.
function score(q, text) {
  if (!q) return 0.001;
  text = text.toLowerCase();
  const i = text.indexOf(q);
  if (i === 0) return 3;
  if (i > 0) return 2 - i * 0.001;
  let ti = 0;
  for (const ch of q) {
    ti = text.indexOf(ch, ti);
    if (ti < 0) return -1;
    ti++;
  }
  return 1;
}

export default function CommandPalette({ onClose, onOpenOverview, onOpenQuickSettings }) {
  const { openApp } = useDesktop();
  const { lock, startTour, showWidgets, setShowWidgets } = useSystem();
  const { isDark, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const run = useCallback(
    (fn) => () => {
      fn();
      onClose();
    },
    [onClose]
  );

  const commands = useMemo(() => {
    const apps = APPS.map((a) => ({
      id: `open-${a.id}`,
      label: `Open ${a.title}`,
      hint: "App",
      icon: a.icon,
      keywords: a.title,
      shortcut: APP_KEYS[a.id] ? `G ${APP_KEYS[a.id]}` : null,
      run: run(() => openApp(a.id)),
    }));
    const actions = [
      { id: "cv", label: "Download CV", hint: "Action", icon: "download", keywords: "resume pdf", run: run(() => handleBotAction("download_cv")) },
      { id: "theme", label: isDark ? "Switch to Light mode" : "Switch to Dark mode", hint: "Appearance", icon: isDark ? "sun" : "moon", keywords: "theme dark light appearance", run: run(toggleTheme) },
      { id: "overview", label: "Show all windows", hint: "Activities", icon: "apps", keywords: "activities overview search", run: run(onOpenOverview) },
      { id: "control", label: "Open Control Center", hint: "System", icon: "gear", keywords: "quick settings wifi volume brightness", run: run(onOpenQuickSettings) },
      { id: "widget", label: showWidgets ? "Hide Dev Activity widget" : "Show Dev Activity widget", hint: "Desktop", icon: "github", keywords: "github contributions widget toggle", run: run(() => setShowWidgets(!showWidgets)) },
      { id: "tour", label: "Take the guided tour", hint: "Help", icon: "bell", keywords: "onboarding tour help guide", run: run(startTour) },
      { id: "lock", label: "Lock screen", hint: "System", icon: "lock", keywords: "lock", run: run(lock) },
    ];
    return [...apps, ...actions];
  }, [run, openApp, isDark, toggleTheme, onOpenOverview, onOpenQuickSettings, showWidgets, setShowWidgets, startTour, lock]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return commands
      .map((c) => ({ c, s: Math.max(score(q, c.label), score(q, c.keywords) - 0.5) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.c);
  }, [commands, query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    setSel(0);
  }, [query]);
  useEffect(() => {
    listRef.current?.querySelector('[data-sel="true"]')?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(results.length - 1, s + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[sel]?.run();
    }
  };

  return (
    <div className="fixed inset-0 z-[210] flex justify-center bg-black/40 px-4 pt-[14vh]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="mat-popover animate-windowIn h-fit w-full max-w-[560px] overflow-hidden rounded-2xl border shadow-float"
        style={{ borderColor: "var(--mat-border)" }}
      >
        {/* search */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Icon name="search" size={17} className="flex-none text-text-dim" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search apps & actions…"
            className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-dim"
          />
          <kbd className="flex-none rounded border border-b-2 px-1.5 py-0.5 font-mono text-[10px] text-text-dim">esc</kbd>
        </div>

        {/* results */}
        <div ref={listRef} className="max-h-[46vh] overflow-auto p-1.5">
          {results.length ? (
            results.map((c, i) => (
              <button
                key={c.id}
                data-sel={i === sel}
                onMouseMove={() => setSel(i)}
                onClick={c.run}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
                  i === sel ? "bg-accent text-text-on-accent" : "text-text"
                }`}
              >
                <Icon name={c.icon} size={16} className={i === sel ? "" : "text-text-dim"} />
                <span className="flex-1 truncate text-[13px] font-medium">{c.label}</span>
                {c.shortcut && (
                  <span className={`font-mono text-[10px] ${i === sel ? "text-text-on-accent/80" : "text-text-dim"}`}>{c.shortcut}</span>
                )}
                <span className={`text-[10px] uppercase tracking-wider ${i === sel ? "text-text-on-accent/70" : "text-text-dim"}`}>{c.hint}</span>
              </button>
            ))
          ) : (
            <div className="px-3 py-8 text-center text-sm text-text-dim">No commands for “{query}”.</div>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t px-4 py-2 font-mono text-[10px] text-text-dim">
          <span className="flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ run</span>
          </span>
          <span>tip: press G then B · S · P · E · T · C</span>
        </div>
      </div>
    </div>
  );
}
