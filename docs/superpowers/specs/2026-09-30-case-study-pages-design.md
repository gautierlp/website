# Case study pages: design

Status: approved by Gautier on 2026-09-30, after five full-page mockups (layout "A. Story" chosen). Mockups live in `.superpowers/brainstorm/` (not committed).

## Goal

The site has two kinds of story page today: 12 project pages (one per client, `/projects/<slug>/`) and 4 use-case pages (one per kind of work, `/use-cases/<slug>/`). They tell overlapping stories in different shapes, and neither follows the case study rules of the Hyperfreelance course (lesson 7.1) consistently. Replace both with one kind of page, the case study, built like an article so that blog posts can reuse the same template later.

## Rules every case study follows (course, lesson 7.1, and `freelance/docs/case-studies/README.md`)

- The strongest number is in the title.
- The main results are summarised at the top, under the title.
- The client is described (sector, size) and not named until the client approves. Rounded or adjusted figures say so.
- The body follows STAR: Situation, Task, Actions, Results. Results read as a before and after.
- Deliverables (screens) and results appear together.
- A client quote, when one exists.

## Content model

- One collection, `case-studies`, replaces `projects` and `use-cases`. URL: `/case-studies/<slug>/` (and `/fr/case-studies/<slug>/`, same fallback rules as today).
- 15 case studies:
  - the 12 current project stories (9 live, 3 empty drafts: BETC, Price Writers, Protech);
  - 3 use cases: the no-code exit, interfaces on a new stack, the marketing site migration.
- The use case "Internal applications" is removed. Its facts that the three app stories lack (one app a year in 2023, 2024 and 2025; the second and third bought on the strength of the first; all three in use in September 2026; the IT department does not staff tools for a subsidiary) move into the three app stories (Varnel, Ostrake, Brivane) and onto the automotive group's client page.
- Frontmatter of a case study: `name` (short label), `title` (sentence with the number), `summary`, `intro`, `client` (description), `clientPage` (optional slug of a client page), `when`, `stats` (up to 4 items of `value` and `label`), `cover` (the wide screen under the stats), `quote` (optional), `links`, `logo`, `nda`, `featured`, `order`, `status`. Field names may be adjusted in the plan; the list of facts on the page may not.
- `/projects/` and `/use-cases/` disappear. No redirects: lepoher.co does not point at the site yet (README, Deploy checklist).

## The page (layout "A. Story")

Single column of about 40rem for text; screens break out wider (up to about 72rem). In order:

1. A small grey label: the case study name, the client description, the year.
2. The title: one sentence with the number.
3. The intro: one or two sentences in first person.
4. A row of up to 4 numbers with short labels, above a thin rule. Numbers count up the first time they come into view.
5. The cover screen in a light grey stage with round corners.
6. The body. Each section heading is written in Markdown as `## Situation | The product had outgrown Bubble.` and renders as a small grey uppercase label ("SITUATION") above the sentence as the heading. A heading with no `|` renders as a plain heading with no label (for future blog posts). Case studies keep the four labels: Situation, Task, Actions, Results. "What you get" stays as a final section where a use case has one.
7. Images and videos in the body render in the same grey stage, wider than the text, with an optional caption.
8. The client quote, in large type, with the role under it.
9. A link card to the client page, when `clientPage` is set.

Motion: each block fades in from a blur (about 0.7s, ease-out) when it enters the view. With `prefers-reduced-motion`, nothing moves and everything shows at once. No live demo components in this version (the sync checklist in the mockup is out of scope).

Drafts keep today's behaviour: the draft note, and `noindex`.

## Client pages

Only for a client with two or more case studies. There are two:

- Evaboot: the Evaboot story (500 features and fixes), the no-code exit, interfaces on a new stack, the marketing site migration.
- The automotive group (described, not named): Varnel, Ostrake, Brivane.

URL `/clients/<slug>/`. The page holds the client's name or description, one or two sentences, the quote if any, and the list of its case studies (same list component as today). The Evaboot use cases keep the client described inside the case study text; the client page is where the name appears, as on the current Evaboot project page.

## Links from the rest of the site

- Homepage logo grid, featured case and work carousel: a client with one case study links to that case study; a client with several links to its client page. The carousel keeps linking to case studies.
- The hero link that points at `/projects/evaboot/` points at the Evaboot client page.

## Content work

- Move the text of each project page into its case study unchanged, except for the headings, which take the `Label | Sentence` form.
- The project pages have no Task section. Write a short Task paragraph for each live one from facts already on the page, and mark each with an HTML comment `<!-- TASK DRAFT: check -->` for Gautier to review. Invent no number and no fact.
- Where a page lacks a number for the title or the stats, keep the current `result` and mark the gap in a comment; do not invent one.

## Tests

- Every case study builds to `dist/case-studies/<slug>/index.html`; every client page to `dist/clients/<slug>/index.html`.
- Every live case study title contains a digit.
- Every live case study has the four labels Situation, Task, Actions, Results, in that order.
- No page in `dist/` links to `/projects/` or `/use-cases/`.
- Every client page links to each of its case studies, and each of those links back.
- The reveal CSS has a `prefers-reduced-motion` rule.
- Checked at phone width (390px) and desktop width in a browser before merge: no horizontal scroll, screens fit.

## Out of scope

Blog posts, live demo components, French translations, redirects.
