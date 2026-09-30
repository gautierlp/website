// @ts-check
import { defineConfig } from "astro/config";
import rehypeCaseStudy from "./src/lib/rehype-case-study.mjs";

export default defineConfig({
  site: "https://lepoher.co",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: { prefixDefaultLocale: false },
  },
  markdown: { rehypePlugins: [rehypeCaseStudy] },
});
