#!/usr/bin/env node
import fs from "fs";
import path from "path";

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const categories = new Set(["planning", "architecture", "development", "tooling", "session", "persona"]);
const required = ["name", "description", "category", "tags", "target_llms"];
const skipDirs = new Set([".git", "node_modules", "dist", ".claude"]);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name === "SKILL.md") out.push(p);
  }
  return out;
}

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

function rel(file) { return path.relative(root, file).replaceAll(path.sep, "/"); }
function skillSlug(file) { return rel(path.dirname(file)); }
function dirSlug(file) { return path.basename(path.dirname(file)); }

function linkTargets(markdown) {
  const withoutFences = markdown.replace(/```[\s\S]*?```/g, "");
  const links = [];
  const re = /\[[^\]]+\]\((?!https?:|mailto:|#)([^)]+)\)/g;
  markdown = withoutFences;
  let m;
  while ((m = re.exec(markdown))) links.push(m[1].split("#")[0]);
  return links.filter(Boolean);
}

const files = walk(root);
const errors = [];
const warnings = [];
const registry = [];
const bySlug = new Map();

for (const file of files) {
  const slug = skillSlug(file);
  bySlug.set(slug, file);
}

for (const file of files) {
  const slug = skillSlug(file);
  const folder = dirSlug(file);
  const { meta, body, error } = parseFrontmatter(file);
  if (error) { errors.push(`${slug}: ${error}`); continue; }

  for (const key of required) if (!meta[key] || (Array.isArray(meta[key]) && meta[key].length === 0)) errors.push(`${slug}: missing required frontmatter field '${key}'`);
  if (meta.category && !categories.has(meta.category)) errors.push(`${slug}: invalid category '${meta.category}'`);
  if (meta.name && meta.name !== folder) {
    const aliases = Array.isArray(meta.aliases) ? meta.aliases : [];
    if (!aliases.includes(folder)) errors.push(`${slug}: frontmatter name '${meta.name}' does not match directory slug '${folder}' and aliases does not include '${folder}'`);
  }
  if (meta.description && String(meta.description).length < 50) warnings.push(`${slug}: description is short (${String(meta.description).length} chars)`);
  if (meta.category !== "persona" && !/##\s+(When to Use|Process|Workflow|Steps|How to Use)/i.test(body)) warnings.push(`${slug}: body may be too thin; no obvious workflow heading found`);
  if (/Replace this file|TODO:|TBD|placeholder content|Install full content/i.test(body)) errors.push(`${slug}: placeholder/TODO content remains in SKILL.md`);

  for (const target of linkTargets(body)) {
    const resolved = path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolved)) errors.push(`${slug}: broken local link '${target}'`);
  }

  const composable = Array.isArray(meta.composable_with) ? meta.composable_with : [];
  for (const target of composable) {
    if (!bySlug.has(target)) errors.push(`${slug}: composable_with target '${target}' does not exist`);
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
    composable_with: composable,
    path: rel(file),
  });
}

function parseRouterSkills() {
  const router = path.join(root, "ROUTER.md");
  if (!fs.existsSync(router)) return [];
  const txt = fs.readFileSync(router, "utf8");
  return [...txt.matchAll(/`([^`]+)`\s*\|\s*`?https:\/\/raw\.githubusercontent\.com\/deveshpat\/skills\/main\/([^`\s|]+\/SKILL\.md)`?/g)]
    .map(m => ({ name: m[1], path: m[2] }));
}

for (const item of parseRouterSkills()) {
  if (!fs.existsSync(path.join(root, item.path))) errors.push(`ROUTER.md: listed skill '${item.name}' points to missing '${item.path}'`);
}

if (fs.existsSync(path.join(root, "README.md"))) {
  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  for (const target of linkTargets(readme)) {
    if (target.startsWith("./")) {
      const resolved = path.resolve(root, target);
      if (!fs.existsSync(resolved)) errors.push(`README.md: broken local link '${target}'`);
    }
  }
}

registry.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

if (args.has("--write-registry")) {
  fs.writeFileSync(path.join(root, "skills.registry.json"), JSON.stringify({ generated_from: "SKILL.md frontmatter", skills: registry }, null, 2) + "\n");
  console.log("[wrote] skills.registry.json");
}

if (args.has("--write-router")) {
  const base = "https://raw.githubusercontent.com/deveshpat/skills/main";
  const rows = registry.map(s => `| \`${s.name}\` | \`${base}/${s.slug}/SKILL.md\` | ${s.category} |`).join("\n");
  const triggers = registry.map(s => `**\`${s.name}\`** — ${s.description}`).join("\n\n");
  const chains = registry
    .filter(s => s.composable_with?.length)
    .map(s => `| \`${s.name}\` | ${s.composable_with.map(t => `\`${t}\``).join(", ")} |`)
    .join("\n");
  const content = `# Skill Router — deveshpat/skills

**Base URL:** \`${base}\`

You have access to a library of structured workflow skills hosted at the URL above.
Before responding to any request, check this registry and determine whether a skill applies.
If one does, fetch it and follow its process. If none applies, respond normally.

---

## How to Use This Router

1. Read the user's message.
2. Scan the registry below for a matching skill by name, trigger phrases, or situation.
3. If a match: fetch \`{base_url}/{skill-slug}/SKILL.md\` from the URL index below.
4. Announce: \`[Loading skill: {skill-name}]\`, then follow the fetched skill's process exactly.
5. If no match: respond normally without mentioning the router.

**Shortcut:** If the user names a skill directly, fetch it immediately from the URL index below; no need to scan the registry.

**For Claude Code:** this router is unnecessary — skills are auto-discovered from your installed skills directory. No fetching required.

**For Claude Desktop:** this router is unnecessary; skills are auto-discovered from installed \`SKILL.md\` descriptions.

---

## Skill URL Index

| Skill name | Fetch URL | Category |
|---|---|---|
${rows}

---

## Skill Registry (trigger matching)

${triggers}

---

## Chaining Skills

| Skill | Composable with |
|---|---|
${chains || "| _None declared_ | — |"}
`;
  fs.writeFileSync(path.join(root, "ROUTER.md"), content);
  console.log("[wrote] ROUTER.md");
}

for (const w of warnings) console.warn(`[WARN] ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`[ERROR] ${e}`);
  console.error(`\nValidation failed: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}
console.log(`Validation passed: ${registry.length} skills, ${warnings.length} warning(s).`);
