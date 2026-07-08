import { PROJECTS } from "./apps/projects-data";

// GitHub "linguist" language colours (subset — extend as needed).
const LANG_COLORS = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  HTML: "#e34c26",
  Solidity: "#AA6746",
  Python: "#3572A5",
  Java: "#b07219",
  PHP: "#4F5D95",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
  Shell: "#89e051",
  Vue: "#41b883",
  Dockerfile: "#384d54",
  Makefile: "#427819",
  Other: "#8b949e",
};

const HEADERS = { Accept: "application/vnd.github+json" };

// { "TypeScript": 128400, ... } → [{ name, pct, color }] (top 4 + "Other").
function buildLangs(raw) {
  const entries = Object.entries(raw);
  const total = entries.reduce((s, [, b]) => s + b, 0);
  if (!total) return null;
  entries.sort((a, b) => b[1] - a[1]);
  const TOP = 4;
  const langs = entries.slice(0, TOP).map(([name, bytes]) => ({
    name,
    pct: (bytes / total) * 100,
    color: LANG_COLORS[name] || LANG_COLORS.Other,
  }));
  const restBytes = entries.slice(TOP).reduce((s, [, b]) => s + b, 0);
  if (restBytes > 0) {
    langs.push({ name: "Other", pct: (restBytes / total) * 100, color: LANG_COLORS.Other });
  }
  return langs;
}

// Fetch public repo stats from GitHub (no auth; CORS-enabled; ~60 req/h per IP).
// Also fetches /languages for the curated project repos only (a handful) to keep
// well under the rate limit, then attaches a normalised `langs` array to byName.
export async function fetchGithubStats(user = "ptduy14") {
  const res = await fetch(
    `https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`,
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error("github " + res.status);
  const repos = await res.json();
  if (!Array.isArray(repos)) throw new Error("github bad payload");

  const byName = {};
  let totalStars = 0;
  for (const r of repos) {
    byName[r.name] = { stars: r.stargazers_count, forks: r.forks_count };
    totalStars += r.stargazers_count;
  }

  // Enrich only the curated repos with language breakdown (bounded, cached in this result).
  const curated = [...new Set(PROJECTS.map((p) => p.repo).filter(Boolean))];
  await Promise.all(
    curated.map(async (name) => {
      if (!byName[name]) return; // repo not public / not in list → skip
      try {
        const r = await fetch(`https://api.github.com/repos/${user}/${name}/languages`, {
          headers: HEADERS,
        });
        if (!r.ok) return;
        const langs = buildLangs(await r.json());
        if (langs) byName[name].langs = langs;
      } catch {
        /* leave langs undefined → UI hides the bar */
      }
    })
  );

  return { byName, totalStars, repoCount: repos.length };
}
