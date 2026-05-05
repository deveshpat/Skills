import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { findBrokenMarkdownLinks, findStaleReferences, walkFiles } from "../scripts/lib/doc-lint.js";

const root = path.resolve(import.meta.dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

test("docs do not reference stale runtime or metadata claims", () => {
  const failures = findStaleReferences(root, {
    exclude: (file) => file.startsWith("test/") || file === "scripts/lib/doc-lint.js",
  });

  assert.deepEqual(failures, []);
});

test("markdown local links resolve", () => {
  assert.deepEqual(findBrokenMarkdownLinks(root), []);
});

test("README stays human-facing while maintainer mechanics live in CONTRIBUTING", () => {
  const readme = read("README.md");
  const contributing = read("CONTRIBUTING.md");
  const userFacing = readme.split("## For maintainers")[0];

  assert.match(readme, /## Quick start/);
  assert.match(readme, /## Cookbooks/);
  assert.match(readme, /## Skill families/);
  assert.match(readme, /\[CONTRIBUTING\.md\]\(\.\/CONTRIBUTING\.md\)/);

  assert.doesNotMatch(userFacing, /scripts\/validate-skills\.js/);
  assert.doesNotMatch(userFacing, /scripts\/export\.js/);
  assert.doesNotMatch(userFacing, /Required frontmatter/);

  assert.match(contributing, /scripts\/validate-skills\.js/);
  assert.match(contributing, /Required frontmatter/);
  assert.ok(readme.split("\n").length < 240, "README should stay concise enough for human onboarding");
});

test("all canonical skills are marked LLM-agnostic", async () => {
  const { parseSkillFile, toArray } = await import("../scripts/lib/frontmatter.js");
  const failures = [];

  for (const file of walkFiles(root, { extensions: ["SKILL.md"] })) {
    const parsed = parseSkillFile(file);
    if (!toArray(parsed.meta.target_llms).includes("all")) failures.push(path.relative(root, file));
  }

  assert.deepEqual(failures, []);
});

test("public GitHub URLs use one canonical repo path", async () => {
  const { PROJECT_REPO, BASE_URL, ROUTER_URL } = await import("../scripts/lib/project-config.js");
  const failures = [];

  assert.equal(PROJECT_REPO, "deveshpat/Skill-Binder");
  assert.equal(BASE_URL, "https://raw.githubusercontent.com/deveshpat/Skill-Binder/main");
  assert.equal(ROUTER_URL, "https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/router.json");

  for (const file of walkFiles(root, { extensions: ["md", "json", "js"] })) {
    const relative = path.relative(root, file).replaceAll(path.sep, "/");
    if (relative.startsWith(".git/")) continue;

    const text = fs.readFileSync(file, "utf8");
    if (/deveshpat\/(skills|Skills)\b/.test(text)) failures.push(relative);
  }

  assert.deepEqual(failures, []);
});

test("always-on prompts stay orchestration-only", () => {
  const alwaysOn = `${read("AGENT.md")}\n${read("dist/minimal-system-prompt.md")}`;

  assert.doesNotMatch(alwaysOn, /## Embedded core skills/);
  assert.doesNotMatch(alwaysOn, /### grill-me/);
  assert.doesNotMatch(alwaysOn, /### diagnose/);
  assert.doesNotMatch(alwaysOn, /### tdd/);
  assert.doesNotMatch(alwaysOn, /No flattery\. No critique without fix/);
  assert.doesNotMatch(alwaysOn, /Never refactor while red/);
});
