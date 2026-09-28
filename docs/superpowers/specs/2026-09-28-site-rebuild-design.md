# Site rebuild: Astro components, client pages, use-case pages

Date: 2026-09-28. Status: design agreed in conversation on 2026-09-25 and 2026-09-28.

## Goal

Rebuild lepoher.co as Astro components with the same look as the current Carrd page,
then replace every Contra case-study link with a page on the site. Two page types are
added: one page per project (11) and one page per use case (4). All pages follow the
homepage design for now. This allows a faster setup, and it can change later.

The purpose of the website:

- Someone who wants to know what I am worth at a glance. They open the site, in French
  or in English according to the URL, and see who I am and what I do in a few seconds.
  Then they see that I have owned products as PO, PM and developer, and that some of
  those were large: a large user base, large revenue, internal apps for large groups.
  The purpose is that a potential client is impressed and trusts me.
- Someone who wants to go deep into one use case. That is why each use case is a
  dedicated page. These pages will not be the most viewed, but they must exist.
- For me, a permanent memory of everything I have worked on, as detailed as possible.
  That lives on the project pages: one page per project, with everything
  non-confidential I did on it.
- For me, a way to force myself to state my value proposition. The portfolio should
  mirror my own mental model of how to present myself to a prospect or a client, so
  that they know at once how I can help them and how I can prove it. It is made for
  my ideal customer profile (ICP).

## Decisions already taken

- Keep the current lepoher.co look (the Carrd design). The mockups made during the
  brainstorm stay in `design-explorations/` (ignored by git) as reference only.
- Content lives in Astro content collections: one Markdown file per project and per use
  case, per language. One component per page type reads the files.
- Project pages: all 11 apps from the homepage logo grid. The 8 projects with a Contra
  story get their text from Contra, imported by a script. The 3 others get a placeholder.
  A project has one client, and a client can have several projects (Fleetnova,
  Eco'Insight and Eco'link belong to the same industrial group). A client page is not built now; the
  `client` field on each project makes it possible later.
- Use-case pages: the 4 drafts in the freelance repository
  (`~/projects/personal/freelance/docs/case-studies/0[1-4]-*.md`).
- Gautier decides per project which client name shows. No anonymisation rule in the site code.
- The build order is: homepage as components, Contra import, project and use-case pages.
- French and English routes exist from day one. The French texts come later (section 8).
- Three additions from reference sites: a number column on lists, a GitHub contribution
  graph, and a code-font verb in the headline (see sections 5 to 7).
- The Carrd quote form posted to Carrd's own backend. It is replaced by the "Book call" button and the e-mail link in the call to action.

## 1. Routes and content

Routes:

- `/` the homepage
- `/projects/<slug>/` 11 pages, and `/fr/projects/<slug>/`
- `/use-cases/<slug>/` 4 pages, and `/fr/use-cases/<slug>/`
- `/fr/` the homepage in French

Collections, defined in `src/content.config.ts` with a schema (a schema is the list of
header fields and their types, checked at build):

`src/content/projects/<lang>/<slug>.md`

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | Display name of the project, for example "Disko Leads" |
| `client` | string | The client name to show. Same string on projects of the same client |
| `logo` | string or empty | Path under `/assets/images/`. Empty for Fleetnova, Eco'Insight and Eco'link: the Carrd page shows a generic icon for them, not a logo. The grid shows the name in text instead |
| `summary` | string | One line, shown in lists |
| `result` | string or empty | The number, for example "$1M to $2M+" |
| `resultLabel` | string or empty | For example "ARR" |
| `links` | list of `{label, url}` | Website, Product Hunt, and so on |
| `useCases` | list of use-case slugs | Can be empty |
| `featured` | boolean | True for Evaboot, Folderly, Disko Leads |
| `order` | number | Order in the logo grid and lists |
| `status` | `live` or `draft` | See "Draft status" below |
| `images` | list of `{src, alt}` | Screenshots for the page |
| `quote` | `{text, who, role}` or empty | The client review |

Body: the story in Markdown. For the 8 Contra projects, the sections of the Contra
page (introduction, problem, solution, implementation, results) as headings.

