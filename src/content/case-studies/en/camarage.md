---
kind: "app"
name: "Camarage"
title: "A housing platform live 30 days after I joined, then its rent payments for 2 years"
summary: "I helped Camarage finish its move from a coded site to Bubble and launched the platform in 30 days, then built and ran its Stripe rent payments until 2025."
intro: "I helped Camarage finish its move from a coded site to Bubble and launched the platform in 30 days, then built and ran its Stripe rent payments until 2025."
client: "Camarage"
when: "February 2023 to June 2025"
logo: "/assets/images/image34.png"
result: "30 days"
resultLabel: "to launch a housing platform, then 2 years of its rent payments"
proof: "2 years of rent payments"
stats: [{"value": "30 days", "label": "from my first day to the launch"}, {"value": "3,000+", "label": "young adults in the database"}, {"value": "8,152", "label": "matchings in the database by June 2025"}]
featured: true
nda: false
order: 5
status: "live"
review: "Rewritten on 2026-10-01 from the Nifty chat and tickets, Clockify and the NoxCod invoices (sources/camarage/notes.md). The old 1,000 users, custom code and no-developer claims had no source. Gautier confirmed on 2026-10-06 that Camarage had started the move from code to Bubble before he joined, and that he helped finish it. Check the title, the stats and the Why Bubble section, then delete this line."
---

![Camarage](/assets/projects/camarage/qjftnmkvlglermlhtsxm.webp)

## Situation | A new platform to launch, and money to collect every month.

[Camarage](https://camarage.fr/) matches seniors who have a spare room with young adults who need a place to live. The young adult pays a matching fee, then a monthly rent. Camarage keeps a follow-up fee and pays the senior by bank transfer.

In February 2023, Camarage was moving from its old coded site to a new platform on Bubble. The client had already started the move and the designs were ready. I joined as the developer.

## Task | Launch the platform, then make the payments run on their own.

Finish the Bubble platform and move the data from the old site. Then make the money side work every month: the fees, the rents, the failed payments and the transfers to the seniors.

## Why Bubble, for this client

Camarage had chosen Bubble before I joined. It fit: their team edits option sets and workflows, merges and deploys on its own, and calls on a developer for the larger work. When a product outgrows that setup, I make the opposite move: see [the exit from Bubble](/case-studies/no-code-exit/). The tool follows the product, not the other way round.

## Actions | A launch in 30 days, then the money side.

- I designed the data model with the client, built the sign-up, the account pages, the search for a room and the requests, and the platform went live on 24 March 2023.
- I moved the data from the old site: users, seniors, young adults, matchings and cohabitations. The 46 young adults already living with a senior paid through a one-off page, and their monthly rent then ran on Stripe.
- I built the Stripe payments: the matching fee, then a monthly rent subscription. Stripe does not prorate the first month on its own, so I calculated it myself. A change of dates or rent in the admin now updates the subscription in Stripe.
- I handled failed payments: Stripe flags the young adult, an email goes out every two days, and they can update their card on their own.
- I built the admin module: one page with tabs for seniors, young adults, matchings and cohabitations, and a payments tab that exports the transfers to the seniors as a Qonto bulk-transfer file.
- I built the rent cap simulator, the feed that publishes the listings on property portals through Ubiflow, and 13 of the 15 SMS and email workflows of the first round.

![Camarage data model](/assets/projects/camarage/hnlzpjxacownbk2nob7x.webp)

## What I fixed

- One table, the Facebook prospects, used 35% of the app's resources. I moved those prospects out of it.
- The search slowed down to 15 seconds, and up to 45, after a filter on seniors with too many requests. I replaced the filter with a flag that a workflow sets on each change.

## How I worked

I asked before I built, with numbered options when a choice was open. Every change went to a test page or a branch first, then to production after the client approved it. For the actions the team does alone, such as changing a rent in Bubble and in Stripe, I recorded a short video. After the launch I stayed on one to two days a week, then on call until June 2025.

## Results | Live in 30 days, and two years of rent payments.

- The platform went live on 24 March 2023, 30 days after my first day.
- 499 seniors in production by April 2023, and more than 3,000 young adults in the database.
- 77 active rent subscriptions on Stripe in January 2024.
- 8,152 matchings in the database by June 2025.

![Camarage property search](/assets/projects/camarage/dfaazlthjwfykwtqvdna.webp)
