---
kind: "use-case"
name: "The no-code exit"
title: "200,000 users moved off Bubble in two months, with no downtime"
summary: "A B2B SaaS leaves Bubble for Django. I mapped the whole app for the rebuild and moved the data while the product kept selling."
intro: "A B2B SaaS leaves Bubble for Django. I mapped the whole app for the rebuild and moved the data while the product kept selling."
client: "B2B SaaS, lead extraction"
clientPage: "evaboot"
result: "200k"
resultLabel: "users migrated, no downtime"
stats: [{"value": "200k", "label": "users migrated, no downtime"}, {"value": "2 months", "label": "from the map of the app to the switch"}]
cover: {"src": "/assets/projects/evaboot/wcnvcxceeguy7ibzeaos.webp", "alt": "Evaboot's export screen"}
when: "April to May 2026"
order: 1
status: "live"
review: "Rewritten on 2026-10-01 against the course. Check it, then delete this line."
---

## Situation | Bubble held the roadmap back.

The product ran on Bubble, with about 200,000 users at the time of the migration. The roadmap needed more than Bubble allowed: deeper integrations with HubSpot, Salesforce and other CRMs, faster releases, A/B tests and autonomous AI agents. There were also few developers to hire who know Bubble, and the cost of Bubble became too high as the product grew.

The founders decided to rebuild the core on Django and AWS. The risk was the data: years of accounts, exports, credits and billing, which had to arrive intact while customers kept paying.

## Task | Map the app, then move the data intact.

Before any of the new core existed, give the backend engineer a complete map of the app to rebuild from. Then move every record to the new database, and keep both systems in step until the switch.

## Actions | A full map, a full load, then a live sync.

- **A complete map of the app.** Every page, workflow, table and field, documented with the help of a Bubble analysis agent.
- **The scope settled first.** In April 2026 the engineer and I went through the open questions: what to keep, what to drop, what to merge. Fields that no user had ever filled were dropped.
- **A full load.** The whole Bubble export went into the new database on 1 May 2026, every table, at full volume.
- **A live sync.** Every record that changed on Bubble after the load followed to the new database, so both systems matched until the switch.
- **A switch planned with the team.** The engineer, the founders and I agreed the cut-over steps together.

I wrote the migration scripts with coding agents. The backend engineer built the new core.

## What I learned | Bubble's limits set the pace.

Bubble's API is slow to read data back, so a full check of the data after each sync would have taken days. I checked the records in narrow time windows instead, which kept every sync verifiable without stopping the product.

The map paid off twice. It answered the engineer's questions during the rebuild, and it made the scope decisions quick, because every field already had a name and a use.

## Results | All the data moved, and no downtime.

- **Before.** One app on Bubble: no deep CRM integrations, slow releases, no A/B tests, no autonomous AI agents, few developers to hire who know Bubble, and a bill that rose with the usage.
- **After.** The core on Django and AWS. Every table loaded and checked after the load, and both systems in sync until the switch.
- **The switch.** No downtime for customers.
- **The team.** One more engineer hired after the move off Bubble.

## What you get

A map of your app that an engineer can rebuild from, and a data move that loses nothing while the product keeps selling. You leave the no-code platform without stopping the product.
