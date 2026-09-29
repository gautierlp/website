# Website copy review: handover

Sep 29, 2026 · @Gautier Le Poher

## Brief

The lepoher.co copy passes one of the course's three positioning tests out of three: it has proof, but it never says who the client is or what the client gains. Your job is to rewrite the copy so it passes all three, without breaking the confidentiality rules below.

- **Repo:** `~/projects/personal/website` (Astro), branch `main` at `7d84fc8`. Work in a Superset workspace, not the main checkout.
- **Copy lives in:** `src/i18n/ui.ts` (hero, section titles, CTA), `src/content/use-cases/en/*.md` (4 case studies), `src/content/projects/en/*.md` (11 project pages).
- **The 8 Contra-imported project pages** come from `scripts/import_contra.py`. Edit the script's table, or delete the script once the texts are rewritten. Do not hand-edit those files while the script is the source.
- **Out of scope:** design, layout, the carousel, the Cal.com popup. Copy only.
- **Do not deploy.** Draft pages build and are linked from the homepage. They carry `noindex`, but anyone who clicks reaches them.

Read this whole doc before touching a file. Sections 3 and 4 are the work; section 5 is what you must not guess.

## Sources of truth

`~/projects/personal/freelance/positioning.md` is the canonical offer. If the site contradicts it, the site is wrong. The course rules come from the Hyperfreelance transcripts in `freelance/docs/hyperfreelance/transcripts/`.

| Rule | Source | What it means for the site |
| --- | --- | --- |
| The three positioning failures: a vague client, an unquantified value, proof that does not match the target | Course, module 2 intro | Every page must name the client, the gain, and proof for that client |
| A description holds four of: value proposition, target client, problem, proof, call to action | Course, LinkedIn profile lesson (3.3.1) | The hero is the description. Today it has proof and a CTA only |
| Open with a proof angle (years, references, difference). Use Problem, Agitate, Solution. Name-drop clients, use numbers, show the method | Course, Malt conversion lesson (6.7) | The 1M to 2M figure and client names belong in the hero, not at the bottom |
| Case studies in STAR (Situation, Task, Actions, Results). The strongest result goes in the title as a number | Course, lesson 7.1 | Use cases mostly comply; one title lacks its number |
| Hide the client's name, adjust figures 10 to 15 percent and say so, get the client's approval | Course, lesson 7.1 | Evaboot is anonymised in use cases but named on its project page |
| Fit one searched job title, do not mix two jobs | Course, Malt lesson 6.6 | "Technical Product Manager" complies |
| The offer: take over a product nobody owns, decide what gets built, ship it. B2B SaaS or internal business application | positioning.md | The hero drops the "B2B SaaS or internal app" half |
| A CTO buying development capacity is not the buyer | positioning.md, "Who buys it" | "Need to build an app?" invites exactly that buyer |
| The pitch is what ships sooner and what that is worth, not a head count saved | positioning.md, value quantification | No page states a gain in time or money for the buyer |
| No client internals: no PR numbers, no billing defect, no security incident | positioning.md, copy rule 1 | Two pages break it (section 3) |
| No emoji, no keyword stuffing | positioning.md, copy rule 2 | Contra pages carry star emoji |
| Every claim maps to a dated line in the work journal | positioning.md, copy rule 3 | At least one number has no source in its own page |
| Name what I do not do | positioning.md, copy rule 4 | Absent from the site |
| Never "Product Owner" as a current title; "Product Owner, 2019 to 2022" as history is fine | positioning.md, D12 | "Ex-Product Owner" in the hero complies |

Writing voice: plain, specific, no em dashes, no filler words ("seamless", "robust", "spearheaded", "leveraging"). Run every rewritten text through the `unslop` skill before you show it.

## Findings, page by page

Checked on the build of `7d84fc8`. The biggest problems are on the homepage and in the Contra project pages; the four use cases are close to ready.

### Homepage (`src/i18n/ui.ts`)

