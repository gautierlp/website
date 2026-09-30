// Two rewrites for story pages, on the top level of the Markdown body:
// 1. "## Situation | The product had outgrown Bubble." becomes a small label above the heading.
// 2. An image or video alone in its block goes in a grey "stage", wider than the text.
// A heading with no "|" and a paragraph with text in it are left alone.

const LABELLED = /^\s*([^|]+?)\s*\|\s*(.+)$/s;

const el = (tagName, className, children) => ({
  type: "element",
  tagName,
  properties: className ? { className: [className] } : {},
  children,
});
const isMedia = (n) => n?.type === "element" && (n.tagName === "img" || n.tagName === "video");
const isRawVideo = (n) => n?.type === "raw" && /^\s*<video[\s>]/.test(n.value);
const isBlank = (n) => n.type === "text" && n.value.trim() === "";

function stage(media) {
  const caption = media.type === "element" ? media.properties?.title : undefined;
  if (caption) delete media.properties.title;
  const children = caption ? [media, el("figcaption", null, [{ type: "text", value: String(caption) }])] : [media];
  return el("figure", "stage", children);
}

function labelHeading(node) {
  const [first, ...rest] = node.children;
  const match = first?.type === "text" ? first.value.match(LABELLED) : null;
  if (!match) return node;
  return {
    ...node,
    properties: { ...node.properties, className: ["cs-h"] },
    children: [
      el("span", "cs-label", [{ type: "text", value: match[1] }]),
      el("span", "cs-title", [{ type: "text", value: match[2] }, ...rest]),
    ],
  };
}

export function rewrite(node) {
  if (node.type === "element" && node.tagName === "h2") return labelHeading(node);
  if (node.type === "element" && node.tagName === "p") {
    const kids = node.children.filter((c) => !isBlank(c));
    if (kids.length === 1 && isMedia(kids[0])) return stage(kids[0]);
    // Markdown splits an inline <video ...></video> into two raw nodes (open tag, close tag) inside the paragraph.
    if (kids.length > 0 && kids.every((c) => c.type === "raw") && isRawVideo(kids[0]) && /<\/video>\s*$/.test(kids.at(-1).value)) {
      return el("figure", "stage", kids);
    }
    return node;
  }
  if (isMedia(node) || isRawVideo(node)) return stage(node);
  return node;
}

export default function rehypeCaseStudy() {
  return (tree) => {
    tree.children = tree.children.map(rewrite);
  };
}
