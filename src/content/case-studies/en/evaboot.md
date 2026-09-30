---
kind: "app"
name: "Evaboot"
title: "500 features and fixes shipped, June 2023 to February 2026"
summary: "I ran Evaboot's Bubble app alone from June 2023 to February 2026: about 500 features and fixes, then the exit from Bubble and the interfaces on the new stack."
intro: "I ran Evaboot's Bubble app alone from June 2023 to February 2026: about 500 features and fixes, then the exit from Bubble and the interfaces on the new stack."
client: "Evaboot"
clientPage: "evaboot"
logo: "/assets/images/image30.png"
result: "500"
resultLabel: "features and fixes shipped, June 2023 to February 2026"
stats: [{"value": "500", "label": "features and fixes shipped, June 2023 to February 2026"}]
cover: {"src": "/assets/videos/video01.mp4", "alt": "User dashboard"}
links: [{"label": "Website", "url": "https://evaboot.com/"}]
featured: true
nda: false
order: 1
status: "live"
quote: {"text": "Gautier expertly used Bubble.io to support our projects, delivering effective solutions and overcoming obstacles. Impressed by their precision and ability to handle project challenges, we trust in their skills and will use them again for future Bubble.io projects.", "who": "JB Jézéquel", "role": "Co-Founder, Evaboot"}
---

## Situation

Evaboot is a B2B SaaS for lead extraction, built on Bubble. The two founders grew it to $1M ARR with no other staff. One of them, JB, still built the app himself, and the app carried technical debt and bugs that kept coming back.

<video controls muted playsinline src="/assets/projects/evaboot/sn8ss9apbt73zhkoqkop.mp4" poster="/assets/projects/evaboot/sn8ss9apbt73zhkoqkop.webp"></video>

## Task

Take the Bubble app off the founder's hands. Own it, clean it up, and ship what the business needed next.

## Actions

- Reworked the database. I removed redundant fields, moved data between fields and tables with the service running, and checked every table with integrity scripts.
- Moved the app from several pages to a single page, and loaded only the data each screen needs, with lazy loading and custom endpoints. Bubble bills on usage, so this cut the bill as well as the load time.
- Replaced plugins with native Bubble functions, set a naming convention, and built reusable elements, so another developer could take the app over.
- Added error handling on the API calls, and a log table that records user actions and errors.
- Rewrote the privacy rules so each user reads only the data they are allowed to see, and kept API tokens and routes on the server.
- Shipped what the founders and the customers asked for: an admin dashboard, Stripe control from the app, pay on download, an export preview, team management, a new credit model with expiry, email enrichment, custom email alerts, Intercom, a free trial and a referral system.
- Added limits that protect users' LinkedIn accounts during exports and stop abuse of the free plan.
- Connected Stripe, Brevo, Segment, Google Tag Manager and Google Sheets.
- Worked with the founder through a daily check-in and a weekly priority meeting, with each task tracked in Notion.

![Evaboot admin screen](/assets/projects/evaboot/wcnvcxceeguy7ibzeaos.webp)

From 2026 the work moved to the exit from Bubble, then to the MCP server and the CLI on the new stack. The use cases below tell those parts.

![Admin dashboard](/assets/images/image06.jpg)

![Stripe integration](/assets/images/image20.jpg)

## Results

- About 500 features and fixes shipped to production between June 2023 and February 2026 (count from the product board, rounded).
- The founder handed day-to-day development over and went back to the business.
- Evaboot went from $1M to $2M ARR over those years. I do not claim that growth. It is the size of the product I ran.
