// Fetch (or sample) the GitHub contribution calendar and bake it to
// src/data/contributions.json. Run by the daily GitHub Action with the built-in
// GITHUB_TOKEN. With no token it emits deterministic sample data so `npm start`
// works locally and the committed fallback stays realistic.
//
//   node scripts/fetch-contributions.mjs
//
// Env: GH_USER (default ptduy14), GITHUB_TOKEN (optional — real data when present).
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const USER = process.env.GH_USER || "ptduy14";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "contributions.json");

const levelFromCount = (c) => (c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : c <= 9 ? 3 : 4);

async function fetchReal() {
  const query = `query($login:String!){
    user(login:$login){ contributionsCollection{ contributionCalendar{
      total weeks{ contributionDays{ date contributionCount } } } } }
  }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: USER } }),
  });
  if (!res.ok) throw new Error("graphql " + res.status);
  const json = await res.json();
  const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) throw new Error("no calendar in payload");
  const days = cal.weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount, level: levelFromCount(d.contributionCount) }));
  return { total: cal.total, days };
}

// Deterministic sample: ~365 days ending today, weekday-weighted, no RNG state issues.
function sample() {
  const days = [];
  const today = new Date();
  let seed = 1337;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) % 100);
  let total = 0;
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dow = d.getDay();
    const r = rnd();
    // fewer contributions on weekends; occasional bursts
    const base = dow === 0 || dow === 6 ? 70 : 42;
    let count = r < base ? 0 : r < base + 18 ? 1 + (r % 2) : r < base + 30 ? 3 + (r % 3) : 6 + (r % 6);
    total += count;
    days.push({ date: d.toISOString().slice(0, 10), count, level: levelFromCount(count) });
  }
  return { total, days };
}

function streaks(days) {
  let cur = 0, longest = 0, run = 0;
  for (const d of days) {
    if (d.count > 0) { run++; longest = Math.max(longest, run); } else run = 0;
  }
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) cur++;
    else break;
  }
  return { currentStreak: cur, longestStreak: longest };
}

async function main() {
  let data;
  try {
    data = TOKEN ? await fetchReal() : sample();
    if (!TOKEN) console.log("No GITHUB_TOKEN — wrote deterministic sample data.");
  } catch (e) {
    console.warn("Real fetch failed (" + e.message + ") — falling back to sample.");
    data = sample();
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
