#!/usr/bin/env node
/**
 * skills export — generate generic convenience bundles from canonical SKILL.md files.
 *
 * Usage:
 *   node scripts/export.js --all --target all --validate
 *   node scripts/export.js --all --target all --out ./dist
 *   node scripts/export.js --skill grill-me --target skill --out ./dist
 *
 * Targets: all | skill | index | categories | minimal-system-prompt
 */

import fs from "fs";
import path from "path";
import { parseArgs } from "util";
import { parseSkillFile, toArray } from "./lib/frontmatter.js";
import { BASE_URL } from "./lib/project-config.js";

const root = path.resolve(import.meta.dirname, "..");
const REQUIRED = ["name", "description", "category", "tags", "target_llms"];
const CATEGORIES = new Set(["planning", "architecture", "development", "productivity", "tooling", "session"]);
const SKIP = new Set(["scripts", ".git", "node_modules", "dist", ".claude", "coverage", "test", "wiki"]);
const LEGACY_TARGETS = new Set(["claude", "openai", "gemini", "ouroboros"]);

const { values: args } = parseArgs({ options: {
  skill: { type: "string" },
  all: { type: "boolean", default: false },
  target: { type: "string", default: "all" },
  out: { type: "string", default: "./dist" },
  validate: { type: "boolean", default: false },
}});

function rel(file) { return path.relative(root, file).replaceAll(path.sep, "/"); }

function findSkillByName(name, records) {
  for (const record of records) {
    if (record.slug.endsWith(`/${name}`) || record.meta.name === name || toArray(record.meta.aliases).includes(name)) {
      return record;
    }
  }
  return null;
}

function findAllSkills() {
  const skills = [];
  for (const category of fs.readdirSync(root)) {
    if (SKIP.has(category)) continue;
    const categoryPath = path.join(root, category);
    if (!fs.existsSync(categoryPath) || !fs.statSync(categoryPath).isDirectory()) continue;
    for (const slug of fs.readdirSync(categoryPath)) {
      const file = path.join(categoryPath, slug, "SKILL.md");
      if (!fs.existsSync(file)) continue;
      const parsed = parseSkillFile(file);
      skills.push({ slug: `${category}/${slug}`, file, ...parsed });
    }
  }
  return skills.sort((a, b) => a.meta.category.localeCompare(b.meta.category) || a.meta.name.localeCompare(b.meta.name));
}

function validateSkill({ slug, meta, body, error }, knownSlugs) {
  const errors = [];
  if (error) return [error];
  for (const field of REQUIRED) {
    if (!meta[field] || (Array.isArray(meta[field]) && meta[field].length === 0)) errors.push(`Missing: ${field}`);
  }
  if (meta.category && !CATEGORIES.has(meta.category)) errors.push(`Invalid category: ${meta.category}`);
  if (meta.description && String(meta.description).length < 50) errors.push(`description too short (${String(meta.description).length} chars)`);
  if (!/##\s+(When to Use|Process|Workflow|Steps|How to Use|Philosophy)/i.test(body)) errors.push("Missing workflow/process section");
  for (const target of toArray(meta.composable_with)) {
    if (!knownSlugs.has(target)) errors.push(`Missing composable target: ${target}`);
  }
  return errors.map((message) => `${slug}: ${message}`);
}

function skillRecord(skill) {
  return {
    slug: skill.slug,
    name: skill.meta.name,
    category: skill.meta.category,
    description: skill.meta.description,
    tags: toArray(skill.meta.tags),
    target_llms: toArray(skill.meta.target_llms),
    chains_to: toArray(skill.meta.composable_with),
    path: rel(skill.file),
    url: `${BASE_URL}/${rel(skill.file)}`,
    body: skill.body.trim(),
  };
}

function writeFile(outRoot, relativePath, content) {
  const outFile = path.join(outRoot, relativePath);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, content.trimEnd() + "\n");
  console.log(`  → ${rel(outFile)}`);
}

function renderSkill(record) {
  const chains = record.chains_to.length ? record.chains_to.map((item) => `\`${item}\``).join(", ") : "none";
  return `# ${record.name}\n\n- Category: ${record.category}\n- Path: ${record.path}\n- URL: ${record.url}\n- Tags: ${record.tags.join(", ")}\n- Chains to: ${chains}\n\n## Trigger contract\n\n${record.description}\n\n---\n\n${record.body}\n`;
}

