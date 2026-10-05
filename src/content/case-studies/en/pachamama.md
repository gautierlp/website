---
kind: "app"
name: "Pachamama"
title: "Took over building a recruitment platform with 5,000+ candidates"
summary: "I took over building Pachamama's recruitment platform on Bubble and shipped 57 tickets in 15 months."
intro: "I took over building Pachamama's recruitment platform on Bubble and shipped 57 tickets in 15 months."
client: "Pachamama"
when: "November 2024 to February 2026"
result: "Took over building"
resultLabel: "a recruitment platform with 5,000+ candidates"
stats: [{"value": "57", "label": "tickets shipped in 15 months"}, {"value": "5,000+", "label": "candidates in the search I rebuilt"}]
featured: false
# Second in the Track record, after Evaboot: 15 months of work.
order: 1.5
status: "live"
review: "Checked on 2026-10-02 against the sources (sources/pachamama/notes.md). Kept 57 (58 tickets marked done in Nifty, minus PAC-566 done by another NoxCod developer) and the 5,000+ (admin_candidat, December 2025). Changed: the app was not built with NoxCod (it existed before NoxCod joined in November 2023), the search no longer works again (no source says it worked before), not every ticket went to a test version (PAC-497, PAC-545 went straight to production), the spam cause is now a likely cause, and 3 business areas merged is now 6 merged into 3. Check the second stat label and the results, then delete this line."
---

## Situation | The whole business runs on one Bubble app.

Pachamama is a recruitment collective. It places people in permanent jobs and in freelance missions. The whole business runs on one Bubble app, and the agency NoxCod has worked on it since November 2023. Recruiters manage hiring assignments and candidates there, client companies follow their candidates in their own space, and candidates apply through a public job board.

In November 2024 I took over the development from the previous developer at NoxCod. I worked on the app until February 2026, with the NoxCod team.

## Task | Take over the app from the previous developer.

Take over the development of the Bubble app from the previous developer at NoxCod, and keep working on it with the NoxCod team.

## Actions | Faster pages, placement payouts, follow-ups and roles.

- I made the slow pages fast. The candidate page was slow, and the candidate search was slow or did not load at all. I moved most of its fields to a separate record, then rebuilt the search as a backend call that returns only what the result cards show.
- I added the money side of each placement: a second recruiter per deal, referral and co-option fees, and a table that shows who earns what. Then I filled in the new data on all 70 existing placements.
- I built the follow-up after a placement. The app creates the to-dos for each contract type and emails a reminder on the due date.
- With the product designer, I made rejections faster: new candidate cards on the hiring board, quick actions, rejection email templates, and a way to reject several candidates at once.
- I added two recruiter roles with different page access, a partner role for each business area, and an offboarding that keeps a recruiter's history in the stats.
- I added stats to the dashboard (client companies, candidates added per recruiter), Slack alerts for new assignments and placements, and data exports.

## What I fixed

- Invitation emails did not reach new clients. They left from the inviter's personal address, which likely sent them to spam. They now leave from the company domain, with the inviter as the reply-to.
- The email service rewrote secure links into insecure ones, and some users got a browser warning. I traced it to a tracking setting.
- A candidate who clicked twice created two applications. The button now locks after the first click.

## How I worked

Most tickets went to a test version first, with a link the client could try, and then to production. On the big tickets I asked questions before I wrote code. For the placement payouts I sent six, and the client split the work in two. When I hit a data problem on the way, I explained it, gave the options, and opened a ticket so it would not get lost.

## Results | 57 tickets shipped, and a rebuilt search.

- 57 tickets shipped in 15 months.
- A rebuilt candidate search, live in March 2025, on a base of more than 5,000 candidates by December 2025.
- 6 business areas merged into 3, across 7 data tables, with no data deleted.
