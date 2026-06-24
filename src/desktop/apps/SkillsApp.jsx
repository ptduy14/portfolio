import { useMemo, useState } from "react";
import {
  siReact,
  siNextdotjs,
  siTailwindcss,
  siRedux,
  siNestjs,
  siLaravel,
  siMysql,
  siSolidity,
  siEthers,
  siGit,
  siDocker,
  siFirebase,
  siCloudinary,
} from "simple-icons";
import { Icon } from "../shell/icons";
import { SKILLS, DOMAINS, LEARNING, LEVEL_RANK } from "./skills-data";

// Simple Icons paths (monochrome, tinted via currentColor).
const PATHS = {
  react: siReact.path,
  nextjs: siNextdotjs.path,
  tailwind: siTailwindcss.path,
  redux: siRedux.path,
  nestjs: siNestjs.path,
  laravel: siLaravel.path,
  mysql: siMysql.path,
  solidity: siSolidity.path,
  ethers: siEthers.path,
  git: siGit.path,
  docker: siDocker.path,
  firebase: siFirebase.path,
  cloudinary: siCloudinary.path,
};

function TechIcon({ slug, name }) {
  const path = slug && PATHS[slug];
  if (path) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    );
  }
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded bg-surface-hover text-[9px] font-bold text-text-dim">
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

// qualitative "use" meter: Daily=3 · Proficient=2 · Familiar=1
function UseDots({ level }) {
  const n = LEVEL_RANK[level];
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${i <= n ? "bg-accent" : "bg-surface-hover"}`}
        />
      ))}
    </span>
  );
}

function DomainMeter({ domain, skills }) {
  const op = { Daily: "", Proficient: "opacity-60", Familiar: "opacity-30" };
  return (
    <div className="rounded-card border bg-surface p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-text">{domain}</span>
        <span className="text-xs text-text-dim">{skills.length}</span>
      </div>
      <div className="flex gap-1">
        {skills.map((s) => (
          <span key={s.name} className={`h-2 flex-1 rounded-sm bg-accent ${op[s.level]}`} title={`${s.name} · ${s.level}`} />
        ))}
      </div>
    </div>
  );
}

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "domain", label: "Domain" },
  { key: "level", label: "Level" },
];
const LEVEL_TAG = {
  Daily: "bg-accent text-text-on-accent",
  Proficient: "bg-surface-hover text-text",
  Familiar: "border text-text-dim",
};

export default function SkillsApp() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "domain", dir: 1 });

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: 1 }));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = SKILLS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q)
    );
    const val = (s) => (sort.key === "level" ? LEVEL_RANK[s.level] : s[sort.key].toLowerCase?.() ?? s[sort.key]);
    return [...filtered].sort((a, b) => {
      const av = val(a), bv = val(b);
      return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
    });
  }, [query, sort]);

  return (
    <div className="flex h-full flex-col bg-window">
      {/* toolbar */}
      <div className="flex flex-none items-center justify-between gap-3 border-b bg-headerbar px-4 py-2.5">
        <div className="text-sm font-bold text-text">
          Skills <span className="font-medium text-text-dim">— System Monitor</span>
        </div>
        <div className="flex items-center gap-2 rounded-control border bg-surface px-2.5 py-1 text-text-dim">
          <Icon name="search" size={14} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter technologies…"
            className="w-44 bg-transparent text-xs text-text outline-none placeholder:text-text-dim"
          />
        </div>
      </div>

      {/* scroll body */}
      <div className="flex-1 overflow-auto px-4 py-4">
        {/* domain meters */}
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-text-dim">Domains</div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
          {DOMAINS.map((d) => (
            <DomainMeter key={d} domain={d} skills={SKILLS.filter((s) => s.domain === d)} />
          ))}
        </div>

        {/* process table */}
        <div className="mt-4 overflow-hidden rounded-card border">
          <div className="grid grid-cols-[2.4fr_1.2fr_1.1fr_0.8fr] items-center gap-3 border-b bg-headerbar px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-text-dim">
            {COLUMNS.map((c) => (
              <button key={c.key} onClick={() => toggleSort(c.key)} className="flex items-center gap-1 text-left hover:text-text">
                {c.label}
                {sort.key === c.key && <span className="text-accent">{sort.dir > 0 ? "▾" : "▴"}</span>}
              </button>
            ))}
            <span>Use</span>
          </div>

          {rows.map((s) => (
            <div
              key={s.name}
              className="grid grid-cols-[2.4fr_1.2fr_1.1fr_0.8fr] items-center gap-3 border-b px-4 py-2.5 transition-colors last:border-b-0 hover:bg-surface-hover"
            >
              <div className="flex items-center gap-2.5">
                <TechIcon slug={s.icon} name={s.name} />
                <span className="text-sm font-medium text-text">{s.name}</span>
              </div>
              <span className="text-xs text-text-dim">{s.domain}</span>
              <span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${LEVEL_TAG[s.level]}`}>
                  {s.level}
                </span>
              </span>
              <UseDots level={s.level} />
            </div>
          ))}

          {rows.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-text-dim">No technologies match “{query}”.</div>
          )}
        </div>
      </div>

      {/* status bar */}
      <div className="flex flex-none items-center justify-between gap-3 border-t bg-headerbar px-4 py-2 text-xs text-text-dim">
        <span>
          {SKILLS.length} technologies · {DOMAINS.length} domains
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <span>🌱 Learning:</span>
          {LEARNING.map((l) => (
            <span key={l} className="rounded-full border px-2 py-0.5 text-[10px] text-text-body">
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
