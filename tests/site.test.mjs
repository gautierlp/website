import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const page = (path) => readFileSync(join(DIST, path, "index.html"), "utf8");
const exists = (path) => existsSync(join(DIST, path, "index.html"));
const links = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

const APPS = ["evaboot", "disko-leads", "folderly", "parts-marketplace", "camarage", "dealership-onboarding", "battery-recycling", "clean-car", "price-writers", "betc", "protech", "domeet", "pachamama"];
const STORIES = ["no-code-exit", "interfaces-on-a-new-stack", "marketing-site-migration"];
// The apps with featured: true follow the stories in the Selected work carousel, in Track record order.
const FEATURED = ["parts-marketplace", "camarage", "clean-car"];
const WORK = [...STORIES, ...FEATURED];
const CASE_STUDIES = [...APPS, ...STORIES];
// Drafts waiting for client approval: they build, but stay off the lists and out of search.
const EMPTY = ["price-writers"];
const CLIENTS = { evaboot: ["evaboot", ...STORIES], "automotive-group": ["parts-marketplace", "dealership-onboarding", "battery-recycling"] };
const LISTED = APPS.filter((s) => !EMPTY.includes(s));
const PAGES = ["", "fr", "reviews", "fr/reviews", "privacy", "fr/privacy", "legal", "fr/legal", ...CASE_STUDIES.flatMap((s) => [`case-studies/${s}`, `fr/case-studies/${s}`]), ...Object.keys(CLIENTS).flatMap((c) => [`clients/${c}`, `fr/clients/${c}`])];
const cssText = () => readdirSync(join(DIST, "_astro")).filter((f) => f.endsWith(".css")).map((f) => readFileSync(join(DIST, "_astro", f), "utf8")).join("\n");

test("homepage: headline in plain text, no code font", () => {
  const html = page("");
  assert.ok(html.includes("I take over your product and ship it."));
  assert.ok(!html.includes("myself"));
  assert.ok(!html.includes("ship()"));
});

test("homepage: the title names the role in both languages", () => {
  for (const p of ["", "fr"]) assert.match(page(p), /<title>Gautier Le Poher \| Technical Product Manager<\/title>/, p);
});

test("homepage: the three featured projects", () => {
  const html = page("");
  for (const name of ["Evaboot", "Disko Leads", "Folderly"]) assert.ok(html.includes(name), name);
});

test("homepage: the record lists every live app, and no empty draft", () => {
  const html = page("");
  assert.ok(html.includes("Track record"));
  assert.ok(!html.includes("All apps"));
  for (const slug of LISTED) assert.ok(links(html).includes(`/case-studies/${slug}/`), slug);
  for (const slug of EMPTY) assert.ok(!links(html).includes(`/case-studies/${slug}/`), slug);
});

