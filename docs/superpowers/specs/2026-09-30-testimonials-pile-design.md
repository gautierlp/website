# Testimonials pile: design

Status: approved by Gautier on 2026-09-30 ("let's do option 4 right now"). The defaults below were chosen without a question round, at his request, and are open to change after he sees the page.

## Goal

The homepage shows one client quote today, and it is easy to miss. Ten reviews exist (see `docs/testimonials.md`). Show the best six as a pile of cards that a visitor can bring to the front one at a time, after the Dribbble shot "Testimonial Card Hover Interaction" by Aathif Thajudeen. Every review, in full, goes on a new page.

## What the visitor sees

**Homepage, below the selected work** (where the single quote sits now), under the heading "What clients say":

- **Desktop (a mouse and a column at least 40rem wide):** six cards in a loose pile, each with a small fixed tilt, each covering part of its neighbours. Hover or keyboard focus brings a card to the front: it turns straight, grows a little and gets a deeper shadow. The move takes about 0.35s with the site's ease-out curve. With reduced motion, the card comes to the front with no transition.
- **Touch or narrow screens:** the same six cards in one row that scrolls sideways, with no tilt and no pile, like the side projects row.
- Under the pile, a link "Read all 10 reviews" to the reviews page. The number counts the review files.

**A card** holds:

- an optional result line on top, only where the track record already claims that result (Johary: "From 0 to $3k MRR"; JB: "500 features and fixes shipped"). No other number is added.
- the excerpt, set in the quote type of the site;
- a small "Translated from French" line when the English page shows a translation;
- a footer row: a round photo when one exists, else the initials in a grey circle; the name; the role.

One card, JB's, is ink with white text so the pile does not look flat. The others are white. No stars: no platform gives a star count for each review, and the site does not invent one.

**Reviews page** (`/reviews/` and `/fr/reviews/`): every review in full, newest first, each with the name (or the role alone when the name is hidden), the source and year ("Malt, 2023"), and the translation label where it applies.

## The six in the pile, in this order

1. JB Jézéquel, Co-founder, Evaboot (Contra, 2024). The ink card.
2. Nirundthan Parameswaran, Lead developer, BETC (Malt, 2023). French.
3. Johary Randria, Founder, Disko Leads (the text already on the site).
4. Pierre Hilbert, Manager, Schroders (Malt, 2023). French.
5. Bastien Paul, Growth, Hublead (Contra, 2024).
6. Clara Ananou (Contra, 2024).

The four others go on the reviews page only: Bastien Paul's Malt review, and the three whose names Malt hides (a CMO, a head of digital strategy, a co-founder).

## Rules for the texts

- The original is kept word for word, typos included.
- An excerpt cuts with "[…]" and never joins two sentences into a new claim.
- The English page shows a translation of a French review, with the label. The French page shows the French original, and English reviews stay in English on both pages.
- A translation keeps the meaning; a missing word in the original shows in square brackets.
- Two changes to the originals, for the site's rules (no em dash, no emoji): an em dash becomes a comma, and Bastien's closing emoji is dropped. These are punctuation only and are listed in `docs/testimonials.md`.

## Where the data lives

One Markdown file per review in `src/content/testimonials/`, frontmatter only, so Gautier removes a review by deleting its file:

| Field | Type | Meaning |
|---|---|---|
| `who` | string, optional | The name. Absent when the platform hides it. |
| `role` | string | Role and company, as the review states them. |
| `lang` | `en` or `fr` | The language of the original. |
| `source` | `site`, `contra` or `malt` | Where the review was left. |
| `date` | date | When it was left. |
| `text` | string | The full original. |
| `translation` | string, optional | The English translation of a French original. |
| `excerpt` | string, optional | The pile text, in the original language. Defaults to `text`. |
| `excerptTranslation` | string, optional | The English pile text of a French original. |
| `pile` | number, optional | The place in the pile, 1 to 6. Absent: reviews page only. |
| `result` | string, optional | The result line on the card. |
| `photo` | string, optional | A path under `/assets/people/`. |
| `tone` | `ink`, optional | The dark card. |

## Components

- `TestimonialCard.astro`: one card from one entry and the page language.
- `TestimonialPile.astro`: the heading, the six cards in pile order, the link. It replaces the current single quote on the homepage. The `Quote` component stays for the project pages.
- `src/pages/reviews.astro` and `src/pages/fr/reviews.astro`: the full list, through one shared `ReviewsPage.astro`.
- A `getTestimonials(lang)` helper in `src/lib/content.ts`, sorted by date, newest first.

The pile positions (offset and tilt for places 1 to 6) are fixed in CSS by place, so the pile looks the same on every visit.

## Tests

- Homepage (en and fr): a pile with six cards in the order above, the link with the right count, and no card for a review without `pile`.
- English homepage: the French reviews show their translation and the label; French homepage: the French originals and no label.
- The reviews pages list every file, and a review with no name shows its role alone.
- The page-wide rules (no em dash, no emoji, no banned words) run on both reviews pages.
- The CSS turns the tilt off and drops the transition under reduced motion.

## Out of scope

Photos (none are on disk yet; the initials stand in), stars, cards that change by themselves, and any change to the project pages.
