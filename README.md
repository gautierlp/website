# website

Personal website, replacing the old Carrd page. Built with [Astro](https://astro.build), deployed on Cloudflare.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start the local dev server at `localhost:4321` |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built site locally |

## Deploy

Cloudflare Workers (static assets), connected to this repo on GitHub. Every push to `main` builds and deploys.

- Build command: `npm run build`
- Output directory: `dist`

The offer text comes from `positioning.md` in the sibling `freelance` repo. Copy it by hand when it changes.
