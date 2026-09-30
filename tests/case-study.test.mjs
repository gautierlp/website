import { test } from "node:test";
import assert from "node:assert/strict";
import rehypeCaseStudy, { rewrite } from "../src/lib/rehype-case-study.mjs";

const text = (value) => ({ type: "text", value });
const el = (tagName, properties, children = []) => ({ type: "element", tagName, properties, children });

test("a labelled heading splits into a label and a title", () => {
  const out = rewrite(el("h2", {}, [text("Situation | The product had outgrown Bubble.")]));
  assert.deepEqual(out.properties.className, ["cs-h"]);
  assert.deepEqual(out.children[0].properties.className, ["cs-label"]);
  assert.equal(out.children[0].children[0].value, "Situation");
  assert.deepEqual(out.children[1].properties.className, ["cs-title"]);
  assert.equal(out.children[1].children[0].value, "The product had outgrown Bubble.");
});

test("a heading with no bar stays as it is", () => {
  const node = el("h2", {}, [text("Why Bubble, for this client")]);
  assert.equal(rewrite(node), node);
});

test("a paragraph that holds only an image becomes a stage, its title the caption", () => {
  const img = el("img", { src: "/a.webp", alt: "A", title: "The map" });
  const out = rewrite(el("p", {}, [text("\n"), img, text("\n")]));
  assert.equal(out.tagName, "figure");
  assert.deepEqual(out.properties.className, ["stage"]);
  assert.equal(out.children[0].tagName, "img");
  assert.equal(out.children[0].properties.title, undefined);
  assert.equal(out.children[1].tagName, "figcaption");
  assert.equal(out.children[1].children[0].value, "The map");
});

test("a paragraph with text and an image stays a paragraph", () => {
  const node = el("p", {}, [text("See "), el("img", { src: "/a.webp", alt: "A" })]);
  assert.equal(rewrite(node), node);
});

test("a video at the top level, parsed or raw, goes in a stage", () => {
  const video = el("video", { src: "/v.mp4" });
  assert.equal(rewrite(video).tagName, "figure");
  const raw = { type: "raw", value: '<video controls src="/v.mp4"></video>' };
  const out = rewrite(raw);
  assert.equal(out.tagName, "figure");
  assert.equal(out.children[0], raw);
});

test("the plugin rewrites the top-level children of the tree", () => {
  const tree = { type: "root", children: [el("h2", {}, [text("Task | Map it.")]), el("p", {}, [text("Body.")])] };
  rehypeCaseStudy()(tree);
  assert.deepEqual(tree.children[0].properties.className, ["cs-h"]);
  assert.equal(tree.children[1].tagName, "p");
});
