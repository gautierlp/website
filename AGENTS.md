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

`npm run review` starts Agentation's annotation server (localhost:4747) and the dev server on port 4331 of all interfaces, so the Mac opens it over Tailscale (http://jarvis:4331/). In the browser, start feedback mode in the toolbar at the bottom right, click an element or select text, and type the change. Each note keeps the page URL, the element text, the nearby text, a CSS path, and in `attributes["data-insp-path"]` the `.astro` file and line (stamped by code-inspector-plugin on the dev server; Markdown text has none). The notes live in `~/.agentation/store.db` on jarvis, not in the repo. Read them with the `agentation` MCP server (`.mcp.json`, `--mcp-only` so it reuses the running annotation server) or `curl localhost:4747/sessions`. A small integration in `astro.config.mjs` adds `src/dev/review.ts` to pages on the dev server only, so the built site ships no React and no toolbar. The dev server forwards `/agentation` to port 4747 and sets a localhost origin, because the annotation server rejects other origins.

## Tests

`npm test` runs the unit tests, builds the site, then checks `dist/`. Set `GITHUB_TOKEN` (for example `GITHUB_TOKEN=$(gh auth token)`) to include the contribution graph test.

## Content

Case studies are Markdown files under `src/content/case-studies/`, client pages under `src/content/clients/`. They are the only source: edit them by hand. A heading written `## Situation | A sentence.` shows the label above the sentence. The Contra and use-case import scripts were deleted on 2026-09-29. Name the end client, never the IT services company between Gautier and that client: NoxCod (Camarage, Clean Car, Protech, Pachamama, the automotive group) and Evodev (Domeet). Do not mention an agency at all. A test fails if any page contains either name.
