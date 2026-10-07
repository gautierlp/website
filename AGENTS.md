**Context card:** `~/vault/20 Areas/freelance/_area.md` (status, goals, links). Read it first.
The positioning that the site copy derives from is `~/vault/20 Areas/freelance/positioning.md`; decisions and logs go to that vault folder (never run git there), and code docs, specs and plans stay in this repo.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Tests

`npm test` runs the unit tests, builds the site, then checks `dist/`. Set `GITHUB_TOKEN` (for example `GITHUB_TOKEN=$(gh auth token)`) to include the contribution graph test.

## Content

Case studies are Markdown files under `src/content/case-studies/`, client pages under `src/content/clients/`. They are the only source: edit them by hand. A heading written `## Situation | A sentence.` shows the label above the sentence. The Contra and use-case import scripts were deleted on 2026-09-29. Name the end client, never NoxCod: NoxCod is the IT services company that billed Gautier's work to Camarage, Clean Car, Protech, Pachamama and the automotive group. A test fails if any page contains the name.
