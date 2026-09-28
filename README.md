# website

Personal website, replacing the old Carrd page. Built with [Astro](https://astro.build), deployed on Cloudflare.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start the local dev server at `localhost:4321` |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm test` | Unit tests, build, then the tests on `dist/` |

## Structure

- `src/content/projects/{en,fr}/<slug>.md`: one project per file. `status: draft` shows a grey note and hides the page from search engines.
- `src/content/use-cases/{en,fr}/<slug>.md`: one use case per file.
- A missing `fr/` file makes the French page show the English text.
- `src/i18n/ui.ts`: every UI string, English and French.
- `scripts/import_contra.py`: the one-off import of the 8 Contra stories (2026-09-28). `scripts/import_use_cases.py`: copies the 4 drafts from the `freelance` repo.

## Deploy

Cloudflare Workers (static assets), connected to this repo on GitHub. Every push to `main` builds and deploys.

- Build command: `npm run build`
- Output directory: `dist`
- Build variable: `GITHUB_TOKEN` (a token with `read:user`), for the contribution graph. Without it the build passes and the graph is absent.

The offer text comes from `positioning.md` in the sibling `freelance` repo. Copy it by hand when it changes.
