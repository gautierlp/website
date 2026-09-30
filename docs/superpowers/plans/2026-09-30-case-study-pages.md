# Case Study Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the project pages and the use-case pages with one article-style case study page (layout "A. Story"), plus two client pages.

**Architecture:** One content collection, `caseStudies`, holds every story (12 former projects with `kind: "app"`, 3 former use cases with `kind: "use-case"`); a small `clients` collection holds the two client pages. A rehype plugin turns `## Label | Sentence` headings into a label above a heading and wraps lone images and videos in a wide grey "stage". The page reveals its blocks with a blur-in on scroll and counts its numbers up, both off under reduced motion.

**Tech Stack:** Astro 7 (static), Markdown content collections with Zod schemas, a hand-written rehype plugin (no new dependency), plain CSS in `src/styles/global.css`, `node:test` for unit and built-site tests.

**Global Constraints:**
- Spec: `docs/superpowers/specs/2026-09-30-case-study-pages-design.md`. Mockup of the chosen layout: `.superpowers/brainstorm/44751-1790783874/content/cs-a-story.html` (local only).
- URLs: `/case-studies/<slug>/`, `/clients/<slug>/`, and the same under `/fr/`. `/projects/` and `/use-cases/` stop existing. No redirects.
- Components carry no `<style>` block: all CSS goes in `src/styles/global.css`, so built HTML has plain `<h1>` tags (tests match `/<h1>(.*?)<\/h1>/`).
- Heading format in Markdown: `## Situation | The product had outgrown Bubble.` renders `<h2 class="cs-h"><span class="cs-label">Situation</span><span class="cs-title">The product had outgrown Bubble.</span></h2>`. A heading with no `|` is left alone.
- A body image or video alone in its paragraph (or a top-level `<video>`) renders as `<figure class="stage">…</figure>`, with the Markdown image title as `<figcaption>`.
- Reveal: hidden only under `html.js`, shown by the class `is-in`; under `prefers-reduced-motion: reduce` nothing is hidden and nothing moves.
- Content: invent no number and no fact. Text drafted by the agent is flagged in the front-matter field `review`, which the page never shows (the spec said an HTML comment; a comment would ship in the HTML, so the field replaces it).
- No em dash anywhere (the site test bans it). Conventional-commit messages, no Co-Authored-By trailer.
- Work in the Superset workspace for this branch, never in the main checkout.

**User decisions (already made):**
- "Actually I think Story (A) is the best": layout A for every case study.
- "1. keep the label": the STAR labels show above each heading.
- "1" (one story, one page): project pages go away; each story is a case study; a client with several stories gets a client page.
- "I think each of these app stories will become use cases anyway": the use case "Internal applications" is removed; its facts move into the three app stories and the automotive group's client page.
- "Looks good let's go": spec approved.

**Interpretations recorded here (not asked):**
- Homepage "Track record" keeps one line per app, each linking to its own case study. Client pages are reached from the hero link ("Evaboot") and from the client card at the foot of each case study.
- Brivane and Ostrake have no number of their own. Their titles use the fact from the removed use case: one of 3 apps built for the same client, all still in use.

---

## File map

| File | Responsibility |
|---|---|
| `src/lib/rehype-case-study.mjs` (new) | Label headings, stage figures. Pure functions, no dependency. |
| `src/lib/stats.ts` (new) | Parse and format a stat value for the count-up. |
| `tests/case-study.test.mjs` (new) | Unit tests for the two files above. |
| `astro.config.mjs` | Register the rehype plugin. |
| `src/content.config.ts` | New `caseStudies` and `clients` collections; later, drop `projects` and `useCases`. |
| `src/content/case-studies/en/*.md` (new, 15) | The stories. |
| `src/content/clients/en/{evaboot,automotive-group}.md` (new) | The two client pages. |
| `src/lib/content.ts` | `getCaseStudies`, `getClients`, types. |
| `src/components/CaseStudyPage.astro` (new) | Layout A. |
| `src/components/ClientPage.astro` (new) | Client page. |
| `src/pages/case-studies/[slug].astro`, `src/pages/fr/case-studies/[slug].astro`, `src/pages/clients/[slug].astro`, `src/pages/fr/clients/[slug].astro` (new) | Routes. |
| `src/layouts/BaseLayout.astro` | Add the `js` class on `<html>`. |
| `src/styles/global.css` | Case study, stage, client card and reveal CSS. |
| `src/components/HomePage.astro`, `WorkCarousel.astro`, `Hero.astro` | Point at the new pages. |
| `src/i18n/ui.ts` | New strings, drop the dead ones. |
| Deleted | `src/pages/{projects,use-cases}`, `src/pages/fr/{projects,use-cases}`, `src/components/{ProjectPage,UseCasePage,FeaturedCase,LogoGrid}.astro`, `src/content/{projects,use-cases}`. |
| `tests/site.test.mjs` | New tests, old paths rewritten. |
| `CLAUDE.md` | The Content section names the new folders. |

---

### Task 0: Rehype plugin for labelled headings and stage figures

**Goal:** A tested rehype plugin that renders `## Label | Sentence` as a label plus a heading and wraps lone images and videos in `<figure class="stage">`, registered in Astro.

**Files:**
- Create: `src/lib/rehype-case-study.mjs`
- Create: `tests/case-study.test.mjs`
- Modify: `astro.config.mjs`
- Modify: `package.json` (the `test:unit` script)

**Acceptance Criteria:**
- [ ] `rewrite` turns an h2 whose first text is `Situation | The product had outgrown Bubble.` into `h2.cs-h > span.cs-label + span.cs-title`.
- [ ] An h2 with no `|` is returned unchanged (same object).
- [ ] A `p` holding only an `img` (whitespace text around it allowed) becomes `figure.stage`, with the image `title` moved into a `figcaption`.
- [ ] A `p` with text and an image stays a `p`.
- [ ] A top-level `video` element, or a raw node starting with `<video`, becomes `figure.stage`.
- [ ] `npm run build` still succeeds with the plugin registered.

**Verify:** `npm run test:unit` → all tests pass, including the 6 new ones; `npm run build` → exit 0.

**Steps:**

- [ ] **Step 1: Write the failing tests**