`src/content/use-cases/<lang>/<slug>.md`

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | Short title, for example "The no-code exit" |
| `title` | string | The result-number title from the draft |
| `summary` | string | One line |
| `result` | string | The number for the number column, for example "200k" |
| `resultLabel` | string | For example "users migrated, no downtime" |
| `projects` | list of project slugs | Can be empty |
| `order` | number | |
| `status` | `live` or `draft` | All 4 start as draft, because the texts wait for client approval |

Body: the draft text (situation, task, actions, results, what this proves).

Draft status. A page with `status: draft` still builds and is linked. It shows a
grey note above the body. If the body is empty, the note reads "Text to come". If the
body has text, the note reads "Draft. Waits for the client's approval." Draft pages
carry `<meta name="robots" content="noindex">`.

The 4 use cases and their slugs: `no-code-exit`, `interfaces-on-a-new-stack`,
`marketing-site-migration`, `internal-applications`.

The 11 projects, in the order of the current logo grid: Evaboot, Disko Leads, Folderly,
Fleetnova, Camarage, Eco'Insight, Eco'link, Clean Car, Price Writers, BETC, Protech.
Slugs are the lowercase name with hyphens and no apostrophe (`disko-leads`,
`eco-insight`, `eco-link`, `clean-car`, `price-writers`). The names Trailforks, Ream
and Simplex in the Carrd markup are the names of generic icons, not projects.

Contra stories and the project they belong to:

| Contra id | Project |
| --- | --- |
| `sllAZU3M` scaling Evaboot | Evaboot |
| `rMAU733P` Folderly's app | Folderly |
| `7XZENP72` Chrome extension | Disko Leads |
| `QEkXbAbv` marketplace for auto parts | Fleetnova |
| `eZU2FPM7` multi-actor recycling | Eco'link |
| `MmEbmmlR` dealership onboarding | Eco'Insight |
| `m26vFMLv` migrating a 1000-user app to Bubble | Camarage |
| `l3XmWqBY` app on App Store and Google Play | Clean Car |

Source: the link on each logo of the Carrd grid, read on 2026-09-28.

## 2. Components and styles

Files under `src/`:

- `layouts/BaseLayout.astro`: head tags (title, description, Open Graph, canonical,
  `hreflang` links, fonts, favicon, analytics), the header with the name, the 3 social
  links and the language switch, the footer, the back-to-top button. Props: `title`,
  `description`, `canonical`, `lang`.
- `components/Hero.astro`: photo, headline (section 7), intro line, "Book call"
  button, e-mail link.
- `components/GitHubGraph.astro`: section 6.
- `components/FeaturedCase.astro`: one featured project, in the current Carrd layout
  (name, result, buttons, 4 paragraphs with screenshots, review). Props: a project entry.
- `components/NumberList.astro`: a list with the number column (section 5). Props: a
  list of `{result, resultLabel, name, summary, href}`.
- `components/LogoGrid.astro`: the 11 projects, each a link to its project page. A logo image when the project has one, the name in text otherwise.
- `components/CallToAction.astro`: "Need to build an app? Ask for a quote".
- `pages/index.astro` and `pages/fr/index.astro`: Hero, GitHubGraph, the 3 featured
  projects, a "Use cases" NumberList, LogoGrid, CallToAction.
- `pages/projects/[slug].astro` and `pages/fr/projects/[slug].astro`: BaseLayout, the
  project name and result as the page title, the client name, the story body, the
  screenshots, the quote, the links, and a NumberList of its use cases.
- `pages/use-cases/[slug].astro` and `pages/fr/use-cases/[slug].astro`: BaseLayout,
  the title, the body, and a NumberList of its projects.
- `styles/global.css`: one file that copies the Carrd look: fonts Overpass (headings),
  Fira Sans and Inter (text), the colors, the sizes and the distances, the rounded
  panel on a dark grey page background, the breakpoints for phone width. Values come
  from `src/carrd/styles.css`; the implementer reads them there, then deletes the file.

Deleted at the end: `src/carrd/` (styles.css, body.html, main.js) and the raw imports
in `index.astro`.

The video of the Evaboot user dashboard (`public/assets/videos/video01.mp4`) stays,
as an image in the Evaboot featured case, as today.

## 3. Contra import

`scripts/import-contra.py`, run once by hand, kept in the repository:

1. Fetch the 8 Contra pages (plain HTTPS requests, no login).
2. Extract the title, the sections and the paragraphs into Markdown, with the section
   headings kept.
