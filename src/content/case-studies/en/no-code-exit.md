---
kind: "use-case"
name: "The no-code exit"
title: "200,000 users moved off Bubble with no downtime, and a map of the app the engineers could rebuild from"
summary: "A B2B SaaS leaves Bubble for Django: the full map of the app, and the data moved with no downtime."
intro: "A B2B SaaS leaves Bubble for Django: the full map of the app, and the data moved with no downtime."
client: "B2B SaaS, lead extraction"
clientPage: "evaboot"
result: "200k"
resultLabel: "users migrated, no downtime"
stats: [{"value": "200k", "label": "users migrated, no downtime"}]
cover: {"src": "/assets/projects/evaboot/wcnvcxceeguy7ibzeaos.webp", "alt": "The product's exports screen"}
order: 1
status: "draft"
review: "Drafted on 2026-09-30: the heading sentences. Check them, then delete this line."
---

## Situation | The product had outgrown Bubble.

The product ran on Bubble for the front end and workflows, with a Django backend
behind it. It had about 200,000 users at the time of the migration. Growth had reached the limits of the platform: multi-second waits on
workflow checks, plugin behaviour that changed without notice, an API connector that
broke on silent changes, and an API rate limit that made bulk operations crawl. Bubble's
pricing had also become expensive for what it delivered. Hiring was constrained,
because a Bubble application cannot be staffed like a codebase. The decision was taken
to rebuild the core on Django and AWS. The risk was the data: years of accounts,
exports, credits and billing that had to arrive intact while the product kept selling.

One person had run the Bubble application since June 2023: about 500 features and
fixes shipped to production in two and a half years, around 200 to 250 a year (count
from the product board, 2026-09-23, rounded).

## Task | Map the app, then move the data intact.

Two things, both before any core code existed. First, a map of the whole application
that a backend engineer could rebuild from. Second, the data: move it to Postgres
without loss, and keep it in sync while both systems ran, up to the cut-over.

## Actions | A full map, a full load, then a live sync.

- Documented every workflow, page, element, table and field of the Bubble application,
  with the help of a Bubble analysis agent, so the rebuild had a complete reference.
- Reconciled the target schema with the backend engineer's own rebuild plan in April
  2026, and settled about twelve open questions on what to keep, drop or merge.
- Cleaned the target schema of dead columns found by measurement (fields with a zero
  percent fill rate went).
- Loaded the full Bubble export into Postgres, all tables, at full volume (1 May 2026).
- Designed and shipped the delta-sync: a run log with cursors per type, then batches
  per data type, so rows changed on Bubble after the load arrived in Postgres too.
- Worked around Bubble's API rate limit (about thirteen pages a minute) by verifying
  in narrow time windows instead of full replays.
- Coordinated the cut-over with the backend engineer and the founders.

## Results | All the data in Postgres, no downtime at cut-over.

- Postgres populated at 100 percent from the Bubble export, verified by a post-load
  audit (1 May 2026).
- Delta-sync live across all data types while both systems ran (first half of May 2026).
- The core rebuilt by the backend engineer on the new stack, on top of that data.
- No downtime at the cut-over (May 2026).
- One additional engineer hired after the move off Bubble.

## What you get

A map of your app that an engineer can rebuild from, and a data move that loses
nothing while the product keeps selling. You leave the no-code platform without
stopping the product.
