/** "August 2023 to February 2025" -> "2023–25", "May to July 2023" -> "2023", "" -> "". */
export function yearsOf(when: string): string {
  const years = when.match(/\b(19|20)\d{2}\b/g) ?? [];
  if (years.length === 0) return "";
  const first = years[0];
  const last = years[years.length - 1];
  return first === last ? first : `${first}–${last.slice(2)}`;
}
