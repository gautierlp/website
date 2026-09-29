import { test } from "node:test";
import assert from "node:assert/strict";
import { getLangFromPath, localePath, mailto, twinPath, t } from "../src/i18n/utils.ts";

test("getLangFromPath: no prefix is English", () => {
  assert.equal(getLangFromPath("/"), "en");
  assert.equal(getLangFromPath("/projects/evaboot/"), "en");
});

test("getLangFromPath: /fr prefix is French", () => {
  assert.equal(getLangFromPath("/fr/"), "fr");
  assert.equal(getLangFromPath("/fr/projects/evaboot/"), "fr");
});

test("localePath adds the prefix for French only", () => {
  assert.equal(localePath("en", "/projects/evaboot/"), "/projects/evaboot/");
  assert.equal(localePath("fr", "/projects/evaboot/"), "/fr/projects/evaboot/");
  assert.equal(localePath("fr", "/"), "/fr/");
});

test("twinPath swaps the language and keeps the path", () => {
  assert.deepEqual(twinPath("/projects/evaboot/"), { lang: "fr", href: "/fr/projects/evaboot/" });
  assert.deepEqual(twinPath("/fr/projects/evaboot/"), { lang: "en", href: "/projects/evaboot/" });
  assert.deepEqual(twinPath("/fr/"), { lang: "en", href: "/" });
});

test("t returns the French string when it exists", () => {
  assert.equal(t("fr")("hero.book"), "Réserver un appel");
});

test("t falls back to English for a missing French key", () => {
  assert.equal(t("fr")("test.onlyEnglish"), "only english");
});

test("mailto carries a subject that differs by language", () => {
  assert.equal(mailto("en"), "mailto:gautier@lepoher.co?subject=A%20product%20to%20take%20over");
  assert.equal(mailto("fr"), "mailto:gautier@lepoher.co?subject=Un%20produit%20%C3%A0%20reprendre");
});
