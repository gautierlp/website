import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const page = (path) => readFileSync(join(DIST, path, "index.html"), "utf8");
const exists = (path) => existsSync(join(DIST, path, "index.html"));
const links = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

const PROJECTS = ["evaboot", "disko-leads", "folderly", "parts-marketplace", "camarage", "dealership-onboarding", "battery-recycling", "clean-car", "price-writers", "betc", "protech"];
const DRAFT_PROJECTS = ["price-writers", "betc", "protech"];
const LISTED = PROJECTS.filter((s) => !DRAFT_PROJECTS.includes(s));
const USE_CASES = ["no-code-exit", "interfaces-on-a-new-stack", "marketing-site-migration", "internal-applications"];

test("homepage: headline in plain text, no code font", () => {
  const html = page("");
  assert.ok(html.includes("I take over your product and ship it myself."));
  assert.ok(!html.includes("ship()"));
});

test("homepage: the three featured projects", () => {
  const html = page("");
  for (const name of ["Evaboot", "Disko Leads", "Folderly"]) assert.ok(html.includes(name), name);
});

test("homepage: the record lists every live project, and no draft", () => {
  const html = page("");
  assert.ok(html.includes("Track record"));
  assert.ok(!html.includes("All apps"));
  for (const slug of LISTED) assert.ok(links(html).includes(`/projects/${slug}/`), slug);
  for (const slug of DRAFT_PROJECTS) assert.ok(!links(html).includes(`/projects/${slug}/`), slug);
});

