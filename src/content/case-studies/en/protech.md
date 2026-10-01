---
kind: "app"
name: "Protech"
title: "Took over a car care platform in daily use, in 2023 and again in 2024"
summary: "I took over Protech's Bubble platform while its technicians, dealers and admins used it every day, in 2023 and again in 2024."
intro: "I took over Protech's Bubble platform while its technicians, dealers and admins used it every day, in 2023 and again in 2024."
client: "Protech"
when: "September 2023 to April 2025"
logo: "/assets/images/image11.png"
result: "Took over"
resultLabel: "a car care platform in daily use, in 2023 and again in 2024"
stats: [{"value": "Every night", "label": "every job exported to the managers' Google Sheet"}, {"value": "2", "label": "takeovers of a platform in daily use"}]
links: [{"label": "protech.mc", "url": "https://protech.mc/"}]
featured: false
nda: false
order: 11
status: "live"
review: "Drafted on 2026-10-01 from the Nifty discussion and tickets, the Clockify export and the NoxCod invoices. Check the title, the stats, and the time column in the export (asked on 2023-10-25, delivery not confirmed in the sources), then delete this line."
---

## Situation | A platform in daily use, built by another developer.

[Protech](https://protech.mc/) has cared for cars in Monte-Carlo since 1989: protection films and treatments. Its business runs on one Bubble platform, built with the agency NoxCod. Car dealers request prices and book jobs there, technicians follow each job in a mobile app, and admins run the jobs and the dealers.

In September 2023, NoxCod introduced me to Protech as the new developer in charge of the changes. I came back in December 2024 for a second round, until April 2025.

## Task | Take over without breaking a tool people use every day.

Take over a platform that technicians, dealers and admins used every day, ship what Protech asked for, and keep the data the managers rely on correct.

## Actions | A nightly export, prices to check, a warranty scanner.

- I sent the jobs to the tool the managers already used. Every night at midnight, every open job goes to a Google Sheet. Closed jobs stay out. When the connection broke in December 2025, I restored it.
- I made prices checkable. The platform calculated each price every time it showed a job. I saved the prices in the database and showed them under the calculated ones, for the technicians and the admins, so Protech could compare the two before trusting the saved values.
- I made the satisfaction score faster to calculate.
- I added a QR code scan of warranties to the technicians' app, so a technician scans a warranty instead of typing a long number.
- In the second round, I added the dealer's purchase price under the recommended retail price, and two items for jobs that match no standard part, priced by the hour or by the square metre.

## What I fixed

- The app applied the wrong discount when a dealer requested a price.
- Parts showed differently on a computer and on a tablet.
- A dealer could not log in. An admin could not delete a dealership. Nobody could create a contact with the planning status.

## How I worked

Each round started with a kick-off. Changes went to a test version first, with a link Protech could try, and then to production. When Protech reported several bugs at once, I sent a list of each one with its status, so they knew what was fixed and what came next.

## Results | Two takeovers, and a sheet that fills itself every night.

- Every open job reaches the managers' Google Sheet every night.
- The admins see the saved price next to the calculated one.
