---
kind: "app"
name: "Brivane"
title: "Built a battery recycling app in 2 months, then extended it a year later"
summary: "An app to collect used electric-vehicle batteries from dealerships and send them to a recycler, built in 2023 and extended in 2024."
intro: "An app to collect used electric-vehicle batteries from dealerships and send them to a recycler, built in 2023 and extended in 2024."
client: "A subsidiary of a large French automotive group"
clientPage: "automotive-group"
when: "August 2023 to February 2025"
result: "2 months"
resultLabel: "to build a battery recycling app, extended a year later"
stats: [{"value": "2 months", "label": "from the first day to a tested app, 22 August to 23 October 2023"}, {"value": "113 hours", "label": "of work in total, over two rounds"}]
cover: {"src": "/assets/projects/battery-recycling/lcmjv6ajvfl8c9kma4qc.webp", "alt": "Battery recycling"}
featured: false
nda: true
order: 7
status: "live"
review: "Rewritten on 2026-10-02 from the sources (the project's source notes). Gone, because no source supports them: the Excel, email and hand-made PDF process before the app, lost requests, PDFs with no third-party tool, a PDF template the admins edit, a board that refreshes on its own, and carriers and recyclers as app users (they get emails and the PDF). The Results line no longer says one app a year: the chat shows another app for this client in development in November and December 2023. Gautier confirmed on 2026-10-06 the move from SendGrid to Mailjet (date not known). Check the title, the 2 months (first entry 22 August, PDF and emails confirmed working 23 October 2023), then delete this line."
---

## Situation | Dealerships had used batteries to send to a recycler.

The client collects used electric-vehicle batteries from car dealerships. It books a carrier to take each battery to a recycler, then sends the dealership a recycling certificate. Each battery carries regulatory waste numbers that must follow it.

In August 2023, the agency that introduced me to the client had designed the screens. I built the app.

## Task | One app from the dealership's request to the certificate.

Let a dealership request a pickup, let the client's admins follow each battery to the recycler, and send each party the right email and document at each step.

## Actions | A request form, a board, transport orders and emails.

- I designed the data model, then built the login and the admin side. Each battery is a card on a board, in columns: request, compliant, delivered, invoiced, archived.
- I built the request form for the dealerships, on phone and desktop, with a confirmation screen and a button to start a new request.
- I built the transport orders. An admin groups batteries into an order for a carrier and a recycler, and the app makes the order as a PDF, from the client's own model.
- I built the emails: to the dealership and the admins when a request comes in, to the carrier with the PDF, to the recycler, and to the dealership on delivery and with the recycling certificate. My demo of 23 October 2023 showed six emails. The client tested it the same day: "I can see it works." The emails went out through SendGrid at first; we later moved them to Mailjet.
- In the first round of the client's tickets (September to November 2023), I added the regulatory numbers, the price of each transport order, a "not compliant" flag, and a rule that a battery needs its recycling certificate before it is invoiced.
- In the second round (August 2024 to February 2025), from the client's list of changes: one transport order can now group batteries from several dealerships, and the PDF lists every one of them. An admin can edit the PDF before it goes to the carrier, without changing the data in the app. A request needs both regulatory numbers before it becomes compliant.

## What I fixed

- The transport order card showed the recycler's address instead of the pickup address (fixed on 1 November 2023).
- The emails to the carrier and the recycler named only the first dealership of an order. I rewrote them with the client's wording (validated on 29 January 2025).
- The admin side swapped the pickup site and the dealership when they differed. The requester's confirmation email went out at the wrong moment, then not at all: a condition had slipped past me. Both were fixed and validated on 31 January 2025.

## How I worked

Before the second round, I sent the client a video and six numbered questions, so nothing got built on a guess. Every change went to a test version first, then to production after the client approved it. In October 2023 I shipped a fix while the client was testing, and they asked to be warned before every release. For the last release, on 3 February 2025, I gave the time that afternoon and confirmed once it was done.

## Results | Tested and validated by the client, in both rounds.

- The PDF and the emails worked on 23 October 2023, two months after my first day. All eight tickets of the first round were closed as "done and validated".
- On 31 January 2025, the client validated every fix of the second round. I released it on 3 February 2025.
- 113 hours of work in total, from August 2023 to February 2025.
- One of three applications I built for this client.