test("homepage: no client revenue sold as a result", () => {
  const html = page("");
  assert.ok(!html.includes("$1.6M"));
  assert.ok(!html.includes("From $1M to $2M+"));
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

test("no language switch until the use cases exist in French", () => {
  for (const p of ["", "fr", "projects/evaboot", "use-cases/no-code-exit"]) assert.ok(!page(p).includes('class="header__lang"'), p);
});

test("project pages: 11 in English and 11 in French", () => {
  for (const slug of PROJECTS) {
    assert.ok(exists(`projects/${slug}`), slug);
    assert.ok(exists(`fr/projects/${slug}`), `fr ${slug}`);
  }
});

test("project page: the story and the quote", () => {
  const html = page("projects/evaboot");
  assert.ok(html.includes("Situation"));
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
  const html = page("projects/parts-marketplace");
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
  for (const slug of ["parts-marketplace", "dealership-onboarding", "battery-recycling"]) assert.ok(links(html).includes(`/projects/${slug}/`), slug);
});

test("every internal link on every page resolves", () => {
  const pages = ["", "fr", "reviews", "fr/reviews", ...PROJECTS.flatMap((s) => [`projects/${s}`, `fr/projects/${s}`]), ...USE_CASES.flatMap((s) => [`use-cases/${s}`, `fr/use-cases/${s}`])];
  for (const p of pages) {
    for (const href of links(page(p))) {
      if (!href.startsWith("/") || href.startsWith("/assets/") || href.startsWith("/_astro/") || href === "/") continue;
      assert.ok(exists(href.replace(/^\/|\/$/g, "")), `${p} -> ${href}`);
    }
  }
});

test("homepage: GitHub graph when a token was present at build", { skip: !process.env.GITHUB_TOKEN }, () => {
  const html = page("");
  // 12 months is 52 or 53 weeks, by the day of the build.
  const weeks = (html.match(/class="gh-week"/g) ?? []).length;
  assert.ok(weeks === 52 || weeks === 53, `${weeks} weeks`);
  assert.match(html, /<code class="fn">git log<\/code> · last 12 months/);
  assert.ok(!html.includes("in the last year"));
  assert.ok(!html.includes("api.github.com"), "the page never calls GitHub: the graph is built with the site");
  // Each day carries its count and date for the label that shows on hover.
  assert.equal((html.match(/class="gh-day l\d" data-count="\d+" data-date="\d{4}-\d{2}-\d{2}"/g) ?? []).length, (html.match(/class="gh-day /g) ?? []).length);
  assert.match(html, /<div class="gh-grid" data-gh-grid data-locale="en-GB" data-none="No contributions on \{date\}" data-one="1 contribution on \{date\}" data-many="\{n\} contributions on \{date\}"/);
  assert.match(page("fr"), /data-locale="fr-FR" data-none="Aucune contribution le \{date\}"/);
  // The head has the link to the profile, the foot has the total and the key of the five tints.
  assert.match(html, /<a class="gh-link" href="https:\/\/github\.com\/gautierlp" target="_blank" rel="noopener">View on GitHub/);
  assert.match(html, /<span class="gh-total">[\d,]+ contributions in the last 12 months<\/span>/);
  assert.equal((html.match(/class="gh-key l\d"/g) ?? []).length, 5);
  assert.match(html, /<span class="gh-foot-label">Less<\/span>/);
  assert.match(html, /<span class="gh-foot-label">More<\/span>/);
  const fr = page("fr");
  assert.match(fr, /class="gh-link"[^>]*>Voir sur GitHub/);
  assert.match(fr, /<span class="gh-foot-label">Moins<\/span>/);
});

test("every page has canonical, description, title and hreflang tags", () => {
  const pages = ["", "fr", "reviews", "fr/reviews", ...PROJECTS.flatMap((s) => [`projects/${s}`, `fr/projects/${s}`]), ...USE_CASES.flatMap((s) => [`use-cases/${s}`, `fr/use-cases/${s}`])];
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
  const pages = ["", "fr", "reviews", "fr/reviews", ...PROJECTS.flatMap((s) => [`projects/${s}`, `fr/projects/${s}`]), ...USE_CASES.flatMap((s) => [`use-cases/${s}`, `fr/use-cases/${s}`])];
  for (const p of pages) assert.ok(!page(p).includes("contra.com/p/"), p);
});

test("the old Carrd page is gone", () => {
  assert.ok(!exists("old"));
  assert.ok(!exists("demo"));
});

test("homepage hero: greeting, role in contrast, booking button and email", () => {
  const en = page("");
  assert.match(en, /Hi, I&#39;m Gautier Le Poher/);
  assert.match(en, /<span class="hero__role">Technical Product Manager<\/span>/);
  assert.ok(!en.includes('class="mark '));
  assert.ok(!en.includes("Available for day-rate work on your product."));
  assert.ok(!en.includes("new projects"));
  assert.match(en, /<a class="pill"[^>]*data-booking/);
  assert.match(en, /<p class="hero__mail"><span class="muted">or email me<\/span> <a class="hero__ref" href="mailto:gautier@lepoher\.co\?subject=A%20product%20to%20take%20over">gautier@lepoher\.co<\/a><\/p>/);
  const fr = page("fr");
  assert.ok(!fr.includes("Disponible au TJM sur votre produit."));
  assert.match(fr, /<p class="hero__mail"><span class="muted">ou écrivez-moi<\/span>/);
  assert.ok(fr.includes('href="mailto:gautier@lepoher.co?subject=Un%20produit%20%C3%A0%20reprendre"'));
  for (const [html, n] of [[en, "en"], [fr, "fr"]]) assert.ok(!html.includes('href="mailto:gautier@lepoher.co"'), `${n}: a mail link has no subject`);
});

test("homepage hero: names the client type, the problem and a number", () => {
  const en = page("");
  assert.ok(en.includes("B2B SaaS and internal business apps that nobody owns end to end"));
  assert.ok(en.includes("then I build it, alone or with your team."));
  assert.ok(!en.includes("the data, the interfaces, the code"));
  assert.ok(en.includes("from $1M to $2M in annual revenue"));
  assert.ok(en.includes("I shipped 500+ features and fixes"));
  assert.ok(en.includes('From 2023 to 2026 I worked on <a class="hero__ref" href="/projects/evaboot/">Evaboot</a>, a B2B SaaS'));
  assert.ok(page("fr").includes('<a class="hero__ref" href="/fr/projects/evaboot/">Evaboot</a>'));
  assert.ok(en.includes("moved its marketing site from WordPress to code"));
  assert.ok(en.includes("and helped migrate its app from no-code to code."));
  assert.ok(en.includes("I also built the MCP server and the CLI, as part of its ambition to become an AI-first company."));
  assert.ok(en.includes("I have also owned and shipped a dozen other apps over the years."));
  assert.ok(!en.includes("Product Owner from 2019 to 2022."));
  assert.ok(en.includes("a dozen other apps over the years. <strong>I build with coding agents every day.</strong>"));
  assert.ok(!en.includes("and I decide what they build"));
});

test("homepage: side projects in a row that scrolls sideways, in both languages", () => {
  const en = page("");
  assert.match(en, /<h2 id="side-title">Side projects<\/h2>/);
  assert.ok(!en.includes("Personal projects"));
  assert.match(en, /<ul class="side__track" data-side-track/);
  // Four projects, in this order. All four are private today, so no tile is a link yet.
  const names = [...en.matchAll(/<span class="tile__copy"><strong>([^<]+)<\/strong>/g)].map((m) => m[1]);
  assert.deepEqual(names, ["Home server", "Finance app", "Jolt", "Session reviewer"]);
  assert.equal((en.match(/<div class="tile tile--static">/g) ?? []).length, 4);
  assert.equal((en.match(/class="tile__arrow"/g) ?? []).length, 0);
  assert.ok(en.includes("A server at home that runs my booking page, my email assistant and my test runners."));
  assert.ok(en.indexOf("Track record") < en.indexOf("Side projects"));
  const fr = page("fr");
  assert.match(fr, /<h2 id="side-title">Projets perso<\/h2>/);
  assert.ok(fr.includes("<strong>Serveur maison</strong>"));
  assert.ok(fr.includes("Une app qui importe mes données bancaires dans Postgres et répond aux questions que je lui pose."));
});

test("homepage CTA: invites the owner-less product, not a buyer of development", () => {
  const en = page("");
  assert.ok(!en.includes("Need to build an app?"));
  assert.ok(en.includes("A product nobody owns end to end?"));
  assert.ok(en.includes("Book a 30-minute call"));
  assert.ok(en.includes("mailto:gautier@lepoher.co"));
});

test("booking links open the Cal.com popup and fall back to the booking page", () => {
  for (const html of [page(""), page("fr")]) {
    const booking = [...html.matchAll(/<a [^>]*data-booking[^>]*>/g)].map((m) => m[0]);
    assert.equal(booking.length, 2, "hero pill and CTA");
    for (const a of booking) assert.match(a, /href="https:\/\/book\.lepoher\.co\/gautier\/30min"/);
    assert.ok(!html.includes("calendly.com"));
    assert.ok(html.includes("https://book.lepoher.co/embed/embed.js"), "embed loader");
  }
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
  // After a drag, snap stays off until the smooth scroll lands, else the browser jumps there.
  assert.match(script, /scrollend/);
});

test("homepage: a small photo of Gautier in the hero", () => {
  assert.match(page(""), /<img class="avatar" src="\/assets\/images\/avatar\.jpg" alt="Gautier Le Poher"/);
});

test("no client internals or internal notes on any page", () => {
  const pages = ["", "fr", "reviews", "fr/reviews", ...PROJECTS.flatMap((s) => [`projects/${s}`, `fr/projects/${s}`]), ...USE_CASES.flatMap((s) => [`use-cases/${s}`, `fr/use-cases/${s}`])];
  const banned = [/billing defect/i, /security vulnerabilit/i, /exposed to security/i, /\bIndra\b/, /\bRenault\b/, /Open item/, /segment B/i, /Gautier is not sure/];
  for (const p of pages) for (const re of banned) assert.doesNotMatch(page(p), re, `${p}: ${re}`);
});

test("use cases: written for the buyer, with the result number in the title", () => {
  for (const slug of USE_CASES) {
    const html = page(`use-cases/${slug}`);
    assert.ok(!html.includes("What this proves"), slug);
    assert.ok(html.includes("What you get"), slug);
    assert.match(html.match(/<h1>(.*?)<\/h1>/)[1], /\d/, `${slug} title has a number`);
  }
  const exit = page("use-cases/no-code-exit");
  assert.match(exit.match(/<h1>(.*?)<\/h1>/)[1], /200,000 users/);
  assert.match(exit, /about 200,000 users at the time of the migration/);
});

test("homepage: the Evaboot quote still under review stays off the homepage", () => {
  const html = page("");
  assert.ok(!html.includes("future Bubble"));
});

test("homepage: says what I do not do", () => {
  assert.ok(page("").includes("What I do not do: model training, MLOps, data engineering, RAG."));
  assert.ok(page("fr").includes("Ce que je ne fais pas : entraîner des modèles, du MLOps, du data engineering, du RAG."));
});

test("no emoji, no em dash, no filler words, no invented product names on any page", () => {
  const pages = ["", "fr", "reviews", "fr/reviews", ...PROJECTS.flatMap((s) => [`projects/${s}`, `fr/projects/${s}`]), ...USE_CASES.flatMap((s) => [`use-cases/${s}`, `fr/use-cases/${s}`])];
  const banned = [/\p{Extended_Pictographic}/u, /—/, /seamless/i, /robust/i, /spearhead/i, /leverag/i, /Eco'?Insight/i, /Eco'?link/i, /Fleetnova/i, /Over the course of a year/, /I have achieved by/];
  for (const p of pages) {
    const text = page(p).replace(/<script[\s\S]*?<\/script>/g, "");
    for (const re of banned) assert.doesNotMatch(text, re, `${p}: ${re}`);
  }
});

test("NDA projects: placeholder name blurred, with an NDA label, on the list and the page", () => {
  const home = page("");
  assert.equal((home.match(/class="nda"/g) ?? []).length, 3);
  for (const slug of ["parts-marketplace", "dealership-onboarding", "battery-recycling"]) {
    const html = page(`projects/${slug}`);
    assert.match(html, /<h1><span class="nda">[^<]+<\/span> <span class="nda-label">NDA signed<\/span><\/h1>/, slug);
  }
});

test("Camarage: a product taken over, with the reason Bubble fit this client", () => {
  const html = page("projects/camarage");
  assert.match(html, /took over/);
  assert.match(html, /without a developer/);
  assert.ok(!html.includes("Migrating a 1,000-user app from Code to Bubble"));
});

test("Folderly: no quote from a third party about another product", () => {
  assert.ok(!page("projects/folderly").includes("Belkins"));
});

test("links are ink with a grey underline: the Carrd blue is gone from the built site", () => {
  const files = readdirSync(join(DIST, "_astro")).filter((f) => f.endsWith(".css"));
  assert.ok(files.length > 0);
  const css = files.map((f) => readFileSync(join(DIST, "_astro", f), "utf8")).join("\n");
  assert.ok(!css.includes("2300ff"));
  assert.ok(!page("").includes("2300ff"));
  assert.match(css, /a\{color:var\(--ink\);text-decoration:underline;text-decoration-color:var\(--underline\)/);
});

test("side projects: the four icons are inline SVG with named moving parts, and motion stops under reduced motion", () => {
  const html = page("");
  assert.ok(!html.includes('<img class="tile__icon"'));
  for (const icon of ["home-server", "finance", "jolt", "session-reviewer"]) {
    assert.match(html, new RegExp(`<svg class="tile__icon" data-icon="${icon}"`));
  }
  assert.match(html, /class="icon__light"/);
  assert.match(html, /class="icon__bar"/);
  assert.match(html, /class="icon__bolt"/);
  assert.match(html, /class="icon__lens"/);
  const css = readdirSync(join(DIST, "_astro")).filter((f) => f.endsWith(".css")).map((f) => readFileSync(join(DIST, "_astro", f), "utf8")).join("\n");
  assert.match(css, /prefers-reduced-motion:\s*reduce\)\{(?:[^{}]*\{[^}]*\})*?[^{}]*\.tile__icon \*\{[^}]*animation:none/);
});

test("GitHub graph: the five tints are clearly apart, from the empty day to the busiest", () => {
  const css = readdirSync(join(DIST, "_astro")).filter((f) => f.endsWith(".css")).map((f) => readFileSync(join(DIST, "_astro", f), "utf8")).join("\n");
  const hex = (sel) => {
    const m = css.match(new RegExp(`${sel.replace(/\./g, "\\.")}[^{]*\\{background:(#[0-9a-f]{3,6}|var\\(--accent\\))`));
    assert.ok(m, sel);
    const v = m[1] === "var(--accent)" ? css.match(/--accent:(#[0-9a-f]{3,6})/)[1] : m[1];
    const full = v.length === 4 ? v.slice(1).split("").map((c) => c + c).join("") : v.slice(1);
    return parseInt(full.slice(0, 2), 16); // grey: one channel is the lightness
  };
  const tints = [hex(".gh-day,.gh-key"), hex(".gh-day.l1"), hex(".gh-day.l2"), hex(".gh-day.l3"), hex(".gh-day.l4")];
  for (let i = 1; i < tints.length; i++) assert.ok(tints[i - 1] - tints[i] >= 35, `tint ${i}: ${tints[i - 1]} to ${tints[i]}`);
});

const PILE = ["JB Jézéquel", "Nirundthan Parameswaran", "Johary Randria", "Pierre Hilbert", "Bastien Paul", "Clara Ananou"];
const pileOf = (html) => html.slice(html.indexOf('<ol class="pile"'), html.indexOf("</ol>", html.indexOf('<ol class="pile"')));

test("homepage: six reviews in a pile after the selected work, in order, with a link to all ten", () => {
  for (const [path, heading, link] of [["", "What clients say", '<a class="pile__all" href="/reviews/">Read all 10 reviews</a>'], ["fr", "Ce que disent les clients", '<a class="pile__all" href="/fr/reviews/">Lire les 10 avis</a>']]) {
    const html = page(path);
    assert.ok(html.includes(`<h2 id="reviews-title">${heading}</h2>`), path);
    assert.ok(html.indexOf("work-title") < html.indexOf('<ol class="pile"'), `${path}: after the selected work`);
    assert.ok(html.indexOf('<ol class="pile"') < html.indexOf("plainlist"), `${path}: before the track record`);
    const pile = pileOf(html);
    assert.deepEqual([...pile.matchAll(/<span class="review__name">([^<]+)<\/span>/g)].map((m) => m[1]), PILE, path);
    assert.deepEqual([...pile.matchAll(/data-place="(\d)"/g)].map((m) => m[1]), ["1", "2", "3", "4", "5", "6"], path);
    assert.equal((pile.match(/tabindex="0"/g) ?? []).length, 6, `${path}: each card takes keyboard focus`);
    assert.match(pile, /data-place="1" data-tone="ink"/);
    assert.ok(html.includes(link), path);
    assert.ok(!pile.includes("CMO") && !pile.includes("promotional"), `${path}: reviews off the pile stay off the homepage`);
    assert.ok(!html.includes('<blockquote class="quote">'), `${path}: the single quote is gone`);
  }
});

test("homepage: a French review shows its translation and a label in English, the original in French", () => {
  const en = pileOf(page(""));
  assert.ok(en.includes("double hat of PO and no-code developer"));
  assert.ok(!en.includes("double casque"));
  assert.equal((en.match(/<p class="review-card__note">Translated from French<\/p>/g) ?? []).length, 2);
  const fr = pileOf(page("fr"));
  assert.ok(fr.includes("Cette double casque de PO et de dev nocode"));
  assert.ok(!fr.includes("review-card__note"));
  assert.ok(fr.includes("He helped scale our Bubble app to $200k MRR"), "an English review stays in English");
  assert.match(en, /<p class="review-card__result">From 0 to \$3k MRR<\/p>/);
});

test("reviews page: every review in full, newest first, a hidden name shows the role alone", () => {
  for (const path of ["reviews", "fr/reviews"]) {
    const html = page(path);
    assert.equal((html.match(/<article class="review"/g) ?? []).length, 10, path);
    const years = [...html.matchAll(/<span class="review__source">(?:Malt|Contra), (\d{4})<\/span>/g)].map((m) => Number(m[1]));
    assert.equal(years.length, 10, path);
    assert.deepEqual(years, [...years].sort((a, b) => b - a), `${path}: newest first`);
    assert.match(html, /<span class="review__role">CMO<\/span>/);
  }
  assert.ok(page("reviews").includes("Azure Graph"));
  assert.ok(page("reviews").includes("Translated from French"));
  assert.ok(page("fr/reviews").includes("faire des appels api sur Azure Graph"));
});

test("pile CSS: cards move only without reduced motion", () => {
  const css = readdirSync(join(DIST, "_astro")).filter((f) => f.endsWith(".css")).map((f) => readFileSync(join(DIST, "_astro", f), "utf8")).join("\n");
  assert.match(css, /\.pile__card\{[^}]*transition:/);
  assert.match(css, /prefers-reduced-motion:\s*reduce\)\{(?:[^{}]*\{[^}]*\})*?[^{}]*\.pile__card\{[^}]*transition:none/);
});
