import fs from "fs";

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function parseFrontmatterContent(content, options = {}) {
  const source = options.source || "content";
  const match = content.match(FRONTMATTER_RE);
  if (!match) {
    return {
      meta: null,
      body: content,
      error: `${source}: malformed frontmatter; expected standalone opening and closing --- delimiters`,
    };
  }

  return {
    meta: parseYamlSubset(match[1]),
    body: match[2],
  };
}

export function parseSkillFile(file) {
  const content = fs.readFileSync(file, "utf8");
  return parseFrontmatterContent(content, { source: file });
}

export function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function parseYamlSubset(source) {
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  const meta = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const top = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!top) continue;

    const [, key, rawValue] = top;
    if (rawValue === ">" || rawValue === "|-" || rawValue === "|") {
      const [value, nextIndex] = readBlockScalar(lines, i + 1, rawValue);
      meta[key] = value;
      i = nextIndex - 1;
      continue;
    }

    if (rawValue === "") {
      const next = lines[i + 1] || "";
      if (/^\s*-\s*/.test(next)) {
        const [value, nextIndex] = readList(lines, i + 1);
        meta[key] = value;
        i = nextIndex - 1;
      } else {
        meta[key] = "";
      }
      continue;
    }

    meta[key] = parseScalar(rawValue);
  }

  return meta;
}

function readBlockScalar(lines, startIndex, marker) {
  const block = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    if (/^[A-Za-z_][A-Za-z0-9_]*:\s*/.test(line)) break;
    if (line.trim() === "") {
      block.push("");
    } else {
      block.push(line.replace(/^\s{1,}/, ""));
    }
    i++;
  }

  if (marker === "|" || marker === "|-") {
    return [block.join("\n").trim(), i];
  }

  return [foldLines(block), i];
}

function foldLines(lines) {
  const paragraphs = [];
  let current = [];

  for (const line of lines) {
    if (line === "") {
      if (current.length) paragraphs.push(current.join(" "));
      current = [];
      continue;
    }
    current.push(line.trim());
  }
  if (current.length) paragraphs.push(current.join(" "));

  return paragraphs.join("\n").trim();
}

function readList(lines, startIndex) {
  const items = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    const item = line.match(/^(\s*)-\s*(.*)$/);
    if (!item) break;

    const [, itemIndent, rawItem] = item;
    if (looksLikeKeyValue(rawItem)) {
      const obj = {};
      const [firstKey, firstValue] = splitKeyValue(rawItem);
      obj[firstKey] = parseScalar(firstValue);
      i++;

      while (i < lines.length) {
        const next = lines[i];
        if (!next.trim()) {
          i++;
          continue;
        }
        if (new RegExp(`^${escapeRegExp(itemIndent)}-\\s*`).test(next)) break;
        if (/^[A-Za-z_][A-Za-z0-9_]*:\s*/.test(next)) break;

        const nested = next.match(/^\s+([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
        if (!nested) break;
        const [, nestedKey, nestedRaw] = nested;
        obj[nestedKey] = parseScalar(nestedRaw);
        i++;
      }

      items.push(obj);
    } else {
      items.push(parseScalar(rawItem));
      i++;
    }
  }

  return [items, i];
}

function looksLikeKeyValue(value) {
  return /^[A-Za-z_][A-Za-z0-9_]*:\s*/.test(value);
}

function splitKeyValue(value) {
  const index = value.indexOf(":");
  return [value.slice(0, index).trim(), value.slice(index + 1).trim()];
}

function parseScalar(rawValue) {
  const value = rawValue.trim();
  if (value === "") return "";
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "[]") return [];
  if (value.startsWith("[") && value.endsWith("]")) return parseInlineArray(value);
  return stripQuotes(value);
}

function parseInlineArray(value) {
  const inner = value.slice(1, -1).trim();
  if (!inner) return [];
  return inner
    .split(",")
    .map((item) => stripQuotes(item.trim()))
    .filter((item) => item !== "");
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
