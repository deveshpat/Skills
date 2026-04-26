#!/usr/bin/env node
/**
 * skills export — generate platform-specific formats from canonical SKILL.md files
 *
 * Usage:
 *   node scripts/export.js --skill grill-me --target openai
 *   node scripts/export.js --all --target gemini --out ./dist/
 *   node scripts/export.js --skill project-architect --target ouroboros
 *   node scripts/export.js --skill grill-me --validate
 *
 * Targets: claude | openai | gemini | ouroboros | all
 */

import fs from "fs";
import path from "path";
import { parseArgs } from "util";

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  for (const line of match[1].split("\n")) {
    const ci = line.indexOf(":");
    if (ci === -1) continue;
    const key = line.slice(0, ci).trim();
    let val = line.slice(ci + 1).trim();
    if (val.startsWith("[") && val.endsWith("]"))
      val = val.slice(1, -1).split(",").map(s => s.trim().replace(/^['"]|['"]$/g, ""));
    meta[key] = val;
  }
  return { meta, body: match[2].trim() };
}

const REQUIRED = ["name", "description", "category", "tags", "target_llms"];
function validate(file, meta, body) {
  const e = [];
  for (const f of REQUIRED) if (!meta[f]) e.push(`Missing: ${f}`);
  if (meta.description?.length < 50) e.push(`description too short (${meta.description?.length} chars)`);
  if (!body.includes("## Process") && !body.includes("## How to Use")) e.push("Missing ## Process section");
  const cats = ["planning","architecture","development","tooling","session","persona"];
  if (meta.category && !cats.includes(meta.category)) e.push(`Invalid category: ${meta.category}`);
  return e;
}

function exportOpenAI(meta, body) {
  return { format: "system-prompt.md", content:
    `# ${meta.name} — Skill\n\nYou are operating under a structured workflow. Follow the process below.\n\n**Trigger:** ${meta.description}\n\n---\n\n${body}` };
}
function exportGemini(meta, body) {
  return { format: "gem-instructions.md", content:
    `You follow a structured workflow called "${meta.name}".\n\nActivate when: ${meta.description}\n\n---\n\n${body}` };
}
function exportOuroboros(meta, body) {
  return { format: "ouroboros-skill.json", content: JSON.stringify({
    skill: meta.name, category: meta.category, tags: meta.tags,
    system_prompt: `[SKILL: ${meta.name}]\nActivate when: ${meta.description}\n\n${body}`,
    composable_with: meta.composable_with || []
  }, null, 2)};
}
function exportClaude(meta, body, file) {
  return { format: "SKILL.md", content: fs.readFileSync(file, "utf8") };
}

const EXPORTERS = { claude: exportClaude, openai: exportOpenAI, gemini: exportGemini, ouroboros: exportOuroboros };

function findSkillByName(root, name) {
  for (const cat of fs.readdirSync(root)) {
    const p = path.join(root, cat, name, "SKILL.md");
    if (fs.existsSync(p)) return { slug: `${cat}/${name}`, file: p };
  }
  return null;
}

function findAllSkills(root) {
  const skills = [];
  const skip = ["scripts", ".git", "node_modules", "dist"];
  for (const cat of fs.readdirSync(root)) {
    if (skip.includes(cat)) continue;
    const catPath = path.join(root, cat);
    if (!fs.statSync(catPath).isDirectory()) continue;
    for (const sn of fs.readdirSync(catPath)) {
      const f = path.join(catPath, sn, "SKILL.md");
      if (fs.existsSync(f)) skills.push({ slug: `${cat}/${sn}`, file: f });
    }
  }
  return skills;
}

const { values: args } = parseArgs({ options: {
  skill: { type: "string" }, all: { type: "boolean", default: false },
  target: { type: "string", default: "all" }, out: { type: "string", default: "./dist" },
  validate: { type: "boolean", default: false },
}});

const root = path.resolve(import.meta.dirname, "..");
let skills = args.all ? findAllSkills(root)
  : args.skill ? [findSkillByName(root, args.skill) || (() => { console.error(`Not found: ${args.skill}`); process.exit(1); })()]
  : (console.error("Provide --skill <name> or --all"), process.exit(1));

const targets = args.target === "all" ? Object.keys(EXPORTERS) : [args.target];
let hasErrors = false;

for (const { slug, file } of skills) {
  const { meta, body } = parseFrontmatter(fs.readFileSync(file, "utf8"));
  const errors = validate(file, meta, body);
  if (errors.length) { console.error(`[INVALID] ${slug}\n  ${errors.join("\n  ")}`); hasErrors = true; }
  else console.log(`[OK] ${slug}`);
  if (args.validate || errors.length) continue;
  for (const target of targets) {
    const { format, content } = EXPORTERS[target](meta, body, file);
    const outDir = path.join(root, args.out, target, slug);
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, format);
    fs.writeFileSync(outFile, content);
    console.log(`  → ${path.relative(root, outFile)}`);
  }
}
if (hasErrors) process.exit(1);
