---
name: "The no-code exit"
title: "From Bubble to a database the engineers could build on, with the product live the whole time"
summary: "A B2B SaaS leaves Bubble for Django: the full map of the app, and the data moved with no downtime."
result: "200k"
resultLabel: "users migrated, no downtime"
projects: ["evaboot"]
order: 1
status: "draft"
---

## Situation

The product ran on Bubble for the front end and workflows, with a Django backend
behind it. Growth had reached the limits of the platform: multi-second waits on
workflow checks, plugin behaviour that changed without notice, an API connector that
broke on silent changes, and an API rate limit that made bulk operations crawl. Bubble's
pricing had also become expensive for what it delivered. Hiring was constrained,
because a Bubble application cannot be staffed like a codebase. The decision was taken
to rebuild the core on Django and AWS. The risk was the data: years of accounts,
exports, credits and billing that had to arrive intact while the product kept selling.

One person had run the Bubble application since June 2023: about 500 features and
fixes shipped to production in two and a half years, around 200 to 250 a year (count
from the product board, 2026-09-23, rounded).

## Task

Two things, both before any core code existed. First, a map of the whole application
that a backend engineer could rebuild from. Second, the data: move it to Postgres
without loss, and keep it in sync while both systems ran, up to the cut-over.

## Actions

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

## Results

- Postgres populated at 100 percent from the Bubble export, verified by a post-load
  audit (1 May 2026).
- Delta-sync live across all data types while both systems ran (first half of May 2026).
- The core rebuilt by the backend engineer on the new stack, on top of that data.
- No downtime at the cut-over (May 2026).
- One additional engineer hired after the move off Bubble.

## What this proves

The two things a founder needs before leaving a no-code platform: a map an engineer
can build from, and a data move that loses nothing. Both delivered while the product
stayed live.
