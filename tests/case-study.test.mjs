import { test } from "node:test";
import assert from "node:assert/strict";
import rehypeCaseStudy, { rewrite } from "../src/lib/rehype-case-study.mjs";
import { formatStat, parseStat } from "../src/lib/stats.ts";

const text = (value) => ({ type: "text", value });
const el = (tagName, properties, children = []) => ({ type: "element", tagName, properties, children });

test("a labelled heading splits into a label and a title", () => {
  const out = rewrite(el("h2", {}, [text("Situation | The product had outgrown Bubble.")]));
  assert.deepEqual(out.properties.className, ["cs-h"]);
  assert.deepEqual(out.children[0].properties.className, ["cs-label"]);
  assert.equal(out.children[0].children[0].value, "Situation");
  assert.deepEqual(out.children[1], { type: "text", value: " " });
  assert.deepEqual(out.children[2].properties.className, ["cs-title"]);
  assert.equal(out.children[2].children[0].value, "The product had outgrown Bubble.");
  const words = (n) => (n.type === "text" ? n.value : n.children.map(words).join(""));
  assert.equal(words(out), "Situation The product had outgrown Bubble.");
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

test("a raw video alone in its paragraph (open and close tag as two raw nodes) goes in a stage", () => {
  const open = { type: "raw", value: '<video controls src="/v.mp4">' };
  const close = { type: "raw", value: "</video>" };
  const out = rewrite(el("p", {}, [open, close]));
  assert.equal(out.tagName, "figure");
  assert.deepEqual(out.children, [open, close]);
  const mixed = el("p", {}, [text("See "), open, close]);
  assert.equal(rewrite(mixed), mixed);
});

test("the plugin rewrites the top-level children of the tree", () => {
  const tree = { type: "root", children: [el("h2", {}, [text("Task | Map it.")]), el("p", {}, [text("Body.")])] };
  rehypeCaseStudy()(tree);
  assert.deepEqual(tree.children[0].properties.className, ["cs-h"]);
  assert.equal(tree.children[1].tagName, "p");
});

test("parseStat splits a value around the one whole number in it", () => {
  assert.deepEqual(parseStat("200k"), { prefix: "", n: 200, suffix: "k", sep: "" });
  assert.deepEqual(parseStat("1,000"), { prefix: "", n: 1000, suffix: "", sep: "," });
  assert.equal(parseStat("+1").prefix, "+");
  assert.equal(parseStat("600+").suffix, "+");
  assert.equal(parseStat("13 working days").n, 13);
});

test("parseStat reads a French number, with a non-breaking space between the thousands", () => {
  assert.deepEqual(parseStat("8\u00a0152"), { prefix: "", n: 8152, suffix: "", sep: "\u00a0" });
  assert.deepEqual(parseStat("3\u00a0000+"), { prefix: "", n: 3000, suffix: "+", sep: "\u00a0" });
  assert.equal(parseStat("2 mois").n, 2);
});

test("parseStat gives up on a value with no single number to count", () => {
  assert.equal(parseStat("From 0 to $3k"), null);
  assert.equal(parseStat("2.5x"), null);
  assert.equal(parseStat("no number"), null);
});

test("formatStat writes a step of the count the way the final value is written", () => {
  assert.equal(formatStat(parseStat("1,000"), 1000), "1,000");
  assert.equal(formatStat(parseStat("1,000"), 250), "250");
  assert.equal(formatStat(parseStat("200k"), 37), "37k");
  assert.equal(formatStat(parseStat("8\u00a0152"), 4500), "4\u00a0500");
});
