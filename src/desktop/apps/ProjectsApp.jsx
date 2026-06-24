import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../shell/icons";
import { useSystem } from "../SystemProvider";
import { PROJECTS, CATEGORIES } from "./projects-data";

const CAT_BG = {
  Frontend: "bg-accent",
  Backend: "bg-success",
  Blockchain: "bg-purple",
  AI: "bg-warning",
};

function Stats({ s }) {
  return (
    <span className="flex items-center gap-3 text-xs text-text-dim">
      <span className="flex items-center gap-1">
        <Icon name="star" size={13} className="text-warning" /> {s.stars}
      </span>
      <span className="flex items-center gap-1">
        <Icon name="fork" size={13} /> {s.forks}
      </span>
    </span>
  );
}

function Tags({ items, max }) {
  const list = max ? items.slice(0, max) : items;
  return (
    <div className="flex flex-wrap gap-1.5">
      {list.map((t) => (
        <span key={t} className="rounded-control border bg-surface px-2 py-0.5 text-[10px] text-text-body">
          {t}
        </span>
      ))}
    </div>
  );
}

function Banner({ category, className = "" }) {
  return (
    <div className={`flex items-center justify-center ${CAT_BG[category]} ${className}`}>
      <span className="text-xs font-bold uppercase tracking-widest text-white/85">{category}</span>
    </div>
  );
}

function ProjectCard({ p, s, featured, span, onOpen }) {
  return (
    <button
      onClick={onOpen}
      style={span}
      className="group flex h-full flex-col overflow-hidden rounded-card border bg-surface text-left transition-colors hover:border-strong"
    >
      <Banner category={p.category} className={featured ? "flex-1" : "h-16 flex-none"} />
      <div className={`flex flex-col gap-1.5 p-3.5 ${featured ? "flex-none" : "flex-1"}`}>
        {featured && (
          <span className="w-fit rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-text-on-accent">
            ★ Featured
          </span>
        )}
        <h3 className={`font-bold text-text ${featured ? "text-lg" : "text-sm"}`}>{p.title}</h3>
        <Stats s={s} />
        <p className="line-clamp-2 text-xs text-text-dim">{p.blurb}</p>
        <div className="mt-auto pt-1">
          <Tags items={p.tags} max={featured ? 6 : 3} />
        </div>
      </div>
    </button>
  );
}

// Full-screen detail view (replaces the list — feels like navigating inside a real app).
function DetailView({ project, s, onBack }) {
  return (
    <>
      <div className="flex flex-none items-center gap-2 border-b bg-headerbar px-3 py-2.5 text-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-control px-2 py-1 font-medium text-text-dim transition-colors hover:bg-surface-hover hover:text-text"
        >
          <Icon name="arrowLeft" size={18} /> Projects
        </button>
        <span className="text-text-dim">/</span>
        <span className="truncate font-semibold text-text">{project.title}</span>
      </div>

      <div className="flex-1 overflow-auto">
        <Banner category={project.category} className="h-44" />
        <div className="mx-auto max-w-3xl space-y-5 p-6">
          <div className="flex flex-wrap items-center gap-3">
            {project.featured && (
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-text-on-accent">
                ★ Featured
              </span>
            )}
            <h1 className="text-2xl font-bold text-text">{project.title}</h1>
          </div>
          <Stats s={s} />
          <p className="text-sm leading-relaxed text-text-body">{project.description}</p>
          <div>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-text-dim">Tech Stack</div>
            <Tags items={project.tags} />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-control bg-accent px-4 py-2 text-sm font-semibold text-text-on-accent transition-colors hover:bg-accent-hover"
            >
              <Icon name="github" size={16} /> View on GitHub
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-control border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
              >
                <Icon name="external" size={16} /> Live demo
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProjectsApp() {
  const { github } = useSystem();
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState(null);
  const [cols, setCols] = useState(3);
  const gridRef = useRef(null);

  const stat = (p) => github.byName[p.repo] || { stars: p.stars, forks: p.forks };

  // Esc backs out of the detail view.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Window-responsive column count for the bento mosaic.
  useEffect(() => {
    const el = gridRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setCols(w >= 760 ? 3 : w >= 520 ? 2 : 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [view, selected]);

  const { items, featured } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PROJECTS.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (p.title.toLowerCase().includes(q) || p.tags.join(" ").toLowerCase().includes(q))
    );
    const feat = cat === "All" && !q ? list.find((p) => p.featured) : null;
    return { items: feat ? [feat, ...list.filter((p) => p !== feat)] : list, featured: feat };
  }, [cat, query]);

  const featSpan =
    cols >= 3 ? { gridColumn: "span 2", gridRow: "span 2" } : cols === 2 ? { gridColumn: "span 2" } : undefined;

  // Detail screen takes over the whole app.
  if (selected) {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-window">
        <DetailView project={selected} s={stat(selected)} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-window">
      {/* toolbar */}
      <div className="flex flex-none flex-wrap items-center justify-between gap-2 border-b bg-headerbar px-4 py-2.5">
        <div className="flex gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-control px-2.5 py-1 text-xs font-semibold transition-colors ${
                cat === c ? "bg-surface text-text" : "text-text-dim hover:text-text"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-control border bg-surface px-2.5 py-1 text-text-dim">
            <Icon name="search" size={14} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search…"
              className="w-32 bg-transparent text-xs text-text outline-none placeholder:text-text-dim"
            />
          </div>
          <div className="flex overflow-hidden rounded-control border">
            {["grid", "list"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-2 py-1 text-xs ${view === v ? "bg-surface text-text" : "text-text-dim hover:text-text"}`}
              >
                {v === "grid" ? "▦" : "▤"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* body */}
      <div className="flex-1 overflow-auto p-4">
        {view === "grid" ? (
          <div
            ref={gridRef}
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridAutoRows: "172px",
              gridAutoFlow: "dense",
            }}
          >
            {items.map((p) => (
              <ProjectCard
                key={p.repo}
                p={p}
                s={stat(p)}
                featured={featured && p === featured}
                span={featured && p === featured ? featSpan : undefined}
                onOpen={() => setSelected(p)}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-card border">
            {items.map((p) => (
              <button
                key={p.repo}
                onClick={() => setSelected(p)}
                className="flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-surface-hover"
              >
                <span className={`h-2.5 w-2.5 flex-none rounded-full ${CAT_BG[p.category]}`} />
                <span className="flex-1 text-sm font-medium text-text">{p.title}</span>
                <span className="hidden sm:block">
                  <Tags items={p.tags} max={2} />
                </span>
                <Stats s={stat(p)} />
              </button>
            ))}
          </div>
        )}

        {items.length === 0 && (
          <div className="py-10 text-center text-sm text-text-dim">No projects match “{query}”.</div>
        )}
      </div>

      {/* status bar */}
      <div className="flex flex-none items-center justify-between border-t bg-headerbar px-4 py-2 text-xs text-text-dim">
        <span>{PROJECTS.length} projects</span>
        <span className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${github.status === "ok" ? "bg-success" : github.status === "error" ? "bg-destructive" : "bg-warning"}`} />
          {github.status === "ok" ? "live ★/⑂ from GitHub" : github.status === "error" ? "GitHub offline · cached" : "syncing GitHub…"}
        </span>
      </div>
    </div>
  );
}
