import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/ui.ts";

export type Project = CollectionEntry<"projects">;
export type UseCase = CollectionEntry<"useCases">;
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
