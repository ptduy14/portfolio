import contributions from "../data/contributions.json";
import { useSystem } from "./SystemProvider";
import { Icon } from "./shell/icons";

const GH_PROFILE = "https://github.com/ptduy14";
const LEVEL_PCT = [0, 32, 56, 80, 100];

const cellBg = (level) =>
  level === 0
    ? "rgba(148,163,184,.14)"
    : `color-mix(in srgb, var(--accent) ${LEVEL_PCT[level]}%, transparent)`;

function ago(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

function Stat({ n, unit, label }) {
  return (
    <div className="flex-1 rounded-lg bg-white/[0.04] px-3 py-2.5">
      <div className="text-xl font-bold tabular-nums text-text">
        {n}
        {unit && <span className="ml-0.5 text-[11px] font-medium text-text-dim">{unit}</span>}
      </div>
      <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-text-dim">{label}</div>
    </div>
  );
}

export default function DevActivityWidget() {
  const { github, showWidgets } = useSystem();
  if (!showWidgets) return null;

  // last ~18 weeks, aligned so grid rows map to weekdays (pad to the first Sunday)
  const recent = contributions.days.slice(-126);
  const firstDow = recent.length ? new Date(recent[0].date + "T00:00:00").getDay() : 0;
  const cells = [...Array(firstDow).fill(null), ...recent];
  const stars = github.status === "ok" ? github.totalStars : null;

  return (
    <a
      href={GH_PROFILE}
      target="_blank"
      rel="noreferrer"
      aria-label="Open GitHub profile"
      data-tour="widget"
      className="mat-popover group absolute bottom-4 right-4 hidden w-[320px] rounded-2xl border p-4 shadow-float transition-transform hover:-translate-y-0.5 md:block"
      style={{ borderColor: "var(--mat-border)" }}
    >
      {/* header */}
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-text-dim">
          <Icon name="github" size={15} />
        </span>
        <span className="text-[12.5px] font-semibold text-text">@ptduy14</span>
        <span className="ml-auto font-mono text-[9px] text-text-dim">updated {ago(contributions.updatedAt)}</span>
      </div>

      {/* stats */}
      <div className="my-3 flex gap-2">
        <Stat n={contributions.totalYear} label="contribs / yr" />
        <Stat n={contributions.currentStreak} unit="d" label="streak" />
        <Stat n={stars == null ? "—" : stars} unit={stars == null ? "" : "★"} label="stars" />
      </div>

      {/* mini heatmap */}
      <div
        className="grid justify-between gap-[3px]"
        style={{ gridAutoFlow: "column", gridTemplateRows: "repeat(7, 12px)" }}
      >
        {cells.map((d, i) =>
          d ? (
            <span
              key={d.date}
              title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}
              className="h-3 w-3 rounded-[2px]"
              style={{ background: cellBg(d.level) }}
            />
          ) : (
            <span key={`pad-${i}`} className="h-3 w-3" style={{ visibility: "hidden" }} />
          )
        )}
      </div>

      {/* legend */}
      <div className="mt-2 flex items-center gap-1 font-mono text-[9px] text-text-dim">
        Less
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className="h-[9px] w-[9px] rounded-[2px]" style={{ background: cellBg(l) }} />
        ))}
        More
      </div>

      {/* footer */}
      <div className="mt-3 flex items-center gap-1.5 border-t pt-2.5 text-[11px] text-accent-hover">
        <Icon name="external" size={12} /> View on GitHub
      </div>
    </a>
  );
}
