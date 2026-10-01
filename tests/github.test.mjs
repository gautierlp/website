import { test } from "node:test";
import assert from "node:assert/strict";
import { lastMonths, level, mostDays } from "../src/lib/github.ts";

// 53 weeks that end on Tuesday 2026-09-29: 52 full weeks, then Sunday to Tuesday.
function calendar() {
  const end = new Date("2026-09-29T00:00:00Z");
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (52 * 7 + 2)); // a Sunday
  const weeks = [];
  for (let d = new Date(start), week = []; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    week.push({ date: d.toISOString().slice(0, 10), count: 1 });
    if (week.length === 7 || d.getTime() === end.getTime()) { weeks.push(week); week = []; }
  }
  return { total: weeks.flat().length, weeks };
}

test("lastMonths keeps the weeks of the last 6 months", () => {
  const cal = calendar();
  assert.equal(cal.weeks.length, 53);
  const six = lastMonths(cal, 6, new Date("2026-09-29T12:00:00Z"));
  // 2026-03-29 is a Sunday: the first week kept starts on it.
  assert.equal(six.weeks[0][0].date, "2026-03-29");
  assert.equal(six.weeks.at(-1).at(-1).date, "2026-09-29");
  assert.equal(six.weeks.length, 27);
});

test("lastMonths counts only the days that it keeps", () => {
  const six = lastMonths(calendar(), 6, new Date("2026-09-29T12:00:00Z"));
  assert.equal(six.total, 26 * 7 + 3);
});

test("lastMonths keeps a full week when the 6 months start inside it", () => {
  // 6 months before Thursday 2026-10-01 is Wednesday 2026-04-01: the week of Sunday 2026-03-29 stays whole.
  const cal = calendar();
  const six = lastMonths(cal, 6, new Date("2026-10-01T12:00:00Z"));
  assert.equal(six.weeks[0][0].date, "2026-03-29");
  assert.equal(six.weeks[0].length, 7);
});

test("level gives the five tints", () => {
  assert.deepEqual([0, 1, 4, 10, 20].map(level), [0, 1, 2, 3, 4]);
});

test("mostDays is true only when more than half of the days have a contribution", () => {
  const cal = (counts) => ({ total: 0, weeks: [counts.map((count, i) => ({ date: `2026-09-0${i + 1}`, count }))] });
  assert.equal(mostDays(cal([1, 1, 0, 0])), false, "half is not most");
  assert.equal(mostDays(cal([1, 1, 1, 0])), true);
  assert.equal(mostDays(cal([0, 0, 0, 5])), false, "a busy day counts once");
});
