export const languages = { en: "EN", fr: "FR" } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = "en";

const en = {
  "site.title": "Gautier Le Poher",
  "site.description": "I take over your product and ship it myself.",
  "hero.line1.before": "I take over your product and ",
  "hero.line1.verb": "ship()",
  "hero.line1.after": " it myself.",
  "hero.line2.before": "Product owner and developer, ",
  "hero.line2.strong": "in one person",
  "hero.line2.after": ". Paris, France.",
  "hero.book": "Book call",
  "hero.email": "or email me",
  "case.fullStory": "Full story",
  "section.useCases": "Use cases",
  "section.allApps": "All apps",
  "section.yourProject": "Your project here",
  "cta.title": "Need to build an app?",
  "cta.button": "Book call",
  "cta.email": "or email me",
  "draft.empty": "Text to come.",
  "draft.pending": "Draft. Waits for the client's approval.",
  "nav.home": "Gautier Le Poher",
  "project.client": "Client",
  "project.useCases": "Use cases",
  "useCase.projects": "Projects",
  "github.title": "last 12 months",
  "github.caption": "{n} contributions in the last year",
  "test.onlyEnglish": "only english",
} as const;

const fr: Partial<Record<keyof typeof en, string>> = {
  "site.title": "Gautier Le Poher",
  "site.description": "Je reprends votre produit et je le livre moi-même.",
  "hero.line1.before": "Je reprends votre produit et je le ",
  "hero.line1.verb": "ship()",
  "hero.line1.after": " moi-même.",
  "hero.line2.before": "Product owner et développeur, ",
  "hero.line2.strong": "en une seule personne",
  "hero.line2.after": ". Paris, France.",
  "hero.book": "Réserver un appel",
  "hero.email": "ou écrivez-moi",
  "case.fullStory": "Lire l'histoire",
  "section.useCases": "Cas d'usage",
  "section.allApps": "Toutes les apps",
  "section.yourProject": "Votre projet ici",
  "cta.title": "Une app à construire ?",
  "cta.button": "Réserver un appel",
  "cta.email": "ou écrivez-moi",
  "draft.empty": "Texte à venir.",
  "draft.pending": "Brouillon. En attente de la validation du client.",
  "nav.home": "Gautier Le Poher",
  "project.client": "Client",
  "project.useCases": "Cas d'usage",
  "useCase.projects": "Projets",
  "github.title": "12 derniers mois",
  "github.caption": "{n} contributions sur la dernière année",
};

export type UiKey = keyof typeof en;
export const ui: { en: typeof en; fr: typeof fr } = { en, fr };
