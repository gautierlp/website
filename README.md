<a id="readme-top"></a>

<div align="center">

# lepoher.co

Personal site of Gautier Le Poher, a technical product manager who takes over a product and ships it himself.

[Live site](https://lepoher.co) · [Report a problem](https://github.com/gautierlp/website/issues)

</div>

<details>
  <summary>Table of contents</summary>
  <ol>
    <li><a href="#about-the-project">About the project</a></li>
    <li><a href="#built-with">Built with</a></li>
    <li><a href="#getting-started">Getting started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#deploy">Deploy</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About the project

This repository holds the source of lepoher.co. It replaces a page made with Carrd.

The site has five page types:

- The homepage: who I am, the selected work, a pile of client reviews, the track record, the side projects and the GitHub graph.
- One page per case study (16, two of them drafts): the story in four parts (situation, task, actions, results), the numbers, screenshots and the client's review.
- One page per client with several case studies (2 today).
- The reviews page: every client review in full.
- The privacy page.

Every page exists in English and, under `/fr/`, in French. A page with no French text yet shows the English text and stays out of search.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built with

- [Astro 7](https://astro.build): static site, content collections, built-in i18n routing
- Plain CSS, no framework
- Node 22 (`node --test`) and Python 3 (`unittest`) for the tests
- [Cloudflare Workers](https://workers.cloudflare.com) for hosting
- The GitHub GraphQL API, at build time, for the contribution graph

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting started

### Prerequisites

- Node 22.12 or later
- Python 3.10 or later (only for the import scripts and their test)
- A GitHub token with the `read:user` scope, if you want the contribution graph (optional)

### Installation

```sh
git clone https://github.com/gautierlp/website.git
cd website
npm install
npm run dev
```

The dev server prints its address, usually `http://localhost:4321`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm test` | Run the unit tests, build the site, then run the tests on `dist/` |

Set `GITHUB_TOKEN` to include the graph and its test: `GITHUB_TOKEN=$(gh auth token) npm test`.

### Where the content lives

| Path | Content |
|---|---|
| `src/content/case-studies/{en,fr}/<slug>.md` | One case study per file: a header block, then the story in Markdown |
| `src/content/clients/{en,fr}/<slug>.md` | One client per file: a short header block and a paragraph about the client |
| `src/i18n/ui.ts` | Every UI string, in English and French |
| `src/content.config.ts` | The list of header fields and their types; the build checks every file against it |

The header fields of a case study: `kind` (`app` or `use-case`), `name`, `title` (the result, as a sentence), `summary`, `intro`, `client`, `clientPage` (slug of the client page, if any), `when` (the period, only if the text states it), `stats`, `cover`, `links`, `quote`, `nda`, `order`, `status`, `review`.

In the body, a heading written `## Label | Sentence` shows a small label above the sentence. `review` is never shown on the page: it flags text drafted by an assistant, so delete it once you have checked the text. A client page lists every case study whose `clientPage` names it.

### Add a case study

1. Create `src/content/case-studies/en/<slug>.md`. Copy the header block of an existing file and fill it.
2. Put the screenshots under `public/assets/projects/<slug>/`.
3. Set `status: "live"`. With `status: "draft"` the page builds, shows a grey note, and tells search engines to skip it.
4. Run `npm test`.

### Add the French text of a page

Create the same file under `src/content/case-studies/fr/` (or `src/content/clients/fr/`). The French route then uses it. Until then, the French route shows the English text and points search engines to the English page.

### Where the first content came from

Two one-off scripts built the first content: one fetched the 8 case studies published on Contra, one copied the 4 case-study drafts from the sibling `freelance` repository. Both are gone since the copy review of 2026-09-29, which rewrote the texts. The Markdown files are now the only source; the scripts are in the git history.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Deploy

Cloudflare Workers (static assets), connected to this repository on GitHub. Every push to `main` builds and deploys.

- Build command: `npm run build`
- Output directory: `dist`
- Build variable: `GITHUB_TOKEN`, for the contribution graph. Without it the build passes and the graph is absent.

The offer text comes from `positioning.md` in the sibling `freelance` repository. Copy it by hand when it changes.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Rebuild the Carrd page as Astro components
- [x] One page per case study and per client
- [x] English and French routes, with a language switch
- [x] French texts for the case studies and client pages (each French file keeps a review line until it is read)
- [x] GitHub contribution graph
- [x] Text-only design after plud.net (the Carrd look is kept under the git tag `archive/carrd-design`)
- [x] Booking through a Cal.com popup, self-hosted at book.lepoher.co
- [x] A `/privacy` page
- [ ] A `/legal` page (mentions légales): done except the business address and the phone number, which French law asks for
- [x] Side projects on the homepage, in a row that scrolls sideways
- [ ] Point the Google Cloud project `calcom-jarvis` (Branding) at https://lepoher.co/privacy/ once the domain points here
- [ ] Point the lepoher.co domain at Cloudflare (it still serves the Carrd page)
- [ ] Replace Google Analytics with Cloudflare Web Analytics (no cookies, so no consent banner), once the site runs on Cloudflare
- [ ] Read and clear the `review:` line of each case study, in both languages
- [ ] Client approval for the 2 draft case studies (BETC, Price Writers), then set them live
- [ ] A link on every side project tile: an open-source project opens its GitHub repository, a private one opens an article on this site. The four projects on the page (home server, finance app, Jolt, Session reviewer) are private and have no article yet, so no tile has a link
- [ ] A blog. It starts with the articles about the private side projects. Not designed yet: run the brainstorm, spec and plan flow before any code

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

No license file. The code is public to read; the texts, images and videos belong to me and to the clients they show.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Gautier Le Poher, gautier@lepoher.co

- [LinkedIn](https://www.linkedin.com/in/gautier-le-poher/)
- [Malt](https://www.malt.fr/profile/gautierlepoher)
- [Contra](https://contra.com/gautierlp)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Best-README-Template](https://github.com/othneildrew/Best-README-Template) for the shape of this file
- [creativeatishay.in](https://www.creativeatishay.in) for the number column and the GitHub graph idea
- [clintbalcom.com](https://www.clintbalcom.com) for the code-font verb in the headline

<p align="right">(<a href="#readme-top">back to top</a>)</p>
