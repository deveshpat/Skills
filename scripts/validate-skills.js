#!/usr/bin/env node
/**
 * validate-skills — validate canonical SKILL.md files and optionally write router.json.
 *
 * Usage:
 *   node scripts/validate-skills.js
 *   node scripts/validate-skills.js --write-router
 *   node scripts/validate-skills.js --write-router --out ./dist/router.json
 */

import fs from "fs";
import path from "path";
import { parseSkillFile, toArray } from "./lib/frontmatter.js";
import { findBrokenMarkdownLinks, findStaleReferences, markdownLinkTargets } from "./lib/doc-lint.js";
import { BASE_URL } from "./lib/project-config.js";

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const argList = process.argv.slice(2);

const outFlagIdx = argList.indexOf("--out");
const routerOutPath = outFlagIdx !== -1
  ? path.resolve(root, argList[outFlagIdx + 1])
  : path.join(root, "router.json");

const categories = new Set(["planning", "architecture", "development", "productivity", "tooling", "session"]);
const required = ["name", "description", "category", "tags", "target_llms"];
const skipDirs = new Set([".git", "node_modules", "dist", ".claude", "coverage"]);
const DEFAULT_ROUTER_META = {
  announcements: [
    { "Session init": "Internalised Skill-Binder router." },
    { "Loading Skill": "<skill-name> initialised." },
  ],
  entry_table: [
    {
      situation: "Architecture/codebase health should be reviewed before planning",
      skills: ["architecture/improve-codebase-architecture"],
      note: "Optional architecture preflight; do not auto-run.",
    },
    {
      situation: "Vague idea, not yet thought through",
      skills: ["planning/grill-me", "planning/to-prd"],
    },
    {
      situation: "Vague idea requiring codebase/domain-doc grounding",
      skills: ["planning/grill-with-docs", "planning/to-prd"],
    },
    {
      situation: "Clear idea, no requirements doc",
      skills: ["planning/to-prd"],
    },
    {
      situation: "PRD exists, need implementation plan",
      skills: ["planning/prd-to-plan"],
    },
    {
      situation: "Plan exists, need tickets",
      skills: ["planning/to-issues"],
    },
    {
      situation: "Bug, root cause unknown",
      skills: ["development/diagnose", "development/triage"],
    },
    {
      situation: "Bug, root cause known",
      skills: ["development/triage", "development/tdd"],
    },
    {
      situation: "Feature or fix ready to implement",
      skills: ["development/tdd"],
    },
    {
      situation: "Need broader codebase context",
      skills: ["architecture/zoom-out"],
    },
    {
      situation: "User wants ultra-terse responses",
      skills: ["productivity/caveman"],
    },
    {
      situation: "Context window >= 80% or 'compact'",
      skills: ["session/strategic-compact"],
    },
  ],
};

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name === "SKILL.md") out.push(p);
  }
  return out;
}

function rel(file) { return path.relative(root, file).replaceAll(path.sep, "/"); }
function skillSlug(file) { return rel(path.dirname(file)); }
function dirSlug(file) { return path.basename(path.dirname(file)); }


function parseRouterSkills() {
  if (!fs.existsSync(routerOutPath)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(routerOutPath, "utf8"));
    return (data.skills || []).map(s => ({ name: s.name, path: s.path }));
  } catch {
    return [];
  }
}

const files = walk(root);
const errors = [];
const warnings = [];
const registry = [];
const bySlug = new Map();

for (const file of files) bySlug.set(skillSlug(file), file);

for (const file of files) {
  const slug = skillSlug(file);
  const folder = dirSlug(file);
  const { meta, body, error } = parseSkillFile(file);
  if (error) { errors.push(`${slug}: ${error}`); continue; }

  for (const key of required) {
    if (!meta[key] || (Array.isArray(meta[key]) && meta[key].length === 0)) {
      errors.push(`${slug}: missing required frontmatter field '${key}'`);
    }
  }

  if (meta.category && !categories.has(meta.category)) {
    errors.push(`${slug}: invalid category '${meta.category}'`);
  }

  if (meta.name && meta.name !== folder) {
    const aliases = toArray(meta.aliases);
    if (!aliases.includes(folder)) {
      errors.push(`${slug}: frontmatter name '${meta.name}' does not match directory slug '${folder}' and aliases does not include '${folder}'`);
    }
  }

  if (meta.description && String(meta.description).length < 50) {
    warnings.push(`${slug}: description is short (${String(meta.description).length} chars)`);
  }

  if (!/##\s+(When to Use|Process|Workflow|Steps|How to Use|Philosophy)/i.test(body)) {
    warnings.push(`${slug}: body may be too thin; no obvious workflow heading found`);
  }

  if (/Replace this file|TODO:|TBD|placeholder content|Install full content/i.test(body)) {
    errors.push(`${slug}: placeholder/TODO content remains in SKILL.md`);
  }

  for (const target of markdownLinkTargets(body)) {
    const resolved = path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolved)) errors.push(`${slug}: broken local link '${target}'`);
  }

  const composable = toArray(meta.composable_with);
  for (const target of composable) {
    if (!bySlug.has(target)) errors.push(`${slug}: composable_with target '${target}' does not exist`);
  }

  registry.push({
    slug,
    name: meta.name,
    category: meta.category,
    description: meta.description,
    tags: toArray(meta.tags),
    target_llms: toArray(meta.target_llms),
    source: meta.source || "unknown",
    aliases: toArray(meta.aliases),
    upstream: meta.upstream || meta.upstream_url || null,
    chains_to: composable,
    path: rel(file),
    url: `${BASE_URL}/${rel(file)}`,
  });
}

for (const item of parseRouterSkills()) {
  if (!fs.existsSync(path.join(root, item.path))) {
    errors.push(`router.json: listed skill '${item.name}' points to missing '${item.path}'`);
  }
}

for (const stale of findStaleReferences(root, {
  exclude: (file) => file.startsWith("test/") || file === "scripts/validate-skills.js" || file === "scripts/lib/doc-lint.js",
})) {
  errors.push(stale);
}

for (const broken of findBrokenMarkdownLinks(root, {
  exclude: (file) => file.startsWith("dist/"),
})) {
  errors.push(broken);
}

registry.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

if (args.has("--write-router")) {
  let existing = {};
  if (fs.existsSync(routerOutPath)) {
    try { existing = JSON.parse(fs.readFileSync(routerOutPath, "utf8")); } catch {}
  }

  const GENERATED_KEYS = new Set(["generated_from", "base_url", "skills"]);
  const manual = Object.fromEntries(
    Object.entries(existing).filter(([k]) => !GENERATED_KEYS.has(k))
  );

  const router = {
    generated_from: "SKILL.md frontmatter",
    base_url: BASE_URL,
    ...DEFAULT_ROUTER_META,
    ...manual,
    skills: registry,
  };

  fs.mkdirSync(path.dirname(routerOutPath), { recursive: true });
  fs.writeFileSync(routerOutPath, JSON.stringify(router, null, 2) + "\n");
  console.log(`[wrote] ${path.relative(root, routerOutPath)}`);
}

for (const w of warnings) console.warn(`[WARN] ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`[ERROR] ${e}`);
  console.error(`\nValidation failed: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}
console.log(`Validation passed: ${registry.length} skills, ${warnings.length} warning(s).`);