test("homepage: each record row has a logo or a blank tile, a short proof only where it lasts, and the years", () => {
  const html = page("");
  const record = html.slice(html.indexOf('id="track-record"'), html.indexOf("</section>", html.indexOf('id="track-record"')));
  const rows = record.split("<li").slice(1);
  assert.equal(rows.length, LISTED.length);
  for (const row of rows) assert.match(row, /class="record__icon/);
  assert.match(record, /Disko Leads<\/a>[\s\S]*?€0 to €3k MRR[\s\S]*?2024/);
  assert.match(record, /Evaboot<\/a>[\s\S]*?Builder of a \$2M ARR SaaS[\s\S]*?2023–26/);
  assert.match(record, /Pachamama<\/a>[\s\S]*?Recruitment app, 5,000\+ candidates/);
  assert.match(record, /Camarage<\/a>[\s\S]*?Housing platform, 8,000\+ matchings/);
  assert.ok(!record.includes("Lead developer") && !record.includes("rent payments"));
  assert.match(rows.find((r) => r.includes("Folderly</a>")), /<span class="record__years">2023<\/span>/);
  assert.match(record, /BETC<\/a>[\s\S]*?2020–23<\/span>/);
  assert.match(record, /Clean Car<\/a>\s*<\/span>\s*<span class="record__years">2023<\/span>/);
  for (const old of ["to build a booking app", "features and fixes shipped", "17 days"]) assert.ok(!record.includes(old), old);
  const fr = page("fr");
  assert.ok(fr.includes("De 0 à 3 k€ de MRR"));
  assert.ok(fr.includes("App de recrutement, plus de 5 000 candidats") && fr.includes("Plateforme de logement, plus de 8 000 mises en relation") && fr.includes("Builder d&#39;un SaaS à 2 M$ d&#39;ARR"));
});

test("homepage: no client revenue sold as a result", () => {
  const html = page("");
  assert.ok(!html.includes("$1.6M"));
  assert.ok(!html.includes("From $1M to $2M+"));
});

test("homepage: the selected work links to every use-case story", () => {
  const html = page("");
  for (const slug of STORIES) assert.ok(links(html).includes(`/case-studies/${slug}/`), slug);
});

test("homepage: no Contra link, the profiles are LinkedIn and Malt", () => {
  assert.ok(!page("").includes("contra.com"));
  assert.ok(page("").includes("https://www.linkedin.com/in/gautier-le-poher/"));
  assert.ok(page("").includes("https://www.malt.fr/profile/gautierlepoher"));
});

test("french homepage: French strings and /fr/ links", () => {
  const html = page("fr");
  assert.ok(html.includes("Réserver un appel"));
  assert.ok(links(html).includes("/fr/case-studies/evaboot/"));
  assert.match(html, /<html lang="fr">/);
});

test("a language switch leads to the same page in the other language", () => {
  for (const [p, twin] of [["", "/fr/"], ["fr", "/"], ["case-studies/evaboot", "/fr/case-studies/evaboot/"], ["fr/case-studies/no-code-exit", "/case-studies/no-code-exit/"], ["clients/evaboot", "/fr/clients/evaboot/"], ["privacy", "/fr/privacy/"]]) {
    assert.match(page(p), new RegExp(`<a class="header__lang" href="${twin}"`), p);
  }
});

test("french stories: French text, French STAR labels, links that stay in French", () => {
  for (const slug of CASE_STUDIES.filter((s) => !EMPTY.includes(s))) {
    const html = page(`fr/case-studies/${slug}`);
    assert.match(html, /<html lang="fr">/, slug);
    const labels = [...html.matchAll(/<span class="cs-label">([^<]+)<\/span>/g)].map((m) => m[1]).filter((l) => ["Situation", "Mission", "Actions", "Résultats"].includes(l));
    assert.deepEqual(labels, ["Situation", "Mission", "Actions", "Résultats"], slug);
    for (const href of links(html.replace(/<a class="header__lang"[^>]*>/, ""))) assert.doesNotMatch(href, /^\/(case-studies|clients)\//, `${slug} -> ${href}`);
  }
});

test("case study: Domeet, a design mockup", () => {
  const html = page("case-studies/domeet");
  assert.ok(html.includes("13 working days"));
  assert.ok(html.includes("Design mockup"));
  assert.ok(!/bubble/i.test(html));
});

test("NoxCod and Evodev, the IT services companies between Gautier and the end clients, appear on no page", () => {
  // The site names the end client. The intermediaries stay in the vault only.
  for (const path of PAGES) assert.ok(!/noxcod|evodev/i.test(page(path)), path);
});

test("the automotive group pages never mention an agency", () => {
  for (const path of [...CLIENTS["automotive-group"].flatMap((s) => [`case-studies/${s}`, `fr/case-studies/${s}`]), "clients/automotive-group", "fr/clients/automotive-group"]) {
    assert.ok(!/\bagency\b|\bagence\b/i.test(page(path)), path);
  }
});

test("case study: Pachamama, taken over from another developer", () => {
  const html = page("case-studies/pachamama");
  assert.ok(html.includes("Took over building a recruitment platform with 5,000+ candidates"));
  assert.ok(html.includes("57"));
  assert.ok(html.includes("Situation") && html.includes("Results"));
  // Client staff and client internals stay off the page.
  for (const name of ["Marion", "Valentine", "Laurie", "Gabrielle", "Arnaud", "Marine", "Mendrika"]) assert.ok(!html.includes(name), name);
  assert.ok(page("").includes("5,000+ candidates"), "the proof in the Track record");
});

test("case study: the story and the quote", () => {
  const html = page("case-studies/evaboot");
  assert.ok(html.includes("Situation"));
  assert.ok(html.includes("Results"));
  assert.ok(html.includes("JB Jézéquel"));
  assert.ok(!html.includes("contra.com/p/"));
});

test("case study: a draft waiting for client approval has its text, but stays out of search", () => {
  for (const slug of EMPTY) {
    const html = page(`case-studies/${slug}`);
    assert.ok(!html.includes("Text to come."), slug);
    assert.match(html, /<meta name="robots" content="noindex">/, slug);
  }
});

test("case study: the stories the client cleared are in search, in both languages", () => {
  for (const slug of STORIES) for (const p of [`case-studies/${slug}`, `fr/case-studies/${slug}`]) {
    assert.doesNotMatch(page(p), /<meta name="robots" content="noindex">/, p);
    assert.ok(!page(p).includes("Text to come.") && !page(p).includes("Texte à venir."), p);
  }
});

test("case study: the client card says where it leads", () => {
  assert.match(page("case-studies/no-code-exit"), /<small>See every project for this client<\/small>/);
  assert.match(page("fr/case-studies/no-code-exit"), /<small>Voir tous les projets pour ce client<\/small>/);
});

test("case study: the image frame has no grey box of its own", async () => {
  const { readFileSync } = await import("node:fs");
  const rule = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8").match(/^\.stage \{[^}]*\}/m)[0];
  assert.doesNotMatch(rule, /background|border:/, "an image with its own grey background showed two greys");
});

test("no-code exit: Gautier's second round of notes", () => {
  const exit = page("case-studies/no-code-exit");
  assert.match(exit, /<figcaption>Evaboot&#39;s export screen<\/figcaption>/);
  assert.ok(exit.includes("A/B tests and autonomous AI agents"));
  assert.ok(exit.includes("no autonomous AI agents"));
  assert.equal((exit.match(/few developers to hire who know Bubble/g) ?? []).length, 2, "in the Situation and in Before");
  assert.doesNotMatch(exit, /\((1 )?May 2026\)/, "no dates in brackets in the results");
});

test("case study: images fill a rounded frame with a hairline on top, as on plud.net", async () => {
  const { readFileSync } = await import("node:fs");
  const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
  const rule = css.match(/^\.stage img, \.stage video \{[^}]*\}/m)?.[0] ?? "";
  assert.match(rule, /border-radius: 1\.25rem/);
  assert.match(rule, /outline: 0\.5px solid rgba\(0, 0, 0, 0\.2\)/);
  assert.match(rule, /outline-offset: -0\.5px/);
});

test("no-code exit: Gautier's corrections of 2026-10-01", () => {
  const exit = page("case-studies/no-code-exit");
  assert.doesNotMatch(exit, /outgrown/i, "the product did not outgrow Bubble");
  for (const why of ["HubSpot", "Salesforce", "A/B tests", "AI agents"]) assert.ok(exit.includes(why), why);
  for (const gone of [/not from memory/, /twelve/, /thirteen pages/, /took seconds/, /plugins changed/]) assert.doesNotMatch(exit, gone);
});

test("the old addresses are gone, and nothing links to them", () => {
  for (const p of ["projects/evaboot", "fr/projects/evaboot", "use-cases/no-code-exit", "fr/use-cases/no-code-exit", "case-studies/internal-applications"]) assert.ok(!exists(p), p);
  for (const p of PAGES) for (const href of links(page(p))) assert.doesNotMatch(href, /^\/(fr\/)?(projects|use-cases)\//, `${p} -> ${href}`);
});

test("every internal link on every page resolves", () => {
  const pages = PAGES;
  for (const p of pages) {
    for (const link of links(page(p))) {
      const href = link.split("#")[0]; // "/#work" is the homepage, at the Selected work cards
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
  assert.ok(!html.includes("api.github.com"), "the page never calls GitHub: the graph is built with the site");
  // Each day carries its count and date for the label that shows on hover.
  assert.equal((html.match(/class="gh-day l\d" data-count="\d+" data-date="\d{4}-\d{2}-\d{2}"/g) ?? []).length, (html.match(/class="gh-day /g) ?? []).length);
  assert.match(html, /<div class="gh-grid" data-gh-grid data-locale="en-GB" data-none="No contributions on \{date\}" data-one="1 contribution on \{date\}" data-many="\{n\} contributions on \{date\}"/);
  assert.match(page("fr"), /data-locale="fr-FR" data-none="Aucune contribution le \{date\}"/);
  // After the side projects it proves, at the end of the page: no "Your product here" section.
  const at = (s) => html.indexOf(s);
  assert.ok(at('class="side"') < at('class="gh"'), "side projects, then the strip");
  assert.ok(!html.includes("Your product here") && !page("fr").includes("Votre produit ici"));
  assert.ok(at('class="work"') < at('class="gh"'), "the client work comes first");
  // Its own section with a heading, as Side projects and Track record. No key of the tints.
  assert.match(html, /<section class="gh" aria-labelledby="gh-title">\s*<h2 id="gh-title">Most days on GitHub<\/h2>/);
  assert.match(page("fr"), /<h2 id="gh-title">La plupart des jours sur GitHub<\/h2>/);
  assert.ok(!html.includes("gh-key"), "no key");
  // The foot has the total and the link to the profile.
  // The number has its own span, so the script can count it up while the grid fills in.
  assert.match(html, /<span class="gh-total"><span class="gh-n">[\d,]+<\/span> contributions in the last 12 months<\/span>/);
  assert.match(page("fr"), /<span class="gh-total"><span class="gh-n">[\d\u202f\u00a0 ]+<\/span> contributions/);
  assert.match(html, /querySelector\("\.gh-n"\)/);
  // The link looks like the email link in the hero: ink, a thin grey line, the ink line draws on hover.
  assert.match(html, /<a class="gh-link hero__ref" href="https:\/\/github\.com\/gautierlp" target="_blank" rel="noopener">View on GitHub/);
  assert.match(page("fr"), /class="gh-link hero__ref"[^>]*>Voir sur GitHub/);
});

test("every page has canonical, description, title and hreflang tags", () => {
  const pages = PAGES;
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
  const pages = PAGES;
  for (const p of pages) assert.ok(!page(p).includes("contra.com/p/"), p);
});

test("the old Carrd page is gone", () => {
  assert.ok(!exists("old"));
  assert.ok(!exists("demo"));
});

test("homepage hero: greeting, role in contrast, booking button and email", () => {
  const en = page("");
  assert.match(en, /<span class="hero__line">Hi, I&#39;m Gautier, a <\/span>/);
  assert.match(en, /<span class="hero__line"><span class="hero__role">Technical Product Manager<\/span>\.<\/span>/, "the role on its own line");
  assert.match(page("fr"), /<span class="hero__line">Bonjour, je suis Gautier, <\/span>/);
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

test("homepage hero: proof first, then the problem, then the offer, in both languages", () => {
  const en = page("");
  const hero = en.slice(en.indexOf('class="block hero"'), en.indexOf('class="hero__actions"'));
  const proof = hero.indexOf('From 2023 to 2026 I ran <a class="hero__ref" href="/clients/evaboot/">Evaboot</a>&#39;s app with over 200,000 users');
  const problem = hero.indexOf("You have a product that nobody owns end to end, or operations that still run on spreadsheets.");
  const offer = hero.indexOf("I take ownership of your product to create");
  assert.ok(proof > 0 && problem > proof && offer > problem, "proof, then problem, then offer");
  assert.ok(hero.includes("annual recurring revenue that grew from $1M to $2M."));
  assert.ok(hero.includes("internal tools for operations and recruitment teams, marketplaces, and other B2B SaaS."));
  assert.ok(hero.includes("I take ownership of your product to create what your users need. From their feedback and your data, I build it and ship it to production. One person accountable, alone or with your team."));
  // The count links to the list of apps it counts, in both languages.
  assert.ok(hero.includes('<a class="hero__ref" href="#track-record">a dozen other apps</a>'));
  assert.match(en, /<section class="block" id="track-record">\s*<h2>Track record<\/h2>/);
  assert.ok(hero.includes("<strong>I build with coding agents every day.</strong>"));
  // Cut on purpose during the 2026-10-01 review: too specific, jargon for the buyer, or a claim Gautier does not make.
  for (const gone of ["500", "MCP", "CLI", "no-code", "write the code", "agency", "over the years"]) assert.ok(!hero.includes(gone), `hero still says "${gone}"`);
  const fr = page("fr");
  const heroFr = fr.slice(fr.indexOf('class="block hero"'), fr.indexOf('class="hero__actions"'));
  assert.ok(heroFr.includes('<a class="hero__ref" href="/fr/clients/evaboot/">Evaboot</a>'));
  assert.ok(heroFr.includes("plus de 200\u00a0000 utilisateurs"));
  assert.ok(heroFr.includes("Votre produit n&#39;a pas de responsable clairement identifié"));
  assert.ok(heroFr.includes("Un seul interlocuteur, en autonomie ou intégré à votre équipe."));
  assert.ok(heroFr.includes('<a class="hero__ref" href="#track-record">une dizaine d&#39;autres projets</a>'));
  assert.match(fr, /<section class="block" id="track-record">/);
  assert.ok(heroFr.includes("<strong>Je pilote des agents IA au quotidien.</strong>"), "active verb: the agents are the tool, not the actor");
  for (const gone of ["500", "MCP", "CLI", "no-code"]) assert.ok(!heroFr.includes(gone), `French hero still says "${gone}"`);
});

test("homepage: side projects in a row that scrolls sideways, in both languages", () => {
  const en = page("");
  assert.match(en, /<h2 id="side-title">Side projects<\/h2>/);
  assert.ok(!en.includes("Personal projects"));
  assert.match(en, /<ul class="side__track" data-side-track/);
  // The open-source work, in this order. Each tile opens its GitHub page.
  const names = [...en.matchAll(/<span class="tile__copy"><strong>([^<]+)<\/strong>/g)].map((m) => m[1]);
  assert.deepEqual(names, ["Inbox Zero", "dormouse", "woodpecker", "magpie", "astro-agentation"]);
  const hrefs = [...en.matchAll(/<a class="tile" href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(hrefs, ["https://github.com/elie222/inbox-zero/pull/3993", "https://github.com/gautierlp/dormouse", "https://github.com/gautierlp/woodpecker", "https://github.com/gautierlp/magpie", "https://github.com/gautierlp/astro-agentation"]);
  assert.equal((en.match(/class="tile__arrow"/g) ?? []).length, 5);
  assert.ok(en.includes("12k+ GitHub stars"));
  for (const gone of ["Home server", "Finance app", "Jolt", "Session reviewer"]) assert.ok(!en.includes(`<strong>${gone}</strong>`), gone);
  assert.ok(en.indexOf("Track record") < en.indexOf("Side projects"));
  const fr = page("fr");
  assert.match(fr, /<h2 id="side-title">Projets perso<\/h2>/);
  assert.ok(fr.includes("<strong>woodpecker</strong>") && fr.includes("Un bot Telegram"));
});

test("homepage: the hero alone carries the call and the email, there is no closing call to action", () => {
  const en = page("");
  assert.ok(!en.includes("Need to build an app?"));
  assert.ok(!en.includes("A product nobody owns end to end?"));
  assert.ok(en.includes("Book call") && !en.includes("Book a 30-minute call"));
  assert.ok(en.includes("mailto:gautier@lepoher.co"));
});

test("booking links open the Cal.com popup and fall back to the booking page", () => {
  for (const html of [page(""), page("fr")]) {
    const booking = [...html.matchAll(/<a [^>]*data-booking[^>]*>/g)].map((m) => m[0]);
    assert.equal(booking.length, 1, "the hero pill");
    for (const a of booking) assert.match(a, /href="https:\/\/book\.lepoher\.co\/gautier\/30min"/);
    assert.ok(!html.includes("calendly.com"));
    assert.ok(html.includes("https://book.lepoher.co/embed/embed.js"), "embed loader");
  }
});

test("homepage: selected work cards for the three use-case stories, then the featured apps, in order", () => {
  const cards = [...page("").matchAll(/<a class="card"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(cards, WORK.map((s) => `/case-studies/${s}/`));
  const fr = [...page("fr").matchAll(/<a class="card"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(fr, WORK.map((s) => `/fr/case-studies/${s}/`));
});

test("marketing site migration: the new site is the picture, on its card and as the page cover", () => {
  assert.match(page(""), /<a class="card"[^>]*href="\/case-studies\/marketing-site-migration\/"[\s\S]*?<img src="\/assets\/projects\/evaboot\/marketing-site\.webp"/);
  assert.ok(page("case-studies/marketing-site-migration").includes("/assets/projects/evaboot/marketing-site.webp"));
});

test("homepage: work cards carry an illustration, a light layer, and the carousel script, without sound or haptics", () => {
  const html = page("");
  assert.equal((html.match(/class="card__media"[^>]*>\s*<img src="\/assets\/[^"]+"/g) ?? []).length, WORK.length);
  assert.equal((html.match(/class="card__shine"/g) ?? []).length, WORK.length);
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
  const pages = PAGES;
  const banned = [/billing defect/i, /security vulnerabilit/i, /exposed to security/i, /\bIndra\b/, /\bRenault\b/, /Open item/, /segment B/i, /Gautier is not sure/];
  for (const p of pages) for (const re of banned) assert.doesNotMatch(page(p), re, `${p}: ${re}`);
});

test("use cases: written for the buyer, with the result number in the title", () => {
  for (const slug of STORIES) {
    const html = page(`case-studies/${slug}`);
    assert.ok(!html.includes("What this proves"), slug);
    assert.ok(html.includes("What you get"), slug);
    assert.match(html.match(/<h1>(.*?)<\/h1>/)[1], /\d/, `${slug} title has a number`);
  }
  const exit = page("case-studies/no-code-exit");
  assert.match(exit.match(/<h1>(.*?)<\/h1>/)[1], /200,000 users/);
  assert.match(exit, /about 200,000 users at the time of the migration/);
});

test("no-code exit: the course's case study shape, in plain words", () => {
  const exit = page("case-studies/no-code-exit");
  const title = exit.match(/<h1>(.*?)<\/h1>/)[1];
  assert.match(title, /in two months/, "the result comes with its duration");
  assert.match(exit, /What I learned/, "a section on what went wrong and what was learned");
  assert.match(exit, /<strong>Before\.<\/strong>/);
  assert.match(exit, /<strong>After\.<\/strong>/);
  assert.match(exit, /coding agents/, "says who wrote the code");
  for (const jargon of [/delta-sync/i, /cursors/i, /run log/i, /fill rate/i, /500 features/]) assert.doesNotMatch(exit, jargon);
});

test("use cases: the label shows the name and the period, not the client type the intro already gives", () => {
  assert.match(page("case-studies/no-code-exit"), /<p class="cs__label">The no-code exit · April to May 2026<\/p>/);
  for (const slug of STORIES) assert.doesNotMatch(page(`case-studies/${slug}`), /class="cs__label">[^<]*lead extraction/, slug);
  // An app page keeps the client, often the only place that says who the client was.
  assert.match(page("case-studies/battery-recycling"), /class="cs__label">.*A subsidiary of a large French automotive group/);
});

test("homepage: the Evaboot quote still under review stays off the homepage", () => {
  const html = page("");
  assert.ok(!html.includes("future Bubble"));
});

test("homepage: no AI section", () => {
  assert.ok(!page("").includes("The AI I build"));
  assert.ok(!page("fr").includes("L'IA que je fais"));
});

test("no emoji, no em dash, no filler words, no invented product names on any page", () => {
  const pages = PAGES;
  const banned = [/\p{Extended_Pictographic}/u, /—/, /seamless/i, /robust/i, /spearhead/i, /leverag/i, /Eco'?Insight/i, /Eco'?link/i, /Fleetnova/i, /Over the course of a year/, /I have achieved by/];
  for (const p of pages) {
    const text = page(p).replace(/<script[\s\S]*?<\/script>/g, "");
    for (const re of banned) assert.doesNotMatch(text, re, `${p}: ${re}`);
  }
});

test("NDA apps: no link underline under the blurred name in the track record", () => {
  assert.match(cssText(), /\.record__main a:has\(\.nda\)\{text-decoration:none\}/);
});

test("NDA apps: placeholder name blurred, with an NDA label, on the list and the page", () => {
  const home = page("");
  assert.equal((home.match(/class="nda"/g) ?? []).length, 3);
  for (const slug of ["parts-marketplace", "dealership-onboarding", "battery-recycling"]) {
    assert.match(page(`case-studies/${slug}`), /<p class="cs__label"><span class="nda">[^<]+<\/span> <span class="nda-label">NDA signed<\/span>/, slug);
    assert.match(page(`fr/case-studies/${slug}`), /<span class="nda-label">NDA signé<\/span>/, `fr/${slug}`);
  }
  for (const p of PAGES) {
    assert.ok(!page(p).includes("name changed") && !page(p).includes("nom modifié"), p);
  }
});

test("no Google Analytics, no cookie: the privacy page names Cloudflare Web Analytics", () => {
  for (const p of PAGES) assert.doesNotMatch(page(p), /googletagmanager|gtag\(/, p);
  assert.match(page("privacy"), /Cloudflare Web Analytics/);
  assert.match(page("privacy"), /no cookies/);
  assert.match(page("fr/privacy"), /aucun cookie/);
  for (const p of ["privacy", "fr/privacy"]) assert.doesNotMatch(page(p), /Google Analytics/, p);
});

test("Camarage: the launch and the payments, only claims the sources support", () => {
  const html = page("case-studies/camarage");
  assert.match(html, /Stripe/);
  assert.match(html, /Qonto/);
  // Not in the sources (2026-10-01 review): no user count of 1,000, the team kept a developer one day a week.
  for (const claim of ["1,000", "without a developer", "from code to Bubble", "custom-coded"]) assert.ok(!html.includes(claim), claim);
});

test("Clean Car: no 10 days claim, the build took 17 days and the stores came later", () => {
  const html = page("case-studies/clean-car");
  assert.ok(!/10 days/.test(html), "10 days");
  assert.match(html, /17 days/);
  assert.ok(!html.includes("transport"), "no vehicle type the sources do not show");
});

test("Folderly: no quote from a third party about another product", () => {
  assert.ok(!page("case-studies/folderly").includes("Belkins"));
});

test("links are ink with a grey underline: the Carrd blue is gone from the built site", () => {
  const files = readdirSync(join(DIST, "_astro")).filter((f) => f.endsWith(".css"));
  assert.ok(files.length > 0);
  const css = files.map((f) => readFileSync(join(DIST, "_astro", f), "utf8")).join("\n");
  assert.ok(!css.includes("2300ff"));
  assert.ok(!page("").includes("2300ff"));
  assert.match(css, /a\{color:var\(--ink\);text-decoration:underline;text-decoration-color:var\(--underline\)/);
});

test("side projects: each icon is the project's own logo, served from the site", () => {
  const html = page("");
  const icons = [...html.matchAll(/<img class="tile__icon" src="([^"]+)" alt=""/g)].map((m) => m[1]);
  assert.equal(icons.length, 5);
  for (const src of icons) assert.ok(existsSync(join(DIST, src)), src);
  assert.ok(!html.includes('<svg class="tile__icon"'));
});

test("GitHub graph: the five tints are clearly apart, from the empty day to the busiest", () => {
  const css = readdirSync(join(DIST, "_astro")).filter((f) => f.endsWith(".css")).map((f) => readFileSync(join(DIST, "_astro", f), "utf8")).join("\n");
  const hex = (sel) => {
    const m = css.match(new RegExp(`(?:^|[}\\s])${sel.replace(/\./g, "\\.")}\\{[^}]*?background:(#[0-9a-f]{3,6}|var\\(--accent\\))`));
    assert.ok(m, sel);
    const v = m[1] === "var(--accent)" ? css.match(/--accent:(#[0-9a-f]{3,6})/)[1] : m[1];
    const full = v.length === 4 ? v.slice(1).split("").map((c) => c + c).join("") : v.slice(1);
    return parseInt(full.slice(0, 2), 16); // grey: one channel is the lightness
  };
  const tints = [hex(".gh-day"), hex(".gh-day.l1"), hex(".gh-day.l2"), hex(".gh-day.l3"), hex(".gh-day.l4")];
  for (let i = 1; i < tints.length; i++) assert.ok(tints[i - 1] - tints[i] >= 35, `tint ${i}: ${tints[i - 1]} to ${tints[i]}`);
});

test("GitHub graph: the tints fill in from empty, the busiest days last, never under reduced motion", { skip: !process.env.GITHUB_TOKEN }, () => {
  const css = cssText();
  assert.ok(!/\.gh-body\{[^}]*(?:100vw|56rem)/.test(css), "the grid stays in the text column, as wide as the text");
  assert.match(css, /\.gh-body\.gh-wait \.gh-day\{background-color:#e{3,6}\}/);
  assert.match(css, /\.gh-body\.gh-play \.gh-day\{animation:gh-heat [^;}]*var\(--lv/);
  assert.match(css, /\.gh-n\{font-variant-numeric:tabular-nums\}/);
  assert.match(css, /@keyframes gh-heat\{(?:from|0%)\{background-color:#e{3,6}\}\}/);
  const html = page("");
  assert.match(html, /if \(!reduced && "IntersectionObserver" in window\)/);
  assert.ok(!html.includes("data-gh-anim") && !html.includes('get("gh")'), "the trial switch is gone");
});

test("reviews: no fake, off-topic or Bubble-centred review on the site", () => {
  for (const p of ["", "fr", "reviews", "fr/reviews"]) {
    const html = page(p);
    for (const gone of ["Clara Ananou", "Xano", "promotional videos", "vidéos promotionnelles", "implement an API on our website", "Gautier showed his expertise", "a démontré son expertise", "Gautier’s work with Bubble"]) assert.ok(!html.includes(gone), `${p}: ${gone}`);
    const quotes = [...html.matchAll(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g)].map((m) => m[1]).join("\n");
    assert.ok(!/Bubble/.test(quotes), `${p}: no review names Bubble`);
  }
});

test("case study: Evaboot names the founders together, the CRM integrations, and no growth disclaimer", () => {
  const en = page("case-studies/evaboot"), fr = page("fr/case-studies/evaboot");
  assert.ok(en.includes("They still built the app themselves") && fr.includes("Ils construisaient encore l’app eux-mêmes"));
  assert.ok(en.includes("HubSpot, Clay and Apollo") && fr.includes("HubSpot, Clay et Apollo"));
  for (const gone of ["One of them, JB", "I do not claim that growth", "L’un d’eux, JB", "Je ne revendique pas"]) assert.ok(!en.includes(gone) && !fr.includes(gone), gone);
});

test("stories: credit for the stack, months not days, the cut-over as steps, no leftover caveats", () => {
  const m = page("case-studies/marketing-site-migration"), mf = page("fr/case-studies/marketing-site-migration");
  assert.ok(m.includes("I recommended the new stack") && mf.includes("J’ai recommandé la nouvelle stack"));
  for (const day of ["27 February", "3 March", "13 March", "25 March", "27 février", "3 mars", "13 mars", "25 mars"]) assert.ok(!m.includes(day) && !mf.includes(day), day);
  assert.match(m, /step by step \(March 2026\):\s*<ol>\s*<li>/);
  assert.match(mf, /pas à pas \(mars 2026\)\s*:\s*<ol>\s*<li>/);
  assert.ok(!m.includes("open item") && !mf.includes("resté ouvert"));
  const i = page("case-studies/interfaces-on-a-new-stack"), f = page("fr/case-studies/interfaces-on-a-new-stack");
  assert.ok(!i.includes("four times") && !f.includes("quatre fois"));
  assert.ok(!i.includes("35 of 36") && !f.includes("35 outils"));
  for (const p of ["case-studies/evaboot", "fr/case-studies/evaboot", "clients/evaboot", "fr/clients/evaboot"]) assert.ok(!/Bubble app alone|tenu seul/.test(page(p)), p);
});

test("homepage: no review pile while fewer than six reviews are on it", () => {
  for (const path of ["", "fr"]) {
    const html = page(path);
    assert.ok(!html.includes('<ol class="pile"') && !html.includes('id="reviews-title"'), path);
    assert.ok(!html.includes('<blockquote class="quote">'), `${path}: the single quote is gone`);
  }
});

test("reviews page: a French review shows its translation and a label in English, the original in French", () => {
  const en = page("reviews");
  assert.ok(en.includes("double hat of PO and no-code developer"));
  assert.ok(!en.includes("double casque"));
  const fr = page("fr/reviews");
  assert.ok(fr.includes("Cette double casque de PO et de dev nocode"));
  assert.ok(fr.includes("He helped scale our app to $200k MRR"), "an English review stays in English");
  for (const p of ["", "reviews", "case-studies/disko-leads", "fr/case-studies/disko-leads"]) assert.doesNotMatch(page(p), /\$3k|3k \$|3 000 \$|\$3,000/, p);
});

test("reviews page: every review in full, newest first", () => {
  for (const path of ["reviews", "fr/reviews"]) {
    const html = page(path);
    assert.equal((html.match(/<article class="review"/g) ?? []).length, 5, path);
    const years = [...html.matchAll(/<span class="review__source">(?:Malt|Contra), (\d{4})<\/span>/g)].map((m) => Number(m[1]));
    assert.equal(years.length, 5, path);
    assert.deepEqual(years, [...years].sort((a, b) => b - a), `${path}: newest first`);
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

test("case study: content shows when printing and when the page script fails", () => {
  const css = cssText();
  assert.match(css, /@media print\{\.js \.cs \[data-r\],\.js \.cs__body>\*\{[^}]*opacity:1/);
  assert.match(css, /@keyframes cs-show\{/);
  assert.match(css, /html\.js:not\(\.cs-ready\) \.cs \[data-r\],html\.js:not\(\.cs-ready\) \.cs__body>\*\{[^}]*animation:[^;}]*cs-show/);
});

test("case study: a French route falls back to English", () => {
  const html = page("fr/case-studies/price-writers");
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/lepoher\.co\/case-studies\/price-writers\/"/);
});

test("case studies: a number in the title and the four STAR labels in order", () => {
  const STAR = ["Situation", "Task", "Actions", "Results"];
  for (const slug of CASE_STUDIES.filter((s) => !EMPTY.includes(s))) {
    const html = page(`case-studies/${slug}`);
    assert.match(html.match(/<h1>(.*?)<\/h1>/)[1], /\d/, `${slug}: number in the title`);
    const labels = [...html.matchAll(/<span class="cs-label">([^<]+)<\/span>/g)].map((m) => m[1]).filter((l) => STAR.includes(l));
    assert.deepEqual(labels, STAR, slug);
  }
});

test("case study: a back link above the title returns to the list the story comes from", () => {
  assert.match(page(""), /<section class="work" id="work"/);
  assert.match(page("case-studies/no-code-exit"), /<a class="cs__back" href="\/#work">← Selected work<\/a>/);
  assert.match(page("fr/case-studies/no-code-exit"), /<a class="cs__back" href="\/fr\/#work">← Projets phares<\/a>/);
  assert.match(page("case-studies/camarage"), /<a class="cs__back" href="\/#track-record">← Track record<\/a>/);
  const html = page("case-studies/no-code-exit");
  assert.ok(html.indexOf('class="cs__back"') < html.indexOf("<h1>"), "above the title");
});

test("case study: a card at the bottom leads to the next story of the same list, and the last one wraps", () => {
  const next = (slug) => page(slug).match(/<a class="cs__next" href="([^"]+)"[^>]*>[\s\S]*?<strong[^>]*>([^<]+)<\/strong>/)?.slice(1);
  assert.deepEqual(next("case-studies/no-code-exit"), ["/case-studies/interfaces-on-a-new-stack/", "The API, the CLI and the MCP server"]);
  assert.deepEqual(next("case-studies/marketing-site-migration"), ["/case-studies/no-code-exit/", "The no-code exit"], "the last use case wraps to the first");
  assert.deepEqual(next("case-studies/evaboot"), ["/case-studies/pachamama/", "Pachamama"], "apps follow the Track record order");
  assert.deepEqual(next("case-studies/domeet"), ["/case-studies/evaboot/", "Evaboot"], "the last app wraps to the first");
  assert.equal(next("case-studies/camarage")?.[0], "/case-studies/dealership-onboarding/");
  assert.match(page("case-studies/no-code-exit"), /<small>Next<\/small>/);
  assert.match(page("fr/case-studies/no-code-exit"), /<a class="cs__next" href="\/fr\/case-studies\/interfaces-on-a-new-stack\/"[\s\S]*?<small>Suivant<\/small>/);
});

// Design notes copied from pedromarques.me: one font, 64px between sections. The 586px column felt too tight, so the 40rem one is back.
test("design: one font family, Inter, and no second font download", () => {
  const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");
  assert.ok(!layout.includes("JetBrains"), "the code font is not used on any page");
  assert.ok(!css.includes("--font-code"));
});

test("design: the column is 40rem wide, margins included", () => {
  const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
  assert.match(css, /--column: 40rem;/);
});

test("design: 64px between the sections of a page", () => {
  const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
  assert.match(css, /^main > \* \+ \* \{ margin-top: 4rem; \}/m);
  assert.match(css, /^\.page \.block \{ margin-top: 4rem; \}/m);
});


test("privacy page: in both languages, names what the site collects, and every page links to it", () => {
  for (const [path, heading] of [["privacy", "Privacy"], ["fr/privacy", "Confidentialité"]]) {
    const html = page(path);
    assert.match(html, new RegExp(`<h1>${heading}`), path);
    for (const fact of ["Cloudflare Web Analytics", "book.lepoher.co", "Google Calendar", "gautier@lepoher.co"]) assert.ok(html.includes(fact), `${path}: ${fact}`);
  }
  for (const p of PAGES) assert.ok(links(page(p)).includes(p.startsWith("fr") ? "/fr/privacy/" : "/privacy/"), p);
});

test("legal notice: the publisher's legal identity and the host, linked from every page", () => {
  for (const [path, heading] of [["legal", "Legal notice"], ["fr/legal", "Mentions légales"]]) {
    const html = page(path);
    assert.match(html, new RegExp(`<h1>${heading}`), path);
    for (const fact of ["Gautier Le Poher", "824 922 363 00034", "FR87824922363", "Cloudflare, Inc.", "gautier@lepoher.co"]) assert.ok(html.includes(fact), `${path}: ${fact}`);
  }
  for (const p of PAGES) assert.ok(links(page(p)).includes(p.startsWith("fr") ? "/fr/legal/" : "/legal/"), p);
});

test("case study: Clean Car links to both app stores", () => {
  const hrefs = links(page("case-studies/clean-car"));
  assert.ok(hrefs.some((h) => h.startsWith("https://apps.apple.com/")));
  assert.ok(hrefs.some((h) => h.startsWith("https://play.google.com/")));
});

test("the review toolbar stays on the dev server: no page or asset ships Agentation or React", () => {
  // The Side projects row names the astro-agentation repo on purpose: check every page without it.
  const withoutSide = (html) => html.replace(/<section class="side"[\s\S]*?<\/section>/, "");
  for (const p of PAGES) assert.doesNotMatch(withoutSide(page(p)), /agentation|react|data-insp-path/i, p);
  assert.doesNotMatch(page(""), /<script[^>]*agentation|data-insp-path/i);
  for (const f of readdirSync(join(DIST, "_astro"))) assert.doesNotMatch(readFileSync(join(DIST, "_astro", f), "utf8"), /agentation|react-dom/i, f);
});