Create `tests/case-study.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import rehypeCaseStudy, { rewrite } from "../src/lib/rehype-case-study.mjs";

const text = (value) => ({ type: "text", value });
const el = (tagName, properties, children = []) => ({ type: "element", tagName, properties, children });

test("a labelled heading splits into a label and a title", () => {
  const out = rewrite(el("h2", {}, [text("Situation | The product had outgrown Bubble.")]));
  assert.deepEqual(out.properties.className, ["cs-h"]);
  assert.deepEqual(out.children[0].properties.className, ["cs-label"]);
  assert.equal(out.children[0].children[0].value, "Situation");
  assert.deepEqual(out.children[1].properties.className, ["cs-title"]);
  assert.equal(out.children[1].children[0].value, "The product had outgrown Bubble.");
});

test("a heading with no bar stays as it is", () => {
  const node = el("h2", {}, [text("Why Bubble, for this client")]);
  assert.equal(rewrite(node), node);
});

test("a paragraph that holds only an image becomes a stage, its title the caption", () => {
  const img = el("img", { src: "/a.webp", alt: "A", title: "The map" });
  const out = rewrite(el("p", {}, [text("\n"), img, text("\n")]));
  assert.equal(out.tagName, "figure");
  assert.deepEqual(out.properties.className, ["stage"]);
  assert.equal(out.children[0].tagName, "img");
  assert.equal(out.children[0].properties.title, undefined);
  assert.equal(out.children[1].tagName, "figcaption");
  assert.equal(out.children[1].children[0].value, "The map");
});

test("a paragraph with text and an image stays a paragraph", () => {
  const node = el("p", {}, [text("See "), el("img", { src: "/a.webp", alt: "A" })]);
  assert.equal(rewrite(node), node);
});

test("a video at the top level, parsed or raw, goes in a stage", () => {
  const video = el("video", { src: "/v.mp4" });
  assert.equal(rewrite(video).tagName, "figure");
  const raw = { type: "raw", value: '<video controls src="/v.mp4"></video>' };
  const out = rewrite(raw);
  assert.equal(out.tagName, "figure");
  assert.equal(out.children[0], raw);
});

test("the plugin rewrites the top-level children of the tree", () => {
  const tree = { type: "root", children: [el("h2", {}, [text("Task | Map it.")]), el("p", {}, [text("Body.")])] };
  rehypeCaseStudy()(tree);
  assert.deepEqual(tree.children[0].properties.className, ["cs-h"]);
  assert.equal(tree.children[1].tagName, "p");
});
```

In `package.json`, change the `test:unit` script to:

```json
"test:unit": "node --experimental-strip-types --test tests/i18n.test.mjs tests/github.test.mjs tests/case-study.test.mjs",
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npm run test:unit`
Expected: FAIL, `Cannot find module '.../src/lib/rehype-case-study.mjs'`.

- [ ] **Step 3: Write the plugin**

Create `src/lib/rehype-case-study.mjs`:

```js
// Two rewrites for story pages, on the top level of the Markdown body:
// 1. "## Situation | The product had outgrown Bubble." becomes a small label above the heading.
// 2. An image or video alone in its block goes in a grey "stage", wider than the text.
// A heading with no "|" and a paragraph with text in it are left alone.

const LABELLED = /^\s*([^|]+?)\s*\|\s*(.+)$/s;

const el = (tagName, className, children) => ({
  type: "element",
  tagName,
  properties: className ? { className: [className] } : {},
  children,
});
const isMedia = (n) => n?.type === "element" && (n.tagName === "img" || n.tagName === "video");
const isRawVideo = (n) => n?.type === "raw" && /^\s*<video[\s>]/.test(n.value);
const isBlank = (n) => n.type === "text" && n.value.trim() === "";

function stage(media) {
  const caption = media.type === "element" ? media.properties?.title : undefined;
  if (caption) delete media.properties.title;
  const children = caption ? [media, el("figcaption", null, [{ type: "text", value: String(caption) }])] : [media];
  return el("figure", "stage", children);
}

function labelHeading(node) {
  const [first, ...rest] = node.children;
  const match = first?.type === "text" ? first.value.match(LABELLED) : null;
  if (!match) return node;
  return {
    ...node,
    properties: { ...node.properties, className: ["cs-h"] },
    children: [
      el("span", "cs-label", [{ type: "text", value: match[1] }]),
      el("span", "cs-title", [{ type: "text", value: match[2] }, ...rest]),
    ],
  };
}

export function rewrite(node) {
  if (node.type === "element" && node.tagName === "h2") return labelHeading(node);
  if (node.type === "element" && node.tagName === "p") {
    const kids = node.children.filter((c) => !isBlank(c));
    if (kids.length === 1 && isMedia(kids[0])) return stage(kids[0]);
    return node;
  }
  if (isMedia(node) || isRawVideo(node)) return stage(node);
  return node;
}

export default function rehypeCaseStudy() {
  return (tree) => {
    tree.children = tree.children.map(rewrite);
  };
}
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `npm run test:unit`
Expected: PASS, 6 new tests plus the existing i18n and GitHub tests.

- [ ] **Step 5: Register the plugin**

Replace `astro.config.mjs` with:

```js
// @ts-check
import { defineConfig } from "astro/config";
import rehypeCaseStudy from "./src/lib/rehype-case-study.mjs";

export default defineConfig({
  site: "https://lepoher.co",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: { prefixDefaultLocale: false },
  },
  markdown: { rehypePlugins: [rehypeCaseStudy] },
});
```

Run: `npm test`
Expected: PASS (the old project pages now wrap their body images in `figure.stage`; no existing test checks those images).

- [ ] **Step 6: Commit**

```bash
git add src/lib/rehype-case-study.mjs tests/case-study.test.mjs astro.config.mjs package.json
git commit -m "feat(case-studies): rehype plugin for labelled headings and stage figures"
```

---

### Task 1: Stat parser for the count-up

**Goal:** A tested `parseStat` / `formatStat` pair that the page script uses to count a number up without changing how it reads at the end.

**Files:**
- Create: `src/lib/stats.ts`
- Modify: `tests/case-study.test.mjs`

**Acceptance Criteria:**
- [ ] `parseStat("200k")` → `{ prefix: "", n: 200, suffix: "k", commas: false }`.
- [ ] `parseStat("1,000")` → `{ prefix: "", n: 1000, suffix: "", commas: true }`.
- [ ] `parseStat("+1")` → prefix `"+"`; `parseStat("600+")` → suffix `"+"`.
- [ ] `parseStat("From 0 to $3k")` → `null` (two numbers: nothing to count).
- [ ] `formatStat(parseStat("1,000"), 1000)` → `"1,000"`; `formatStat(parseStat("200k"), 37)` → `"37k"`.

**Verify:** `npm run test:unit` → all pass.

**Steps:**

- [ ] **Step 1: Write the failing tests**

Append to `tests/case-study.test.mjs`:

```js
import { formatStat, parseStat } from "../src/lib/stats.ts";

test("parseStat splits a value around the one whole number in it", () => {
  assert.deepEqual(parseStat("200k"), { prefix: "", n: 200, suffix: "k", commas: false });
  assert.deepEqual(parseStat("1,000"), { prefix: "", n: 1000, suffix: "", commas: true });
  assert.equal(parseStat("+1").prefix, "+");
  assert.equal(parseStat("600+").suffix, "+");
  assert.equal(parseStat("13 working days").n, 13);
});

test("parseStat gives up on a value with no single number to count", () => {
  assert.equal(parseStat("From 0 to $3k"), null);
  assert.equal(parseStat("2.5x"), null);
  assert.equal(parseStat("no number"), null);
});

test("formatStat writes a step of the count the way the final value is written", () => {
  assert.equal(formatStat(parseStat("1,000"), 1000), "1,000");
  assert.equal(formatStat(parseStat("1,000"), 250), "250");
  assert.equal(formatStat(parseStat("200k"), 37), "37k");
});
```

Move the new `import` line to the top of the file, under the existing imports.

- [ ] **Step 2: Run to see it fail**

Run: `npm run test:unit`
Expected: FAIL, cannot find `src/lib/stats.ts`.

- [ ] **Step 3: Write the parser**

Create `src/lib/stats.ts`:

```ts
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
```

- [ ] **Step 4: Run to see it pass**

Run: `npm run test:unit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/stats.ts tests/case-study.test.mjs
git commit -m "feat(case-studies): parse stat values for the count-up"
```

---

### Task 2: Case study and client collections, content moved in

**Goal:** The `caseStudies` and `clients` collections exist next to the old ones, filled with the 15 stories and the 2 client pages, with helpers in `content.ts`; the site still builds and all old tests pass.

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/content/case-studies/en/*.md` (15 files, by the one-off script below; the script is not committed)
- Create: `src/content/clients/en/evaboot.md`, `src/content/clients/en/automotive-group.md`
- Modify: `src/lib/content.ts`

