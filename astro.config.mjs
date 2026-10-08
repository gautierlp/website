// @ts-check
import { defineConfig } from "astro/config";
import rehypeCaseStudy from "./src/lib/rehype-case-study.mjs";

// The Agentation toolbar, on dev server pages only: the built site gets nothing.
const agentationReview = {
  name: "agentation-review",
  hooks: {
    "astro:config:setup": ({ command, injectScript }) => {
      if (command === "dev") injectScript("page", `import "/src/dev/review.ts";`);
    },
  },
};

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
  integrations: [agentationReview],
  // Agentation's annotation server accepts only localhost origins, so the dev
  // server forwards /agentation to it and the browser stays on one origin.
  vite: {
    server: {
      proxy: {
        "/agentation": {
          target: "http://localhost:4747",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/agentation/, ""),
          configure: (proxy) => proxy.on("proxyReq", (req) => req.setHeader("origin", "http://localhost:4747")),
        },
      },
    },
  },
});
