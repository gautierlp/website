// Agentation review toolbar, added to pages by the dev server only (see
// "Visual review" in AGENTS.md). The dev server forwards /agentation to the
// annotation server on port 4747, so this works from the Mac over Tailscale.
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Agentation } from "agentation";

const host = document.createElement("div");
document.body.append(host);
createRoot(host).render(
  createElement(Agentation, {
    endpoint: `${location.origin}/agentation`,
    // data-insp-path is the source file and line, stamped by code-inspector.
    identifyingAttributes: ["data-insp-path"],
  }),
);
