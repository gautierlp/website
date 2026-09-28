# Site Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild lepoher.co as Astro components with the current Carrd look, add one page per project (11) and per use case (4) in English and French routes, and remove every Contra case-study link.

**Architecture:** Static Astro 7 site. Content lives in two content collections (`projects`, `use-cases`), one Markdown file per entry and per language under `en/` and `fr/`; a missing `fr/` file falls back to the `en/` file. One layout, six homepage components, two page templates shared by the English and French routes. A one-off Python script imports the 8 Contra stories. Tests run with `node --test` on the built `dist/`.

**Tech Stack:** Astro 7.3 (content collections with the `glob` loader, built-in i18n routing), plain CSS, Node 22 (`node --test`, TypeScript type stripping), Python 3 standard library for the import script, GitHub GraphQL API at build time.

**Global Constraints:**
- The look is the current Carrd page: fonts Overpass (headings, buttons), Fira Sans (large text), Inter (small text); site blue `#2300ff`; page background `#454545`; white panel with `1.875rem` corner radius; `html { font-size: 18pt }` on desktop, `13pt` under 1024px, `11pt` under 736px. Compare every page against `http://localhost:4322/old` (the untouched Carrd copy, kept until Task 9).
- No em dash (`—`) and no en dash (`–`) in any file this plan creates. Use a comma, a colon, a period or parentheses.
- Every page has `lang`, a `<title>`, a `<meta name="description">`, a canonical link and two `hreflang` links (`en`, `fr`).
- French routes are `/fr/...`. English routes have no prefix. UI strings come from `src/i18n/ui.ts` only; no UI string is written inside a component.
- No `contra.com/p/` string in `src/` or `dist/` at the end. The profile link `https://contra.com/gautierlp` stays.
- The Carrd files `src/carrd/*`, the demo page and `src/data/` are deleted in Task 9, not before.
- Commit after each task with a conventional-commit message. No push.

**User decisions (already made):**
- "Keep my lepoher.co website design. I think it's the most easily readable" (2026-09-25).
- One page per project, and the use cases as separate pages; a client page is not built now (2026-09-28).
- "The i18n routing should be ready, the actual french copy can wait" (2026-09-28).
- All 11 projects get a page; the 3 without a Contra story get a placeholder (2026-09-28, "All 14" said before the count was corrected to 11).
- "Just get contra, we'll refine it later on": the 8 project texts come from Contra as they are.
- The 4 use-case texts come from `~/projects/personal/freelance/docs/case-studies/`, status `draft`.
- Additions from reference sites: number column on lists, GitHub contribution graph, `ship()` in the headline in a code font (demo approved 2026-09-25).
- The Carrd quote form (posts to Carrd's backend) is replaced by the "Book call" button and the e-mail link.

---

## File structure

| Path | Responsibility |
| --- | --- |
| `astro.config.mjs` | Site URL and i18n routing |
| `src/content.config.ts` | The two collection schemas |
| `src/content/projects/{en,fr}/<slug>.md` | One project per file |
| `src/content/use-cases/{en,fr}/<slug>.md` | One use case per file |
| `src/lib/content.ts` | Read the collections per language with the English fallback |
| `src/i18n/ui.ts` | UI strings, English and French |
| `src/i18n/utils.ts` | Language from URL, translator, path helpers (pure functions) |
| `src/styles/global.css` | The Carrd look |
| `src/layouts/BaseLayout.astro` | Head, header, footer, back-to-top |
| `src/components/Hero.astro` | Photo, headline, intro, buttons |
| `src/components/GitHubGraph.astro` | Contribution grid, fetched at build |
| `src/components/FeaturedCase.astro` | One featured project on the homepage |
| `src/components/NumberList.astro` | List with the number column |
| `src/components/LogoGrid.astro` | The 11 projects |
| `src/components/CallToAction.astro` | "Need to build an app?" |
| `src/components/DraftNote.astro` | The grey note on draft pages |
| `src/components/ProjectPage.astro` | Body of a project page (shared en/fr) |
| `src/components/UseCasePage.astro` | Body of a use-case page (shared en/fr) |
| `src/pages/index.astro`, `src/pages/fr/index.astro` | Homepage |
| `src/pages/projects/[slug].astro`, `src/pages/fr/projects/[slug].astro` | Project pages |
| `src/pages/use-cases/[slug].astro`, `src/pages/fr/use-cases/[slug].astro` | Use-case pages |
| `scripts/import_contra.py` | One-off Contra import |
| `src/components/Media.astro` | An image, or a video when the path ends with `.mp4` |
| `scripts/import-use-cases.py` | One-off copy of the 4 drafts |
| `tests/i18n.test.mjs` | Unit tests of the i18n helpers |
| `tests/site.test.mjs` | Tests on `dist/` |
| `tests/test_import_contra.py` | Unit test of the Contra HTML converter |

Task order: the content model first, then the content (the homepage components read it), then the layout and the homepage, then the two page types, then the graph, then the cleanup.

---

### Task 1: Config, content model, i18n helpers, test harness

**Goal:** The site builds with i18n routing, two typed collections, and the i18n helpers with unit tests.

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json` (scripts)
- Create: `src/content.config.ts`
- Create: `src/content/projects/en/.gitkeep`, `src/content/projects/fr/.gitkeep`, `src/content/use-cases/en/.gitkeep`, `src/content/use-cases/fr/.gitkeep`
- Create: `src/lib/content.ts`
- Create: `src/i18n/ui.ts`
- Create: `src/i18n/utils.ts`
- Test: `tests/i18n.test.mjs`

**Acceptance Criteria:**
- [ ] `node --experimental-strip-types --test tests/i18n.test.mjs` passes 6 tests.
- [ ] `npm run build` passes and prints no schema error.
- [ ] `astro.config.mjs` has `site: 'https://lepoher.co'` and `i18n.locales: ['en', 'fr']`.

**Verify:** `npm run test:unit && npm run build` → tests pass, build ends with "Complete!".

**Steps:**

- [ ] **Step 1: Write the failing unit tests**

`tests/i18n.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { getLangFromPath, localePath, twinPath, t } from "../src/i18n/utils.ts";

test("getLangFromPath: no prefix is English", () => {
  assert.equal(getLangFromPath("/"), "en");
  assert.equal(getLangFromPath("/projects/evaboot/"), "en");
});

test("getLangFromPath: /fr prefix is French", () => {
  assert.equal(getLangFromPath("/fr/"), "fr");
  assert.equal(getLangFromPath("/fr/projects/evaboot/"), "fr");
});

test("localePath adds the prefix for French only", () => {
  assert.equal(localePath("en", "/projects/evaboot/"), "/projects/evaboot/");
  assert.equal(localePath("fr", "/projects/evaboot/"), "/fr/projects/evaboot/");
  assert.equal(localePath("fr", "/"), "/fr/");
});

test("twinPath swaps the language and keeps the path", () => {
  assert.deepEqual(twinPath("/projects/evaboot/"), { lang: "fr", href: "/fr/projects/evaboot/" });
  assert.deepEqual(twinPath("/fr/projects/evaboot/"), { lang: "en", href: "/projects/evaboot/" });
  assert.deepEqual(twinPath("/fr/"), { lang: "en", href: "/" });
});

test("t returns the French string when it exists", () => {
  assert.equal(t("fr")("hero.book"), "Réserver un appel");
});

test("t falls back to English for a missing French key", () => {
  assert.equal(t("fr")("test.onlyEnglish"), "only english");
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --experimental-strip-types --test tests/i18n.test.mjs`
Expected: FAIL, "Cannot find module '../src/i18n/utils.ts'".

- [ ] **Step 3: Write the i18n strings**

`src/i18n/ui.ts`:

```ts
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
```

- [ ] **Step 4: Write the i18n helpers**

`src/i18n/utils.ts`:

```ts
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
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `node --experimental-strip-types --test tests/i18n.test.mjs`
Expected: 6 passed.

- [ ] **Step 6: Astro config and collection schemas**

`astro.config.mjs`:

```js
// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://lepoher.co",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: { prefixDefaultLocale: false },
  },
});
```

`src/content.config.ts`:

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const link = z.object({ label: z.string(), url: z.string().url() });
const image = z.object({ src: z.string(), alt: z.string() });
const highlight = z.object({ text: z.string(), image: z.string().default(""), caption: z.string().default("") });
const status = z.enum(["live", "draft"]);

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    client: z.string(),
    logo: z.string().default(""),
    summary: z.string(),
    result: z.string().default(""),
    resultLabel: z.string().default(""),
    links: z.array(link).default([]),
    useCases: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number(),
    status,
    images: z.array(image).default([]),
    highlights: z.array(highlight).default([]),
    quote: z.object({ text: z.string(), who: z.string(), role: z.string() }).optional(),
  }),
});

const useCases = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/use-cases" }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    summary: z.string(),
    result: z.string(),
    resultLabel: z.string(),
    projects: z.array(z.string()).default([]),
    order: z.number(),
    status,
  }),
});

export const collections = { projects, useCases };
```

`highlights` holds the 4 short paragraphs with a screenshot each that the homepage featured block shows (the Carrd texts). `images` holds the screenshots of the project page.

- [ ] **Step 7: Collection readers with the English fallback**

`src/lib/content.ts`:

```ts
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
```

Create the four `.gitkeep` files so the `glob` loader finds its base folders.

- [ ] **Step 8: Scripts in package.json**

Replace the `scripts` block:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "test:unit": "node --experimental-strip-types --test tests/i18n.test.mjs",
  "test:site": "node --test tests/site.test.mjs",
  "test": "npm run test:unit && npm run build && npm run test:site"
}
```

`tests/site.test.mjs` does not exist yet; Task 5 creates it. Until then run `npm run test:unit` and `npm run build` by hand.

- [ ] **Step 9: Build**

Run: `npm run build`
Expected: "Complete!" and no error. A warning "collection projects is empty" is acceptable at this point.

- [ ] **Step 10: Commit**

```bash
git add astro.config.mjs package.json src/content.config.ts src/content src/lib src/i18n tests/i18n.test.mjs
git commit -m "feat(site): content collections, i18n routing and helpers"
```

---

### Task 2: Contra import script and the 11 project files

**Goal:** `src/content/projects/en/` holds 11 files: 8 imported from Contra with their images, 3 placeholders.