3. Download the images (`media.contra.com` URLs, the largest variant) into
   `public/assets/projects/<slug>/` and rewrite the paths.
4. Write `src/content/projects/<lang>/<slug>.md` with the header fields filled from the page
   (name, summary from the introduction, images) and `status: live`. Fields that the
   page does not give (result, links, useCases, featured, order, quote) come from a
   small table inside the script, taken from the Carrd page.
5. For the 3 projects without a story (Price Writers, BETC, Protech), write a file with `status: draft`, the name,
   the logo, the order, and an empty body.

The script is idempotent: a second run overwrites the same files.

After the import, no `contra.com/p/` link remains in `src/`. The Contra profile link
(`contra.com/gautierlp`) in the header stays.

## 4. Tests and deploy

- `npm run build` passes with zero warnings from the content schema.
- A test file, `tests/site.test.mjs`, run with `node --test` on the built `dist/`:
  - 11 project pages and 4 use-case pages exist as `index.html`, in English and under
    `/fr/`.
  - No `contra.com/p/` string in any built page.
  - Every item in the homepage grid (11) links to a path that exists in `dist/`.
  - Every project page links back to `/` and every use-case link on it exists.
  - Every English page links to its `/fr/` twin, and the twin links back.
  - The homepage contains the GitHub graph with 53 week columns.
- `npm test` runs the build then the test file.
- Deploy does not change: a push to `main` builds on Cloudflare Workers. One new build
  secret, `GITHUB_TOKEN`, for section 6.

## 5. Number column

From creativeatishay.in. A list item has three parts: the result on the left in the
site blue (`#2300ff`), the label under it in small grey type, and the name plus
summary on the right. Used for the "Use cases" list on the homepage, the use-case list
on a project page, and the project list on a use-case page. An item with no result shows
the name only, aligned with the others. The 3 featured cases keep the Carrd layout.

## 6. GitHub graph

From creativeatishay.in, verified in the demo page on 2026-09-25. At build time,
`GitHubGraph.astro` fetches the contribution calendar of `gautierlp` for the last 12
months from the GitHub GraphQL API, with the token in the `GITHUB_TOKEN` environment
variable. The token belongs to Gautier, so private contributions are included (4,240
of 4,244 in the year to 2026-09-25). The component renders a 53-column, 7-row grid of
10 px cells, 5 tints of the site blue by count (0, 1, 4, 10, 20 and more), a title
"git log · last 12 months" with the command in the code font, and a caption with the
total and a link to the GitHub profile. No script on the page. The graph refreshes on
each deploy only.

If `GITHUB_TOKEN` is absent, the build still passes and the section is not rendered.
The build logs one warning. The demo page and `src/data/github-calendar.json` are
deleted; the component fetches live.

## 7. Headline device

From clintbalcom.com, verified in the demo page. The hero headline is "I take over
your product and `ship()` it myself." The verb `ship()` is in JetBrains Mono, weight
400, in the site blue; the rest of the line keeps Overpass 300. The second line is
"Product owner and developer, in one person. Paris, France." The meta description
becomes "I take over your product and ship it myself."

The freelance positioning file says it is the canonical source of the copy, and it
carries a different hero line. Gautier updates that file when this headline goes live.
The site does not read that file.

## 8. Two languages

Astro's built-in i18n routing: `defaultLocale: "en"`, `locales: ["en", "fr"]`, no
prefix for English, `/fr/` prefix for French. Content is one file per language:
`src/content/projects/en/<slug>.md` and `src/content/projects/fr/<slug>.md`, the
same for use cases. When the French file is missing, the French page renders the
English file, with `lang="en"` on the page, so no `/fr/` link is dead. The UI strings
(buttons, section titles, the draft note) live in `src/i18n/ui.ts`, one object per
language, and the French strings are written in this build. Each page carries
`hreflang` links to its twin. The header has a small "FR / EN" switch that keeps the
current path.

The French texts of the projects and use cases are a later step.

## Out of scope

- A redesign. The look stays.
- A CMS.
- Approval of the 4 use-case drafts by the clients. They ship as `draft` until
  Gautier flips the status.
- Text for the 3 projects with no Contra story.
- The French texts of the projects and use cases.
- A client page that lists the projects of one client.
- A scheduled rebuild to refresh the GitHub graph between pushes.
