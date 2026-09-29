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
  assert.ok(links(html).includes("/fr/"));
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/lepoher\.co\/projects\/betc\/"/);
});

test("project page: links to its use cases exist", () => {
  const html = page("projects/fleetnova");
  assert.ok(links(html).includes("/use-cases/internal-applications/"));
});

test("use-case pages: 4 in English and 4 in French", () => {
  for (const slug of USE_CASES) {
    assert.ok(exists(`use-cases/${slug}`), slug);
    assert.ok(exists(`fr/use-cases/${slug}`), `fr ${slug}`);
  }
});

test("use-case page: draft note and project links", () => {
  const html = page("use-cases/internal-applications");
  assert.ok(html.includes("Draft. Waits for the client&#39;s approval."));
  for (const slug of ["fleetnova", "eco-insight", "eco-link"]) assert.ok(links(html).includes(`/projects/${slug}/`), slug);
});

test("every internal link on every page resolves", () => {
  const pages = ["", "fr", ...PROJECTS.flatMap((s) => [`projects/${s}`, `fr/projects/${s}`]), ...USE_CASES.flatMap((s) => [`use-cases/${s}`, `fr/use-cases/${s}`])];
  for (const p of pages) {
    for (const href of links(page(p))) {
      if (!href.startsWith("/") || href.startsWith("/assets/") || href.startsWith("/_astro/") || href === "/") continue;
      assert.ok(exists(href.replace(/^\/|\/$/g, "")), `${p} -> ${href}`);
    }
  }
});

test("homepage: GitHub graph when a token was present at build", { skip: !process.env.GITHUB_TOKEN }, () => {
  const html = page("");
  assert.equal((html.match(/class="gh-week"/g) ?? []).length, 53);
  assert.match(html, /contributions in the last year/);
  assert.ok(!/<script[^>]*>[^<]*github/i.test(html), "the graph adds no script");
});

test("every page has canonical, description, title and hreflang tags", () => {
  const pages = ["", "fr", ...PROJECTS.flatMap((s) => [`projects/${s}`, `fr/projects/${s}`]), ...USE_CASES.flatMap((s) => [`use-cases/${s}`, `fr/use-cases/${s}`])];
  for (const p of pages) {
    const html = page(p);
    assert.match(html, /<html lang="/, p);
    assert.match(html, /<title>/, p);
    assert.match(html, /<meta name="description"/, p);
    assert.match(html, /<link rel="canonical" href="https:\/\/lepoher\.co\//, p);
    assert.match(html, /hreflang="en"/, p);
    assert.match(html, /hreflang="fr"/, p);
  }
});

test("no Contra case-study link anywhere in dist", () => {
  const pages = ["", "fr", ...PROJECTS.flatMap((s) => [`projects/${s}`, `fr/projects/${s}`]), ...USE_CASES.flatMap((s) => [`use-cases/${s}`, `fr/use-cases/${s}`])];
  for (const p of pages) assert.ok(!page(p).includes("contra.com/p/"), p);
});

test("the old Carrd page is gone", () => {
  assert.ok(!exists("old"));
  assert.ok(!exists("demo"));
});

test("homepage hero: greeting, marked title, availability and booking button", () => {
  const en = page("");
  assert.match(en, /Hi, I&#39;m Gautier Le Poher/);
  assert.equal((en.match(/class="mark /g) ?? []).length, 3);
  assert.ok(en.includes("Available for new projects"));
  assert.match(en, /class="pill"[^>]*href="https:\/\/calendly\.com\/gautierlp\/30min"|href="https:\/\/calendly\.com\/gautierlp\/30min"[^>]*class="pill"/);
  const fr = page("fr");
  assert.ok(fr.includes("Disponible pour de nouveaux projets"));
});

test("homepage: selected work cards for the four use cases, in order", () => {
  const cards = [...page("").matchAll(/<a class="card"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(cards, USE_CASES.map((s) => `/use-cases/${s}/`));
  const fr = [...page("fr").matchAll(/<a class="card"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(fr, USE_CASES.map((s) => `/fr/use-cases/${s}/`));
});

test("homepage: work cards carry an illustration, a light layer, and the carousel script, without sound or haptics", () => {
  const html = page("");
  assert.equal((html.match(/class="card__media"[^>]*>\s*<img /g) ?? []).length, USE_CASES.length);
  assert.equal((html.match(/class="card__shine"/g) ?? []).length, USE_CASES.length);
  assert.match(html, /<ul class="work__track" data-carousel/);
  assert.match(html, /<script[^>]*>[^<]*setProperty\("--d"/);
  assert.ok(!html.includes("data-haptic") && !html.includes("cuelume"));
});

test("homepage: the work carousel scrolls by itself and stops under the mouse", () => {
  const script = [...page("").matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((s) => s.includes("data-carousel")) ?? "";
  assert.match(script, /dataset\.autoplay/);
  assert.match(script, /pointerenter/);
  assert.match(script, /pointerleave/);
  assert.match(script, /prefers-reduced-motion/);
  // A mouse click also focuses the card; only keyboard focus may hold the drift.
  assert.match(script, /:focus-visible/);
  assert.ok(!script.includes("contains(document.activeElement)"));
});

test("homepage: a small photo of Gautier in the hero", () => {
  assert.match(page(""), /<img class="avatar" src="\/assets\/images\/avatar\.jpg" alt="Gautier Le Poher"/);
});
