import { expect, test } from "bun:test";
import { updateDecision } from "../tools/update-upstream.mjs";

const current = { sha: "a".repeat(40), version: "0.15.5" };
test("same revision is an idempotent no-op", () => {
  expect(updateDecision(current, current)).toBe(false);
});
test("same-version upstream corrections still produce an update", () => {
  expect(updateDecision(current, { sha: "b".repeat(40), version: "0.15.5" })).toBe(true);
});
test("a newer minor release can reset its patch version", () => {
  expect(updateDecision(current, { sha: "b".repeat(40), version: "0.16.0" })).toBe(true);
});
test("malformed revisions and version rollback stop publication", () => {
  expect(() => updateDecision(current, { sha: "main", version: "0.15.6" })).toThrow();
  expect(() => updateDecision(current, { sha: "b".repeat(40), version: "0.14.9" })).toThrow();
  expect(() => updateDecision(current, { sha: "b".repeat(40), version: "latest" })).toThrow();
});
