import { defaultLang, ui, type Lang, type UiKey } from "./ui.ts";

export function getLangFromPath(pathname: string): Lang {
  const first = pathname.split("/")[1];
  return first === "fr" ? "fr" : defaultLang;
}

export function localePath(lang: Lang, path: string): string {
  return lang === defaultLang ? path : `/fr${path}`;
}

export function stripLang(pathname: string): string {
  return pathname.startsWith("/fr/") ? pathname.slice(3) : pathname;
}

export function twinPath(pathname: string): { lang: Lang; href: string } {
  const lang = getLangFromPath(pathname);
  const bare = stripLang(pathname);
  return lang === "fr" ? { lang: "en", href: bare } : { lang: "fr", href: localePath("fr", bare) };
}

export function t(lang: Lang) {
  return (key: UiKey): string => ui[lang][key] ?? ui[defaultLang][key];
}

// The email link, with a subject in the language of the page.
export function mailto(lang: Lang): string {
  return `mailto:gautier@lepoher.co?subject=${encodeURIComponent(t(lang)("mail.subject"))}`;
}
