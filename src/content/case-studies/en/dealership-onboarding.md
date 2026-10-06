---
kind: "app"
name: "Ostrake"
title: "An application portal for vehicle recycling centres that checks 15 rules on every application"
summary: "I built the app where vehicle recycling centres apply to join a network: two forms, 15 automatic checks, and a back office for the staff who review and audit them."
intro: "I built the app where vehicle recycling centres apply to join a network: two forms, 15 automatic checks, and a back office for the staff who review and audit them."
client: "A subsidiary of a large French automotive group"
clientPage: "automotive-group"
when: "November 2023 to January 2026"
result: "15 rules"
resultLabel: "checked on every application from a vehicle recycling centre, the moment it is sent"
stats: [{"value": "15", "label": "rules checked on every application"}, {"value": "4 July 2024", "label": "in production"}, {"value": "190 h", "label": "of my work, from November 2023 to January 2026"}]
cover: {"src": "/assets/projects/dealership-onboarding/ne6m3zcu7egyjlzrb10m.webp", "alt": "Vehicle recycling centre applications"}
featured: false
nda: true
order: 6
status: "live"
review: "Rewritten on 2026-10-02 from the sources (the project's source notes). The applicants are vehicle recycling centres, not dealerships; removed the unsourced 'more requests, fewer delays' result, the tablet (the sources say smartphone) and 'one a year from 2023 to 2025' (all three apps started in 2023). Check the title, the stats, the Results line on the three apps, then delete this line. Gautier confirmed on 2026-10-06 that the January 2026 work went into production."
---

## Situation | Recycling centres apply to join a network, and staff review each one.

The client runs a network of vehicle recycling centres: the sites that take in and treat cars at the end of their life. A centre that wants to join sends an application. The client's staff review it, audit the site, then accept or refuse the centre.

In November 2023, the agency put me on the app that would carry this process.

## Task | One app for the whole application, from the form to the audit.

Build one app where a centre applies and the staff follow each application up to the audit. Then keep it in line with the rules and with what the staff asked for.

## Actions | Two forms, 15 automatic checks, a back office for two roles.

- I built the first version in January 2024, in about 60 hours: the data model, the application form, a second form the centre opens with a one-time code sent by email, the back office, the user accounts and the emails through Mailjet. It went to the client for testing on 25 January 2024, the date I had committed to.
- In April and May 2024, I reworked the forms for new regulations. The first form now runs over 3 pages and checks the company numbers before it lets the centre go on.
- I added 15 automatic refusal rules. When a centre sends the first form, the app checks its permits, its certificates and its recycling rates. If a rule fails, the application is refused and the centre gets an email with the reasons. When staff refuse an application by hand, they must give a reason, and it stays in the file.
- The back office has two roles. Assistants sort and review the applications. Network managers audit the site and fill in the audit report. The managers work in the field on their phones, so in September 2024 I made the whole app work on a phone.
- I added an export of every application with all its fields, for the assistants. When the file grew too big, I moved it to the server, and the file now arrives by email.
- In January 2026, I made the first application simpler and added renewals: assistants send a renewal request to one centre or several at once. This was ready for the client to test on 26 January 2026, then went into production.

## What I fixed

- After the app moved to its final web address, centres with an application in progress could no longer open their link. I deployed the fix the same evening, on 30 August 2024.
- A number typed with a space between the thousands was not saved, and no error showed. I set 17 fields to whole numbers and 7 to a money format.
- The address search saved a different address than the one typed. I explained in writing what the address field could and could not do, and shipped a smaller fix the client accepted.

## How I worked

Every change went to a test version first, with a link. The client's project lead tested each point and gave the go for production. From August 2024, I wrote to the client directly, and from October 2024 I announced every release in the project chat before it went out. Before a change with a trade-off, I explained the options in writing. For each fix, I sent a screenshot or a short video.

## Results | In production since July 2024, still changing in 2026.

- In production on 4 July 2024.
- Every application is checked against 15 rules the moment it is sent, and a refused centre gets the reasons by email.
- One of three applications I built for this client.
