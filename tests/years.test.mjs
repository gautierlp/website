import { test } from "node:test";
import assert from "node:assert/strict";
import { yearsOf } from "../src/lib/years.ts";

test("a range over several years keeps the first year and the last two digits", () => {
  assert.equal(yearsOf("August 2023 to February 2025"), "2023–25");
  assert.equal(yearsOf("août 2023 à février 2025"), "2023–25");
});

test("a range inside one year, or a single month, gives one year", () => {
  assert.equal(yearsOf("May to July 2023"), "2023");
  assert.equal(yearsOf("December 2024"), "2024");
});

test("no date gives no years", () => {
  assert.equal(yearsOf(""), "");
});