**Files:**
- Create: `scripts/import_contra.py`
- Create: `tests/test_import_contra.py`
- Create: `tests/fixtures/contra-sample.html`
- Create: `src/content/projects/en/*.md` (11 files, by the script)
- Create: `public/assets/projects/<slug>/*` (by the script)

**Acceptance Criteria:**
- [ ] `python3 -m unittest tests/test_import_contra.py` passes 4 tests.
- [ ] `python3 scripts/import-contra.py` writes 11 files and downloads at least 1 image per Contra project.
- [ ] `npm run build` passes with the 11 files (schema valid).
- [ ] `grep -rl "contra.com/p/" src/content` prints nothing.

**Verify:** `python3 -m unittest tests/test_import_contra.py && python3 scripts/import-contra.py && npm run build && ls src/content/projects/en | wc -l` → 11.

**Steps:**

- [ ] **Step 1: Write the fixture and the failing tests**

`tests/fixtures/contra-sample.html` (a cut of a real page, only the parts the converter reads):

```html
<html><head>
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Article","description":"A short summary.","headline":"Sample title"}]}</script>
</head><body>
<div class="bn-block-content" data-content-type="heading" data-level="2"><h2><div class="bn-inline-content"><strong>INTRODUCTION</strong></div></h2></div>
<div class="bn-block-content" data-content-type="paragraph"></div>
<div class="bn-block-content" data-content-type="paragraph"><div class="bn-inline-content">First paragraph with <strong>bold</strong> and <a href="https://example.com">a link</a>.</div></div>
<div class="bn-block-content" data-content-type="bulletListItem"><div class="bn-inline-content"><strong>Item</strong>: detail.</div></div>
<div class="bn-block-content" data-content-type="image" data-uid="img123" data-name="shot.png"><img src="https://media.contra.com/image/upload/fl_progressive/q_auto:best/img123.webp"/></div>
<div class="bn-block-content" data-content-type="video" data-uid="vid456" data-caption="App preview"><video></video></div>
<div class="bn-block-content" data-content-type="divider"></div>
<div class="bn-block-content" data-content-type="heading" data-level="3"><h3><div class="bn-inline-content">Core Challenges</div></h3></div>
</body></html>
```

`tests/test_import_contra.py`:

```python
import os, sys, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
import import_contra as ic

FIXTURE = os.path.join(os.path.dirname(__file__), "fixtures", "contra-sample.html")


class ConverterTest(unittest.TestCase):
    def setUp(self):
        with open(FIXTURE, encoding="utf-8") as f:
            self.html = f.read()

    def test_summary_and_title_come_from_ld_json(self):
        meta = ic.read_meta(self.html)
        self.assertEqual(meta["title"], "Sample title")
        self.assertEqual(meta["summary"], "A short summary.")

    def test_blocks_become_markdown(self):
        md, assets = ic.blocks_to_markdown(self.html, "sample")
        self.assertIn("## Introduction", md)
        self.assertIn("First paragraph with **bold** and [a link](https://example.com).", md)
        self.assertIn("- **Item**: detail.", md)
        self.assertIn("### Core Challenges", md)
        self.assertIn("\n---\n", md)

    def test_media_paths_are_local(self):
        md, assets = ic.blocks_to_markdown(self.html, "sample")
        self.assertIn("![shot.png](/assets/projects/sample/img123.webp)", md)
        self.assertIn('<video controls muted playsinline src="/assets/projects/sample/vid456.mp4" poster="/assets/projects/sample/vid456.webp"></video>', md)
        urls = sorted(a["url"] for a in assets)
        self.assertEqual(urls, [
            "https://media.contra.com/image/upload/fl_progressive/q_auto:best/img123.webp",
            "https://media.contra.com/video/upload/fl_progressive/q_auto:best,w_700/vid456.mp4",
            "https://media.contra.com/video/upload/fl_progressive/q_auto:best,w_700/vid456.webp",
        ])

    def test_frontmatter_is_valid_yaml_via_json_strings(self):
        text = ic.frontmatter({"name": "A \"quoted\" name", "order": 3, "featured": True, "links": [{"label": "Site", "url": "https://x.y"}]})
        self.assertTrue(text.startswith("---\n"))
        self.assertIn('name: "A \\"quoted\\" name"', text)
        self.assertIn("order: 3\n", text)
        self.assertIn("featured: true\n", text)
        self.assertIn('links: [{"label": "Site", "url": "https://x.y"}]', text)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `python3 -m unittest tests/test_import_contra.py`
Expected: FAIL, "No module named 'import_contra'".

- [ ] **Step 3: Write the script**

```python
#!/usr/bin/env python3
"""One-off import of the 8 Contra case studies into src/content/projects/en/.

Run: python3 scripts/import_contra.py
A second run overwrites the same files. Standard library only.
"""
import html
import json
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "content", "projects", "en")
ASSETS = os.path.join(ROOT, "public", "assets", "projects")
CONTRA = "https://contra.com/p/"
IMG = "https://media.contra.com/image/upload/fl_progressive/q_auto:best/{uid}.webp"
VID = "https://media.contra.com/video/upload/fl_progressive/q_auto:best,w_700/{uid}.{ext}"
UA = {"User-Agent": "Mozilla/5.0 (lepoher.co import script)"}

# Data that the Contra page does not give: taken from the Carrd page on 2026-09-28.
PROJECTS = [
    dict(slug="evaboot", name="Evaboot", client="Evaboot", order=1, featured=True,
         contra="sllAZU3M-scaling-evaboot-from-dollar1-m-to-dollar2-m-arr-with-bubble",
         logo="/assets/images/image30.png", result="From $1M to $2M+", resultLabel="ARR",
         links=[{"label": "Website", "url": "https://evaboot.com/"}],
         useCases=["no-code-exit", "interfaces-on-a-new-stack", "marketing-site-migration"],
         images=[{"src": "/assets/videos/video01.mp4", "alt": "User dashboard"},
                 {"src": "/assets/images/image06.jpg", "alt": "Admin dashboard"},
                 {"src": "/assets/images/image20.jpg", "alt": "Stripe integration"}],
         highlights=[
             {"text": "Evaboot had reached $1M ARR but faced challenges scaling due to technical debt and operational bottlenecks. JB, one of the founders, was deeply involved in development, limiting his ability to focus on growth.", "image": "/assets/videos/video01.mp4", "caption": "User dashboard"},
             {"text": "Evaboot needed to scale from $1M to $2M ARR but was struggling with a Bubble app burdened by technical debt, ongoing bugs, and security concerns. JB's involvement in app development made it difficult for him to prioritize strategic business tasks.", "image": "/assets/images/image06.jpg", "caption": "Admin dashboard"},
             {"text": "Over the course of a year, I worked closely with JB to take over the technical management of the app. This included refactoring the codebase to eliminate technical debt, resolving critical bugs, enhancing security, improving the user experience, and integrating third-party tools like Stripe and Segment. These efforts allowed JB to delegate technical responsibilities and focus on scaling the business.", "image": "/assets/images/image20.jpg", "caption": "Stripe integration"},
             {"text": "By optimizing the app and streamlining operations, Evaboot successfully reached its goal of $2M ARR. The technical improvements enabled the company to grow efficiently, while JB could concentrate on strategic growth initiatives.", "image": "", "caption": ""},
         ],
         quote={"text": "Gautier expertly used Bubble.io to support our projects, delivering effective solutions and overcoming obstacles. Impressed by their precision and ability to handle project challenges, we trust in their skills and will use them again for future Bubble.io projects.", "who": "JB Jézéquel", "role": "Co-Founder, Evaboot"}),
    dict(slug="disko-leads", name="Disko Leads", client="Disko Leads", order=2, featured=True,
         contra="7XZENP72-connecting-bubble-with-a-google-chrome-extension",
         logo="/assets/images/image31.png", result="From 0 to $3k", resultLabel="MRR",
         links=[], useCases=[],
         images=[{"src": "/assets/images/image21.jpg", "alt": "User dashboard"},
                 {"src": "/assets/images/image05.jpg", "alt": "Pricing page"},
                 {"src": "/assets/images/image03.jpg", "alt": "Chrome extension"}],
         highlights=[
             {"text": "Disko Leads, founded by Johary, aimed to create an app that could extract and enrich the profiles of users who liked or commented on LinkedIn posts, generating valuable lead data for businesses.", "image": "/assets/images/image21.jpg", "caption": "User dashboard"},
             {"text": "Johary needed a solution that would allow users to extract and enrich LinkedIn profiles from any post, generate detailed CSVs, and manage credits and payments efficiently. The project had to be completed from scratch and delivered quickly.", "image": "/assets/images/image03.jpg", "caption": "Chrome extension"},
             {"text": "Over three weeks, I developed a chrome extension and a web app using Bubble.io and JavaScript. The extension added a button to LinkedIn posts, which redirected users to the Disko Leads platform. There, users could apply filters (e.g., industry, role, company size) and generate enriched CSVs with public LinkedIn information, enhanced through RapidAPI. The platform also handled user credits, payments (via Stripe), CSV management, and provided an admin interface for overseeing users and exports. Additionally, I integrated SendGrid for emails and Google Sheets for data visualization.", "image": "/assets/images/image05.jpg", "caption": "Pricing page"},
             {"text": "The app successfully launched, going from 0 to $3k MRR in a short period. Users benefited from a streamlined lead extraction process, and Disko Leads now had a scalable platform for managing both users and data exports.", "image": "", "caption": ""},
         ],
         quote={"text": "Working with Gautier on our SaaS project was an exceptional experience. His mastery of Bubble.io allowed us to quickly bring our vision to life, and the final product exceeded our expectations. Highly recommended!", "who": "Johary Randria", "role": "Founder, Disko Leads"}),
    dict(slug="folderly", name="Folderly", client="Folderly", order=3, featured=True,
         contra="rMAU733P-developing-folderlys-bubble-app-from-0-to-600-users",
         logo="/assets/images/image32.png", result="$1.6M+", resultLabel="ARR, backed by Google Startups",
         links=[{"label": "Product Hunt", "url": "https://www.producthunt.com/products/folderly#outreach-academy-by-folderly/"},
                {"label": "Google Startups", "url": "https://blog.google/around-the-globe/google-europe/25-new-startup-recipients-of-the-ukraine-support-fund/"}],
         useCases=[],
         images=[{"src": "/assets/images/image18.jpg", "alt": "Landing hero"},
                 {"src": "/assets/images/image04.jpg", "alt": "Mobile version"},
                 {"src": "/assets/images/image09.jpg", "alt": "Tablet version"},
                 {"src": "/assets/images/image26.jpg", "alt": "Laptop version"}],
         highlights=[
             {"text": "Folderly, a B2B email deliverability SaaS, sought to develop the Outreach Academy, a comprehensive, free course designed for professionals using cold email to drive sales.", "image": "/assets/images/image18.jpg", "caption": "Landing hero"},
             {"text": "Folderly needed a fully responsive, user-friendly platform for delivering their course content across multiple devices. The platform required robust functionality, including customizable modules, lessons, tests, and autonomous content management for admins. Seamless integration with tools like HubSpot and SendGrid was essential for enhancing user engagement and automating processes.", "image": "/assets/images/image04.jpg", "caption": "Mobile version"},
             {"text": "Within three weeks, I developed and delivered a fully responsive and bug-free application that worked flawlessly on desktop, tablet, and mobile devices. The platform included a flexible course system where admins could easily add, edit, and manage content. I also integrated HubSpot for marketing automation and SendGrid for email communications, ensuring a smooth experience for both administrators and users.", "image": "/assets/images/image26.jpg", "caption": "Laptop version"},
             {"text": "Folderly's Outreach Academy launched successfully, attracting more than 600 students in the first few weeks. The platform empowered admins to manage course content autonomously and engage effectively with users. The project was delivered on time, fully functional, and positioned as a valuable free resource for sales professionals using cold email.", "image": "", "caption": ""},
         ],
         quote={"text": "I'd like to highlight the incredible experience we've had. The intuitive interface and robust features have significantly simplified our email management.", "who": "Inna Ozymai", "role": "Sales, Belkins Data Enrich"}),
    dict(slug="fleetnova", name="Fleetnova", client="Automotive recycling group", order=4,
         contra="QEkXbAbv-building-a-marketplace-for-second-hand-auto-parts-with-bubble",
         logo="", useCases=["internal-applications"]),
    dict(slug="camarage", name="Camarage", client="Camarage", order=5,
         contra="m26vFMLv-migrating-a-1000-user-app-from-code-to-bubble",
         logo="/assets/images/image34.png"),
    dict(slug="eco-insight", name="Eco'Insight", client="Automotive recycling group", order=6,
         contra="eZU2FPM7-streamlining-multi-actor-recycling-operations-with-bubble",
         logo="", useCases=["internal-applications"]),
    dict(slug="eco-link", name="Eco'link", client="Automotive recycling group", order=7,
         contra="MmEbmmlR-streamlining-dealership-onboarding-with-bubble",
         logo="", useCases=["internal-applications"]),
    dict(slug="clean-car", name="Clean Car", client="Clean Car", order=8,
         contra="l3XmWqBY-launching-a-bubble-app-on-app-store-and-google-play",
         logo="/assets/images/image14.png"),
    dict(slug="price-writers", name="Price Writers", client="Price Writers", order=9, logo="/assets/images/image15.png"),
    dict(slug="betc", name="BETC", client="BETC", order=10, logo="/assets/images/image16.png"),
    dict(slug="protech", name="Protech", client="Protech", order=11, logo="/assets/images/image11.png"),
]