**Acceptance Criteria:**
- [ ] `src/content/case-studies/en/` holds exactly: battery-recycling, betc, camarage, clean-car, dealership-onboarding, disko-leads, domeet, evaboot, folderly, parts-marketplace, price-writers, protech, no-code-exit, interfaces-on-a-new-stack, marketing-site-migration (15 files).
- [ ] Each body is the old body unchanged, except that the old `images[1:]` are added as Markdown images before `## Results`.
- [ ] `clientPage` is `evaboot` on evaboot and the 3 use cases, `automotive-group` on parts-marketplace, dealership-onboarding, battery-recycling, absent elsewhere.
- [ ] `npm test` passes (old pages untouched).

**Verify:** `ls src/content/case-studies/en | wc -l` → `15`; `npm test` → pass.

**Steps:**

- [ ] **Step 1: Add the collections**

In `src/content.config.ts`, after the `useCases` collection, add:

```ts
const stat = z.object({ value: z.string(), label: z.string() });
const quote = z.object({ text: z.string(), who: z.string(), role: z.string(), photo: z.string().optional() });

// Every story, in layout A. "app" stories are the track record; "use-case" stories are the selected work.
const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    kind: z.enum(["app", "use-case"]),
    name: z.string(),
    title: z.string(),
    summary: z.string(),
    intro: z.string(),
    client: z.string(),
    clientPage: z.string().optional(),
    when: z.string().default(""),
    logo: z.string().default(""),
    result: z.string().default(""),
    resultLabel: z.string().default(""),
    stats: z.array(stat).max(4).default([]),
    cover: image.optional(),
    links: z.array(link).default([]),
    featured: z.boolean().default(false),
    // The client's product has no public name: show a placeholder, blurred, with an "NDA signed" label.
    nda: z.boolean().default(false),
    order: z.number(),
    status,
    quote: quote.optional(),
    // Text the agent drafted and Gautier has not checked yet. Never shown on the page.
    review: z.string().optional(),
  }),
});

// A client with several stories gets one page that lists them.
const clients = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/clients" }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    logo: z.string().default(""),
    links: z.array(link).default([]),
    quote: quote.optional(),
    order: z.number(),
  }),
});
```

Change the export line to:

```ts
export const collections = { projects, useCases, caseStudies, clients, testimonials };
```

- [ ] **Step 2: Move the content with a one-off script**

Save this as `migrate_case_studies.py` in the session scratchpad (not in the repo) and run it from the repo root with `python3 <scratchpad>/migrate_case_studies.py`:

```python
"""One-off: copy projects and 3 use cases into src/content/case-studies/en/. Not committed."""
import json
from pathlib import Path

import yaml

SRC = Path("src/content")
OUT = SRC / "case-studies/en"
OUT.mkdir(parents=True, exist_ok=True)
CLIENT_PAGE = {
    "evaboot": "evaboot",
    "parts-marketplace": "automotive-group",
    "dealership-onboarding": "automotive-group",
    "battery-recycling": "automotive-group",
}
USE_CASE_COVERS = {
    "no-code-exit": {"src": "/assets/projects/evaboot/wcnvcxceeguy7ibzeaos.webp", "alt": "The product's exports screen"},
    "interfaces-on-a-new-stack": {"src": "/assets/projects/evaboot/yeozsoqcr93m15jqq47s.webp", "alt": "The product's admin logs screen"},
}


def split(path):
    _, fm, body = path.read_text().split("---\n", 2)
    return yaml.safe_load(fm), body


def write(slug, data, body):
    keep = {k: v for k, v in data.items() if v is not None and v != "" and v != []}
    head = "\n".join(f"{k}: {json.dumps(v, ensure_ascii=False)}" for k, v in keep.items())
    (OUT / f"{slug}.md").write_text(f"---\n{head}\n---\n\n{body.lstrip(chr(10))}")


for path in sorted((SRC / "projects/en").glob("*.md")):
    slug = path.stem
    d, body = split(path)
    images = d.get("images", [])
    title = f"{d.get('result', '')} {d.get('resultLabel', '')}".strip()
    title = title[:1].upper() + title[1:] if title else d["name"]
    extra = "".join(f"![{i['alt']}]({i['src']})\n\n" for i in images[1:])
    if extra:
        body = body.replace("\n## Results", f"\n{extra}## Results", 1) if "\n## Results" in body else body + "\n" + extra
    write(slug, {
        "kind": "app", "name": d["name"], "title": title, "summary": d["summary"], "intro": d["summary"],
        "client": d["client"], "clientPage": CLIENT_PAGE.get(slug), "logo": d.get("logo", ""),
        "result": d.get("result", ""), "resultLabel": d.get("resultLabel", ""),
        "stats": [{"value": d["result"], "label": d["resultLabel"]}] if d.get("result") else [],
        "cover": images[0] if images else None, "links": d.get("links", []),
        "featured": d.get("featured", False), "nda": d.get("nda", False),
        "order": d["order"], "status": d["status"], "quote": d.get("quote"),
    }, body)

for slug in ["no-code-exit", "interfaces-on-a-new-stack", "marketing-site-migration"]:
    d, body = split(SRC / f"use-cases/en/{slug}.md")
    write(slug, {
        "kind": "use-case", "name": d["name"], "title": d["title"], "summary": d["summary"], "intro": d["summary"],
        "client": "B2B SaaS, lead extraction", "clientPage": "evaboot",
        "result": d["result"], "resultLabel": d["resultLabel"],
        "stats": [{"value": d["result"], "label": d["resultLabel"]}],
        "cover": USE_CASE_COVERS.get(slug), "order": d["order"], "status": d["status"],
    }, body)

print(sorted(p.name for p in OUT.glob("*.md")))
```

Expected output: the 15 file names from the acceptance criteria.

Then check two files by eye: `src/content/case-studies/en/evaboot.md` has `cover: {"src": "/assets/videos/video01.mp4", ...}`, `clientPage: "evaboot"`, and the two other images just above `## Results`; `src/content/case-studies/en/betc.md` has `title: "BETC"` and `status: "draft"`.

- [ ] **Step 3: Write the two client pages**

Create `src/content/clients/en/evaboot.md`:

```md
---
name: "Evaboot"
summary: "A B2B SaaS for lead extraction. I ran its Bubble app from June 2023 to February 2026, then helped move it off Bubble."
logo: "/assets/images/image30.png"
links: [{"label": "Website", "url": "https://evaboot.com/"}]
order: 1
---

Evaboot is a B2B SaaS for lead extraction, built on Bubble. I took the app over from its founder in June 2023. From 2026 the work moved to the exit from Bubble, then to the MCP server and the CLI on the new stack, and to the move of the marketing site off WordPress.
```

Create `src/content/clients/en/automotive-group.md`:

