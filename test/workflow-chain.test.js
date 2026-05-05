import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { parseSkillFile, toArray } from "../scripts/lib/frontmatter.js";

const root = path.resolve(import.meta.dirname, "..");

function skill(slug) {
  const parsed = parseSkillFile(path.join(root, slug, "SKILL.md"));
  assert.equal(parsed.error, undefined);
  return parsed.meta;
}

test("canonical planning chain is discoverable from composable metadata", () => {
  assert.ok(toArray(skill("planning/grill-me").composable_with).includes("planning/to-prd"));
  assert.ok(toArray(skill("planning/grill-with-docs").composable_with).includes("planning/to-prd"));
  assert.ok(toArray(skill("planning/to-prd").composable_with).includes("planning/prd-to-plan"));
  assert.ok(toArray(skill("planning/prd-to-plan").composable_with).includes("planning/to-issues"));
  assert.ok(toArray(skill("planning/to-issues").composable_with).includes("development/tdd"));
});

test("upstream renamed skills are canonical while old names remain aliases", () => {
  assert.ok(toArray(skill("planning/to-prd").aliases).includes("write-a-prd"));
  assert.ok(toArray(skill("planning/to-issues").aliases).includes("prd-to-issues"));
  assert.ok(toArray(skill("development/diagnose").aliases).includes("systematic-debugging"));
  assert.ok(toArray(skill("development/triage").aliases).includes("triage-issue"));
});

test("new upstream-derived skills are discoverable", () => {
  assert.equal(skill("productivity/caveman").name, "caveman");
  assert.equal(skill("architecture/zoom-out").name, "zoom-out");
  assert.equal(skill("planning/grill-with-docs").name, "grill-with-docs");
});

test("architecture cleanup is an optional preflight, not the mandatory planning start", () => {
  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  assert.match(readme, /optional architecture preflight/i);
  assert.match(readme, /not mandatory/i);
  assert.ok(toArray(skill("architecture/improve-codebase-architecture").composable_with).includes("development/tdd"));
});


test("upstream-deprecated skills are not canonical", () => {
  assert.throws(() => skill("architecture/design-an-interface"));
  assert.throws(() => skill("tooling/ubiquitous-language"));
});
