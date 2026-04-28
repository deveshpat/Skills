#!/usr/bin/env node
import fs from "fs";
import path from "path";

const root = process.cwd();
const SKILL_RE = /SKILL\.md$/;
const KNOWN_KEYS = [
  "name", "description", "category", "tags", "target_llms", "source",
  "inputs", "outputs", "composable_with", "aliases", "upstream", "upstream_url", "notes"
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", "dist", ".claude"].includes(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (SKILL_RE.test(entry.name)) out.push(p);
  }
  return out;
}

function parseInlineFrontmatter(content) {
  if (!content.startsWith("--- name:")) return null;

  // Local files currently close frontmatter as " --- #", " --- This skill", or
  // similar because opening and closing delimiters were collapsed to one line.
  const close = content.match(/\s---\s(?=(#|>|This skill|Interview me|Sets up|Break|Use|You|##|[A-Z][A-Za-z ]{2,}))/);
  if (!close) return null;

  const raw = content.slice(4, close.index).trim();
  const body = content.slice(close.index + close[0].length).trimStart();
  return { raw, body };
}

function splitFields(raw) {
  const positions = [];
  for (const key of KNOWN_KEYS) {
    const re = new RegExp(`(?:^|\\s)${key}:`, "g");
    let m;
    while ((m = re.exec(raw))) positions.push({ key, index: m.index + (raw[m.index] === " " ? 1 : 0) });
  }
  positions.sort((a, b) => a.index - b.index);

  const fields = new Map();
  for (let i = 0; i < positions.length; i++) {
    const { key, index } = positions[i];
    const start = index + key.length + 1;
    const end = i + 1 < positions.length ? positions[i + 1].index : raw.length;
    fields.set(key, raw.slice(start, end).trim());
  }
  return Object.fromEntries(fields.entries());
}

function toArray(value) {
  if (!value) return [];
  let v = value.trim();
  if (v.startsWith("[")) {
    v = v.replace(/^\[/, "").replace(/\]$/, "");
    return v.split(",").map(s => s.trim().replace(/^['\"]|['\"]$/g, "")).filter(Boolean);
  }
  if (v.startsWith("- ")) return v.split(/\s+-\s+/).map(s => s.replace(/^-\s*/, "").trim()).filter(Boolean);
  return [v];
}

function yamlScalar(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function render(fields, body) {
  const lines = ["---"];
  lines.push(`name: ${yamlScalar(fields.name)}`);
  lines.push("description: >");
  const desc = yamlScalar(String(fields.description || "").replace(/^>\s*/, ""));
  const chunks = desc.match(/.{1,88}(?:\s|$)/g) || [desc];
  for (const chunk of chunks) lines.push(`  ${chunk.trim()}`);
  lines.push(`category: ${yamlScalar(fields.category)}`);
  const tags = toArray(fields.tags);
  lines.push(`tags: [${tags.join(", ")}]`);
  const target = toArray(fields.target_llms);
  lines.push(`target_llms: [${target.length ? target.join(", ") : "all"}]`);
  if (fields.source) lines.push(`source: ${yamlScalar(fields.source)}`);
  const aliases = toArray(fields.aliases);
  if (aliases.length) lines.push(`aliases: [${aliases.join(", ")}]`);
  if (fields.upstream || fields.upstream_url) lines.push(`upstream: ${yamlScalar(fields.upstream || fields.upstream_url)}`);
  const comp = toArray(fields.composable_with);
  if (comp.length) {
    lines.push("composable_with:");
    for (const c of comp) lines.push(`  - ${c}`);
  }
  lines.push("---", "", body.trim() + "\n");
  return lines.join("\n");
}

let changed = 0;
for (const file of walk(root)) {
  const content = fs.readFileSync(file, "utf8");
  if (content.startsWith("---\n")) continue;
  const parsed = parseInlineFrontmatter(content);
  if (!parsed) continue;
  const fields = splitFields(parsed.raw);
  const next = render(fields, parsed.body);
  fs.writeFileSync(file, next);
  changed++;
  console.log(`[normalized] ${path.relative(root, file)}`);
}
console.log(`Normalized ${changed} SKILL.md file(s).`);