```md
---
name: "A subsidiary of a large French automotive group"
summary: "Three internal applications for the same client, one a year, all still in use."
order: 2
---

An automotive recycling company, a subsidiary of a large French automotive group, with a network of partner dealerships. Three of its processes ran on Excel, e-mail and PDFs. The IT department of a group that size does not staff tools for a subsidiary's operations team, so each time the operations side bought the tool directly.

I built one application a year, in 2023, 2024 and 2025, through the agency that introduced the client. The client bought the second and the third on the strength of the first. All three were still in use in September 2026.
```

Every fact above comes from `src/content/use-cases/en/internal-applications.md` and `src/content/projects/en/evaboot.md`. Do not add any.

- [ ] **Step 4: Add the helpers**

In `src/lib/content.ts`, add the types and helpers, and widen `Entry`:

```ts
export type CaseStudy = CollectionEntry<"caseStudies">;
export type Client = CollectionEntry<"clients">;
type Entry = Project | UseCase | CaseStudy | Client;
```

(replace the existing `type Entry = Project | UseCase;` line), and add after `getUseCases`:

```ts
export async function getCaseStudies(lang: Lang): Promise<CaseStudy[]> {
  return pick(await getCollection("caseStudies"), lang);
}

export async function getClients(lang: Lang): Promise<Client[]> {
  return pick(await getCollection("clients"), lang);
}
```

- [ ] **Step 5: Build and test**

Run: `ls src/content/case-studies/en | wc -l` → `15`
Run: `npm test`
Expected: PASS (nothing renders the new collections yet; Astro validates their schemas at build time, so a schema error fails the build here).

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/content/case-studies src/content/clients src/lib/content.ts
git commit -m "feat(case-studies): one collection for every story, and client pages"
```

---

### Task 3: Case study and client pages

**Goal:** `/case-studies/<slug>/` renders layout A and `/clients/<slug>/` lists a client's stories, in both languages, with the blur-in reveal and the count-up; tested on the built site.

**Files:**
- Create: `src/components/CaseStudyPage.astro`, `src/components/ClientPage.astro`
- Create: `src/pages/case-studies/[slug].astro`, `src/pages/fr/case-studies/[slug].astro`, `src/pages/clients/[slug].astro`, `src/pages/fr/clients/[slug].astro`
- Modify: `src/layouts/BaseLayout.astro`, `src/styles/global.css`, `src/i18n/ui.ts`
- Modify: `tests/site.test.mjs`

**Acceptance Criteria:**
- [ ] 15 case study pages and 2 client pages build, each in English and French.
- [ ] `case-studies/evaboot`: `<h1>` holds the title, `cs__stats` holds `500`, the cover and the body screens sit in `figure.stage`, the video sits in a stage, the quote shows "JB Jézéquel", and a link goes to `/clients/evaboot/`.
- [ ] Each client page links to each of its case studies; each of those links back.
- [ ] Built CSS: the reveal hides blocks only under `.js`, and a `prefers-reduced-motion: reduce` rule sets `transition:none` on them.
- [ ] `fr/case-studies/betc` falls back to English with `noindex` and a canonical to `/case-studies/betc/`.

**Verify:** `npm test` → pass, including the 6 new site tests.

**Steps:**

- [ ] **Step 1: Write the failing site tests**

In `tests/site.test.mjs`, under the existing constants, add:

```js
const APPS = ["evaboot", "disko-leads", "folderly", "parts-marketplace", "camarage", "dealership-onboarding", "battery-recycling", "clean-car", "price-writers", "betc", "protech", "domeet"];
const STORIES = ["no-code-exit", "interfaces-on-a-new-stack", "marketing-site-migration"];
const CASE_STUDIES = [...APPS, ...STORIES];
const EMPTY = ["price-writers", "betc", "protech"];
const CLIENTS = { evaboot: ["evaboot", ...STORIES], "automotive-group": ["parts-marketplace", "dealership-onboarding", "battery-recycling"] };
const cssText = () => readdirSync(join(DIST, "_astro")).filter((f) => f.endsWith(".css")).map((f) => readFileSync(join(DIST, "_astro", f), "utf8")).join("\n");
```

Append these tests:

```js
test("case study pages: 15 in English and 15 in French", () => {
  for (const slug of CASE_STUDIES) {
    assert.ok(exists(`case-studies/${slug}`), slug);
    assert.ok(exists(`fr/case-studies/${slug}`), `fr ${slug}`);
  }
});

test("client pages: each lists its case studies, and each case study links back", () => {
  for (const [client, slugs] of Object.entries(CLIENTS)) {
    assert.ok(exists(`clients/${client}`) && exists(`fr/clients/${client}`), client);
    const html = page(`clients/${client}`);
    for (const slug of slugs) {
      assert.ok(links(html).includes(`/case-studies/${slug}/`), `${client} -> ${slug}`);
      assert.ok(links(page(`case-studies/${slug}`)).includes(`/clients/${client}/`), `${slug} -> ${client}`);
    }
  }
});

test("case study: title, numbers, cover, quote and client card", () => {
  const html = page("case-studies/evaboot");
  assert.match(html.match(/<h1>(.*?)<\/h1>/)[1], /500 features and fixes/);
  assert.match(html, /<ul class="cs__stats"[^>]*>[\s\S]*?<b data-stat>500<\/b>/);
  assert.ok(html.includes("JB Jézéquel"));
  assert.ok(links(html).includes("/clients/evaboot/"));
});

test("case study: screens and the video sit in a grey stage", () => {
  const html = page("case-studies/evaboot");
  assert.ok((html.match(/<figure class="stage"/g) ?? []).length >= 3, "cover and body screens");
  assert.match(html, /<figure class="stage"><video/);
});

test("case study reveal: hidden only when scripts run, never under reduced motion", () => {
  const css = cssText();
  assert.match(css, /\.js \.cs \[data-r\],\.js \.cs__body>\*\{[^}]*opacity:0/);
  assert.match(css, /\.js \.cs \.is-in\{[^}]*opacity:1/);
  assert.match(css, /prefers-reduced-motion:\s*reduce\)\{(?:[^{}]*\{[^}]*\})*?[^{}]*\.cs__body>\*\{[^}]*transition:none/);
  assert.match(page("case-studies/evaboot"), /<html[^>]*>[\s\S]*?classList\.add\("js"\)/);
});

test("case study: a French route falls back to English", () => {
  const html = page("fr/case-studies/betc");
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/lepoher\.co\/case-studies\/betc\/"/);
});
```

- [ ] **Step 2: Run to see them fail**

Run: `npm test`
Expected: the 6 new tests FAIL (`case-studies/evaboot` does not exist); the old tests pass.

- [ ] **Step 3: Add the UI strings**

In `src/i18n/ui.ts`, in the English block after `"useCase.projects": "Projects",` add:

```ts
  "caseStudy.more": "More from this client",
  "client.caseStudies": "Case studies",
```

In the French block after `"useCase.projects": "Projets",` add:

```ts
  "caseStudy.more": "Plus pour ce client",
  "client.caseStudies": "Études de cas",
```

- [ ] **Step 4: Mark pages that run scripts**

In `src/layouts/BaseLayout.astro`, as the first child of `<head>`, add:

```astro
    <script is:inline>document.documentElement.classList.add("js");</script>
