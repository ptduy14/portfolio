// Fetch the GitHub contribution calendar and bake it to
// src/data/contributions.json. Run by the daily GitHub Action with the built-in
// GITHUB_TOKEN. Requires a token — there is NO sample/fake fallback; if the fetch
// fails the script exits non-zero so the Action fails loudly instead of baking
// placeholder data.
//
//   GITHUB_TOKEN=... node scripts/fetch-contributions.mjs
//
// Env: GH_USER (default ptduy14), GITHUB_TOKEN (required).
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const USER = process.env.GH_USER || "ptduy14";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "contributions.json");

const levelFromCount = (c) => (c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : c <= 9 ? 3 : 4);

async function fetchCalendar() {
  const query = `query($login:String!){
    user(login:$login){ contributionsCollection{ contributionCalendar{
      totalContributions weeks{ contributionDays{ date contributionCount } } } } }
  }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: USER } }),
  });
  if (!res.ok) throw new Error("graphql HTTP " + res.status);
  const json = await res.json();
  if (json.errors?.length) throw new Error("graphql: " + json.errors[0].message);
  const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) throw new Error("no contributionCalendar in payload");
  const days = cal.weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount, level: levelFromCount(d.contributionCount) }));
  return { total: cal.totalContributions, days };
}

function streaks(days) {
  let longest = 0, run = 0;
  for (const d of days) {
    if (d.count > 0) { run++; longest = Math.max(longest, run); } else run = 0;
  }
  let cur = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) cur++;
    else break;
  }
  return { currentStreak: cur, longestStreak: longest };
}

async function main() {
  if (!TOKEN) {
    console.error("GITHUB_TOKEN (or GH_TOKEN) is required — no sample fallback. Aborting.");
    process.exit(1);
  }
  let data;
  try {
    data = await fetchCalendar();
  } catch (e) {
    console.error("Failed to fetch contributions: " + e.message);
    process.exit(1);
  }
  const { currentStreak, longestStreak } = streaks(data.days);
  const out = {
    updatedAt: new Date().toISOString(),
    totalYear: data.total,
    currentStreak,
    longestStreak,
    days: data.days,
  };
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 0) + "\n");
  console.log(`Wrote ${data.days.length} days · ${data.total} contributions → ${OUT}`);
}

main();