function renderAllSkills(records) {
  return [`# All skills\n\nGenerated from canonical SKILL.md files. Load this only when you intentionally want every workflow in context. Prefer router.json plus selected SKILL.md files for normal use.`, ...records.map(renderSkill)].join("\n\n");
}

function renderIndex(records) {
  const groups = groupByCategory(records);
  const lines = [
    "# Skills index",
    "",
    "Generated from canonical SKILL.md frontmatter.",
    "",
  ];
  for (const [category, skills] of Object.entries(groups)) {
    lines.push(`## ${titleCase(category)}`, "", "| Skill | Trigger contract | Chains to |", "|---|---|---|");
    for (const skill of skills) {
      const chains = skill.chains_to.length ? skill.chains_to.map((item) => `\`${item}\``).join("<br>") : "—";
      lines.push(`| [${skill.name}](../${skill.path}) | ${escapeTable(skill.description)} | ${chains} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

function renderCategory(category, records) {
  return [`# ${titleCase(category)} skills\n\nGenerated from canonical SKILL.md files.`, ...records.map(renderSkill)].join("\n\n");
}

function renderMinimalSystemPrompt() {
  return `# Minimal Skill-Binder setup prompt\n\nUse Skill-Binder as workflow cookbook.\nStart -> router.json.\nNeed skill -> fetch only matching <category>/<skill>/SKILL.md.\nFollow skill exactly.\nchains_to/composable_with -> next useful workflow.\nNo preload whole repo.\n`;
}

function groupByCategory(records) {
  return records.reduce((groups, record) => {
    groups[record.category] ||= [];
    groups[record.category].push(record);
    return groups;
  }, {});
}

function titleCase(value) {
  return value.replace(/(^|-)([a-z])/g, (_, prefix, letter) => `${prefix === "-" ? " " : ""}${letter.toUpperCase()}`);
}

function escapeTable(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function normalizeTarget(target) {
  if (LEGACY_TARGETS.has(target)) {
    console.warn(`[legacy] --target ${target} is deprecated; writing a generic skill bundle instead.`);
    return "skill";
  }
  return target;
}

const allSkillRecords = findAllSkills();
const knownSlugs = new Set(allSkillRecords.map((skill) => skill.slug));

let skills;
if (args.all) {
  skills = allSkillRecords;
} else if (args.skill) {
  const found = findSkillByName(args.skill, allSkillRecords);
  if (!found) {
    console.error(`Not found: ${args.skill}`);
    process.exit(1);
  }
  skills = [found];
} else {
  console.error("Provide --skill <name> or --all");
  process.exit(1);
}

let hasErrors = false;
for (const skill of skills) {
  const errors = validateSkill(skill, knownSlugs);
  if (errors.length) {
    console.error(`[INVALID] ${skill.slug}\n  ${errors.join("\n  ")}`);
    hasErrors = true;
  } else {
    console.log(`[OK] ${skill.slug}`);
  }
}
if (hasErrors) process.exit(1);
if (args.validate) process.exit(0);

const target = normalizeTarget(args.target);
const outRoot = path.resolve(root, args.out);
const records = skills.map(skillRecord);

if (target === "all") {
  writeFile(outRoot, "all-skills.md", renderAllSkills(records));
  writeFile(outRoot, "skills-index.md", renderIndex(records));
  writeFile(outRoot, "minimal-system-prompt.md", renderMinimalSystemPrompt());
  for (const [category, categoryRecords] of Object.entries(groupByCategory(records))) {
    writeFile(outRoot, `categories/${category}.md`, renderCategory(category, categoryRecords));
  }
} else if (target === "skill") {
  for (const record of records) writeFile(outRoot, `skills/${record.slug}.md`, renderSkill(record));
} else if (target === "index") {
  writeFile(outRoot, "skills-index.md", renderIndex(records));
} else if (target === "categories") {
  for (const [category, categoryRecords] of Object.entries(groupByCategory(records))) {
    writeFile(outRoot, `categories/${category}.md`, renderCategory(category, categoryRecords));
  }
} else if (target === "minimal-system-prompt") {
  writeFile(outRoot, "minimal-system-prompt.md", renderMinimalSystemPrompt());
} else {
  console.error(`Unknown target '${target}'. Expected all, skill, index, categories, or minimal-system-prompt.`);
  process.exit(1);
}
