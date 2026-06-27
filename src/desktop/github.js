// Fetch public repo stats from GitHub (no auth; CORS-enabled; ~60 req/h per IP).
export async function fetchGithubStats(user = "ptduy14") {
  const res = await fetch(
    `https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`,
    { headers: { Accept: "application/vnd.github+json" } }
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
  return { byName, totalStars, repoCount: repos.length };
}
