import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/ui.ts";

export type Project = CollectionEntry<"projects">;
export type UseCase = CollectionEntry<"useCases">;
export type Testimonial = CollectionEntry<"testimonials">;
type Entry = Project | UseCase;

/** "en/evaboot" -> "evaboot" */
export function slugOf(entry: Entry): string {
  return entry.id.split("/").pop() ?? entry.id;
}

/** "en/evaboot" -> "en" */
export function langOf(entry: Entry): Lang {
  return entry.id.startsWith("fr/") ? "fr" : "en";
}

function pick<T extends Entry>(all: T[], lang: Lang): T[] {
  const en = all.filter((e) => langOf(e) === "en");
  const fr = all.filter((e) => langOf(e) === "fr");
  const chosen = lang === "en" ? en : en.map((e) => fr.find((f) => slugOf(f) === slugOf(e)) ?? e);
  return chosen.sort((a, b) => a.data.order - b.data.order);
}

export async function getProjects(lang: Lang): Promise<Project[]> {
  return pick(await getCollection("projects"), lang);
}

export async function getUseCases(lang: Lang): Promise<UseCase[]> {
  return pick(await getCollection("useCases"), lang);
}

/** Every review, newest first. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const all = await getCollection("testimonials");
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || (a.data.pile ?? 9) - (b.data.pile ?? 9));
}

/** The text a page shows: the English translation of a French review on an English page, else the original. */
export function reviewText(t: Testimonial, lang: Lang, short: boolean): { text: string; translated: boolean } {
  const d = t.data;
  if (lang === "en" && d.lang === "fr") {
    const text = short ? d.excerptTranslation ?? d.translation : d.translation;
    if (text) return { text, translated: true };
  }
  return { text: short ? d.excerpt ?? d.text : d.text, translated: false };
}

/** "Nirundthan Parameswaran" -> "NP" */
export function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}