```

- [ ] **Step 5: Write the case study page**

Create `src/components/CaseStudyPage.astro`:

```astro
---
// Layout "A. Story": label, title with the number, intro, numbers, cover, STAR body, quote, client card.
import { render } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import Media from "./Media.astro";
import Quote from "./Quote.astro";
import DraftNote from "./DraftNote.astro";
import { getClients, langOf, slugOf, type CaseStudy } from "../lib/content.ts";
import type { Lang } from "../i18n/ui.ts";
import { t, localePath, stripLang } from "../i18n/utils.ts";

interface Props { study: CaseStudy; lang: Lang }
const { study, lang } = Astro.props;
const d = study.data;
const tr = t(lang);
const pageLang = langOf(study); // "en" when the French file is missing
const { Content } = await render(study);
const isDraft = d.status === "draft";
const isEmpty = study.body === undefined || study.body.trim() === "";
const client = d.clientPage ? (await getClients(lang)).find((c) => slugOf(c) === d.clientPage) : undefined;
const isFallback = pageLang !== lang;
const canonical = isFallback ? "https://lepoher.co" + stripLang(Astro.url.pathname) : undefined;
const label = [d.client !== d.name ? d.client : "", d.when].filter(Boolean).join(" · ");
---
<BaseLayout lang={pageLang} routeLang={lang} title={`${d.title} | Gautier Le Poher`} description={d.summary} noindex={isDraft || isFallback} canonical={canonical}>
  <article class="cs">
    <header class="cs__head" data-r>
      <p class="cs__label">{d.nda ? <><span class="nda">{d.name}</span> <span class="nda-label">{tr("project.nda")}</span></> : d.name}{label && ` · ${label}`}</p>
      <h1>{d.title}</h1>
      <p class="cs__intro">{d.intro}</p>
    </header>
    {isDraft && <DraftNote lang={lang} empty={isEmpty} />}
    {d.stats.length > 0 && (
      <ul class="cs__stats" data-r>
        {d.stats.map((s) => <li><b data-stat>{s.value}</b><span>{s.label}</span></li>)}
      </ul>
    )}
    {d.links.length > 0 && (
      <p class="links" data-r>{d.links.map((l) => <a href={l.url} target="_blank" rel="noopener">{l.label}</a>)}</p>
    )}
    {d.cover && (
      <figure class="stage" data-r>
        <Media src={d.cover.src} alt={d.cover.alt} />
        <figcaption>{d.cover.alt}</figcaption>
      </figure>
    )}
    <div class="prose cs__body"><Content /></div>
    {d.quote && <div class="cs__quote" data-r><Quote quote={d.quote} /></div>}
    {client && (
      <a class="cs__client" href={localePath(lang, `/clients/${slugOf(client)}/`)} data-r>
        {client.data.logo && <img src={client.data.logo} alt="" width="40" height="40" />}
        <span><strong>{client.data.name}</strong><small>{tr("caseStudy.more")}</small></span>
      </a>
    )}
  </article>
</BaseLayout>
<script>
  import { formatStat, parseStat } from "../lib/stats.ts";

  // Blocks blur in as they enter the view; numbers count up once. Reduced motion: all shown, nothing moves.
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const show = (el: Element) => el.classList.add("is-in");
  const blocks = document.querySelectorAll(".cs [data-r], .cs__body > *");

  function count(el: HTMLElement) {
    const stat = parseStat(el.textContent ?? "");
    if (!stat) return;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 1400);
      el.textContent = formatStat(stat, Math.round(stat.n * (1 - (1 - k) ** 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if (still || !("IntersectionObserver" in window)) blocks.forEach(show);
  else {
    // Threshold 0: a block taller than the screen still triggers on its first visible line.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        show(e.target);
        e.target.querySelectorAll<HTMLElement>("[data-stat]").forEach(count);
        io.unobserve(e.target);
      }
    }, { rootMargin: "0px 0px -10% 0px" });
    blocks.forEach((el) => io.observe(el));
  }
</script>
```

- [ ] **Step 6: Write the client page**

Create `src/components/ClientPage.astro`:

```astro
---
// A client with several stories: who they are, then the list of case studies.
import { render } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import PlainList from "./PlainList.astro";
import Quote from "./Quote.astro";
import { getCaseStudies, langOf, slugOf, type Client } from "../lib/content.ts";
import type { Lang } from "../i18n/ui.ts";
import { t, localePath, stripLang } from "../i18n/utils.ts";

interface Props { client: Client; lang: Lang }
const { client, lang } = Astro.props;
const d = client.data;
const tr = t(lang);
const pageLang = langOf(client);
const { Content } = await render(client);
const studies = (await getCaseStudies(lang)).filter((s) => s.data.clientPage === slugOf(client));
const items = studies.map((s) => ({
  name: s.data.name,
  nda: s.data.nda,
  note: [s.data.result, s.data.resultLabel].filter(Boolean).join(" "),
  summary: s.data.summary,
  href: localePath(lang, `/case-studies/${slugOf(s)}/`),
}));
const isFallback = pageLang !== lang;
const canonical = isFallback ? "https://lepoher.co" + stripLang(Astro.url.pathname) : undefined;
---
<BaseLayout lang={pageLang} routeLang={lang} title={`${d.name} | Gautier Le Poher`} description={d.summary} noindex={isFallback} canonical={canonical}>
  <article class="page">
    <header class="page__head">
      {d.logo && <img class="client__logo" src={d.logo} alt="" width="48" height="48" />}
      <h1>{d.name}</h1>
      <p class="muted">{d.summary}</p>
    </header>
    {d.links.length > 0 && (
      <p class="links">{d.links.map((l) => <a href={l.url} target="_blank" rel="noopener">{l.label}</a>)}</p>
    )}
    <div class="prose"><Content /></div>
    {d.quote && <Quote quote={d.quote} />}
    <section class="block">
      <h2>{tr("client.caseStudies")}</h2>
      <PlainList items={items} lang={lang} />
    </section>
  </article>
</BaseLayout>
```

- [ ] **Step 7: Add the four routes**

`src/pages/case-studies/[slug].astro`:

```astro
---
import CaseStudyPage from "../../components/CaseStudyPage.astro";
import { getCaseStudies, slugOf } from "../../lib/content.ts";

export async function getStaticPaths() {
  const studies = await getCaseStudies("en");
  return studies.map((study) => ({ params: { slug: slugOf(study) }, props: { study } }));
}
const { study } = Astro.props;
---
<CaseStudyPage study={study} lang="en" />
```

`src/pages/fr/case-studies/[slug].astro`:

```astro
---
import CaseStudyPage from "../../../components/CaseStudyPage.astro";
import { getCaseStudies, slugOf } from "../../../lib/content.ts";

export async function getStaticPaths() {
  const studies = await getCaseStudies("fr");
  return studies.map((study) => ({ params: { slug: slugOf(study) }, props: { study } }));
}
const { study } = Astro.props;
---
<CaseStudyPage study={study} lang="fr" />
```

`src/pages/clients/[slug].astro`:

```astro
---
import ClientPage from "../../components/ClientPage.astro";
import { getClients, slugOf } from "../../lib/content.ts";

export async function getStaticPaths() {
  const clients = await getClients("en");
  return clients.map((client) => ({ params: { slug: slugOf(client) }, props: { client } }));
}
const { client } = Astro.props;
---
<ClientPage client={client} lang="en" />
```

`src/pages/fr/clients/[slug].astro`:

```astro
---
import ClientPage from "../../../components/ClientPage.astro";
import { getClients, slugOf } from "../../../lib/content.ts";

