import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");

function run(args) {
  return spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
  });
}

test("validator and export validation are green", () => {
  const validate = run(["scripts/validate-skills.js"]);
  assert.equal(validate.status, 0, validate.stderr || validate.stdout);
  assert.match(validate.stdout, /Validation passed: 20 skills/);

  const exportValidate = run(["scripts/export.js", "--all", "--target", "all", "--validate"]);
  assert.equal(exportValidate.status, 0, exportValidate.stderr || exportValidate.stdout);
  assert.match(exportValidate.stdout, /\[OK\] planning\/grill-me/);
  assert.match(exportValidate.stdout, /\[OK\] productivity\/caveman/);
});

test("generic bundle generation writes expected outputs", () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "skills-export-"));
  const result = run(["scripts/export.js", "--all", "--target", "all", "--out", out]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.ok(fs.existsSync(path.join(out, "all-skills.md")));
  assert.ok(fs.existsSync(path.join(out, "skills-index.md")));
  assert.ok(fs.existsSync(path.join(out, "minimal-system-prompt.md")));
  assert.ok(fs.existsSync(path.join(out, "categories", "planning.md")));
  assert.ok(fs.existsSync(path.join(out, "categories", "productivity.md")));
});
