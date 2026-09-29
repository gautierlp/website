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

This repository holds the source of lepoher.co. It replaces a page made with Carrd, and it keeps that page's look on purpose: the page read well, and I wanted the content model first and a redesign later.

The site has three page types:

- The homepage: who I am, three featured projects, the use cases, every app I built, and a call to action.
- One page per project (11 today): the full story, screenshots, the client's review, and links to the use cases it belongs to.
- One page per use case (4 today): a longer text on one kind of work, with the projects where it applied.

Every page exists in English and, under `/fr/`, in French. A page with no French text yet shows the English text.

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
| `python3 -m unittest tests/test_import_contra.py` | Test the Contra import converter |

Set `GITHUB_TOKEN` to include the graph and its test: `GITHUB_TOKEN=$(gh auth token) npm test`.

### Where the content lives

| Path | Content |
|---|---|
| `src/content/projects/{en,fr}/<slug>.md` | One project per file. A header block (name, client, logo, result, links, use cases, status), then the story in Markdown |
| `src/content/use-cases/{en,fr}/<slug>.md` | One use case per file, same shape |
| `src/i18n/ui.ts` | Every UI string, in English and French |
| `src/content.config.ts` | The list of header fields and their types; the build checks every file against it |

### Add a project

1. Create `src/content/projects/en/<slug>.md`. Copy the header block of an existing file and fill it.
2. Put the screenshots under `public/assets/projects/<slug>/`.
3. Set `status: "live"`. With `status: "draft"` the page builds, shows a grey note, and tells search engines to skip it.
4. Run `npm test`.

### Add the French text of a page

Create the same file under `src/content/projects/fr/` (or `src/content/use-cases/fr/`). The French route then uses it. Until then, the French route shows the English text and points search engines to the English page.

### Import scripts

Two one-off scripts in `scripts/` built the first content. I keep them as a record of where the text came from:

- `import_contra.py` fetched the 8 case studies published on Contra, with their images and videos.
- `import_use_cases.py` copied the 4 case-study drafts from the sibling `freelance` repository.

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
- [x] One page per project and per use case
- [x] English and French routes
- [x] GitHub contribution graph
- [ ] French texts for the projects and use cases
- [ ] Rewrite the 8 imported stories (remove the duplicated review, real alt text, lighter images)
- [ ] Texts for the 3 projects without a story
- [ ] Point the lepoher.co domain at Cloudflare
- [x] Text-only design after plud.net (the Carrd look is kept under the git tag `archive/carrd-design`)
- [x] Booking through a Cal.com popup, self-hosted at book.lepoher.co
- [ ] A `/privacy` page, then point the Google Cloud project `calcom-jarvis` (Branding) at it instead of the homepage

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