export async function getStaticPaths() {
  const clients = await getClients("fr");
  return clients.map((client) => ({ params: { slug: slugOf(client) }, props: { client } }));
}
const { client } = Astro.props;
---
<ClientPage client={client} lang="fr" />
```

- [ ] **Step 8: Add the CSS**

Append to `src/styles/global.css`:

```css
/* Case study pages, layout "A. Story": text in the column, screens in a wider grey stage. */
.cs > * + * { margin-top: 1.75rem; }
.cs__label { color: var(--muted); font-size: 0.875rem; }
.cs__head h1 { margin-top: 0.5rem; font-size: clamp(1.6rem, 5vw, 2.1rem); line-height: 1.15; letter-spacing: -0.03em; font-weight: 600; text-wrap: balance; }
.cs__intro { margin-top: 1rem; font-size: 1.125rem; }
.cs__stats { display: flex; flex-wrap: wrap; gap: 1rem 2.5rem; padding-top: 1rem; border-top: 1px solid var(--rule); list-style: none; }
.cs__stats b { display: block; font-size: 1.75rem; font-weight: 600; letter-spacing: -0.03em; line-height: 1.1; font-variant-numeric: tabular-nums; }
.cs__stats span { color: var(--muted); font-size: 0.875rem; }
.stage { width: min(calc(100vw - 2rem), 60rem); margin-left: calc(50% - min(50vw - 1rem, 30rem)); padding: clamp(1rem, 4vw, 3rem); background: #f4f4f4; border: 1px solid #ececec; border-radius: 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
.stage img, .stage video, .stage .media { width: auto; max-width: 100%; max-height: 36rem; border-radius: 0.5rem; }
.stage figcaption { color: var(--muted); font-size: 0.875rem; text-align: center; }
.cs__body > * + * { margin-top: 1rem; }
.cs__body > .stage { margin-top: 2.5rem; margin-bottom: 1.5rem; }
.cs__body > .cs-h { margin-top: 3.5rem; }
.cs-label { display: block; margin-bottom: 0.35rem; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.cs-title { display: block; font-size: 1.25rem; line-height: 1.3; letter-spacing: -0.02em; }
.cs__quote { margin-top: 3.5rem; }
.cs__quote .quote { padding-left: 0; border-left: 0; }
.cs__quote .quote p { font-size: clamp(1.2rem, 3vw, 1.5rem); line-height: 1.4; letter-spacing: -0.02em; font-weight: 500; }
.cs__client { display: flex; align-items: center; gap: 1rem; margin-top: 3rem; padding: 1rem 1.25rem; border: 1px solid var(--rule); border-radius: 1rem; text-decoration: none; transition: border-color 0.18s, transform 0.18s; }
.cs__client:hover { border-color: var(--underline); transform: translateY(-2px); }
.cs__client img { width: 2.5rem; height: 2.5rem; border-radius: 0.6rem; }
.cs__client small { display: block; color: var(--muted); }
.client__logo { width: 3rem; height: 3rem; border-radius: 0.75rem; }
/* Reveal: hidden only when scripts run (html.js), shown by .is-in. Reduced motion: nothing hidden, nothing moves. */
.js .cs [data-r], .js .cs__body > * { opacity: 0; filter: blur(10px); transform: translateY(12px); transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), filter 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
.js .cs .is-in { opacity: 1; filter: none; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .js .cs [data-r], .js .cs__body > * { opacity: 1; filter: none; transform: none; transition: none; }
  .cs__client { transition: none; }
}
```

If the minified CSS in `dist/_astro/*.css` writes the selectors differently from the regexes in Step 1 (for example `.js .cs [data-r]` in another order), change the regex to match what the minifier writes, not the CSS.

- [ ] **Step 9: Run the tests**

Run: `npm test`
Expected: PASS, the 6 new tests included.

- [ ] **Step 10: Commit**

```bash
git add src/components/CaseStudyPage.astro src/components/ClientPage.astro src/pages/case-studies src/pages/fr/case-studies src/pages/clients src/pages/fr/clients src/layouts/BaseLayout.astro src/styles/global.css src/i18n/ui.ts tests/site.test.mjs
git commit -m "feat(case-studies): article-style case study page and client pages"
```

---

### Task 4: Switch the site to the new pages and remove the old ones

**Goal:** The homepage, the carousel and the hero point at case studies and client pages; the old routes, components, collections and content are gone; every site test uses the new paths.

**Files:**
- Modify: `src/components/HomePage.astro`, `src/components/WorkCarousel.astro`, `src/components/Hero.astro`
- Modify: `src/content.config.ts`, `src/lib/content.ts`, `src/i18n/ui.ts`
- Delete: `src/pages/projects/`, `src/pages/use-cases/`, `src/pages/fr/projects/`, `src/pages/fr/use-cases/`, `src/components/ProjectPage.astro`, `src/components/UseCasePage.astro`, `src/components/FeaturedCase.astro`, `src/components/LogoGrid.astro`, `src/content/projects/`, `src/content/use-cases/`
- Modify: `tests/site.test.mjs`, `CLAUDE.md`

**Acceptance Criteria:**
- [ ] The Track record lists the 9 live apps, each linking to `/case-studies/<slug>/`; no empty draft is listed.
- [ ] The carousel shows 3 cards linking to `/case-studies/{no-code-exit,interfaces-on-a-new-stack,marketing-site-migration}/`.
- [ ] The hero "Evaboot" links to `/clients/evaboot/` (`/fr/clients/evaboot/` in French).
- [ ] `dist/projects`, `dist/use-cases` and `dist/case-studies/internal-applications` do not exist, and no page links to `/projects/` or `/use-cases/`.
- [ ] `grep -rnE "getProjects|getUseCases|[^s]/projects/|/use-cases/" src` returns nothing (`[^s]` skips `/assets/projects/`).

**Verify:** `npm test` → pass; `grep -rnE "getProjects|getUseCases|[^s]/projects/|/use-cases/" src` → no output.

**Steps:**

- [ ] **Step 1: Rewrite the site tests for the new paths**

In `tests/site.test.mjs`:

1. Delete the old constants `PROJECTS`, `DRAFT_PROJECTS`, `LISTED`, `USE_CASES`, and add under the constants from Task 3:

```js
const LISTED = APPS.filter((s) => !EMPTY.includes(s));
const PAGES = ["", "fr", "reviews", "fr/reviews", ...CASE_STUDIES.flatMap((s) => [`case-studies/${s}`, `fr/case-studies/${s}`]), ...Object.keys(CLIENTS).flatMap((c) => [`clients/${c}`, `fr/clients/${c}`])];
```

2. Replace these tests' bodies (names may change as shown):

```js
test("homepage: the record lists every live app, and no empty draft", () => {
  const html = page("");
  assert.ok(html.includes("Track record"));
  assert.ok(!html.includes("All apps"));
  for (const slug of LISTED) assert.ok(links(html).includes(`/case-studies/${slug}/`), slug);
  for (const slug of EMPTY) assert.ok(!links(html).includes(`/case-studies/${slug}/`), slug);
});

test("homepage: the selected work links to every use-case story", () => {
  const html = page("");
  for (const slug of STORIES) assert.ok(links(html).includes(`/case-studies/${slug}/`), slug);
});

test("french homepage: French strings and /fr/ links", () => {
  const html = page("fr");
  assert.ok(html.includes("Réserver un appel"));
  assert.ok(links(html).includes("/fr/case-studies/evaboot/"));
  assert.match(html, /<html lang="fr">/);
});

test("no language switch until the stories exist in French", () => {
  for (const p of ["", "fr", "case-studies/evaboot", "case-studies/no-code-exit", "clients/evaboot"]) assert.ok(!page(p).includes('class="header__lang"'), p);
});

test("case study: Domeet, a design mockup built with Evodev", () => {
  const html = page("case-studies/domeet");
  assert.ok(html.includes("Evodev"));
  assert.ok(html.includes("13 working days"));
  assert.ok(html.includes("Design mockup"));
  assert.ok(!/bubble/i.test(html));
});

test("case study: the story and the quote", () => {
  const html = page("case-studies/evaboot");
  assert.ok(html.includes("Situation"));
  assert.ok(html.includes("Results"));
  assert.ok(html.includes("JB Jézéquel"));
  assert.ok(!html.includes("contra.com/p/"));
});

test("case study: draft note on a placeholder", () => {
  const html = page("case-studies/betc");
  assert.ok(html.includes("Text to come."));
  assert.match(html, /<meta name="robots" content="noindex">/);
});

test("case study: a use-case story waiting for approval has the draft note", () => {
  assert.ok(page("case-studies/no-code-exit").includes("Draft. Waits for the client&#39;s approval."));
});

test("the old addresses are gone, and nothing links to them", () => {
  for (const p of ["projects/evaboot", "fr/projects/evaboot", "use-cases/no-code-exit", "fr/use-cases/no-code-exit", "case-studies/internal-applications"]) assert.ok(!exists(p), p);
  for (const p of PAGES) for (const href of links(page(p))) assert.doesNotMatch(href, /^\/(fr\/)?(projects|use-cases)\//, `${p} -> ${href}`);
});
```

3. In the tests "every internal link on every page resolves", "every page has canonical, description, title and hreflang tags", "no Contra case-study link anywhere in dist", "no client internals or internal notes on any page" and "no emoji, no em dash, no filler words, no invented product names on any page", replace the local `const pages = [...]` line with `const pages = PAGES;`.

4. In "homepage hero: names the client type, the problem and a number", change the two link lines to:

```js
  assert.ok(en.includes('From 2023 to 2026 I worked on <a class="hero__ref" href="/clients/evaboot/">Evaboot</a>, a B2B SaaS'));
  assert.ok(page("fr").includes('<a class="hero__ref" href="/fr/clients/evaboot/">Evaboot</a>'));
```

5. In "homepage: selected work cards for the four use cases, in order", rename to "homepage: selected work cards for the three use-case stories, in order" and use `STORIES` and `/case-studies/`:

```js
  assert.deepEqual(cards, STORIES.map((s) => `/case-studies/${s}/`));
  ...
  assert.deepEqual(fr, STORIES.map((s) => `/fr/case-studies/${s}/`));
```

and in "homepage: work cards carry an illustration…" replace `USE_CASES.length` with `STORIES.length` (twice).

6. In "use cases: written for the buyer, with the result number in the title", loop over `STORIES` and read `case-studies/${slug}`; read `exit` from `case-studies/no-code-exit`.

7. Replace the NDA test with:

```js
test("NDA apps: placeholder name blurred, with an NDA label, on the list and the page", () => {
  const home = page("");
  assert.equal((home.match(/class="nda"/g) ?? []).length, 3);
  for (const slug of ["parts-marketplace", "dealership-onboarding", "battery-recycling"]) {
    assert.match(page(`case-studies/${slug}`), /<p class="cs__label"><span class="nda">[^<]+<\/span> <span class="nda-label">NDA signed<\/span>/, slug);
  }
});
```

8. In the Camarage and Folderly tests, change `projects/` to `case-studies/`.

9. Delete the tests "project pages: 12 in English and 12 in French", "project page: French route falls back to English content", "project page: links to its use cases exist", "use-case pages: 4 in English and 4 in French" and "use-case page: draft note and project links" (Task 3 and the tests above replace them).

- [ ] **Step 2: Run to see them fail**

Run: `npm test`
Expected: FAIL on the homepage, hero, and "old addresses are gone" tests.

- [ ] **Step 3: Point the homepage at case studies**

In `src/components/HomePage.astro`, replace the import of `getProjects, getUseCases, slugOf` and the lines from `const projects = …` to the end of `projectItems` with:

```astro
import { getCaseStudies, slugOf } from "../lib/content.ts";
```

```astro
const studies = await getCaseStudies(lang);
const useCases = studies.filter((s) => s.data.kind === "use-case");
// One line per app. Drafts with no text stay off the list: they build, but only a direct link reaches them.
const projectItems = studies.filter((s) => s.data.kind === "app" && s.data.status === "live").map((s) => ({
  name: s.data.name,
  nda: s.data.nda,
  note: [s.data.result, s.data.resultLabel].filter(Boolean).join(" "),
  href: localePath(lang, `/case-studies/${slugOf(s)}/`),
}));
```

In `src/components/WorkCarousel.astro`: change the import to `import type { CaseStudy } from "../lib/content.ts";`, the props to `interface Props { useCases: CaseStudy[]; lang: Lang }`, delete the `"internal-applications": …` line of `art`, and change the card link to:

```astro
  href: localePath(lang, `/case-studies/${slugOf(u)}/`),
```

In `src/components/Hero.astro`, change the comment and the link:

```astro
// The first "Evaboot" of the second paragraph links to the Evaboot client page.
```

```astro
const refHref = localePath(Astro.props.lang, "/clients/evaboot/");
```

- [ ] **Step 4: Delete the old pages, components, collections and content**

```bash
git rm -r src/pages/projects src/pages/use-cases src/pages/fr/projects src/pages/fr/use-cases \
  src/components/ProjectPage.astro src/components/UseCasePage.astro src/components/FeaturedCase.astro src/components/LogoGrid.astro \
  src/content/projects src/content/use-cases
```

In `src/content.config.ts`: delete the `projects` and `useCases` collections and the `highlight` constant, and set:

```ts
export const collections = { caseStudies, clients, testimonials };
```

In `src/lib/content.ts`: delete the `Project` and `UseCase` types and `getProjects` / `getUseCases`, and set `type Entry = CaseStudy | Client;`.

In `src/i18n/ui.ts`: delete the keys `case.fullStory`, `project.client`, `project.useCases`, `useCase.projects` in both languages. Keep `project.nda` (the case study label uses it).

- [ ] **Step 5: Update the project instructions**

In `CLAUDE.md`, replace the `## Content` section body with:

```md
Case studies are Markdown files under `src/content/case-studies/`, client pages under `src/content/clients/`. They are the only source: edit them by hand. A heading written `## Situation | A sentence.` shows the label above the sentence. The Contra and use-case import scripts were deleted on 2026-09-29.
```

- [ ] **Step 6: Check nothing points at the old paths, then test**

Run: `grep -rnE "getProjects|getUseCases|[^s]/projects/|/use-cases/" src`
Expected: no output. (`[^s]` skips the asset paths `/assets/projects/...`, which stay.)

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A src tests CLAUDE.md
git commit -m "refactor(case-studies): link the site to case studies, remove project and use-case pages"
```

---

### Task 5: Headings, Task drafts and the automotive facts

**Goal:** Every story with text has the four STAR labels in order with a sentence heading, a number in its title, and the facts of the removed use case; drafted text is flagged in `review`.

**Files:**
- Modify: the 12 files with text in `src/content/case-studies/en/` (all but `betc.md`, `price-writers.md`, `protech.md`)
- Modify: `tests/site.test.mjs`

**Acceptance Criteria:**
- [ ] For the 12 stories with text, the labels found in order are exactly `Situation, Task, Actions, Results`, each heading written `## Label | Sentence`.
- [ ] Every one of those 12 titles contains a digit.
- [ ] Varnel, Ostrake and Brivane each say, in Results, that the app is one of 3 built for the same client, one a year from 2023 to 2025, all still in use in September 2026.
- [ ] Each file with drafted text has a `review` line naming what to check.
- [ ] `npm test` passes, the "no em dash" test included.

**Verify:** `npm test` → pass, including the new STAR test.

**Steps:**

- [ ] **Step 1: Write the failing test**

Append to `tests/site.test.mjs`:

```js
test("case studies: a number in the title and the four STAR labels in order", () => {
  const STAR = ["Situation", "Task", "Actions", "Results"];
  for (const slug of CASE_STUDIES.filter((s) => !EMPTY.includes(s))) {
    const html = page(`case-studies/${slug}`);
    assert.match(html.match(/<h1>(.*?)<\/h1>/)[1], /\d/, `${slug}: number in the title`);
    const labels = [...html.matchAll(/<span class="cs-label">([^<]+)<\/span>/g)].map((m) => m[1]).filter((l) => STAR.includes(l));
    assert.deepEqual(labels, STAR, slug);
  }
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test`
Expected: FAIL on every story (no labels yet), and on the titles of battery-recycling and dealership-onboarding (no digit).

- [ ] **Step 3: Rewrite the headings, story by story**

For each of the 12 files, rewrite only the `##` headings and add the missing Task section. Rules:

- `## Situation` → `## Situation | <sentence>`. `## What I built`, `## What I built, in three weeks` and the like → `## Actions | <sentence>`; keep the "in three weeks" fact in the sentence if it was in the heading. `## Actions` → `## Actions | <sentence>`. `## Results` → `## Results | <sentence>`. `## Task` → `## Task | <sentence>`. `## What you get` stays as it is (no label).
- The sentence says the section's point in 10 words or fewer, ends with a full stop, and uses only facts already in that section. Model: `## Situation | The product had outgrown Bubble.`
- A heading that is not a STAR part (Camarage's `## Why Bubble, for this client`) stays as a plain heading, inside or after the section it belongs to.
- A story with no Task section gets one, right after Situation: `## Task | <sentence>` and one or two sentences that state what the client asked for, built only from facts already in the file (usually in Situation or summary). Model, for Camarage: `## Task | Let the team run its own platform.` then `Take over the custom-coded platform and rebuild it on a tool the Camarage team can edit itself.`
- Invent no number, no date, no client name, no tool.
- Add to the front matter: `review: "Drafted on 2026-09-30: the heading sentences and the Task section. Check them, then delete this line."` (use cases, which already had a Task: `"Drafted on 2026-09-30: the heading sentences. Check them, then delete this line."`).

- [ ] **Step 4: Titles with no number, and the facts of the removed use case**

In `battery-recycling.md` set:

```yaml
title: "A battery recycling workflow app, one of 3 apps for the same client, still in use"
```

In `dealership-onboarding.md` set:

```yaml
title: "A dealership onboarding app, one of 3 apps for the same client, still in use"
```

Add their stat: `stats: [{"value": "3", "label": "apps for the same client, all still in use"}]` to both, and to `parts-marketplace.md` as a second stat after the existing one.

In each of `parts-marketplace.md`, `dealership-onboarding.md`, `battery-recycling.md`, add as the last bullet of Results:

```md
- One of three applications built for this client, one a year from 2023 to 2025. All three were still in use in September 2026.
```

Extend their `review` line with ` Also check the new title and the Results line about the three apps.` (battery and dealership) or ` Also check the Results line about the three apps.` (parts marketplace).

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: PASS. If the STAR test fails on a story, the error names the slug and the labels it found; fix that file's headings.

- [ ] **Step 6: Commit**

```bash
git add src/content/case-studies tests/site.test.mjs
git commit -m "content(case-studies): STAR labels, Task drafts, and the three-app facts"
```

---

### Task 6: Look at the pages on a desktop and a phone

**Goal:** The case study and client pages look like the approved mockup at 1280px and 390px wide, with no sideways scroll and no screen wider than the viewport.

**Files:**
- Modify: `src/styles/global.css` (only if the check finds a defect)

**Acceptance Criteria:**
- [ ] Screenshots at 1280px and 390px of `/case-studies/evaboot/`, `/case-studies/no-code-exit/`, `/case-studies/camarage/` and `/clients/evaboot/` saved and looked at.
- [ ] At 390px: `document.documentElement.scrollWidth` equals `window.innerWidth` on all four pages.
- [ ] At both widths the stages are wider than the text on desktop, fit the screen on the phone, and every block is visible (revealed) after load.
- [ ] `npm test` still passes after any CSS fix.

**Verify:** the four pairs of screenshots exist in the scratchpad and were viewed; the width check prints `ok` for the four pages.

**Steps:**

- [ ] **Step 1: Build and serve the site**

```bash
npm run build
npx astro preview --port 4321 &
```

- [ ] **Step 2: Take the screenshots with headless Chrome**

Run for each path in `case-studies/evaboot case-studies/no-code-exit case-studies/camarage clients/evaboot` and each width in `1280 390`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars \
  --virtual-time-budget=6000 --window-size=${W},3000 \
  --screenshot="$SCRATCH/cs-${W}-$(echo $P | tr / -).png" "http://localhost:4321/$P/"
```

(`$SCRATCH` is the session scratchpad.) Open each PNG with the Read tool and compare it with the mockup `cs-a-story.html`: label, title, intro, numbers, grey cover stage, labelled headings, stages between paragraphs, quote, client card.

- [ ] **Step 3: Check for sideways scroll at phone width**

Headless Chrome cannot report the page width, so use the Chrome MCP tools: open `http://localhost:4321/<path>/` in a new tab, `resize_window` to 390 by 860, reload, then run with `javascript_tool`:

```js
document.documentElement.scrollWidth <= window.innerWidth ? "ok" : `too wide: ${document.documentElement.scrollWidth}`
```

If `window.innerWidth` still reads more than 400 after the resize (a maximized window ignores it), say so, and instead read the 390px screenshots from Step 2 for any content cut at the right edge. Report which method was used and the result for each of the four paths.

- [ ] **Step 4: Fix, test, commit**

If a defect shows, fix it in `src/styles/global.css`, rerun Steps 1 to 3, then:

```bash
npm test
git add src/styles/global.css
git commit -m "fix(case-studies): <what the check found>"
```

If nothing needs a fix, commit nothing and report the check as passed with the screenshot paths.

- [ ] **Step 5: Stop the preview server**

```bash
kill %1
```
