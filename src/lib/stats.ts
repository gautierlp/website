// A stat such as "200k", "1,000" or "+1", split so the page can count the number up
// and still end on the exact text of the content file.
export interface Stat { prefix: string; n: number; suffix: string; commas: boolean }

/** Null when the value holds no single whole number ("From 0 to $3k", "2.5x"). */
export function parseStat(value: string): Stat | null {
  const m = value.match(/^(\D*?)(\d[\d,]*)(\D*)$/);
  if (!m) return null;
  return { prefix: m[1], n: Number(m[2].replace(/,/g, "")), suffix: m[3], commas: m[2].includes(",") };
}

export function formatStat(stat: Stat, n: number): string {
  return stat.prefix + (stat.commas ? n.toLocaleString("en-US") : String(n)) + stat.suffix;
}
