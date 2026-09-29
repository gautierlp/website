---
name: "The marketing site migration"
title: "Lighthouse 100 on performance and SEO: a nine-language site off WordPress in two weeks, no downtime"
summary: "A nine-language site moves off WordPress to Astro and Sanity in two weeks, no downtime."
result: "100"
resultLabel: "Lighthouse performance and SEO"
projects: ["evaboot"]
order: 3
status: "draft"
---

## Situation

The marketing site ran on WordPress. Content changes went through a developer, the
site was slow on Core Web Vitals, and the stack did not match the rest of the product.

## Task

Move the site to Astro for the front and Sanity as the headless CMS, keep the content
and the URLs, and leave the team able to edit without a developer.

## Actions

- Audited the WordPress site and defined the stack (27 February 2026).
- Exported and prepared the content, built the Sanity schema in one day (3 March).
- Migrated the static pages and the blog, with a URL structure audit and redirects.
- Rebuilt the navigation, the author pages, and the translations across nine languages.
- Switched the production dataset (13 March) and removed the WordPress export and the
  migration scripts once the move was verified.
- Fixed Core Web Vitals after launch: an INP issue at 247 ms, a 94 ms blocking-time hit
  from a third-party script, both removed by deferred loading (April 2026).
- Removed a reCAPTCHA dependency behind a feature flag, deployed on Cloudflare.
- Planned and ran the cut-over in three phases, written up for the founder step by
  step: DNS moved to Cloudflare first, with no downtime and no visible change for
  visitors; then the switch of the domain to the new deployment; then the checks, 301
  redirects on the old URLs, the sitemap submitted to Search Console, and crawl errors
  watched daily for 48 hours and weekly for four to six weeks (25 March 2026).

## Results

- Core migration done in about two weeks, planning to production dataset.
- Nine languages live.
- The team edits content in Sanity without a developer.
- Lighthouse after the move, 25 March 2026: Performance 100, Accessibility 93, Best
  Practices 100, SEO 100. The one open item was font colour contrast.

## What you get

A site move with a fixed scope, done by one person and handed over. Your team
edits the content without a developer, and the old URLs redirect to the new ones.
