# Design test: text-only, after plud.net

Branch `feat/design-plud`. The content, the routes, the UI strings and the tests did not change. Only the look did.

plud.net itself now shows image cards under "Selected work", so I followed the text-only rules of the brief, not the live page.

## Screenshots

Taken from the built `dist/` (no dev toolbar), full page.

| | 1280px | 390px |
| --- | --- | --- |
| Homepage | [home-1280.png](design-plud/home-1280.png) | [home-390.png](design-plud/home-390.png) |
| Evaboot project page | [project-1280.png](design-plud/project-1280.png) | [project-390.png](design-plud/project-390.png) |

At 390px, `document.documentElement.scrollWidth` is 390 on both pages, so there is no horizontal scroll. The GitHub graph is wider than a phone and scrolls inside its own row, as before.

## What changed, per file

- `src/styles/global.css`: rewritten. One 640px column (`--column: 40rem`) centred on a white page, 16px gutter. Inter for all text, JetBrains Mono only for `ship()` and `git log`. Near-black text, one grey (`--muted`), `#2300ff` kept as the only accent and used for links and the graph. Headings are 17px, weight 600; the headline and page titles are 22px. The Carrd frame, the pill buttons, the rounded image borders and the dark page background are gone. One special rule: the Contra imports of Evaboot, Disko Leads and Folderly open with an 800px reviewer photo alone in a paragraph, which looked huge at column width, so a CSS rule shows it as a 48px circle. The Markdown files are untouched.
- `src/layouts/BaseLayout.astro`: header is the name (link home) on the left and FR/EN on the right. The three icons moved to a new footer as text links (LinkedIn, Malt, Contra) plus the e-mail. The floating back-to-top button is removed: the pages are short and plud.net has none. The `nav.top` string stays in `ui.ts`. The font link loads Inter 400/500/600 and JetBrains Mono instead of Overpass, Fira Sans and Inter 300.
- `src/components/PlainList.astro`: new. One link per line, an optional grey note after the name, an optional grey summary under it.
- `src/components/HomePage.astro`: order is now hero, all 11 projects (PlainList, result and label in grey when they exist), GitHub graph, the 4 use cases (PlainList with summaries), call to action. FeaturedCase, LogoGrid and NumberList are no longer used anywhere but the files stay.
- `src/components/Hero.astro`: no avatar, no buttons. The headline, the second line, then one text line: "Book call or email me gautier@lepoher.co". I did not add the name as a separate small line above the headline, because the header already shows it one line higher and it read as a duplicate.
- `src/components/CallToAction.astro`: heading plus one line with the Calendly link and the e-mail.
- `src/components/GitHubGraph.astro`: only the wrapper class changed. Cells are 8px (were 10px).
- `src/components/ProjectPage.astro`, `UseCasePage.astro`: same markup order, plain heading block (name, result, client in grey), links as text, images at column width with no frame, the quote with a thin left rule, related lists through PlainList.
- `src/components/Media.astro`: wrapper class `frame` renamed `media` (no border any more).

## Tests

`GITHUB_TOKEN=$(gh auth token) npm test`: 6 of 6 unit tests pass, 19 of 19 site tests pass, before and after the change. No test was edited.

## To compare

Current design: `npx astro dev` in the main checkout. This one: the same command in `~/.superset/worktrees/website/feat/design-plud`.
