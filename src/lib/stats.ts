// A stat such as "200k", "1,000", "8 152" or "+1", split so the page can count the number up
// and still end on the exact text of the content file.
export interface Stat { prefix: string; n: number; suffix: string; sep: string }

/** Null when the value holds no single whole number ("From 0 to $3k", "2.5x"). */
export function parseStat(value: string): Stat | null {
  // Thousands split by a comma (English) or a non-breaking space (French).
  const m = value.match(/^(\D*?)(\d{1,3}(?:([,  ])\d{3})+|\d+)(\D*)$/);
  if (!m) return null;
  const sep = m[3] ?? "";
  return { prefix: m[1], n: Number(sep ? m[2].split(sep).join("") : m[2]), suffix: m[4], sep };
}

export function formatStat(stat: Stat, n: number): string {
  const digits = stat.sep ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, stat.sep) : String(n);
  return stat.prefix + digits + stat.suffix;
}