BLOCK = re.compile(r'<div class="bn-block-content" data-content-type="(\w+)"([^>]*)>')
INLINE = re.compile(r'<div class="bn-inline-content">(.*?)</div>', re.S)


def attr(attrs, name):
    m = re.search(name + r'="([^"]*)"', attrs)
    return html.unescape(m.group(1)) if m else ""


def inline_to_md(fragment):
    """Keep bold, italic and links. Drop every other tag."""
    s = re.sub(r"<strong>(.*?)</strong>", r"**\1**", fragment, flags=re.S)
    s = re.sub(r"<em>(.*?)</em>", r"*\1*", s, flags=re.S)
    s = re.sub(r'<a [^>]*href="([^"]*)"[^>]*>(.*?)</a>', r"[\2](\1)", s, flags=re.S)
    s = re.sub(r"<br\s*/?>", " ", s)
    s = re.sub(r"<[^>]+>", "", s)
    return html.unescape(re.sub(r"\s+", " ", s)).strip()


def heading_text(text):
    return text.capitalize() if text.isupper() else text


def read_meta(page):
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', page, re.S)
    article = json.loads(m.group(1))["@graph"][0]
    return {"title": article.get("headline", ""), "summary": article.get("description", "")}


def blocks_to_markdown(page, slug):
    """Return (markdown, assets). assets: [{url, path}] to download."""
    out, assets = [], []
    matches = list(BLOCK.finditer(page))
    for i, m in enumerate(matches):
        kind, attrs = m.group(1), m.group(2)
        end = matches[i + 1].start() if i + 1 < len(matches) else len(page)
        seg = page[m.end():end]
        inline = INLINE.search(seg)
        text = inline_to_md(inline.group(1)) if inline else ""
        if kind == "heading":
            level = int(attr(attrs, "data-level") or "2")
            out.append("#" * level + " " + heading_text(text.replace("**", "")))
        elif kind == "paragraph":
            if text:
                out.append(text)
        elif kind == "bulletListItem":
            out.append("- " + text)
        elif kind == "divider":
            out.append("---")
        elif kind == "image":
            uid, name = attr(attrs, "data-uid"), attr(attrs, "data-name") or "image"
            local = f"/assets/projects/{slug}/{uid}.webp"
            assets.append({"url": IMG.format(uid=uid), "path": local})
            out.append(f"![{name}]({local})")
        elif kind == "video":
            uid = attr(attrs, "data-uid")
            mp4, poster = f"/assets/projects/{slug}/{uid}.mp4", f"/assets/projects/{slug}/{uid}.webp"
            assets.append({"url": VID.format(uid=uid, ext="mp4"), "path": mp4})
            assets.append({"url": VID.format(uid=uid, ext="webp"), "path": poster})
            out.append(f'<video controls muted playsinline src="{mp4}" poster="{poster}"></video>')
    return "\n\n".join(out) + "\n", assets


def frontmatter(fields):
    lines = ["---"]
    for key, value in fields.items():
        lines.append(f"{key}: {json.dumps(value, ensure_ascii=False)}")
    lines.append("---")
    return "\n".join(lines) + "\n"


def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read()


def download(assets):
    for a in assets:
        target = os.path.join(ROOT, "public", a["path"].lstrip("/"))
        os.makedirs(os.path.dirname(target), exist_ok=True)
        if os.path.exists(target):
            continue
        with open(target, "wb") as f:
            f.write(fetch(a["url"]))
        print("  downloaded", a["path"])


def build_entry(p):
    fields = {
        "name": p["name"], "client": p["client"], "logo": p.get("logo", ""),
        "summary": "", "result": p.get("result", ""), "resultLabel": p.get("resultLabel", ""),
        "links": p.get("links", []), "useCases": p.get("useCases", []),
        "featured": p.get("featured", False), "order": p["order"], "status": "draft",
        "images": p.get("images", []), "highlights": p.get("highlights", []),
    }
    if "quote" in p:
        fields["quote"] = p["quote"]
    body = ""
    if "contra" in p:
        page = fetch(CONTRA + p["contra"]).decode("utf-8")
        meta = read_meta(page)
        fields["summary"] = meta["summary"] or p["name"]
        fields["status"] = "live"
        body, assets = blocks_to_markdown(page, p["slug"])
        download(assets)
        body = f"# {meta['title']}\n\n" + body
    else:
        fields["summary"] = p["name"]
    return frontmatter(fields) + "\n" + body


def main():
    os.makedirs(OUT, exist_ok=True)
    for p in PROJECTS:
        print(p["slug"])
        with open(os.path.join(OUT, p["slug"] + ".md"), "w", encoding="utf-8") as f:
            f.write(build_entry(p))
    print("done:", len(PROJECTS), "files")


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `python3 -m unittest tests/test_import_contra.py`
Expected: 4 tests OK.

- [ ] **Step 5: Run the import**

Run: `python3 scripts/import_contra.py`
Expected: 11 slugs printed, "downloaded" lines for the 8 Contra projects, "done: 11 files".

Then open `src/content/projects/en/evaboot.md` and check that the body starts with "# Scaling Evaboot from $1M to $2M ARR with Bubble" and has "## Introduction", "## Problem statement", "## Results". If a heading kept its uppercase, `heading_text` did not match: fix it in the script and run again.

Copy the project titles of the 5 non-featured Contra projects into `summary` if the ld+json description is empty. Check with: `grep -L 'summary: ".\{20,\}' src/content/projects/en/*.md`. Expected: only the 3 placeholder files.

- [ ] **Step 6: Build and check**

Run: `npm run build && ls src/content/projects/en | wc -l && grep -rl "contra.com/p/" src/content || echo "no contra links"`
Expected: build passes, `11`, "no contra links".

- [ ] **Step 7: Commit**

```bash
git add scripts/import_contra.py tests/test_import_contra.py tests/fixtures src/content/projects public/assets/projects
git commit -m "feat(content): import the 8 Contra stories and add the 11 project files"
```

---

### Task 3: The 4 use-case files from the freelance drafts

**Goal:** `src/content/use-cases/en/` holds the 4 drafts with a valid header, status `draft`.

**Files:**
- Create: `scripts/import_use_cases.py`
- Create: `src/content/use-cases/en/*.md` (4 files, by the script)