| Element | Current copy | Problem |
| --- | --- | --- |
| Headline | "I take over your product and ship it myself." | Good promise, but "your product" names no client. positioning.md says B2B SaaS or internal business application |
| Paragraph 1 | "Ex-Product Owner, freelance on one B2B SaaS since 2023..." | "one B2B SaaS" contradicts the page below, which lists 2023 to 2025 work for other clients. No gain for the buyer |
| Paragraph 2 | Bubble exit, MCP server, CLI, coding agents | Strong proof, but no number. The 1M to 2M ARR figure only appears in the list at the bottom |
| Status | "Available for new projects" | "projects" leans toward fixed-price work. Decided: the line targets a day-rate seat only (section 5) |
| Selected work | Four use-case cards | Good. STAR, a number per card |
| All apps | 11 entries, 3 of them empty drafts (Price Writers, BETC, Protech) | Mostly 2023 to 2024 Bubble builds. Proof that does not match the target. Empty drafts are linked |
| CTA | "Your project here. Need to build an app?" | Invites the buyer of development capacity, whom positioning.md excludes |
| Missing | Testimonials, "what I do not do" | Two JB and founder quotes exist on project pages; none on the homepage |

### Use cases (`src/content/use-cases/en/`)

All four follow STAR and carry a result number. All four are `status: "draft"`, waiting for client approval.

- **no-code-exit:** the card says "200k users migrated, no downtime", but the body never mentions 200k. The title has no number. The figure is confirmed (200k users at the time of migration): state it in the body and put it in the title.
- **interfaces-on-a-new-stack:** "Found and filed one billing defect in the public API" breaks copy rule 1 (no defect found in their billing). Cut the bullet (confirmed by Gautier).
- **internal-applications:** the "Open item" section ("Gautier is not sure") and "the only proof segment B has today" are internal notes. They render on the public page.
- **All four:** "What this proves" is written for Gautier, not for a buyer. Rewrite it as what the buyer gets, or cut it.

### Project pages (`src/content/projects/en/`)

Written in 2024 for Contra: long, generic, Bubble-centred, in a voice the rest of the site no longer uses ("seamless", "robust", "spearheaded", "leveraging").

- **evaboot:** names Evaboot, JB and the ARR while every use case hides them. It links to all three use cases. Decided: Evaboot is named everywhere (section 5), so the fix is to name it in the use cases once JB approves them, not to hide it here. It says "Over the course of a year" (the work ran June 2023 to 2026). It says "addressing a significant security vulnerability" (copy rule 1). The title credits the ARR growth to the Bubble work, which positioning.md does not claim. JB's quote says "future Bubble projects", which anchors the reader on Bubble.
- **eco-link:** the summary names "Indra", while the internal-applications use case says the client stays described until it gives permission.
- **eco-insight, eco-link, fleetnova:** the product names (Eco'Insight, Eco'link) are Gautier's own inventions, not the client's. Replace them with random names, blurred, labelled "NDA signed". The blur is a small styling change, the one exception to copy-only scope.
- **folderly:** "$1.6M+ ARR, backed by Google Startups" is the client's revenue, not a result of the work. The quote is from a Belkins account manager about email management, not about Gautier's work.
- **camarage:** a move from code to Bubble. It looks like the opposite of the no-code exit. Decided: keep it, as proof of a product taken over, with a line on why Bubble fit that client.
- **disko-leads, evaboot, folderly:** star emoji (copy rule 2).
- **fleetnova:** "I have achieved by connecting their SFTP" is broken English.
- **betc, price-writers, protech:** empty drafts. BETC is the segment B reference positioning.md names, and it has no text.

### French pages

Only the interface strings are translated. `src/content/*/fr/` is empty, so every card, case study and project page shows English text under a French header. Either translate the four use cases or hide the FR switch until they exist.

## Recommendations, in order

Do 1 before anything else: it is the only item that can hurt a client relationship. Items 2 and 3 carry most of the positioning gain.

