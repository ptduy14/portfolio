import { useEffect, useMemo, useState } from "react";
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

const fmtPct = (n, precise) => (precise ? `${n.toFixed(1)}%` : `${Math.round(n)}%`);

// Live GitHub language breakdown: stacked bar + legend. Hides when there's no data;
// shows a skeleton only while GitHub is still syncing.
function LangBar({ langs, height = 7, legendMax = 4, precise = false }) {
  const { github } = useSystem();
  if (!langs || !langs.length) {
    if (github.status === "loading") {
      return <div className="w-full animate-pulse rounded-full bg-white/[0.06]" style={{ height }} />;
    }
    return null;
  }
  return (
    <div>
      <div className="flex w-full overflow-hidden rounded-full bg-white/[0.06]" style={{ height }}>
        {langs.map((l) => (
          <span key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {langs.slice(0, legendMax).map((l) => (
          <span key={l.name} className="flex items-center gap-1.5 text-[11px] text-text-body">
            <span className="h-2 w-2 flex-none rounded-full" style={{ background: l.color }} />
            <span className="font-medium text-text">{l.name}</span>
            <span className="font-mono text-[10px] text-text-dim">{fmtPct(l.pct, precise)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// 16:9 image area. Swap the inner <div> for <img className="h-full w-full object-cover"> when
// real screenshots are available (1280×720 recommended).
function Cover({ category, featured }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden">
      <div className={`flex h-full w-full items-center justify-center ${CAT_BG[category]}`}>
        <span className="text-xs font-bold uppercase tracking-widest text-white/85">{category}</span>
      </div>
      {featured && (
        <span className="absolute left-2.5 top-2.5 rounded-full bg-black/35 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
          ★ Featured
        </span>
      )}
    </div>
  );
}

function ProjectCard({ p, s, featured, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className={`group flex flex-col overflow-hidden rounded-card border bg-surface text-left transition-transform hover:-translate-y-0.5 hover:border-strong ${
        featured ? "ring-1 ring-accent" : ""
      }`}
    >
      <Cover category={p.category} featured={featured} />
      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-sm font-bold text-text">{p.title}</h3>
        <Stats s={s} />
        <LangBar langs={s.langs} legendMax={3} />
        <p className="line-clamp-2 text-xs leading-relaxed text-text-dim">{p.blurb}</p>
        <Tags items={p.tags} max={4} />
      </div>
    </button>
  );
}

// Featured project — full-width hero (image left + content right; stacks when narrow).
function FeaturedHero({ p, s, onOpen }) {
  return (
    <div className="mb-4 flex flex-wrap overflow-hidden rounded-card border bg-surface">
      <button
        onClick={onOpen}
        aria-label={p.title}
        className="relative min-h-[270px] min-w-[260px] flex-1 basis-[44%]"
      >
        <div className={`flex h-full w-full items-center justify-center ${CAT_BG[p.category]}`}>
          <span className="text-xs font-bold uppercase tracking-widest text-white/85">{p.category}</span>
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-black/35 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
          ★ Featured
        </span>
      </button>
      <div className="flex min-w-[300px] flex-[1.3] flex-col gap-3 p-5">
        <button onClick={onOpen} className="flex flex-col items-start gap-2.5 text-left">
          <h2 className="text-xl font-bold text-text">{p.title}</h2>
          <Stats s={s} />
          <p className="text-sm leading-relaxed text-text-body">{p.blurb}</p>
          <Tags items={p.tags} />
          <div className="w-full">
            <LangBar langs={s.langs} height={8} />
          </div>
        </button>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-control bg-accent px-4 py-2 text-sm font-semibold text-text-on-accent transition-colors hover:bg-accent-hover"
          >
            <Icon name="github" size={16} /> GitHub
          </a>
          {p.demo && (
            <a
              href={p.demo}
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
  );
}

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
        <div className={`flex aspect-[21/9] w-full items-center justify-center ${CAT_BG[project.category]}`}>
          <span className="text-sm font-bold uppercase tracking-widest text-white/85">{project.category}</span>
        </div>
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
          {s.langs?.length > 0 && (
            <div>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-text-dim">Languages</div>
              <LangBar langs={s.langs} height={9} legendMax={6} precise />
            </div>
          )}
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

  const stat = (p) => github.byName[p.repo] || { stars: p.stars, forks: p.forks };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { list, hero, gridItems } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = PROJECTS.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (p.title.toLowerCase().includes(q) || p.tags.join(" ").toLowerCase().includes(q))
    );
    // Featured hero only in the unfiltered view.
    const feat = cat === "All" && !q ? filtered.find((p) => p.featured) : null;
    const grid = feat ? filtered.filter((p) => p !== feat) : filtered;
    return { list: feat ? [feat, ...grid] : filtered, hero: feat, gridItems: grid };
  }, [cat, query]);

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
          <>
            {hero && <FeaturedHero p={hero} s={stat(hero)} onOpen={() => setSelected(hero)} />}
            {hero && (
              <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-text-dim">More projects</div>
            )}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
              {gridItems.map((p) => (
                <ProjectCard key={p.repo} p={p} s={stat(p)} featured={false} onOpen={() => setSelected(p)} />
              ))}
            </div>
          </>
        ) : (
          <div className="overflow-hidden rounded-card border">
            {list.map((p) => (
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

        {list.length === 0 && (
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
