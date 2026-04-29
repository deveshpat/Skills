#!/usr/bin/env node
/**
 * validate-skills — validate SKILL.md files and optionally write router.json
 *
 * Usage:
 *   node scripts/validate-skills.js
 *   node scripts/validate-skills.js --write-router
 *   node scripts/validate-skills.js --write-router --out ./dist/router.json
 */

import fs from "fs";
import path from "path";

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const argList = process.argv.slice(2);

// --out <path> support
const outFlagIdx = argList.indexOf("--out");
const routerOutPath = outFlagIdx !== -1
  ? path.resolve(root, argList[outFlagIdx + 1])
  : path.join(root, "router.json");

const categories = new Set(["planning", "architecture", "development", "tooling", "session", "persona"]);
const required = ["name", "description", "category", "tags", "target_llms"];
const skipDirs = new Set([".git", "node_modules", "dist", ".claude"]);

const BASE_URL = "https://raw.githubusercontent.com/deveshpat/skills/main";

// Entry table: maps situations to skill slugs — kept here as the source of truth
const ENTRY_TABLE = [
  { situation: "Vague idea, not yet thought through", skills: ["planning/grill-me", "planning/write-a-prd"] },
  { situation: "Clear idea, no requirements doc", skills: ["planning/write-a-prd"] },
  { situation: "PRD exists, need implementation plan", skills: ["planning/prd-to-plan"] },
  { situation: "Plan exists, need GitHub tickets", skills: ["planning/prd-to-issues"] },
  { situation: "Bug, root cause unknown", skills: ["session/systematic-debugging", "development/triage-issue"] },
  { situation: "Bug, root cause known", skills: ["development/triage-issue", "development/tdd"] },
  { situation: "Feature or fix to implement", skills: ["development/tdd"] },
  { situation: "Architecture friction / duplication / file too long", skills: ["architecture/improve-codebase-architecture"] },
  { situation: "Architecture direction agreed, need coding-agent prompt", skills: ["architecture/request-refactor-plan"] },
  { situation: "Context window >= 80% or 'compact'", skills: ["session/strategic-compact"] },
  { situation: "Multi-session project with BLUEPRINT.md", skills: ["persona/project-architect"], note: "load as persona" },
  { situation: "ML training / GPU workflows / experiment tracking", skills: ["persona/ml-engineer"], note: "load as persona" },
];

// ---------------------------------------------------------------------------
// Filesystem helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Frontmatter parser
// ---------------------------------------------------------------------------

function parseFrontmatter(file) {
  const content = fs.readFileSync(file, "utf8");
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: null, body: content, error: "Malformed frontmatter: expected standalone opening and closing --- delimiters" };

  const meta = {};
  const lines = match[1].split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!m) continue;
    const [, key, raw] = m;
    if (raw === ">") {
      const block = [];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) block.push(lines[++i].trim());
      meta[key] = block.join(" ").trim();
    } else if (raw.startsWith("[")) {
      meta[key] = raw.replace(/^\[/, "").replace(/\]$/, "").split(",").map(s => s.trim()).filter(Boolean);
    } else if (raw === "") {
      const arr = [];
      while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) arr.push(lines[++i].replace(/^\s*-\s+/, "").trim());
      meta[key] = arr.length ? arr : "";
    } else {
      meta[key] = raw.trim();
    }
  }
  return { meta, body: match[2] };
}

// ---------------------------------------------------------------------------
// Local link extractor
// ---------------------------------------------------------------------------