1. **Remove client internals and leaks.** Cut the billing-defect bullet (interfaces use case), the security-vulnerability line (evaboot project), the "Open item" section and "only proof segment B has" (internal-applications), and "Indra" (eco-link summary; say "a subsidiary of a large French automotive group" instead). Evaboot is named (see section 5): apply that on every page and link, and publish the use cases under its name only after JB approves them.
2. **Rewrite the hero so it names the client, the problem and a number.** Keep the headline. Draft, to adapt and run through `unslop`:
   - Headline: "I take over your product and ship it myself."
   - Paragraph 1: "For a B2B SaaS or an internal business app that nobody owns end to end. I decide what gets built and in what order, then I ship it: the data, the interfaces, the code."
   - Paragraph 2: "Since 2023, on one B2B SaaS that grew from 1M to 2M in annual revenue: about 500 features and fixes shipped on its Bubble app, then its exit from Bubble, its MCP server and its CLI on the new stack."
   - Paragraph 3: "Product Owner from 2019 to 2022. I build with coding agents every day, and I decide what they build."
   - Every figure above is in positioning.md. Do not add a figure that is not.
3. **Replace the CTA.** "Need to build an app?" becomes an invitation to the owner-less product, for example: "A product nobody owns end to end? Book a 30-minute call." Keep the email line.
4. **Cut "All apps" down to proof that matches the target.** Drop the three empty drafts. Keep Camarage (see its finding above). Drop Folderly's "$1.6M+ ARR" label; use "600 students in three weeks" if the page stays. Keep the internal apps and Disko Leads. Rename the section from "All apps" to something that reads as a record, not a catalogue.
5. **Finish the use cases.** Put a number in the no-code exit title. State the 200k users (confirmed) in the body. Rewrite each "What this proves" as what the buyer gets. Add the course's disclosure line if any figure was adjusted.
6. **Move testimonials up.** JB's and Johary's quotes sit deep in project pages. Put one on the homepage, but cut "future Bubble projects" only with JB's agreement, never by editing a quote silently.
7. **Add one "what I do not do" line** from positioning.md: agents, MCP servers, LLM calls in the product; no model training, MLOps, data engineering or RAG.
8. **French.** Translate the four use cases, or hide the FR switch until they exist.
9. **Contra pages, last.** Rewrite in the site's voice or retire them. Strip emoji, fix the Fleetnova sentence, and correct "Over the course of a year" on Evaboot.

## Open questions and done criteria

Gautier answered these on 2026-09-29. Only the quote question is still open; do not guess it.

- **Evaboot: named or anonymised?** Decided: named. The use cases name Evaboot too, but only once JB has approved them; until then they stay draft. The project page keeps its links to them.
- **The automotive group: can it, or Indra, be named?** Decided: never "Indra" or "Renault". Describe it as "a subsidiary of a large French automotive group". The product names (Eco'Insight, Eco'link) were invented by Gautier and are dropped: replace them with random placeholder names, shown blurred, with an "NDA signed" label.
- **Where does "200k users migrated" come from?** Answered: Evaboot had 200k users when it migrated. Add that to the use case body, and to positioning.md or the work journal so the figure has a source (copy rule 3).
- **JB's quote:** may it be shortened to drop "future Bubble projects"? Only JB can say yes. Deferred: Gautier will review this later; until then, leave the quote untouched and off the homepage.
- **Hero status line:** Decided: all in on a day-rate seat (D11) for now. Drop "projects". Draft, to run through unslop: "Available for a day-rate seat on your product."

The review is done when every box below is ticked:

- [ ] No billing defect, security issue, PR number or internal note on any rendered page
- [ ] One Evaboot policy, applied on every page and link
- [ ] The hero names the client type, the problem, and at least one number from positioning.md
- [ ] The CTA no longer invites a buyer of development capacity
- [ ] Every result number maps to a line in positioning.md or the work journal
- [ ] No emoji, no em dash, every rewritten text passed through `unslop`
- [ ] `npm test` passes, and the rendered homepage text was read in full on the build
- [ ] Not deployed. Gautier reviews and deploys