**Acceptance Criteria:**
- [ ] `python3 scripts/import_use_cases.py` writes 4 files.
- [ ] Each file body starts with `## Situation` (the draft's H1, status and client lines are dropped).
- [ ] `npm run build` passes.

**Verify:** `python3 scripts/import_use_cases.py && npm run build && ls src/content/use-cases/en` → 4 files, build passes.

**Steps:**

- [ ] **Step 1: Write the script**

`scripts/import_use_cases.py`:

```python
#!/usr/bin/env python3
"""One-off copy of the 4 case-study drafts from the freelance repository.

Run: python3 scripts/import_use_cases.py
The drafts stay the source; run again after they change.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.expanduser("~/projects/personal/freelance/docs/case-studies")
OUT = os.path.join(ROOT, "src", "content", "use-cases", "en")

USE_CASES = [
    dict(slug="no-code-exit", file="01-no-code-exit.md", name="The no-code exit", order=1,
         summary="A B2B SaaS leaves Bubble for Django: the full map of the app, and the data moved with no downtime.",
         result="200k", resultLabel="users migrated, no downtime", projects=["evaboot"]),
    dict(slug="interfaces-on-a-new-stack", file="02-interfaces-on-a-new-stack.md", name="The API, the CLI and the MCP server", order=2,
         summary="A product gets its public interfaces on the new stack: an MCP server, a CLI, an LLM agent.",
         result="36", resultLabel="MCP tools in production", projects=["evaboot"]),
    dict(slug="marketing-site-migration", file="03-marketing-site-migration.md", name="The marketing site migration", order=3,
         summary="A nine-language site moves off WordPress to Astro and Sanity in two weeks, no downtime.",
         result="100", resultLabel="Lighthouse performance and SEO", projects=["evaboot"]),
    dict(slug="internal-applications", file="04-internal-applications-industrial-group.md", name="Internal applications", order=4,
         summary="Three internal applications for the same industrial group, one a year, all still in use.",
         result="3", resultLabel="internal apps, same client", projects=["fleetnova", "eco-insight", "eco-link"]),
]


def split_draft(text):
    title = re.match(r"# (.+)", text).group(1).strip()
    body = text[text.index("## Situation"):]
    return title, body


def frontmatter(fields):
    return "---\n" + "\n".join(f"{k}: {json.dumps(v, ensure_ascii=False)}" for k, v in fields.items()) + "\n---\n"


def main():
    os.makedirs(OUT, exist_ok=True)
    for u in USE_CASES:
        with open(os.path.join(SRC, u["file"]), encoding="utf-8") as f:
            title, body = split_draft(f.read())
        fields = {"name": u["name"], "title": title, "summary": u["summary"], "result": u["result"],
                  "resultLabel": u["resultLabel"], "projects": u["projects"], "order": u["order"], "status": "draft"}
        with open(os.path.join(OUT, u["slug"] + ".md"), "w", encoding="utf-8") as f:
            f.write(frontmatter(fields) + "\n" + body)
        print(u["slug"])


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run it and build**

Run: `python3 scripts/import_use_cases.py && npm run build && head -12 src/content/use-cases/en/no-code-exit.md`
Expected: 4 slugs printed, build passes, the header shows `title: "From Bubble to a database ..."` and the body starts at "## Situation".

- [ ] **Step 3: Commit**

```bash
git add scripts/import_use_cases.py src/content/use-cases
git commit -m "feat(content): add the 4 use-case drafts"
```

---

### Task 4: Global CSS and the base layout

**Goal:** A layout that reproduces the Carrd frame (dark page, white rounded panel, header with name and 3 icons, back-to-top) with the site's fonts, plus a throwaway page to compare it with `/old`.

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/icons/LinkedIn.astro`, `src/components/icons/Contra.astro`, `src/components/icons/Malt.astro`, `src/components/icons/ArrowRight.astro`
- Create: `src/components/Media.astro`
- Rename: `src/pages/index.astro` to `src/pages/old.astro`
- Create: `src/pages/index.astro` (temporary: the layout with one heading)

**Acceptance Criteria:**
- [ ] `npm run build` passes; `dist/index.html` and `dist/old/index.html` exist.
- [ ] `dist/index.html` has `<html lang="en">`, a `<title>`, `<link rel="canonical" href="https://lepoher.co/">`, two `hreflang` links, and the Google Fonts link with Overpass, Fira Sans, Inter and JetBrains Mono.
- [ ] A screenshot of `/` at 1280 px shows the dark `#454545` page, the white panel with rounded corners, the name top-left and 3 grey icons top-right, at the same positions as `/old`.

**Verify:** `npm run build && grep -c 'hreflang' dist/index.html` → 2.

**Steps:**

- [ ] **Step 1: Keep the Carrd page at /old**

```bash
git mv src/pages/index.astro src/pages/old.astro
```

In `src/pages/old.astro`, add `<meta name="robots" content="noindex" />` in the head. Nothing else changes.

- [ ] **Step 2: The icons**

The four SVG symbols come from `src/carrd/body.html`: copy the `<path d="...">` of each `<symbol>` into a component. Symbol ids: LinkedIn `icon-bf393d6ea48a4e69e1ed58a3563b94a5`, Contra `icon-74a58e2fe0465702e6b031066e7c7292`, Malt `icon-959284698a8c524d2fbbb5dc0e2ef60c`, arrow `icon-67ad41ecc66a1b1cd00d0d3b20c00017`. Each component has this shape (`src/components/icons/ArrowRight.astro`):

```astro
---
// Path copied from the Carrd export (symbol icon-67ad41ecc66a1b1cd00d0d3b20c00017).
---
<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path d="M34.1,19.9c0,0.3-0.1,0.3-0.1,0.4L21.3,33.1c-0.1,0.1-0.1,0.1-0.4,0.1c-0.3,0-0.3-0.1-0.4-0.1L19,31.6 c-0.1-0.1-0.1-0.1-0.1-0.4s0.1-0.3,0.1-0.4l9.2-9.2H5.8c-0.1,0-0.2,0-0.2,0c0,0,0,0,0,0c-0.1-0.1-0.1-0.2-0.1-0.4v-2.5 c0-0.2,0.1-0.4,0.1-0.5c0,0,0.1,0,0.2,0h22.4L19,9c-0.1-0.1-0.1-0.1-0.1-0.4c0-0.3,0.1-0.3,0.1-0.4l1.5-1.5c0.1-0.1,0.1-0.1,0.4-0.1 c0.3,0,0.3,0.1,0.4,0.1L34,19.5C34,19.6,34.1,19.6,34.1,19.9z"/></svg>
```

Get the other three paths with:

```bash
python3 -c "
import re;b=open('src/carrd/body.html').read()
for i in ['bf393d6ea48a4e69e1ed58a3563b94a5','74a58e2fe0465702e6b031066e7c7292','959284698a8c524d2fbbb5dc0e2ef60c']:
    m=re.search(r'<symbol id=\"icon-'+i+r'\"[^>]*>(.*?)</symbol>',b,re.S); print(i, m.group(1)[:3000]); print()"
```

- [ ] **Step 3: Media component**

`src/components/Media.astro` renders a screenshot, or the Evaboot dashboard video when the path ends with `.mp4` (the Carrd page autoplays it, muted, in a loop; its poster file is a blank frame, so it is never used as an image):

```astro
---
interface Props { src: string; alt: string }
const { src, alt } = Astro.props;
const isVideo = src.endsWith(".mp4");
---
<div class="frame">
  {isVideo
    ? <video src={src} muted autoplay loop playsinline preload="metadata" aria-label={alt}></video>
    : <img src={src} alt={alt} loading="lazy" />}
</div>
```

- [ ] **Step 4: The global CSS**

`src/styles/global.css`:

```css
/* The Carrd look of lepoher.co, rewritten by hand. Values come from the Carrd export. */
:root {
  --blue: #2300ff;
  --page-bg: #454545;
  --panel-bg: #ffffff;
  --ink: #000000;
  --ink-soft: rgba(0, 0, 0, 0.8);
  --grey: #677084;
  --border: #c6c6c6;
  --radius: 1.875rem;
  --pad-x: 6rem;
  --pad-y: 1.5rem;
  --font-heading: "Overpass", sans-serif;
  --font-text: "Fira Sans", sans-serif;
  --font-small: "Inter", sans-serif;
  --font-code: "JetBrains Mono", "Fira Code", "Lucida Console", monospace;
}
*, *::before, *::after { box-sizing: border-box; }
html { font-size: 18pt; -webkit-text-size-adjust: none; }
@media (max-width: 1024px) { html { font-size: 13pt; } }
@media (max-width: 736px) { html { font-size: 11pt; } :root { --pad-x: 2rem; } }
body { margin: 0; min-width: 320px; background: var(--page-bg); color: var(--ink); font-family: var(--font-text); font-weight: 300; line-height: 1.5; overflow-x: hidden; word-wrap: break-word; }
h1, h2, h3, p, ul { margin: 0; padding: 0; }
ul { list-style: none; }
img, video { display: block; max-width: 100%; height: auto; }
a { color: inherit; }
strong { font-weight: bolder; }

/* Frame: dark page, white panel with rounded corners, like the Carrd #main. */
.site { padding: 0.5rem; max-width: 100vw; }
.panel { background: var(--panel-bg); border-radius: var(--radius); overflow: hidden; }
.section { padding: var(--pad-y) var(--pad-x); }
.section--tight { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.section--flush { padding: 0; }
.section--center { text-align: center; }
.stack > * + * { margin-top: 1.5rem; }
.stack--tight > * + * { margin-top: 0.125rem; }
.columns { display: flex; align-items: center; gap: 2rem; }
.columns > * { flex: 1 1 0; min-width: 0; }
@media (max-width: 736px) { .columns { flex-direction: column; align-items: stretch; } }
.spacer { height: 1.5rem; }

/* Header */
.header { display: flex; align-items: center; justify-content: space-between; padding: var(--pad-y) 2.5rem; }
.header__name { font-family: var(--font-heading); font-weight: 400; font-size: 1.25em; letter-spacing: -0.05rem; text-decoration: none; }
.header__links { display: flex; gap: 1rem; font-size: 2em; }
.header__links a { display: flex; width: 1em; height: 1em; color: #d0d0d0; }
.header__links a:hover { color: var(--blue); }
.header__links svg { width: 100%; height: 100%; fill: currentColor; }
.header__lang { font-family: var(--font-small); font-size: 0.6em; margin-left: 1rem; text-decoration: none; color: var(--grey); align-self: center; }

/* Type styles, named after the Carrd ones */
.t-hero { font-family: var(--font-heading); font-weight: 300; font-size: 1.875em; line-height: 1.375; letter-spacing: -0.05rem; text-align: left; }
.t-title { font-family: var(--font-text); font-weight: 400; font-size: 2.375em; line-height: 1.5; letter-spacing: -0.025rem; }
.t-result { font-family: var(--font-text); font-weight: 300; font-size: 1.25em; line-height: 1.5; letter-spacing: 0.2rem; text-align: right; }
.t-body { font-family: var(--font-text); font-weight: 300; font-size: 1.375em; line-height: 1.75; color: var(--ink-soft); }
.t-caption { font-family: var(--font-text); font-weight: 300; font-size: 0.75em; line-height: 1.5; color: var(--grey); text-align: center; }
.t-small { font-family: var(--font-heading); font-weight: 300; font-size: 1.125em; line-height: 1.5; }
.t-label { font-family: var(--font-text); font-weight: 300; font-size: 0.875em; line-height: 1.5; text-align: center; }
@media (max-width: 1024px) { .t-hero { font-size: 1.5em; } .t-title { font-size: 2em; } }
code.fn { font-family: var(--font-code); font-weight: 400; font-size: 0.95em; color: var(--blue); letter-spacing: 0; }

/* Buttons: pill, thin border, arrow on the right */
.button { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; height: 2.5rem; padding: 0 1rem; border: 1px solid var(--ink); border-radius: 2.5rem; font-family: var(--font-heading); font-weight: 300; font-size: 1em; text-decoration: none; white-space: nowrap; transition: color 0.25s ease, background-color 0.25s ease; }
.button svg { width: 1em; height: 1em; fill: currentColor; }
.button:hover { background: var(--ink); color: #fff; }
.buttons { display: flex; flex-wrap: wrap; gap: 0.75rem; }

/* Images with the Carrd frame */
.frame { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin: 0 auto; max-width: 50rem; }
.frame img, .frame video { width: 100%; }
.avatar { width: 7rem; height: 7rem; border-radius: 50%; object-fit: cover; }

/* Back to top */
.to-top { position: fixed; right: 30px; bottom: 20px; z-index: 99; width: 3rem; height: 3rem; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #fff; color: var(--ink); opacity: 0.3; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); text-decoration: none; }
.to-top:hover { opacity: 1; }

/* Draft note */
.draft-note { background: #f3f3f3; color: var(--grey); font-family: var(--font-small); font-size: 0.75em; padding: 0.5rem 1rem; border-radius: 0.5rem; }
```

- [ ] **Step 5: The layout**

`src/layouts/BaseLayout.astro`:

```astro
---
import "../styles/global.css";
import LinkedIn from "../components/icons/LinkedIn.astro";
import Contra from "../components/icons/Contra.astro";
import Malt from "../components/icons/Malt.astro";
import { languages, type Lang } from "../i18n/ui.ts";
import { t, twinPath, stripLang } from "../i18n/utils.ts";

interface Props {
  lang: Lang;
  title: string;
  description: string;
  noindex?: boolean;
}
const { lang, title, description, noindex = false } = Astro.props;
const tr = t(lang);
const site = "https://lepoher.co";
const path = Astro.url.pathname;
const twin = twinPath(path);
const canonical = site + path;
const enHref = site + stripLang(path);
const frHref = site + (path.startsWith("/fr/") ? path : "/fr" + path);
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <title>{title}</title>
    <meta name="description" content={description} />
    {noindex && <meta name="robots" content="noindex" />}
    <link rel="canonical" href={canonical} />
    <link rel="alternate" hreflang="en" href={enHref} />
    <link rel="alternate" hreflang="fr" href={frHref} />
    <meta property="og:site_name" content="Gautier Le Poher" />
    <meta property="og:title" content={title} />
    <meta property="og:type" content="website" />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={site + "/assets/images/card.jpg"} />
    <meta property="og:url" content={canonical} />
    <meta property="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
    <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      href="https://fonts.googleapis.com/css2?display=swap&family=Overpass:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Fira+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Inter:wght@300;400&family=JetBrains+Mono:wght@400"
      rel="stylesheet"
    />
    <script is:inline async src="https://www.googletagmanager.com/gtag/js?id=G-8RLHFGPZ87"></script>
    <script is:inline>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag("js", new Date());
      gtag("config", "G-8RLHFGPZ87");
    </script>
  </head>
  <body>
    <div class="site">
      <div class="panel" id="top">
        <header class="header">
          <a class="header__name" href={lang === "fr" ? "/fr/" : "/"}>{tr("nav.home")}</a>
          <nav class="header__links" aria-label="Profiles">
            <a href="https://www.linkedin.com/in/gautier-le-poher/" target="_blank" rel="noopener" aria-label="LinkedIn"><LinkedIn /></a>
            <a href="https://contra.com/gautierlp" target="_blank" rel="noopener" aria-label="Contra"><Contra /></a>
            <a href="https://www.malt.fr/profile/gautierlepoher" target="_blank" rel="noopener" aria-label="Malt"><Malt /></a>
            <a class="header__lang" href={twin.href} hreflang={twin.lang} lang={twin.lang}>{languages[twin.lang]}</a>
          </nav>
        </header>
        <slot />
      </div>
    </div>
    <a class="to-top" href="#top" aria-label="Back to top">&#x2B06;&#xFE0E;</a>
  </body>
</html>
```

- [ ] **Step 6: A temporary homepage**

`src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout lang="en" title="Gautier Le Poher" description="I take over your product and ship it myself.">
  <section class="section"><h1 class="t-hero">Layout check.</h1></section>
</BaseLayout>
```

- [ ] **Step 7: Build and compare**

Run: `npm run build && grep -c 'hreflang' dist/index.html && ls dist/old/index.html`
Expected: `2`, and the old page exists.

Then, with the dev server (`npx astro dev --background`, note the port it prints), take two screenshots and compare the header and the panel:

```bash
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --disable-gpu --hide-scrollbars --window-size=1280,900 --screenshot=/tmp/new.png http://localhost:4322/
"$CH" --headless=new --disable-gpu --hide-scrollbars --window-size=1280,900 --screenshot=/tmp/old.png http://localhost:4322/old
```

Read both images. Adjust `.header` padding and icon size in `global.css` until the name and the icons sit at the same place as on `/old`.

- [ ] **Step 8: Commit**

```bash
git add src/styles src/layouts src/components/icons src/components/Media.astro src/pages/index.astro src/pages/old.astro
git commit -m "feat(site): base layout and global styles in the Carrd look"
```

---

### Task 5: Homepage components and the two homepages

**Goal:** `/` and `/fr/` show the full homepage from the collections: hero with `ship()`, 3 featured projects, use-case list with the number column, logo grid, call to action. The `dist/` test file starts here.

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/FeaturedCase.astro`
- Create: `src/components/NumberList.astro`
- Create: `src/components/LogoGrid.astro`
- Create: `src/components/CallToAction.astro`
- Create: `src/components/HomePage.astro`
- Modify: `src/pages/index.astro`
- Create: `src/pages/fr/index.astro`
- Modify: `src/styles/global.css` (component rules appended)
- Test: `tests/site.test.mjs`

**Acceptance Criteria:**
- [ ] `npm test` passes (unit tests, build, site tests).
- [ ] `dist/index.html` contains `<code class="fn">ship()</code>`, the three featured names, 11 grid links to `/projects/<slug>/`, and 4 links to `/use-cases/<slug>/`.
- [ ] `dist/fr/index.html` contains "Réserver un appel" and links to `/fr/projects/...`.
- [ ] No `contra.com/p/` string in `dist/index.html`.
- [ ] A screenshot of `/` matches `/old` section by section (hero, Evaboot block, logo grid, call to action), with the two additions (use-case list, headline verb).

**Verify:** `npm test` → all tests pass.

**Steps:**

- [ ] **Step 1: Write the failing site tests**

`tests/site.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const page = (path) => readFileSync(join(DIST, path, "index.html"), "utf8");
const exists = (path) => existsSync(join(DIST, path, "index.html"));
const links = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

const PROJECTS = ["evaboot", "disko-leads", "folderly", "fleetnova", "camarage", "eco-insight", "eco-link", "clean-car", "price-writers", "betc", "protech"];
const USE_CASES = ["no-code-exit", "interfaces-on-a-new-stack", "marketing-site-migration", "internal-applications"];

test("homepage: headline verb in code font", () => {
  assert.match(page(""), /<code class="fn">ship\(\)<\/code>/);
});

test("homepage: the three featured projects", () => {
  const html = page("");
  for (const name of ["Evaboot", "Disko Leads", "Folderly"]) assert.ok(html.includes(name), name);
});

test("homepage: the grid links to every project page", () => {
  const html = page("");
  for (const slug of PROJECTS) assert.ok(links(html).includes(`/projects/${slug}/`), slug);
});

test("homepage: the use-case list links to every use case", () => {
  const html = page("");
  for (const slug of USE_CASES) assert.ok(links(html).includes(`/use-cases/${slug}/`), slug);
});

test("homepage: no Contra case-study link", () => {
  assert.ok(!page("").includes("contra.com/p/"));
  assert.ok(page("").includes("https://contra.com/gautierlp"));
});

test("french homepage: French strings and /fr/ links", () => {
  const html = page("fr");
  assert.ok(html.includes("Réserver un appel"));
  assert.ok(links(html).includes("/fr/projects/evaboot/"));
  assert.match(html, /<html lang="fr">/);
});

test("both homepages link to each other", () => {
  assert.ok(links(page("")).includes("/fr/"));
  assert.ok(links(page("fr")).includes("/"));
});
```

- [ ] **Step 2: Run the site tests to verify they fail**

Run: `npm run build && npm run test:site`
Expected: FAIL on the first test (the temporary homepage has no `ship()`).

- [ ] **Step 3: NumberList**

`src/components/NumberList.astro`:

```astro
---
interface Item { result: string; resultLabel: string; name: string; summary: string; href: string }
interface Props { items: Item[] }
const { items } = Astro.props;
---
<ul class="numlist">
  {items.map((item) => (
    <li class="numlist__item">
      <div class="numlist__num">
        {item.result && <b>{item.result}</b>}
        {item.resultLabel && <span>{item.resultLabel}</span>}
      </div>
      <div class="numlist__text">
        <a href={item.href}>{item.name}</a>
        <p>{item.summary}</p>
      </div>
    </li>
  ))}
</ul>
```

Append to `global.css`:

```css
/* Number column list (from creativeatishay.in) */
.numlist { display: grid; gap: 1.5rem; text-align: left; }
.numlist__item { display: grid; grid-template-columns: 9rem minmax(0, 1fr); gap: 1.5rem; align-items: start; }
.numlist__num b { display: block; font-family: var(--font-heading); font-weight: 400; font-size: 1.5em; line-height: 1.1; color: var(--blue); letter-spacing: -0.03rem; }
.numlist__num span { display: block; font-family: var(--font-small); font-size: 0.7em; color: var(--grey); margin-top: 0.25rem; }
.numlist__text a { font-family: var(--font-heading); font-weight: 400; font-size: 1.125em; text-decoration: none; }
.numlist__text a:hover { text-decoration: underline; }
.numlist__text p { font-family: var(--font-text); font-weight: 300; font-size: 0.95em; color: var(--ink-soft); margin-top: 0.25rem; }
@media (max-width: 736px) { .numlist__item { grid-template-columns: 1fr; gap: 0.25rem; } }
```

- [ ] **Step 4: Hero**

`src/components/Hero.astro`:

```astro
---
import ArrowRight from "./icons/ArrowRight.astro";
import type { Lang } from "../i18n/ui.ts";
import { t } from "../i18n/utils.ts";
interface Props { lang: Lang }
const tr = t(Astro.props.lang);
---
<section class="section stack">
  <img class="avatar" src="/assets/images/image01.jpg" alt="Gautier Le Poher" width="252" height="252" />
  <div class="stack--tight">
    <h1 class="t-hero">{tr("hero.line1.before")}<code class="fn">{tr("hero.line1.verb")}</code>{tr("hero.line1.after")}</h1>
    <h2 class="t-hero">{tr("hero.line2.before")}<strong>{tr("hero.line2.strong")}</strong>{tr("hero.line2.after")}</h2>
  </div>
  <div class="columns columns--start">
    <ul class="buttons">
      <li><a class="button" href="https://calendly.com/gautierlp/30min" target="_blank" rel="noopener">{tr("hero.book")} <ArrowRight /></a></li>
    </ul>
    <p class="t-small">{tr("hero.email")} <a href="mailto:gautier@lepoher.co">gautier@lepoher.co</a></p>
  </div>
</section>
```

Append to `global.css`: `.columns--start { justify-content: flex-start; } .columns--start > * { flex: 0 0 auto; }`.

- [ ] **Step 5: FeaturedCase**

`src/components/FeaturedCase.astro`:

```astro
---
import ArrowRight from "./icons/ArrowRight.astro";
import Media from "./Media.astro";
import type { Project } from "../lib/content.ts";
import { slugOf } from "../lib/content.ts";
import type { Lang } from "../i18n/ui.ts";
import { t, localePath } from "../i18n/utils.ts";
interface Props { project: Project; lang: Lang }
const { project, lang } = Astro.props;
const d = project.data;
const tr = t(lang);
const href = localePath(lang, `/projects/${slugOf(project)}/`);
---
<article class="section stack featured">
  <div class="columns">
    <h2 class="t-title">{d.name}</h2>
    {d.result && <p class="t-result">{d.result} {d.resultLabel}</p>}
  </div>
  <ul class="buttons">
    <li><a class="button" href={href}>{tr("case.fullStory")} <ArrowRight /></a></li>
    {d.links.map((l) => <li><a class="button" href={l.url} target="_blank" rel="noopener">{l.label} <ArrowRight /></a></li>)}
  </ul>
  {d.highlights.map((h) => (
    <div class="stack">
      <p class="t-body">{h.text}</p>
      {h.image && (
        <figure class="stack--tight">
          <Media src={h.image} alt={h.caption} />
          <figcaption class="t-caption">{h.caption}</figcaption>
        </figure>
      )}
    </div>
  ))}
  {d.quote && (
    <blockquote class="review">
      <p class="t-body">“{d.quote.text}”</p>
      <footer class="t-caption">{d.quote.who}, {d.quote.role}</footer>
    </blockquote>
  )}
</article>
```

Append to `global.css`:

```css
.featured { border-top: 1px solid #efefef; }
.review { margin: 0; padding: 1rem 1.5rem; border: 1px solid var(--border); border-radius: var(--radius); }
.review .t-caption { text-align: left; margin-top: 0.5rem; }
```

- [ ] **Step 6: LogoGrid and CallToAction**

`src/components/LogoGrid.astro`:

```astro
---
import type { Project } from "../lib/content.ts";
import { slugOf } from "../lib/content.ts";
import type { Lang } from "../i18n/ui.ts";
import { localePath } from "../i18n/utils.ts";
interface Props { projects: Project[]; lang: Lang }
const { projects, lang } = Astro.props;
---
<ul class="logogrid">
  {projects.map((p) => (
    <li>
      <a href={localePath(lang, `/projects/${slugOf(p)}/`)} class="logogrid__item">
        {p.data.logo ? <img src={p.data.logo} alt={p.data.name} loading="lazy" /> : <span class="logogrid__text">{p.data.name}</span>}
        <span class="t-label">{p.data.name}</span>
      </a>
    </li>
  ))}
</ul>
```

`src/components/CallToAction.astro`:

```astro
---
import ArrowRight from "./icons/ArrowRight.astro";
import type { Lang } from "../i18n/ui.ts";
import { t } from "../i18n/utils.ts";
interface Props { lang: Lang }
const tr = t(Astro.props.lang);
---
<section class="section stack featured">
  <h2 class="t-title">{tr("section.yourProject")}</h2>
  <p class="t-body">{tr("cta.title")}</p>
  <div class="columns columns--start">
    <ul class="buttons">
      <li><a class="button" href="https://calendly.com/gautierlp/30min" target="_blank" rel="noopener">{tr("cta.button")} <ArrowRight /></a></li>
    </ul>
    <p class="t-small">{tr("cta.email")} <a href="mailto:gautier@lepoher.co">gautier@lepoher.co</a></p>
  </div>
</section>
```

Append to `global.css`:

```css
.logogrid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 2rem 1rem; }
.logogrid__item { display: grid; justify-items: center; gap: 0.5rem; text-decoration: none; }
.logogrid__item img { width: 4.5rem; height: 4.5rem; object-fit: contain; border-radius: 50%; border: 1px solid var(--border); }
.logogrid__text { width: 4.5rem; height: 4.5rem; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid var(--border); font-family: var(--font-heading); font-size: 0.7em; text-align: center; padding: 0.25rem; }
@media (max-width: 736px) { .logogrid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
```

- [ ] **Step 7: HomePage and the two routes**

`src/components/HomePage.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "./Hero.astro";
import FeaturedCase from "./FeaturedCase.astro";
import NumberList from "./NumberList.astro";
import LogoGrid from "./LogoGrid.astro";
import CallToAction from "./CallToAction.astro";
import { getProjects, getUseCases, slugOf } from "../lib/content.ts";
import type { Lang } from "../i18n/ui.ts";
import { t, localePath } from "../i18n/utils.ts";
interface Props { lang: Lang }
const { lang } = Astro.props;
const tr = t(lang);
const projects = await getProjects(lang);
const useCases = await getUseCases(lang);
const featured = projects.filter((p) => p.data.featured);
const useCaseItems = useCases.map((u) => ({
  result: u.data.result, resultLabel: u.data.resultLabel, name: u.data.name, summary: u.data.summary,
  href: localePath(lang, `/use-cases/${slugOf(u)}/`),
}));
---
<BaseLayout lang={lang} title={tr("site.title")} description={tr("site.description")}>
  <Hero lang={lang} />
  {featured.map((p) => <FeaturedCase project={p} lang={lang} />)}
  <section class="section stack featured">
    <h2 class="t-title">{tr("section.useCases")}</h2>
    <NumberList items={useCaseItems} />
  </section>
  <section class="section stack featured section--center">
    <h2 class="t-title">{tr("section.allApps")}</h2>
    <LogoGrid projects={projects} lang={lang} />
  </section>
  <CallToAction lang={lang} />
</BaseLayout>
```

`src/pages/index.astro`:

```astro
---
import HomePage from "../components/HomePage.astro";
---
<HomePage lang="en" />
```

`src/pages/fr/index.astro`:

```astro
---
import HomePage from "../../components/HomePage.astro";
---
<HomePage lang="fr" />
```

- [ ] **Step 8: Run the tests**

Run: `npm test`
Expected: unit tests pass, build passes, site tests: the 7 tests pass. The grid and use-case links point to pages that do not exist yet; the tests only check the links here. Tasks 6 and 7 add the pages.

- [ ] **Step 9: Compare with /old**

Screenshot `/` and `/old` at 1280 px as in Task 4, full height (`--window-size=1280,6000`). Match: avatar size, headline size, button shape, the Evaboot title row (name left, result right with letter spacing), body text size, image frames, the grid. Adjust `global.css` values, not the components.

- [ ] **Step 10: Commit**

```bash
git add src/components src/pages/index.astro src/pages/fr src/styles/global.css tests/site.test.mjs
git commit -m "feat(site): homepage as components, in English and French"
```

---

### Task 6: Project pages

**Goal:** `/projects/<slug>/` and `/fr/projects/<slug>/` for the 11 projects, with the draft note where needed.

**Files:**
- Create: `src/components/DraftNote.astro`
- Create: `src/components/ProjectPage.astro`
- Create: `src/pages/projects/[slug].astro`
- Create: `src/pages/fr/projects/[slug].astro`
- Modify: `tests/site.test.mjs`
- Modify: `src/styles/global.css` (prose rules)

**Acceptance Criteria:**
- [ ] `npm test` passes with the 5 new tests below.
- [ ] 11 pages under `dist/projects/` and 11 under `dist/fr/projects/`.
- [ ] `dist/projects/evaboot/index.html` has the story headings ("Introduction", "Results") and the quote.
- [ ] `dist/projects/betc/index.html` has the draft note "Text to come." and `<meta name="robots" content="noindex">`.
- [ ] `dist/fr/projects/betc/index.html` has `<html lang="en">` (fallback) and the note in English.

**Verify:** `npm test` → passes; `ls dist/projects | wc -l` → 11.

**Steps:**

- [ ] **Step 1: Add the failing tests**

Append to `tests/site.test.mjs`:

```js
test("project pages: 11 in English and 11 in French", () => {
  for (const slug of PROJECTS) {
    assert.ok(exists(`projects/${slug}`), slug);
    assert.ok(exists(`fr/projects/${slug}`), `fr ${slug}`);
  }
});

test("project page: the Contra story and the quote", () => {
  const html = page("projects/evaboot");
  assert.ok(html.includes("Introduction"));
  assert.ok(html.includes("Results"));
  assert.ok(html.includes("JB Jézéquel"));
  assert.ok(!html.includes("contra.com/p/"));
});

test("project page: draft note on a placeholder", () => {
  const html = page("projects/betc");
  assert.ok(html.includes("Text to come."));
  assert.match(html, /<meta name="robots" content="noindex">/);
});

test("project page: French route falls back to English content", () => {
  const html = page("fr/projects/betc");
  assert.match(html, /<html lang="en">/);
  assert.ok(links(html).includes("/projects/betc/"));
});

test("project page: links to its use cases exist", () => {
  const html = page("projects/fleetnova");
  assert.ok(links(html).includes("/use-cases/internal-applications/"));
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npm run build && npm run test:site`
Expected: the 5 new tests FAIL (no `dist/projects/`).

- [ ] **Step 3: DraftNote and ProjectPage**

`src/components/DraftNote.astro`:

```astro
---
import type { Lang } from "../i18n/ui.ts";
import { t } from "../i18n/utils.ts";
interface Props { lang: Lang; empty: boolean }
const { lang, empty } = Astro.props;
const tr = t(lang);
---
<p class="draft-note">{empty ? tr("draft.empty") : tr("draft.pending")}</p>
```

`src/components/ProjectPage.astro`:

```astro
---
import { render } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import ArrowRight from "./icons/ArrowRight.astro";
import Media from "./Media.astro";
import NumberList from "./NumberList.astro";
import DraftNote from "./DraftNote.astro";
import { getUseCases, langOf, slugOf, type Project } from "../lib/content.ts";
import type { Lang } from "../i18n/ui.ts";
import { t, localePath } from "../i18n/utils.ts";

interface Props { project: Project; lang: Lang }
const { project, lang } = Astro.props;
const d = project.data;
const tr = t(lang);
const pageLang = langOf(project); // "en" when the French file is missing
const { Content } = await render(project);
const isDraft = d.status === "draft";
const isEmpty = project.body === undefined || project.body.trim() === "";
const useCases = (await getUseCases(lang)).filter((u) => d.useCases.includes(slugOf(u)));
const items = useCases.map((u) => ({
  result: u.data.result, resultLabel: u.data.resultLabel, name: u.data.name, summary: u.data.summary,
  href: localePath(lang, `/use-cases/${slugOf(u)}/`),
}));
const title = d.result ? `${d.name}, ${d.result} ${d.resultLabel}` : d.name;
---
<BaseLayout lang={pageLang} title={`${title} | Gautier Le Poher`} description={d.summary} noindex={isDraft}>
  <article class="section stack">
    <div class="columns">
      <h1 class="t-title">{d.name}</h1>
      {d.result && <p class="t-result">{d.result} {d.resultLabel}</p>}
    </div>
    <p class="t-small">{tr("project.client")}: {d.client}</p>
    {isDraft && <DraftNote lang={lang} empty={isEmpty} />}
    <ul class="buttons">
      {d.links.map((l) => <li><a class="button" href={l.url} target="_blank" rel="noopener">{l.label} <ArrowRight /></a></li>)}
    </ul>
    {d.images.length > 0 && (
      <div class="stack">
        {d.images.map((img) => (
          <figure class="stack--tight">
            <Media src={img.src} alt={img.alt} />
            <figcaption class="t-caption">{img.alt}</figcaption>
          </figure>
        ))}
      </div>
    )}
    <div class="prose"><Content /></div>
    {d.quote && (
      <blockquote class="review">
        <p class="t-body">“{d.quote.text}”</p>
        <footer class="t-caption">{d.quote.who}, {d.quote.role}</footer>
      </blockquote>
    )}
    {items.length > 0 && (
      <section class="stack">
        <h2 class="t-title">{tr("project.useCases")}</h2>
        <NumberList items={items} />
      </section>
    )}
  </article>
</BaseLayout>
```

Append to `global.css`:

```css
/* Markdown bodies */
.prose { font-family: var(--font-text); font-weight: 300; font-size: 1.125em; line-height: 1.75; color: var(--ink-soft); text-align: left; }
.prose > * + * { margin-top: 1rem; }
.prose h1 { font-family: var(--font-text); font-weight: 400; font-size: 1.75em; line-height: 1.3; color: var(--ink); }
.prose h2 { font-family: var(--font-heading); font-weight: 400; font-size: 1.375em; color: var(--ink); margin-top: 2rem; }
.prose h3 { font-family: var(--font-heading); font-weight: 400; font-size: 1.125em; color: var(--ink); margin-top: 1.5rem; }
.prose ul { list-style: disc; padding-left: 1.5rem; }
.prose li + li { margin-top: 0.5rem; }
.prose img, .prose video { border: 1px solid var(--border); border-radius: var(--radius); margin: 0 auto; max-width: 50rem; width: 100%; }
.prose hr { border: 0; border-top: 1px solid #efefef; }
.prose a { color: var(--blue); }
```

- [ ] **Step 4: The two routes**

`src/pages/projects/[slug].astro`:

```astro
---
import ProjectPage from "../../components/ProjectPage.astro";
import { getProjects, slugOf } from "../../lib/content.ts";

export async function getStaticPaths() {
  const projects = await getProjects("en");
  return projects.map((project) => ({ params: { slug: slugOf(project) }, props: { project } }));
}
const { project } = Astro.props;
---
<ProjectPage project={project} lang="en" />
```

`src/pages/fr/projects/[slug].astro`:

```astro
---
import ProjectPage from "../../../components/ProjectPage.astro";
import { getProjects, slugOf } from "../../../lib/content.ts";

export async function getStaticPaths() {
  const projects = await getProjects("fr");
  return projects.map((project) => ({ params: { slug: slugOf(project) }, props: { project } }));
}
const { project } = Astro.props;
---
<ProjectPage project={project} lang="fr" />
```

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: all pass. If `render` is not exported from `astro:content` in this Astro version, use `const { Content } = await render(project)` from `import { render } from "astro:content"` as written; if the build says otherwise, check `node_modules/astro/dist/content/runtime.js` for the exported name.

- [ ] **Step 6: Look at one page**

Screenshot `http://localhost:4322/projects/evaboot/` and `http://localhost:4322/projects/betc/`. The header, the panel and the type must match the homepage. Fix `global.css` only.

- [ ] **Step 7: Commit**

```bash
git add src/components/DraftNote.astro src/components/ProjectPage.astro src/pages/projects src/pages/fr/projects src/styles/global.css tests/site.test.mjs
git commit -m "feat(site): project pages in English and French"
```

---

### Task 7: Use-case pages

**Goal:** `/use-cases/<slug>/` and `/fr/use-cases/<slug>/` for the 4 use cases, with the draft note and the project list.

**Files:**
- Create: `src/components/UseCasePage.astro`
- Create: `src/pages/use-cases/[slug].astro`
- Create: `src/pages/fr/use-cases/[slug].astro`
- Modify: `tests/site.test.mjs`

**Acceptance Criteria:**
- [ ] `npm test` passes with the 3 new tests.
- [ ] 4 pages under `dist/use-cases/` and 4 under `dist/fr/use-cases/`.
- [ ] `dist/use-cases/internal-applications/index.html` links to the 3 group projects and shows "Draft. Waits for the client's approval."

**Verify:** `npm test` → passes; `ls dist/use-cases | wc -l` → 4.

**Steps:**

- [ ] **Step 1: Add the failing tests**

Append to `tests/site.test.mjs`:

```js
test("use-case pages: 4 in English and 4 in French", () => {
  for (const slug of USE_CASES) {
    assert.ok(exists(`use-cases/${slug}`), slug);
    assert.ok(exists(`fr/use-cases/${slug}`), `fr ${slug}`);
  }
});

test("use-case page: draft note and project links", () => {
  const html = page("use-cases/internal-applications");
  assert.ok(html.includes("Draft. Waits for the client's approval."));
  for (const slug of ["fleetnova", "eco-insight", "eco-link"]) assert.ok(links(html).includes(`/projects/${slug}/`), slug);
});

test("every internal link on every page resolves", () => {
  const pages = ["", "fr", ...PROJECTS.flatMap((s) => [`projects/${s}`, `fr/projects/${s}`]), ...USE_CASES.flatMap((s) => [`use-cases/${s}`, `fr/use-cases/${s}`])];
  for (const p of pages) {
    for (const href of links(page(p))) {
      if (!href.startsWith("/") || href.startsWith("/assets/") || href === "/") continue;
      assert.ok(exists(href.replace(/^\/|\/$/g, "")), `${p} -> ${href}`);
    }
  }
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npm run build && npm run test:site`
Expected: the 3 new tests FAIL.

- [ ] **Step 3: UseCasePage and the routes**

`src/components/UseCasePage.astro`:

```astro
---
import { render } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import NumberList from "./NumberList.astro";
import DraftNote from "./DraftNote.astro";
import { getProjects, langOf, slugOf, type UseCase } from "../lib/content.ts";
import type { Lang } from "../i18n/ui.ts";
import { t, localePath } from "../i18n/utils.ts";

interface Props { useCase: UseCase; lang: Lang }
const { useCase, lang } = Astro.props;
const d = useCase.data;
const tr = t(lang);
const pageLang = langOf(useCase);
const { Content } = await render(useCase);
const isDraft = d.status === "draft";
const isEmpty = useCase.body === undefined || useCase.body.trim() === "";
const projects = (await getProjects(lang)).filter((p) => d.projects.includes(slugOf(p)));
const items = projects.map((p) => ({
  result: p.data.result, resultLabel: p.data.resultLabel, name: p.data.name, summary: p.data.summary,
  href: localePath(lang, `/projects/${slugOf(p)}/`),
}));
---
<BaseLayout lang={pageLang} title={`${d.title} | Gautier Le Poher`} description={d.summary} noindex={isDraft}>
  <article class="section stack">
    <p class="t-small">{d.name}</p>
    <h1 class="t-title">{d.title}</h1>
    {isDraft && <DraftNote lang={lang} empty={isEmpty} />}
    <div class="prose"><Content /></div>
    {items.length > 0 && (
      <section class="stack">
        <h2 class="t-title">{tr("useCase.projects")}</h2>
        <NumberList items={items} />
      </section>
    )}
  </article>
</BaseLayout>
```

`src/pages/use-cases/[slug].astro`:

```astro
---
import UseCasePage from "../../components/UseCasePage.astro";
import { getUseCases, slugOf } from "../../lib/content.ts";

export async function getStaticPaths() {
  const useCases = await getUseCases("en");
  return useCases.map((useCase) => ({ params: { slug: slugOf(useCase) }, props: { useCase } }));
}
const { useCase } = Astro.props;
---
<UseCasePage useCase={useCase} lang="en" />
```

`src/pages/fr/use-cases/[slug].astro`:

```astro
---
import UseCasePage from "../../../components/UseCasePage.astro";
import { getUseCases, slugOf } from "../../../lib/content.ts";

export async function getStaticPaths() {
  const useCases = await getUseCases("fr");
  return useCases.map((useCase) => ({ params: { slug: slugOf(useCase) }, props: { useCase } }));
}
const { useCase } = Astro.props;
---
<UseCasePage useCase={useCase} lang="fr" />
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: all pass, including "every internal link on every page resolves". If that test names a link to `/old/`, it comes from nowhere in the new pages; if it names `/fr/` on the French page, the header's own link is fine because `dist/fr/index.html` exists.

- [ ] **Step 5: Commit**

```bash
git add src/components/UseCasePage.astro src/pages/use-cases src/pages/fr/use-cases tests/site.test.mjs
git commit -m "feat(site): use-case pages in English and French"
```

---

### Task 8: GitHub contribution graph

**Goal:** The homepage shows the last 12 months of contributions of `gautierlp`, fetched at build time with `GITHUB_TOKEN`, and builds without the token.

**Files:**
- Create: `src/lib/github.ts`
- Create: `src/components/GitHubGraph.astro`
- Modify: `src/components/HomePage.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/site.test.mjs`
- Create: `.env.example`

**Acceptance Criteria:**
- [ ] With `GITHUB_TOKEN` set, `dist/index.html` has 53 `<div class="gh-week">` and the caption "contributions in the last year".
- [ ] Without the token, the build passes, logs one warning, and `dist/index.html` has no `gh-week`.
- [ ] No `<script>` is added to the page for the graph.
- [ ] `.env` is in `.gitignore` (check; add it if missing).

**Verify:** `GITHUB_TOKEN=$(gh auth token) npm test` → passes, the graph test reports 53 weeks.

**Steps:**

- [ ] **Step 1: Add the failing test**

Append to `tests/site.test.mjs`:

```js
test("homepage: GitHub graph when a token was present at build", { skip: !process.env.GITHUB_TOKEN }, () => {
  const html = page("");
  assert.equal((html.match(/class="gh-week"/g) ?? []).length, 53);
  assert.match(html, /contributions in the last year/);
  assert.ok(!/<script[^>]*>[^<]*github/i.test(html), "the graph adds no script");
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `GITHUB_TOKEN=$(gh auth token) npm run build && GITHUB_TOKEN=$(gh auth token) npm run test:site`
Expected: the new test FAILS (0 weeks).

- [ ] **Step 3: The fetch helper**

`src/lib/github.ts`:

```ts
export interface Day { date: string; count: number }
export interface Calendar { total: number; weeks: Day[][] }

const QUERY = `{
  user(login: "gautierlp") {
    contributionsCollection {
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
    }
  }
}`;

/** Returns null when no token is set or the request fails; the build must not break on GitHub. */
export async function fetchCalendar(token: string | undefined): Promise<Calendar | null> {
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

/** 0 to 4, like GitHub's five tints. */
export function level(count: number): number {
  if (count >= 20) return 4;
  if (count >= 10) return 3;
  if (count >= 4) return 2;
  if (count >= 1) return 1;
  return 0;
}
```

- [ ] **Step 4: The component**

`src/components/GitHubGraph.astro`:

```astro
---
import { fetchCalendar, level } from "../lib/github.ts";
import type { Lang } from "../i18n/ui.ts";
import { t } from "../i18n/utils.ts";
interface Props { lang: Lang }
const { lang } = Astro.props;
const tr = t(lang);
const cal = await fetchCalendar(import.meta.env.GITHUB_TOKEN);
const total = cal ? cal.total.toLocaleString(lang === "fr" ? "fr-FR" : "en-US") : "";
---
{cal && (
  <section class="section stack--tight gh">
    <h2 class="gh-title"><code class="fn">git log</code> · {tr("github.title")}</h2>
    <div class="gh-grid" role="img" aria-label={tr("github.caption").replace("{n}", total)}>
      {cal.weeks.map((week) => (
        <div class="gh-week">
          {week.map((day) => <i class={`gh-day l${level(day.count)}`} title={`${day.date}: ${day.count}`}></i>)}
        </div>
      ))}
    </div>
    <p class="gh-caption">{tr("github.caption").replace("{n}", total)} · <a href="https://github.com/gautierlp" target="_blank" rel="noopener">github.com/gautierlp</a></p>
  </section>
)}
```

Append to `global.css`:

```css
/* GitHub contribution graph */
.gh { padding-top: 0.5rem; }
.gh-title { font-family: var(--font-heading); font-weight: 300; font-size: 1.1em; letter-spacing: -0.02rem; margin-bottom: 0.8rem; }
.gh-grid { display: grid; grid-auto-flow: column; grid-auto-columns: max-content; gap: 3px; overflow-x: auto; padding-bottom: 4px; }
.gh-week { display: grid; grid-template-rows: repeat(7, 10px); gap: 3px; }
.gh-day { display: block; width: 10px; height: 10px; border-radius: 2px; background: #ebedf0; }
.gh-day.l1 { background: #c9c4ff; } .gh-day.l2 { background: #9a90ff; } .gh-day.l3 { background: #5d4dff; } .gh-day.l4 { background: var(--blue); }
.gh-caption { font-family: var(--font-small); font-size: 0.7em; color: #555; margin-top: 0.8rem; }
.gh-caption a { color: var(--blue); }
```

In `src/components/HomePage.astro`, import `GitHubGraph` and place `<GitHubGraph lang={lang} />` right after `<Hero lang={lang} />`.

`.env.example`:

```
# GitHub token with read access to the user's contribution calendar (classic token, scope read:user).
# Set it in Cloudflare's build variables too. Without it the graph is not rendered.
GITHUB_TOKEN=
```

Check `.gitignore` contains `.env`; add the line if not.

- [ ] **Step 5: Run the tests, with and without the token**

Run: `GITHUB_TOKEN=$(gh auth token) npm test`
Expected: all pass, the graph test included.

Run: `npm run build 2>&1 | grep github`
Expected: the warning "[github] GITHUB_TOKEN is not set" and a passing build.

- [ ] **Step 6: Commit**

```bash
git add src/lib/github.ts src/components/GitHubGraph.astro src/components/HomePage.astro src/styles/global.css tests/site.test.mjs .env.example .gitignore
git commit -m "feat(site): GitHub contribution graph on the homepage"
```

---

### Task 9: Cleanup, docs, final checks

**Goal:** The Carrd files, the demo and the old page are gone; the README and CLAUDE.md describe the new structure; every test passes on a clean build.

**Files:**
- Delete: `src/carrd/`, `src/pages/old.astro`, `src/pages/demo.astro`, `src/data/`
- Modify: `README.md`, `CLAUDE.md`
- Modify: `tests/site.test.mjs`
- Modify: `docs/superpowers/specs/2026-09-28-site-rebuild-design.md` (one line on the form)

**Acceptance Criteria:**
- [ ] `git ls-files src/carrd src/data src/pages/old.astro src/pages/demo.astro` prints nothing.
- [ ] `grep -rn "contra.com/p/" src dist` prints nothing.
- [ ] `grep -rn "—\|–" src tests scripts README.md CLAUDE.md` prints nothing (no em dash, no en dash).
- [ ] `rm -rf dist && GITHUB_TOKEN=$(gh auth token) npm test` passes.
- [ ] `dist/old/` does not exist.

**Verify:** `rm -rf dist && GITHUB_TOKEN=$(gh auth token) npm test && test ! -d dist/old && echo clean` → tests pass, "clean".

**Steps:**

- [ ] **Step 1: Add the last tests**

Append to `tests/site.test.mjs`:

```js
test("no Contra case-study link anywhere in dist", () => {
  const pages = ["", "fr", ...PROJECTS.flatMap((s) => [`projects/${s}`, `fr/projects/${s}`]), ...USE_CASES.flatMap((s) => [`use-cases/${s}`, `fr/use-cases/${s}`])];
  for (const p of pages) assert.ok(!page(p).includes("contra.com/p/"), p);
});

test("the old Carrd page is gone", () => {
  assert.ok(!exists("old"));
  assert.ok(!exists("demo"));
});
```

- [ ] **Step 2: Delete the Carrd files and the temporary pages**

```bash
git rm -r -q src/carrd src/pages/old.astro
rm -rf src/pages/demo.astro src/data
```

`src/pages/demo.astro` and `src/data/` were never committed; `rm` is enough.

- [ ] **Step 3: README and CLAUDE.md**

Replace the README body after the "Commands" table with:

```markdown
| `npm test` | Unit tests, build, then the tests on `dist/` |

## Structure

- `src/content/projects/{en,fr}/<slug>.md`: one project per file. `status: draft` shows a grey note and hides the page from search engines.
- `src/content/use-cases/{en,fr}/<slug>.md`: one use case per file.
- A missing `fr/` file makes the French page show the English text.
- `src/i18n/ui.ts`: every UI string, English and French.
- `scripts/import_contra.py`: the one-off import of the 8 Contra stories (2026-09-28). `scripts/import_use_cases.py`: copies the 4 drafts from the `freelance` repo.

## Deploy

Cloudflare Workers (static assets), connected to this repo on GitHub. Every push to `main` builds and deploys.

- Build command: `npm run build`
- Output directory: `dist`
- Build variable: `GITHUB_TOKEN` (a token with `read:user`), for the contribution graph. Without it the build passes and the graph is absent.

The offer text comes from `positioning.md` in the sibling `freelance` repo. Copy it by hand when it changes.
```

Append to `CLAUDE.md`:

```markdown
## Tests

`npm test` runs the unit tests, builds the site, then checks `dist/`. Set `GITHUB_TOKEN` (for example `GITHUB_TOKEN=$(gh auth token)`) to include the contribution graph test.

## Content

Project and use-case pages are Markdown files under `src/content/`. Do not edit the 8 imported Contra files by hand while `scripts/import_contra.py` is the source; edit the script's table, or delete the script once the texts are rewritten.
```

Add to the spec, under "Decisions already taken": `- The Carrd quote form posted to Carrd's own backend. It is replaced by the "Book call" button and the e-mail link in the call to action.`

- [ ] **Step 4: Clean build and full test**

Run: `rm -rf dist && GITHUB_TOKEN=$(gh auth token) npm test && test ! -d dist/old && echo clean`
Expected: every test passes, "clean".

Run: `grep -rn "—\|–" src tests scripts README.md CLAUDE.md; grep -rn "contra.com/p/" src dist`
Expected: no output.

- [ ] **Step 5: Last visual check**

Screenshot `/`, `/fr/`, `/projects/evaboot/`, `/use-cases/no-code-exit/` at 1280 px and at 390 px (`--window-size=390,2000`). At 390 px: no horizontal scroll, the grid has 2 columns, the number list stacks.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(site): remove the Carrd copy, document the structure and the tests"
```

Do not push. Report the branch state to Gautier.
