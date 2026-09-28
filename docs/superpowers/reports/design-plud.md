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
- `src/components/HomePage.astro`: order is now hero, the use-case cards, all 11 projects (PlainList, result and label in grey when they exist), GitHub graph, call to action. FeaturedCase, LogoGrid and NumberList are no longer used anywhere but the files stay.
- `src/components/Hero.astro`: rebuilt on the plud.net hero after review. A two-line headline ("Hi, I'm Gautier Le Poher, a Technical Product Manager." then "I take over your product and ship() it myself."), each word of the role underlined with a hand-drawn stroke (yellow, pink, green), two grey paragraphs with the last sentence in bold, then a black "Book call" pill, a small photo above the headline, and a green "Available for new projects" dot. The paragraphs are the lepoher.co hero text from `positioning.md` in the `freelance` repository; the bold sentence and the French version are new and need a read. The old `hero.line2.*` and `hero.email` strings are gone from `ui.ts`, replaced by `hero.hi`, `hero.role`, `hero.p1`, `hero.p2`, `hero.p2.strong` and `hero.available`.
- `src/components/WorkCarousel.astro`: new, after review, on the plud.net "Selected work" row. The four use cases (not the clients) as cards in a row wider than the column that scrolls sideways and snaps to each card. Each card shows the use case's result as a large number with its label at the top, and the name and summary at the bottom, on one of four tones (black, the accent blue, light grey, orange). The height fits the text, with a minimum. No script: the row scrolls with a trackpad, shift and the wheel, a finger, or the Tab key. The "Use cases" plain list is gone from the homepage because the cards replace it; the list of all 11 apps stays. New string: `section.selectedWork` ("Selected work", "Projets phares"). All four use cases are still drafts, and their pages say so.
- `public/assets/images/avatar.jpg`: new, a square crop of `image01.jpg` without the Bubble badge. The hero shows it as a 56px circle above the headline. `image01.jpg` is unchanged.
- `src/components/CallToAction.astro`: heading plus one line with the Calendly link and the e-mail.
- `src/components/GitHubGraph.astro`: only the wrapper class changed. Cells are 8px (were 10px).
- `src/components/ProjectPage.astro`, `UseCasePage.astro`: same markup order, plain heading block (name, result, client in grey), links as text, images at column width with no frame, the quote with a thin left rule, related lists through PlainList.
- `src/components/Media.astro`: wrapper class `frame` renamed `media` (no border any more).

## Tests

`GITHUB_TOKEN=$(gh auth token) npm test`: 6 of 6 unit tests pass and 19 of 19 site tests pass before the change. After it, 6 of 6 and 22 of 22: three tests were added, for the new hero (greeting, three marked words, availability line, booking button, French availability line), for the photo, and for the four use-case cards and their order in English and French. No existing test was edited.

## To compare

Current design: `npx astro dev` in the main checkout. This one: the same command in `~/.superset/worktrees/website/feat/design-plud`.
