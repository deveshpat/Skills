import fs from "fs";
import path from "path";

export const DEFAULT_SKIP_DIRS = new Set([".git", "dist", "node_modules", ".claude", "coverage"]);

export const staleReferenceRules = [
  {
    name: "obsolete project architect persona skill path",
    pattern: /persona\/project-architect\/SKILL\.md|project-architect\/SKILL\.md/i,
  },
  {
    name: "obsolete ML engineer persona skill path",
    pattern: /persona\/ml-engineer\/SKILL\.md|ml-engineer\/SKILL\.md/i,
  },
  {
    name: "wrong canonical skill path placeholder",
    pattern: /skills\/<category>\/<skill>\/SKILL\.md/i,
  },
  {
    name: "obsolete router markdown filename",
    pattern: /ROUTER\.md/i,
  },
  {
    name: "stale target_llms metadata claim",
    pattern: /target_llms:\s*\[(?:chatgpt|claude-code|claude|openai|gemini|ouroboros)[^\]]*\]/i,
  },
  {
    name: "old Skill-Binder repository name",
    pattern: /deveshpat\/skills/i,
  },
  {
    name: "upstream-deprecated active skill reference",
    pattern: /architecture\/design-an-interface\/SKILL\.md|tooling\/ubiquitous-language\/SKILL\.md/i,
  },
];

export function relativeTo(root, file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

export function walkFiles(root, { extensions = [".md", ".js", ".json"], skipDirs = DEFAULT_SKIP_DIRS } = {}) {
  const files = [];

  function visit(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.isDirectory() && skipDirs.has(ent.name)) continue;
      const item = path.join(dir, ent.name);
      if (ent.isDirectory()) visit(item);
      else if (extensions.some((ext) => ent.name.endsWith(ext))) files.push(item);
    }
  }

  visit(root);
  return files;
}

export function markdownLinkTargets(markdown) {
  const withoutFences = markdown.replace(/```[\s\S]*?```/g, "");
  const links = [];
  const re = /\[[^\]]+\]\((?!https?:|mailto:|#)([^)]+)\)/g;
  let match;

  while ((match = re.exec(withoutFences))) {
    const target = match[1].split("#")[0].trim();
    if (target) links.push(target);
  }

  return links;
}

export function findStaleReferences(root, { exclude = () => false } = {}) {
  const failures = [];

  for (const file of walkFiles(root)) {
    const rel = relativeTo(root, file);
    if (exclude(rel)) continue;

    const content = fs.readFileSync(file, "utf8");
    for (const rule of staleReferenceRules) {
      if (rule.pattern.test(content)) failures.push(`${rel}: ${rule.name}`);
    }
  }

  return failures;
}

export function findBrokenMarkdownLinks(root, { exclude = () => false } = {}) {
  const failures = [];

  for (const file of walkFiles(root, { extensions: [".md"] })) {
    const rel = relativeTo(root, file);
    if (exclude(rel)) continue;

    const content = fs.readFileSync(file, "utf8");
    for (const target of markdownLinkTargets(content)) {
      const resolved = path.resolve(path.dirname(file), target);
      if (!fs.existsSync(resolved)) failures.push(`${rel}: broken local link '${target}'`);
    }
  }

  return failures;
}
