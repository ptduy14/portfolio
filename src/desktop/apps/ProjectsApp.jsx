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

// 16:9 cover — real screenshot when available, else a category-coloured placeholder.
function Cover({ project, featured }) {
  const shot = project.screenshots?.[0];
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden">
      {shot ? (
        <img src={shot} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className={`flex h-full w-full items-center justify-center ${CAT_BG[project.category]}`}>
          <span className="text-xs font-bold uppercase tracking-widest text-white/85">{project.category}</span>
        </div>
      )}
      {featured && (
        <span className="absolute left-2.5 top-2.5 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
          ★ Featured
        </span>
      )}
    </div>
  );
}

function TopLang({ s }) {
  const l = s.langs?.[0];
  if (!l) return null;
  return (
    <span className="flex items-center gap-1 font-mono text-[10px] text-text-dim">
      <span className="h-2 w-2 rounded-full" style={{ background: l.color }} /> {l.name} {Math.round(l.pct)}%
    </span>
  );
}

function ProjectCard({ p, s, featured, onOpen, onDemo }) {
  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-card border bg-surface text-left transition-transform hover:-translate-y-0.5 hover:border-strong ${
        featured ? "ring-1 ring-accent" : ""
      }`}
    >
      <div className="relative cursor-pointer" onClick={onOpen}>
        <Cover project={p} featured={featured} />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 bg-black/70 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-text-on-accent"
          >
            Read case study →
          </button>
          {p.demo && (
            <button
              onClick={(e) => { e.stopPropagation(); onDemo(p.demo); }}
              className="rounded-lg border border-white/30 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
            >
              Live demo
            </button>
          )}
        </div>
      </div>
      <button onClick={onOpen} className="flex flex-col items-start gap-1.5 p-4 text-left">
        <h3 className="text-sm font-bold text-text">{p.title}</h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-text-dim">{p.oneLiner || p.blurb}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2.5">
          <Stats s={s} />
          <TopLang s={s} />
        </div>
      </button>
    </div>
  );
}

// Featured project — full-width hero (image left + content right; stacks when narrow).
function FeaturedHero({ p, s, onOpen, onDemo }) {
  const shot = p.screenshots?.[0];
  return (
    <div className="mb-4 flex flex-wrap overflow-hidden rounded-card border bg-surface">
      <button
        onClick={onOpen}
        aria-label={p.title}
        className="relative min-h-[240px] min-w-[260px] flex-1 basis-[44%] overflow-hidden"
      >
        {shot ? (
          <img src={shot} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${CAT_BG[p.category]}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-white/85">{p.category}</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
          ★ Featured
        </span>
      </button>
      <div className="flex min-w-[300px] flex-[1.3] flex-col gap-3 p-5">
        <button onClick={onOpen} className="flex flex-col items-start gap-2.5 text-left">
          <span className="rounded-full border bg-wall/40 px-2.5 py-0.5 text-[10.5px] font-medium text-text-body">{p.category}</span>
          <h2 className="text-xl font-bold text-text">{p.title}</h2>
          <p className="text-sm leading-relaxed text-text-body">{p.oneLiner || p.blurb}</p>
          <div className="flex items-center gap-2.5"><Stats s={s} /><TopLang s={s} /></div>
        </button>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <button
            onClick={onOpen}
            className="flex items-center gap-2 rounded-control bg-accent px-4 py-2 text-sm font-semibold text-text-on-accent transition-colors hover:bg-accent-hover"
          >
            Read case study →
          </button>
          {p.demo && (
            <button
              onClick={() => onDemo(p.demo)}
              className="flex items-center gap-2 rounded-control border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
            >
              <Icon name="external" size={16} /> Live demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function BulletList({ items }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((it, i) => (
        <div key={i} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-text-body">
          <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-accent" />
          <span>{it}</span>
        </div>
      ))}
    </div>
  );
}

// Box-and-arrow architecture diagram from a node list (theme-aware, no assets).
function ArchDiagram({ nodes }) {
  if (!nodes?.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-card border bg-surface/40 p-4">
      {nodes.map((n, i) => (
        <span key={n} className="flex items-center gap-2">
          <span className="rounded-lg border border-strong bg-surface px-3 py-1.5 font-mono text-[11.5px] text-text">{n}</span>
          {i < nodes.length - 1 && <span className="text-text-dim">→</span>}
        </span>
      ))}
    </div>
  );
}

function GitHubButton({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-control bg-accent px-4 py-2 text-sm font-semibold text-text-on-accent transition-colors hover:bg-accent-hover"
    >
      <Icon name="github" size={16} /> View source on GitHub
    </a>
  );
}

// Unified hero per heroMode: "big" (UI-facing → prominent 16:9) or "compact"
// (backend/API/agent → small figure, or nothing when there's no screenshot to show).
function HeroFigure({ project, big }) {
  const shot = project.screenshots?.[0];
  if (!big) {
    return shot ? (
      <figure className="my-6 w-full max-w-[360px] overflow-hidden rounded-xl border">
        <img src={shot} alt={project.title} className="aspect-video w-full object-cover" />
      </figure>
    ) : null;
  }
  return (
    <figure className="my-7 aspect-video w-full overflow-hidden rounded-xl border">
      {shot ? (
        <img src={shot} alt={project.title} className="h-full w-full object-cover" />
      ) : (
        <div className={`flex h-full w-full items-center justify-center ${CAT_BG[project.category]}`}>
          <span className="text-sm font-bold uppercase tracking-widest text-white/85">{project.category}</span>
        </div>
      )}
    </figure>
  );
}

function ArticleH2({ children }) {
  return (
    <h2 className="mb-2.5 mt-8 flex items-center gap-2.5 text-[16px] font-bold text-text first:mt-0">
      <span className="h-4 w-[3px] flex-none rounded-full bg-accent" />
      {children}
    </h2>
  );
}

function DetailView({ project, s, onBack, onDemo }) {
  const cs = project.caseStudy;
  const dd = project.deepDive;
  const hasCase = !!cs;
  const hasDeep = !!dd;
  const big = project.heroMode !== "compact";
  const [tab, setTab] = useState("case");

  const DemoBtn = project.demo ? (
    <button
      onClick={() => onDemo(project.demo)}
      className="flex items-center gap-2 rounded-control bg-accent px-4 py-2 text-sm font-semibold text-text-on-accent transition-colors hover:bg-accent-hover"
    >
      <Icon name="external" size={16} /> View live demo
    </button>
  ) : null;

  return (
    <>
      {/* consolidated header: back + title (left) · segmented tabs (right) */}
      <div className="flex flex-none items-center justify-between gap-3 border-b bg-headerbar px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 rounded-control px-2 py-1 text-[13px] font-medium text-text-dim transition-colors hover:bg-surface-hover hover:text-text"
          >
            <Icon name="arrowLeft" size={17} /> Projects
          </button>
          <span className="text-text-dim">/</span>
          <span className="truncate text-[13px] font-semibold text-text">{project.title}</span>
        </div>
        {hasCase && hasDeep && (
          <div className="flex flex-none gap-0.5 rounded-lg border bg-surface p-0.5">
            {[
              ["case", "Case study"],
              ["deep", "Deep dive"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`rounded-md px-3 py-1 text-[12px] font-semibold transition-colors ${
                  tab === id ? "bg-accent text-text-on-accent" : "text-text-dim hover:text-text"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {/* ===== fallback: light projects with no case study ===== */}
        {!hasCase && (
          <article className="mx-auto max-w-[680px] px-6 py-8">
            <h1 className="text-[26px] font-bold leading-tight tracking-tight text-text">{project.title}</h1>
            {project.oneLiner && <p className="mt-2.5 text-[16px] leading-relaxed text-text-body">{project.oneLiner}</p>}
            <div className="mt-3.5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border bg-surface px-2.5 py-0.5 text-[11px] font-medium text-text-body">{project.category}</span>
              <Stats s={s} />
            </div>
            {DemoBtn && <div className="mt-4">{DemoBtn}</div>}
            <HeroFigure project={project} big={big} />
            {project.description && (<><ArticleH2>About</ArticleH2><p className="text-[15px] leading-[1.7] text-text-body">{project.description}</p></>)}
            <ArticleH2>Tech stack</ArticleH2>
            <Tags items={project.tags} />
            {s.langs?.length > 0 && <div className="mt-3"><LangBar langs={s.langs} height={8} legendMax={5} /></div>}
            <div className="pt-7"><GitHubButton url={project.url} /></div>
          </article>
        )}

        {/* ===== case study tab (blog article) ===== */}
        {hasCase && (tab === "case" || !hasDeep) && (
          <article className="mx-auto max-w-[680px] px-6 py-8">
            <div className="flex flex-wrap items-center gap-2">
              {project.featured && (
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-text-on-accent">★ Featured</span>
              )}
              <h1 className="text-[26px] font-bold leading-tight tracking-tight text-text">{project.title}</h1>
            </div>
            {project.oneLiner && <p className="mt-2.5 text-[16px] leading-relaxed text-text-body">{project.oneLiner}</p>}
            <div className="mt-3.5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border bg-surface px-2.5 py-0.5 text-[11px] font-medium text-text-body">{project.category}</span>
              <Stats s={s} />
            </div>
            {DemoBtn && <div className="mt-4">{DemoBtn}</div>}

            <HeroFigure project={project} big={big} />

            {cs.what && (<><ArticleH2>What is it</ArticleH2><p className="text-[15px] leading-[1.7] text-text-body">{cs.what}</p></>)}

            {cs.problem && cs.solution && (
              <>
                <ArticleH2>Problem → Solution</ArticleH2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-card border bg-wall/40 p-4">
                    <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-warning">Problem</div>
                    <p className="text-[13.5px] leading-relaxed text-text-body">{cs.problem}</p>
                  </div>
                  <div className="rounded-card border bg-wall/40 p-4">
                    <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-success">Solution</div>
                    <p className="text-[13.5px] leading-relaxed text-text-body">{cs.solution}</p>
                  </div>
                </div>
              </>
            )}

            {cs.role && (<><ArticleH2>My role</ArticleH2><p className="text-[15px] leading-[1.7] text-text-body">{cs.role}</p></>)}

            <ArticleH2>Tech stack</ArticleH2>
            <Tags items={project.tags} />
            {s.langs?.length > 0 && <div className="mt-3"><LangBar langs={s.langs} height={8} legendMax={5} /></div>}

            {cs.metrics?.length > 0 && (
              <>
                <ArticleH2>Results &amp; metrics</ArticleH2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {cs.metrics.map((m, i) => (
                    <div key={i} className="rounded-card border bg-wall/40 p-4">
                      <div className="text-xl font-bold text-text">{m.value}</div>
                      <div className="mt-0.5 text-[12px] text-text-dim">{m.label}</div>
                      {m.source && <div className="mt-1.5 font-mono text-[8.5px] uppercase tracking-wider text-accent-hover">via {m.source}</div>}
                    </div>
                  ))}
                </div>
              </>
            )}

            {!hasDeep && <div className="pt-7"><GitHubButton url={project.url} /></div>}
          </article>
        )}

        {/* ===== technical deep dive tab (blog article) ===== */}
        {hasCase && hasDeep && tab === "deep" && (
          <article className="mx-auto max-w-[680px] px-6 py-8">
            {dd.architecture?.length > 0 && (<><ArticleH2>Architecture</ArticleH2><ArchDiagram nodes={dd.architecture} /></>)}
            {dd.decisions?.length > 0 && (<><ArticleH2>Key decisions</ArticleH2><BulletList items={dd.decisions} /></>)}
            {dd.challenges?.length > 0 && (<><ArticleH2>Challenges</ArticleH2><BulletList items={dd.challenges} /></>)}
            {dd.lessons?.length > 0 && (<><ArticleH2>Lessons learned</ArticleH2><BulletList items={dd.lessons} /></>)}
            <div className="mt-9 flex items-center justify-between gap-3 border-t pt-5">
              <span className="text-[12.5px] text-text-dim">Want the code? This is the last door.</span>
              <GitHubButton url={project.url} />
            </div>
          </article>
        )}
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

  // Phase 1: open demo in a new tab. Phase 2 swaps this for the in-portfolio Browser app.
  const onDemo = (url) => window.open(url, "_blank", "noopener");

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
        <DetailView key={selected.repo} project={selected} s={stat(selected)} onBack={() => setSelected(null)} onDemo={onDemo} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-window">
      {/* toolbar */}
      <div className="flex flex-none flex-wrap items-center justify-between gap-2 border-b bg-headerbar px-4 py-2.5">
        <div className="flex gap-0.5 rounded-lg border bg-surface p-0.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                cat === c ? "bg-accent text-text-on-accent" : "text-text-dim hover:text-text"
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
            {hero && <FeaturedHero p={hero} s={stat(hero)} onOpen={() => setSelected(hero)} onDemo={onDemo} />}
            {hero && (
              <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-text-dim">More projects</div>
            )}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
              {gridItems.map((p) => (
                <ProjectCard key={p.repo} p={p} s={stat(p)} featured={false} onOpen={() => setSelected(p)} onDemo={onDemo} />
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
