export interface Day { date: string; count: number }
export interface Calendar { total: number; weeks: Day[][] }

const QUERY = `{
  user(login: "gautierlp") {
    contributionsCollection {
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
    }
  }
}`;

async function doFetch(token: string | undefined): Promise<Calendar | null> {
  if (!token) {
    console.warn("[github] GITHUB_TOKEN is not set, the contribution graph is not rendered");
    return null;
  }
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": "lepoher.co build" },
      body: JSON.stringify({ query: QUERY }),
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = await res.json();
    const cal = json.data.user.contributionsCollection.contributionCalendar;
    return {
      total: cal.totalContributions,
      weeks: cal.weeks.map((w: any) => w.contributionDays.map((d: any) => ({ date: d.date, count: d.contributionCount }))),
    };
  } catch (err) {
    console.warn("[github] fetch failed, the contribution graph is not rendered:", err);
    return null;
  }
}

let pending: Promise<Calendar | null> | undefined;

/** Returns null when no token is set or the request fails; the build must not break on GitHub.
 *  Memoized at module level so a build with several pages (one per locale) only hits the GitHub API,
 *  and logs the "no token" warning, once. */
export async function fetchCalendar(token: string | undefined): Promise<Calendar | null> {
  return (pending ??= doFetch(token));
}

/** The weeks of the last `months` months. A week stays whole when the period starts inside it,
 *  so the grid is a full rectangle, and the total counts only the days that stay. */
export function lastMonths(cal: Calendar, months: number, today: Date = new Date()): Calendar {
  const from = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - months, today.getUTCDate()));
  const cutoff = from.toISOString().slice(0, 10);
  const weeks = cal.weeks.filter((week) => week.length > 0 && week[week.length - 1].date >= cutoff);
  return { total: weeks.flat().reduce((sum, day) => sum + day.count, 0), weeks };
}

/** 0 to 4, like GitHub's five tints. */
export function level(count: number): number {
  if (count >= 20) return 4;
  if (count >= 10) return 3;
  if (count >= 4) return 2;
  if (count >= 1) return 1;
  return 0;
}
