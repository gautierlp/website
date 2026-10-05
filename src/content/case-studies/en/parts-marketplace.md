---
kind: "app"
name: "Varnel"
title: "A used parts ordering site for car repairers, live 37 days after I joined"
summary: "A site where car repairers find used parts held by car recycling centres and order them. Live 37 days after my first day, then two years of changes."
intro: "A site where car repairers find used parts held by car recycling centres and order them. Live 37 days after my first day, then two years of changes."
client: "A subsidiary of a large French automotive group"
clientPage: "automotive-group"
when: "October 2023 to September 2025"
result: "37 days"
resultLabel: "from my first day to the site in production"
stats: [{"value": "37 days", "label": "from my first day to the site in production"}, {"value": "Every weeknight", "label": "the parts list refreshed from the client's file"}]
cover: {"src": "/assets/projects/parts-marketplace/wcipnwjiikjqyctuxvsx.webp", "alt": "Parts marketplace"}
featured: false
nda: true
order: 4
status: "live"
review: "Rewritten on 2026-10-02 from the sources (the project's source notes). The old 2 weeks claim was wrong: my first day was 30 October 2023, the first version was ready to test on 20 November, the site went to production on 6 December. The old page also said the parts came from dealerships and that admins got each cart by email: the parts sit in car recycling centres, and each order goes to the centre that holds the part. Check the title, the stats, and the line on the three apps (the battery app started in August 2023 and the application portal in November 2023, so the old 'one a year from 2023 to 2025' line is gone; nothing in these sources shows use in 2026). Check it, then delete this line."
---

## Situation | Repairers needed to find used parts, and the stock changed every day.

The client runs a network of car recycling centres. They take parts off old cars and sell them. The client wanted car repairers to search those parts online and order them, as a trial run.

The parts list lives in the client's own system. Each day it puts a new file of all the parts in stock on a server, and the site has to follow it.

On 30 October 2023, the agency put me on the project as its developer. The client planned to show the site to repairers on 28 and 29 November and go live right after.

## Task | Build the site and keep its parts list current on its own.

Build the search, the basket and the orders, read the client's daily parts file into the site, and send each order to the right recycling centre.

## Actions | A first version in three weeks, then two years of changes.

- I built the first version in November 2023: sign-up and login, the search page, the basket, the account page, and a layout that works on smaller screens.
- With another developer at the agency, I built the parts import. An automation tool (Make) picks up the client's file each night, cuts it into packs of 500 lines and sends them to the site. Each import replaces the whole list. A part someone already ordered is kept aside as a record, not deleted.
- When a repairer confirms a basket, each recycling centre gets an email with the parts ordered from it. Later I added a confirmation email to the repairer, with the same table of parts.
- A repairer searches by the maker's part number or, when the file has none, by brand, model and type of part. I made the model list follow the chosen brand.
- In 2024 I replaced the wide table of results with cards, 25 or 50 per page. I added the end date of each part's exclusive period, two months after it became available, read from a new column of the file.
- I added a contact form, a request form for new accounts with an admin page to approve them, and a button that downloads all parts in stock as a spreadsheet.

## What I fixed

- The first part of a large file went missing after an import. The file was cut into packs the wrong way. I fixed it the same day.
- After the account requests went live in April 2024, no user could log in: the new "active" field was empty for every existing user. I told the client it was my side effect and offered to mark all current users active.
- The forgot-password email never left. It still used the tool Bubble sets by default, not the client's email service. I moved it over in March 2025.
- In September 2025 the parts list had stopped updating. I set the nightly import to run Monday to Friday at 23:30 and ran it once by hand. The client confirmed the list was up to date that day.

## How I worked

Each request was a ticket. Larger ones went through a quote first. When a request was unclear, I asked before I built: whether a new date would come in the client's file, or a quick sketch of the model list to confirm it. Every change went to the test version first with a link, and to production after the client approved it.

Not everything went well. The agency apologised to the client for a late delivery: it had underestimated the import. The first version was ready to test on 20 November 2023. In December the client asked us to test more carefully, because bugs had reached them.

## Results | Live in 37 days, and still kept current two years later.

- The site went to production on 6 December 2023, 37 days after my first day. About 52 hours of my work went into that first version.
- The parts list refreshes from the client's file every weeknight.
- I kept working on it until September 2025, about 98 hours in all.
- One of three applications I built for this client. All three were still in use in September 2026.
