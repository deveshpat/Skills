import assert from "node:assert/strict";
import { test } from "node:test";
import { parseFrontmatterContent, toArray } from "../scripts/lib/frontmatter.js";

test("parses folded multiline frontmatter", () => {
  const parsed = parseFrontmatterContent(`---\nname: demo\ndescription: >\n  First line,\n  second line.\ncategory: tooling\n---\n# Body\n`);

  assert.equal(parsed.error, undefined);
  assert.equal(parsed.meta.description, "First line, second line.");
  assert.equal(parsed.body, "# Body\n");
});

test("parses inline arrays, block arrays, empty arrays, and booleans", () => {
  const parsed = parseFrontmatterContent(`---\nname: demo\ntags: [one, two, 'three']\ntarget_llms:\n  - chatgpt\n  - claude-code\ncomposable_with: []\ninputs:\n  - name: payload\n    required: true\n---\nBody\n`);

  assert.deepEqual(parsed.meta.tags, ["one", "two", "three"]);
  assert.deepEqual(parsed.meta.target_llms, ["chatgpt", "claude-code"]);
  assert.deepEqual(parsed.meta.composable_with, []);
  assert.deepEqual(parsed.meta.inputs, [{ name: "payload", required: true }]);
});

test("normalizes scalar values to arrays when needed", () => {
  assert.deepEqual(toArray("all"), ["all"]);
  assert.deepEqual(toArray(["all"]), ["all"]);
  assert.deepEqual(toArray(""), []);
});