function linkTargets(markdown) {
  const withoutFences = markdown.replace(/```[\s\S]*?```/g, "");
  const links = [];
  const re = /\[[^\]]+\]\((?!https?:|mailto:|#)([^)]+)\)/g;
  let m;
  while ((m = re.exec(withoutFences))) links.push(m[1].split("#")[0]);
  return links.filter(Boolean);
}

// ---------------------------------------------------------------------------
// Read router.json to verify listed skills exist (replaces old ROUTER.md regex)
// ---------------------------------------------------------------------------

function parseRouterSkills() {
  if (!fs.existsSync(routerOutPath)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(routerOutPath, "utf8"));
    return (data.skills || []).map(s => ({ name: s.name, path: s.path }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const files = walk(root);
const errors = [];
const warnings = [];
const registry = [];
const bySlug = new Map();

for (const file of files) bySlug.set(skillSlug(file), file);

for (const file of files) {
  const slug = skillSlug(file);
  const folder = dirSlug(file);
  const { meta, body, error } = parseFrontmatter(file);
  if (error) { errors.push(`${slug}: ${error}`); continue; }

  for (const key of required) {
    if (!meta[key] || (Array.isArray(meta[key]) && meta[key].length === 0))
      errors.push(`${slug}: missing required frontmatter field '${key}'`);
  }
  if (meta.category && !categories.has(meta.category))
    errors.push(`${slug}: invalid category '${meta.category}'`);
  if (meta.name && meta.name !== folder) {
    const aliases = Array.isArray(meta.aliases) ? meta.aliases : [];
    if (!aliases.includes(folder))
      errors.push(`${slug}: frontmatter name '${meta.name}' does not match directory slug '${folder}' and aliases does not include '${folder}'`);
  }
  if (meta.description && String(meta.description).length < 50)
    warnings.push(`${slug}: description is short (${String(meta.description).length} chars)`);
  if (meta.category !== "persona" && !/##\s+(When to Use|Process|Workflow|Steps|How to Use)/i.test(body))
    warnings.push(`${slug}: body may be too thin; no obvious workflow heading found`);
  if (/Replace this file|TODO:|TBD|placeholder content|Install full content/i.test(body))
    errors.push(`${slug}: placeholder/TODO content remains in SKILL.md`);

  for (const target of linkTargets(body)) {
    const resolved = path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolved))
      errors.push(`${slug}: broken local link '${target}'`);
  }

  const composable = Array.isArray(meta.composable_with) ? meta.composable_with : [];
  for (const target of composable) {
    if (!bySlug.has(target))
      errors.push(`${slug}: composable_with target '${target}' does not exist`);
  }

  registry.push({
    slug,
    name: meta.name,
    category: meta.category,
    description: meta.description,
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    target_llms: Array.isArray(meta.target_llms) ? meta.target_llms : [meta.target_llms].filter(Boolean),
    source: meta.source || "unknown",
    aliases: Array.isArray(meta.aliases) ? meta.aliases : [],
    upstream: meta.upstream || null,
    chains_to: composable,
    path: rel(file),
    url: `${BASE_URL}/${rel(file)}`,
  });
}

// Verify skills listed in existing router.json point to real files
for (const item of parseRouterSkills()) {
  if (!fs.existsSync(path.join(root, item.path)))
    errors.push(`router.json: listed skill '${item.name}' points to missing '${item.path}'`);
}

// Verify README links
if (fs.existsSync(path.join(root, "README.md"))) {
  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  for (const target of linkTargets(readme)) {
    if (target.startsWith("./")) {
      const resolved = path.resolve(root, target);
      if (!fs.existsSync(resolved))
        errors.push(`README.md: broken local link '${target}'`);
    }
  }
}

registry.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

// ---------------------------------------------------------------------------
// Write router.json (unified — replaces both --write-registry and --write-router)
// ---------------------------------------------------------------------------

if (args.has("--write-router")) {
  // Preserve manually-managed fields from existing router.json
  let existing = {};
  if (fs.existsSync(routerOutPath)) {
    try { existing = JSON.parse(fs.readFileSync(routerOutPath, "utf8")); } catch {}
  }
  const GENERATED_KEYS = new Set(["generated_from", "base_url", "entry_table", "skills"]);
  const manual = Object.fromEntries(
    Object.entries(existing).filter(([k]) => !GENERATED_KEYS.has(k))
  );

  const router = {
    ...manual,                              // announcements, and anything else you add manually
    generated_from: "SKILL.md frontmatter",
    base_url: BASE_URL,
    entry_table: ENTRY_TABLE,
    skills: registry,
  };
  fs.mkdirSync(path.dirname(routerOutPath), { recursive: true });
  fs.writeFileSync(routerOutPath, JSON.stringify(router, null, 2) + "\n");
  console.log(`[wrote] ${path.relative(root, routerOutPath)}`);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

for (const w of warnings) console.warn(`[WARN] ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`[ERROR] ${e}`);
  console.error(`\nValidation failed: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}
console.log(`Validation passed: ${registry.length} skills, ${warnings.length} warning(s).`);
