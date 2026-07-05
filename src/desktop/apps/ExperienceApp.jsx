import { useState } from "react";
import { EXPERIENCE } from "./experience-data";
import { Icon } from "../shell/icons";
import { useDesktop } from "../DesktopProvider";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2024-11" -> "Nov 2024" ; "present" -> "Present"
function fmtMonth(v) {
  if (v === "present") return "Present";
  const [y, m] = v.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

// Human duration between start and (end | now).
function fmtDuration(start, end) {
  const [sy, sm] = start.split("-").map(Number);
  let ey, em;
  if (end === "present") {
    const now = new Date();
    ey = now.getFullYear();
    em = now.getMonth() + 1;
  } else {
    [ey, em] = end.split("-").map(Number);
  }
  const months = (ey - sy) * 12 + (em - sm) + 1; // inclusive
  const y = Math.floor(months / 12);
  const mo = months % 12;
  const parts = [];
  if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
  if (mo) parts.push(`${mo} mo${mo > 1 ? "s" : ""}`);
  return parts.join(" ") || "1 mo";
}

// Real company logo with a coloured-monogram fallback (no logo file → still looks right).
function CompanyLogo({ role, size = 46 }) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size, borderRadius: 12 };
  if (failed || !role.logo) {
    return (
      <span
        className="flex flex-none items-center justify-center font-mono font-bold text-white"
        style={{ ...style, background: role.color, fontSize: size > 36 ? 14 : 10 }}
      >
        {role.mono}
      </span>
    );
  }
  return (
    <img
      src={role.logo}
      alt={`${role.company} logo`}
      onError={() => setFailed(true)}
      className="flex-none bg-white object-contain"
      style={{ ...style, padding: 4 }}
    />
  );
}

// One highlight row — clean list item (no nested card), CAR reveals inline.
function Highlight({ item, last }) {
  const [open, setOpen] = useState(false);
  const car = [
    ["Challenge", item.challenge],
    ["Action", item.action],
    ["Result", item.result],
  ].filter(([, v]) => v);
  const expandable = car.length > 0;

  return (
    <div className={last ? "" : "border-b border-[color:var(--border)]"}>
      <div className="flex items-start gap-3 py-3">
        <span className="mt-[3px] flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-accent/15 text-accent">
          <Icon name="chevronRight" size={11} className="rotate-90" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-semibold leading-snug text-text">{item.title}</div>
          {item.blurb && (
            <div className="mt-1 text-[13px] leading-relaxed text-text-body">{item.blurb}</div>
          )}
          {expandable && open && (
            <div className="mt-3 flex flex-col gap-2.5 border-l-2 border-accent/30 pl-4">
              {car.map(([k, v]) => (
                <div key={k}>
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-accent">{k}</div>
                  <div className="mt-0.5 text-[12.5px] leading-relaxed text-text-body">{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {expandable && (
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex-none rounded-control px-2 py-0.5 font-mono text-[11px] text-text-dim transition-colors hover:bg-white/[0.06] hover:text-text"
          >
            {open ? "Less" : "Details"}
          </button>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="mb-2 mt-6 flex items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-dim">{children}</span>
      <span className="h-px flex-1 bg-[color:var(--border)]" />
    </div>
  );
}

function Entry({ role }) {
  const current = role.end === "present";
  return (
    <div className="relative mb-9 last:mb-0">
      {/* node on the spine */}
      <span
        className={`absolute -left-[34px] top-6 h-3.5 w-3.5 rounded-full border-2 ${
          current
            ? "border-accent bg-accent shadow-[0_0_0_5px_rgba(53,132,228,0.14)]"
            : "border-[color:var(--border-strong)] bg-wall"
        }`}
      />
      <div
        className={`overflow-hidden rounded-window border transition-colors hover:border-strong ${
          current ? "border-strong bg-surface/40" : "bg-window"
        }`}
      >
        {current && <div className="h-0.5 w-full bg-accent" />}
        <div className="p-6">
          {/* header */}
          <div className="flex items-start gap-4">
            <CompanyLogo role={role} size={48} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <h3 className="text-[18px] font-bold leading-tight text-text">{role.role}</h3>
                {current && (
                  <span className="rounded-full border border-success/35 bg-success/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-success">
                    Current
                  </span>
                )}
              </div>
              <a
                href={role.url}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 inline-block text-[14px] font-medium text-term-blue hover:underline"
              >
                {role.company}
              </a>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-text-dim">
                <span className="text-text-body">{fmtMonth(role.start)} → {fmtMonth(role.end)}</span>
                <span className="text-white/20">·</span>
                <span>{fmtDuration(role.start, role.end)}</span>
                <span className="text-white/20">·</span>
                <span>{role.location}</span>
                <span className="text-white/20">·</span>
                <span>{role.type}</span>
              </div>
            </div>
          </div>

          {/* summary */}
          {role.summary && (
            <p className="mt-5 text-[14.5px] leading-relaxed text-text-body">{role.summary}</p>
          )}

          {/* highlights */}
          <SectionLabel>Highlights</SectionLabel>
          <div className="flex flex-col">
            {role.highlights.map((h, i) => (
              <Highlight key={i} item={h} last={i === role.highlights.length - 1} />
            ))}
          </div>

          {/* tech + links */}
          <SectionLabel>Tech stack</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {role.tech.map((t) => (
              <span
                key={t}
                className="rounded-control border bg-surface/60 px-2.5 py-1 font-mono text-[11px] text-text-body"
              >
                {t}
              </span>
            ))}
          </div>

          {role.links?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {role.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-control border border-accent/30 bg-accent/10 px-3 py-1.5 text-[12px] font-medium text-accent transition-colors hover:bg-accent/20"
                >
                  <Icon name="external" size={13} /> {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExperienceApp() {
  const { openApp } = useDesktop();
  return (
    <div className="h-full overflow-auto px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">Work Experience</h1>
            <p className="mt-1.5 font-mono text-[11px] text-text-dim">
              {EXPERIENCE.length} roles · Ho Chi Minh City / Can Tho · self-taught full-stack
            </p>
          </div>
          <button
            onClick={() => openApp("contact")}
            className="inline-flex flex-none items-center gap-2 rounded-pill border px-3.5 py-1.5 text-[12px] font-medium text-text-body transition-colors hover:bg-surface-hover hover:text-text"
          >
            <Icon name="contact" size={14} /> Get in touch
          </button>
        </div>

        {/* timeline */}
        <div className="relative pl-9">
          <div className="absolute left-[6px] top-3 bottom-6 w-0.5 bg-[color:var(--border)]" />
          {EXPERIENCE.map((r) => (
            <Entry key={r.id} role={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
