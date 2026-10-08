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

## Visual review

`npm run review` starts the dev server on all interfaces, port 4331, so the Mac opens it over Tailscale (http://jarvis:4331/). The [astro-agentation](https://github.com/gautierlp/astro-agentation) integration adds the Agentation toolbar on the dev server only, starts its annotation server on localhost:4747, and saves the `.astro` file and line of each clicked element in `attributes["data-insp-path"]` (Markdown text has none: find it from the clicked text). Notes live in `~/.agentation/store.db` on jarvis, not in the repo. Read them with the `agentation` MCP server (`.mcp.json`) or `curl localhost:4747/sessions`. A test checks that no built page ships Agentation, React or `data-insp-path`.

## Tests

`npm test` runs the unit tests, builds the site, then checks `dist/`. Set `GITHUB_TOKEN` (for example `GITHUB_TOKEN=$(gh auth token)`) to include the contribution graph test.

## Content

Case studies are Markdown files under `src/content/case-studies/`, client pages under `src/content/clients/`. They are the only source: edit them by hand. A heading written `## Situation | A sentence.` shows the label above the sentence. The Contra and use-case import scripts were deleted on 2026-09-29. Name the end client, never the IT services company between Gautier and that client: NoxCod (Camarage, Clean Car, Protech, Pachamama, the automotive group) and Evodev (Domeet). Do not mention an agency at all. A test fails if any page contains either name.
