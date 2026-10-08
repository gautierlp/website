// @ts-check
import { defineConfig } from "astro/config";
import agentation from "astro-agentation";
import rehypeCaseStudy from "./src/lib/rehype-case-study.mjs";

export default defineConfig({
  site: "https://lepoher.co",
  // The review server is opened from the Mac by its Tailscale name.
  server: { allowedHosts: ["jarvis", ".ts.net"] },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: { prefixDefaultLocale: false },
  },
  markdown: { rehypePlugins: [rehypeCaseStudy] },
  // Review notes on the dev server only: see "Visual review" in AGENTS.md.
  integrations: [agentation()],
});
