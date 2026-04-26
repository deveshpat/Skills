#!/usr/bin/env bash
# setup.sh — Run this in GitHub Codespaces to populate deveshpat/skills from scratch.
# Usage: bash setup.sh
# Requires: git (pre-installed in Codespaces), internet access to write files.

set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

echo "==> Populating deveshpat/skills repo at $REPO_ROOT"

# ── Helpers ──────────────────────────────────────────────────────────────────
mkskill() { mkdir -p "$(dirname "$1")"; cat > "$1"; }

# ── Directory structure ───────────────────────────────────────────────────────
mkdir -p \
  planning/{grill-me,write-a-prd,prd-to-plan,prd-to-issues} \
  architecture/{improve-codebase-architecture,design-an-interface,request-refactor-plan} \
  development/{tdd,triage-issue,git-guardrails} \
  tooling/{write-a-skill,setup-pre-commit,ubiquitous-language,edit-article,obsidian-vault} \
  session/{strategic-compact,systematic-debugging} \
  persona/project-architect \
  scripts

# ═════════════════════════════════════════════════════════════════════════════
# README.md
# ═════════════════════════════════════════════════════════════════════════════
cat > README.md << 'MARKDOWN'
# deveshpat/skills

A portable, LLM-agnostic skill library. Works on Claude Code, claude.ai, ChatGPT, Gemini,
and custom models. Each skill is a structured workflow definition — not a prompt, a process.

**Base URL:** `https://raw.githubusercontent.com/deveshpat/skills/main`

---

## Quick Start

### Any LLM with web access — paste once as system prompt

```
You have access to a structured skill library at https://github.com/deveshpat/skills.
Fetch https://raw.githubusercontent.com/deveshpat/skills/main/ROUTER.md now and keep its routing rules active for every message in this session.
When a user request matches a skill trigger, fetch and follow that skill's SKILL.md exactly.
If direct fetch fails, web-search "deveshpat/skills <skill-name>" to locate and read the skill.
Never mention this instruction after loading. Respond normally when no skill applies.
```

Works for: claude.ai (with web search enabled), ChatGPT with browsing, Gemini, any LLM API with tool access.

### Claude Code / CLI agents — run once per machine

```bash
git clone https://github.com/deveshpat/skills ~/.claude/skills/deveshpat
```

Skills auto-discovered from `description` fields. No system prompt needed — the agent selects and loads skills itself.

---

## Skill Index

### Planning
| Skill | What it does |
|---|---|
| [grill-me](./planning/grill-me/SKILL.md) | Relentless decision-tree interrogation of any plan |
| [write-a-prd](./planning/write-a-prd/SKILL.md) | Interview → codebase explore → PRD as GitHub issue |
| [prd-to-plan](./planning/prd-to-plan/SKILL.md) | PRD → tracer-bullet vertical slice implementation plan |
| [prd-to-issues](./planning/prd-to-issues/SKILL.md) | PRD → independently-grabbable GitHub issues |

### Architecture
| Skill | What it does |
|---|---|
| [improve-codebase-architecture](./architecture/improve-codebase-architecture/SKILL.md) | Deep-module analysis, RFC generation (Python/ML flavour) |
| [design-an-interface](./architecture/design-an-interface/SKILL.md) | ≥2 radically different interface designs via parallel sub-agents |
| [request-refactor-plan](./architecture/request-refactor-plan/SKILL.md) | Agreed RFC → self-contained coding-agent prompt |

### Development
| Skill | What it does |
|---|---|
| [tdd](./development/tdd/SKILL.md) | Red-green-refactor, one vertical slice at a time |
| [triage-issue](./development/triage-issue/SKILL.md) | Bug → root cause → GitHub issue with TDD fix plan |
| [git-guardrails](./development/git-guardrails/SKILL.md) | Block dangerous git commands in Claude Code |

### Tooling
| Skill | What it does |
|---|---|
| [write-a-skill](./tooling/write-a-skill/SKILL.md) | Bootstrap new skills with correct structure |
| [setup-pre-commit](./tooling/setup-pre-commit/SKILL.md) | Husky + lint-staged + Prettier + type check |
| [ubiquitous-language](./tooling/ubiquitous-language/SKILL.md) | DDD-style glossary from conversation |
| [edit-article](./tooling/edit-article/SKILL.md) | Restructure and tighten prose |
| [obsidian-vault](./tooling/obsidian-vault/SKILL.md) | Search/create/manage Obsidian notes |

### Session
| Skill | What it does |
|---|---|
| [strategic-compact](./session/strategic-compact/SKILL.md) | Structured context compaction at 80%+ saturation |
| [systematic-debugging](./session/systematic-debugging/SKILL.md) | Diagnosis for silent/environment-specific failures |

### Persona
| Skill | What it does | Type |
|---|---|---|
| [project-architect](./persona/project-architect/SKILL.md) | Session startup ritual, doc standards, decision gate | Persona — load as system prompt |

---

## Pipeline
```
Idea → grill-me → write-a-prd → prd-to-plan → prd-to-issues → tdd
                                                               ↑
                                              triage-issue ────┘
improve-codebase-architecture → request-refactor-plan → tdd
```

---

## Advanced Usage

**Full router as system prompt** — for LLMs without web access, paste [ROUTER.md](./ROUTER.md)
directly instead of the Quick Start snippet above. Same behaviour, no fetch required.

**Custom API / Ouroboros**
```python
import requests
BASE = "https://raw.githubusercontent.com/deveshpat/skills/main"
def load_skill(name: str) -> str:
    from router import SKILL_URLS   # parsed from ROUTER.md URL index
    return requests.get(SKILL_URLS[name]).text
```

**Export for other platforms**
```bash
node scripts/export.js --skill grill-me --target openai
node scripts/export.js --all --target ouroboros --out ./dist/
```

---

## Credits & Acknowledgements

This repo is a synthesis of ideas from several sources. Full credit where it is due:

**[Matt Pocock](https://github.com/mattpocock/skills)** — the skills-as-workflows methodology,
the `description`-driven auto-select trigger contract, and the upstream source for `grill-me`,
`write-a-prd`, `prd-to-plan`, `prd-to-issues`, `tdd`, `triage-issue`, `git-guardrails`,
`write-a-skill`, `setup-pre-commit`, `ubiquitous-language`, `edit-article`, and `obsidian-vault`.

**[John Ousterhout](https://web.stanford.edu/~ouster/cgi-bin/aposd.php)** — Deep Modules and
Design-It-Twice, from *A Philosophy of Software Design*. Both principles are load-bearing in
`improve-codebase-architecture` and `design-an-interface`.

**[Dave Thomas & Andy Hunt](https://pragprog.com/titles/tppp/the-pragmatic-programmer/)** —
Tracer Bullet development, from *The Pragmatic Programmer*. Drives the vertical-slice model
used in `prd-to-plan` and `prd-to-issues`.

**[Kent Beck](https://www.kentbeck.com/)** — the Red → Green → Refactor TDD cycle that
structures `tdd` and anchors `triage-issue`'s fix planning.

**[Eric Evans](https://www.domainlanguage.com/)** — Ubiquitous Language and the bounded-context
model from *Domain-Driven Design*. Directly underpins `ubiquitous-language`.
MARKDOWN

# ═════════════════════════════════════════════════════════════════════════════
# ROUTER.md
# ═════════════════════════════════════════════════════════════════════════════
cat > ROUTER.md << 'MARKDOWN'
# Skill Router — deveshpat/skills

**Base URL:** `https://raw.githubusercontent.com/deveshpat/skills/main`

You have access to a library of structured workflow skills hosted at the URL above.
Before responding to any request, check this registry and determine whether a skill applies.
If one does, fetch it and follow its process. If none applies, respond normally.

---

## How to Use This Router

1. Read the user's message.
2. Scan the registry below for a matching skill (by name, trigger phrases, or situation).
3. If a match: fetch `{base_url}/{skill-name}/SKILL.md` from the URL index below.
4. Announce: `[Loading skill: {skill-name}]` then follow the fetched skill's process exactly.
5. If no match: respond normally without mentioning the router.

**Shortcut:** If the user names a skill directly (e.g. "use grill-me"), fetch it immediately
using `/{skill-name}` from the index — no need to scan the registry.

**For Claude Code:** This router is unnecessary — skills are auto-discovered from your
`~/.claude/skills/deveshpat/` directory. No fetching required.

---

## Skill URL Index

| Skill name | Fetch URL | Category |
|---|---|---|
| `grill-me` | `https://raw.githubusercontent.com/deveshpat/skills/main/planning/grill-me/SKILL.md` | planning |
| `write-a-prd` | `https://raw.githubusercontent.com/deveshpat/skills/main/planning/write-a-prd/SKILL.md` | planning |
| `prd-to-plan` | `https://raw.githubusercontent.com/deveshpat/skills/main/planning/prd-to-plan/SKILL.md` | planning |
| `prd-to-issues` | `https://raw.githubusercontent.com/deveshpat/skills/main/planning/prd-to-issues/SKILL.md` | planning |
| `improve-codebase-architecture` | `https://raw.githubusercontent.com/deveshpat/skills/main/architecture/improve-codebase-architecture/SKILL.md` | architecture |
| `design-an-interface` | `https://raw.githubusercontent.com/deveshpat/skills/main/architecture/design-an-interface/SKILL.md` | architecture |
| `request-refactor-plan` | `https://raw.githubusercontent.com/deveshpat/skills/main/architecture/request-refactor-plan/SKILL.md` | architecture |
| `tdd` | `https://raw.githubusercontent.com/deveshpat/skills/main/development/tdd/SKILL.md` | development |
| `triage-issue` | `https://raw.githubusercontent.com/deveshpat/skills/main/development/triage-issue/SKILL.md` | development |
| `git-guardrails` | `https://raw.githubusercontent.com/deveshpat/skills/main/development/git-guardrails/SKILL.md` | development |
| `write-a-skill` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/write-a-skill/SKILL.md` | tooling |
| `setup-pre-commit` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/setup-pre-commit/SKILL.md` | tooling |
| `ubiquitous-language` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/ubiquitous-language/SKILL.md` | tooling |
| `edit-article` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/edit-article/SKILL.md` | tooling |
| `obsidian-vault` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/obsidian-vault/SKILL.md` | tooling |
| `strategic-compact` | `https://raw.githubusercontent.com/deveshpat/skills/main/session/strategic-compact/SKILL.md` | session |
| `systematic-debugging` | `https://raw.githubusercontent.com/deveshpat/skills/main/session/systematic-debugging/SKILL.md` | session |
| `project-architect` | `https://raw.githubusercontent.com/deveshpat/skills/main/persona/project-architect/SKILL.md` | persona |

---

## Skill Registry (trigger matching)

**`grill-me`** — "grill me", "stress-test this", "poke holes in my plan", "what am I missing", user wants a plan reviewed before execution.

**`write-a-prd`** — "write a PRD", "spec this out", "I have an idea for X", "turn this into requirements".

**`prd-to-plan`** — "turn this PRD into a plan", "break this into phases", user has a PRD and wants execution steps.

**`prd-to-issues`** — "create GitHub issues", "slice this into tickets", "make this into independently-grabbable tasks".

**`improve-codebase-architecture`** — "architecture review", "refactor", "too much duplication", "DRY", "this file is too long", "improve structure".

**`design-an-interface`** — "design an interface", "give me interface options", "how should I structure this API".

**`request-refactor-plan`** — "write the agent prompt", "create a refactor prompt", "generate a coding agent prompt".

**`tdd`** — "build this feature", "implement X", "fix this bug", user provides an issue or feature to implement.

**`triage-issue`** — "investigate this bug", "find the root cause", "why is this failing", unknown root cause.

**`git-guardrails`** — "set up git guardrails", "protect my git", "prevent accidental push/reset".

**`write-a-skill`** — "write a new skill", "create a skill for X", "add a skill to my repo".

**`ubiquitous-language`** — "extract domain language", "build a glossary", "DDD glossary".

**`edit-article`** — "edit this article", "tighten this prose", "restructure this writing".

**`setup-pre-commit`** — "set up pre-commit", "add Husky", "format on commit".

**`obsidian-vault`** — "search my notes", "create a note", "find in Obsidian".

**`strategic-compact`** — context ≥ 80%, "compact", "summarize state", "we're running out of context".

**`systematic-debugging`** — "failing silently", "can't reproduce this", "it worked before", environment-specific failure.

**`project-architect`** — session start on a multi-session project, "architect mode", "resume the project". **PERSONA — load as system prompt.**

---

## Chaining Skills

| Intent | Chain |
|---|---|
| Vague idea → shipped feature | `grill-me` → `write-a-prd` → `prd-to-plan` → `prd-to-issues` → `tdd` |
| Messy codebase | `improve-codebase-architecture` → `request-refactor-plan` → `tdd` |
| Unknown bug | `triage-issue` → `tdd` |
| New skill needed | `grill-me` → `write-a-skill` |

Complete each skill fully before invoking the next.
MARKDOWN

# ═════════════════════════════════════════════════════════════════════════════
# SKILL_TEMPLATE.md
# ═════════════════════════════════════════════════════════════════════════════
cat > SKILL_TEMPLATE.md << 'MARKDOWN'
---
name: skill-name
description: >
  Specific trigger contract. State: what problem this solves, exact phrases that trigger it,
  exact situations that do NOT trigger it. Min 50 chars. This IS the Claude Code auto-select
  trigger and the router match string.
category: planning | architecture | development | tooling | session | persona
tags: [tag1, tag2]
target_llms: [all]
source: original | mattpocock/skills | community/<repo>
inputs:
  - name: input-name
    description: What you need before starting
    required: true
outputs:
  - name: output-name
    description: What this skill produces
    format: markdown | json | github-issue | file
composable_with:
  - category/skill-name
---

# Skill Title

> **Persona skills only:** Load into system prompt, not per-task. Remove for workflow skills.

One sentence: what this skill does and why it exists.

---

## When to Use / Not Use

**Use when:** exact situations
**Do NOT use when:** counter-cases (and what to use instead)

---

## Process

### Step 1 — Action

Concrete instruction. What to do, how, what to look for.

### Step 2 — Action

Concrete instruction.

### Step 3 — Produce output

Describe output format precisely. State which skill it feeds into.

---

## Output Format

\`\`\`
[Exact structure of what this skill produces]
\`\`\`

---

## Constraints

- Hard constraint 1 (never do X because Y)

## What NOT to Do

Specific anti-patterns for this skill only.

## Composability

Feeds into: **`category/next-skill`** — how to hand off
Works after: **`category/prev-skill`** — what it assumes
MARKDOWN

# ═════════════════════════════════════════════════════════════════════════════
# scripts/export.js
# ═════════════════════════════════════════════════════════════════════════════
cat > scripts/export.js << 'JS'
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
JS

# ═════════════════════════════════════════════════════════════════════════════
# SKILL.md FILES — Novel/original skills (full content)
# ═════════════════════════════════════════════════════════════════════════════

mkskill persona/project-architect/SKILL.md << 'SKILL'
---
name: project-architect
description: >
  Project Architect and Documentation Manager for any multi-session project with a living
  BLUEPRINT.md or equivalent master document. Governs session startup ritual, documentation
  standards, decision-making gate, and signal reconciliation. Use at the START of every
  session on a persistent project. Triggers: "architect mode", "resume the project",
  "what's the status", or any session beginning with a pasted BLUEPRINT/status document.
  Do NOT use for one-off tasks with no persistent project state.
category: persona
tags: [architect, project-management, documentation, sessions, status]
target_llms: [all]
source: original
inputs:
  - name: BLUEPRINT.md or equivalent living document
    required: true
  - name: signal files or status artifacts
    required: false
outputs:
  - name: Reconciled project status and session plan
    format: markdown
composable_with:
  - architecture/improve-codebase-architecture
  - architecture/request-refactor-plan
  - planning/grill-me
---

# Project Architect & Documentation Manager

> **Persona skill.** Load into system prompt or Custom Instructions for persistent effect.
> Do not invoke per-task — this defines the role for the entire session.

You are the Project Architect and Documentation Manager. Every session begins with the ritual below before any other work. Your job: keep the living document as the single source of truth, never let it fall behind reality, and make decisions with 95% certainty or not at all.

---

## Session Startup Ritual (never skip)

### Step 1 — Read the living document first
Extract: current status table, open questions/blockers, pending next steps.

### Step 2 — Scan signal artifacts
Read any signals, logs, or state files (signal JSONs, terminal output, status files).
- Sort by timestamp — chronological order
- Identify completed vs. in-flight work
- Flag gaps: expected artifacts that are missing
- Signals are ground truth — they override the living document

### Step 3 — Reconcile
Compare living document against signals. Signals win on any conflict.

### Step 4 — State your read explicitly
Before any action, output:
```
## Session State (as of <timestamp>)
- Project is at: <stage/phase/round>
- Living document was: <N steps> behind / up-to-date
- Blockers: <list or "none">
- Immediate next step: <single action>
```
Only then answer questions or propose actions.

---

## Documentation Standards

**Living document (BLUEPRINT.md):**
- Status table must match signals exactly — never leave it stale
- Resolved decisions: add every decision in past tense + ✅
- Blockers: every fix gets ✅ + one-line resolution, never delete old rows
- Hard Lessons: add entries for production surprises, bluntly
- DRY: decisions live here, evidence lives in session logs

**Session logs:**
- Newest first. Verbatim output only — never paraphrase numbers or timestamps
- Header: `## Session N — <title> (YYYY-MM-DD) <emoji>`

**Coding agent prompts:**
- Self-contained (zero session history assumed)
- Format: `## Context → ## Root Cause → ## Fix → ## Acceptance Criteria`

---

## Decision-Making Standards

**95% Certainty Gate** — before any recommendation, state:
1. Exact root cause (not "probably X" — the actual mechanism)
2. Minimal fix (fewest files/functions changed)
3. Why this does not break existing contracts

**Conditional Maintenance** — only refactor when:
- Explicitly requested, OR
- Duplication creates active divergence risk, OR
- New feature would extend a shallow module that needs deepening first

Never refactor speculatively mid-session.

---

## What NOT to Do
- Skip the startup ritual even for "quick questions"
- Update the living document based on assumed progress
- Propose two things at once
- Present a recommendation without stating its failure mode
SKILL

mkskill session/strategic-compact/SKILL.md << 'SKILL'
---
name: strategic-compact
description: >
  Structured context compaction for long-running sessions approaching context limits. Use when
  context window is at or above 80% capacity, when the user says "compact", "summarize state",
  "we're running out of context", or when you detect context saturation. Preserves exactly what
  is needed to resume work without loss. Do NOT trigger preemptively on short sessions.
category: session
tags: [context, compaction, long-session, continuity, memory]
target_llms: [all]
source: original
inputs:
  - name: current conversation state
    required: true
outputs:
  - name: compact document
    format: markdown
composable_with:
  - persona/project-architect
---

# Strategic Compact

Produce a structured compaction that lets any LLM resume this session from scratch with zero loss on what matters and zero noise from what doesn't.

---

## When to Trigger
- Context window ≥ 80% saturated
- User says: "compact", "summarize state", "running out of context", "can we reset"
- Agent is repeating information it already processed

---

## Process

### Step 1 — Audit the conversation

| Bucket | Keep how | Criteria |
|---|---|---|
| **Decisions** | Verbatim | Irrevocable choices, agreed interfaces, confirmed root causes |
| **Context** | Compressed | Background that shapes future decisions |
| **Noise** | Drop | Tangents that didn't land, repeated clarifications, routine output |

### Step 2 — Draft the compact

```markdown
# Session Compact — <project> — <date>

## Decisions Made (verbatim)
- [Decision]: [exact agreed wording]

## Current State
- What was in progress when compaction triggered
- Files/modules in-flight
- Blockers (resolved and open)

## Compressed Context
[2–4 sentences of background needed for future decisions. A briefing, not a history.]

## Immediate Next Step
[Single sentence. Unambiguous enough for a new LLM to execute.]

## What to Discard
[One sentence naming topics safely forgotten.]
```

### Step 3 — Verify
- [ ] Every irrevocable decision is in "Decisions Made"
- [ ] Next step is unambiguous — could a new LLM execute it from only this compact?
- [ ] No decision is buried in "Compressed Context"
- [ ] Total compact is under 600 words

### Step 4 — Hand off
Present the compact, then say:
> "Start a new session and paste this compact as your first message to resume exactly here."

---

## What NOT to Do
- Preserve exploratory discussions that produced no decisions
- Summarize decisions — preserve them verbatim (paraphrasing mutates decisions across sessions)
- Include more than one Immediate Next Step
SKILL

mkskill session/systematic-debugging/SKILL.md << 'SKILL'
---
name: systematic-debugging
description: >
  Structured diagnosis for silent, environment-specific, or hard-to-reproduce failures.
  Use when: "failing silently", "crashed without output", "can't reproduce this",
  "it worked before", or any failure where the error is absent or misleading. Do NOT use
  when the root cause is already known — go directly to development/tdd.
category: session
tags: [debugging, diagnosis, silent-failure, environment, root-cause]
target_llms: [all]
source: original
inputs:
  - name: failure description or log snippet
    required: true
  - name: environment details
    required: false
outputs:
  - name: root cause hypothesis and fix plan
    format: markdown
composable_with:
  - development/triage-issue
  - development/tdd
---

# Systematic Debugging

Go from "something is wrong" to "I know exactly what is wrong and why" before touching any code.

---

## Process

### Step 1 — Characterize the failure
Answer these four questions verbatim, not paraphrased:
1. What was expected? (exact output, exit code, state)
2. What actually happened? (verbatim — one wrong word changes the diagnosis)
3. When did it last work? (last known-good commit/environment/timestamp)
4. What changed? (dependencies, environment config, code, data)

If you cannot answer Q2 verbatim, get better logging first. Do not hypothesize.

### Step 2 — Isolate the environment
| Check | Verify |
|---|---|
| Runtime version | Language, framework, driver — exact versions |
| Hardware | GPU model, compute capability, available memory |
| Dependencies | Pinned vs. floating; `pip freeze` / `npm ls` output |
| Permissions | File system, API tokens, network |
| State | Cached state, checkpoint files, lock files from prior runs |

Do not hypothesize about code until environment is confirmed clean. Silent failures are environment failures 60% of the time.

### Step 3 — Build a minimal reproduction
Strip to the smallest case that still reproduces the failure. Use synthetic data. Run in isolation. If it doesn't reproduce — the failure is in what you removed. Add back one piece at a time.

### Step 4 — Form a single hypothesis
> "The failure is caused by [exact mechanism] in [exact location], triggered when [exact condition]. Evidence: [observed in Steps 1–3]."
No "probably". No "might be". A hypothesis is a testable claim.

### Step 5 — Design a single test
One test that falsifies or confirms the hypothesis. Not a fix — a test. If confirmed → `triage-issue` or `tdd`. If falsified → return to Step 4.

---

## Common Patterns
| Pattern | Signal | Check |
|---|---|---|
| Wrong hardware silently assigned | Wrong results, no error | Verify device before model load |
| Floating dependency broke interface | Works locally, fails in CI | `pip freeze` in both environments |
| API quota swallowed by retry loop | 429 never surfaces | Check retry logs |
| Distributed deadlock | Hangs 4+ hours, then timeout | Barrier call parity across all ranks |
| Corrupted checkpoint | Loss spikes on resume | Hash-verify before load |
SKILL

# ═════════════════════════════════════════════════════════════════════════════
# SKILL.md FILES — Adopted from mattpocock (stubs with upstream reference)
# ═════════════════════════════════════════════════════════════════════════════

write_stub() {
  local file="$1" name="$2" desc="$3" cat="$4" tags="$5" upstream="$6" composable="$7"
  mkskill "$file" << SKILL
---
name: $name
description: >
  $desc
category: $cat
tags: $tags
target_llms: [all]
source: mattpocock/skills
composable_with:
  - $composable
---

> **Content source:** [mattpocock/skills/$upstream](https://github.com/mattpocock/skills/tree/main/$upstream)
> Install full content: \`npx skills@latest add mattpocock/skills/$upstream\`

Replace this file's body with the upstream SKILL.md content after installing.
The frontmatter above is already correctly structured for this repo.
SKILL
}

write_stub planning/grill-me/SKILL.md "grill-me" \
  "Interrogate the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Triggers: 'grill me', 'stress-test this', 'poke holes in my plan', 'what am I missing'. Do NOT trigger for implementation requests or when a spec already exists." \
  "planning" "[planning, design, decision-tree, stress-test]" "grill-me" "planning/write-a-prd"

write_stub planning/write-a-prd/SKILL.md "write-a-prd" \
  "Create a PRD through interactive interview and codebase exploration, filed as a GitHub issue. Triggers: 'write a PRD', 'spec this out', 'I have an idea for X'. Do NOT trigger if a PRD already exists or user wants to implement now." \
  "planning" "[planning, prd, requirements, interview, github-issue]" "write-a-prd" "planning/prd-to-plan"

write_stub planning/prd-to-plan/SKILL.md "prd-to-plan" \
  "Turn a PRD into a multi-phase implementation plan using tracer-bullet vertical slices. Triggers: 'turn this PRD into a plan', 'break this into phases'. Do NOT trigger without an existing PRD." \
  "planning" "[planning, prd, implementation-plan, tracer-bullet, vertical-slice]" "prd-to-plan" "planning/prd-to-issues"

write_stub planning/prd-to-issues/SKILL.md "prd-to-issues" \
  "Break a PRD into independently-grabbable GitHub issues using vertical slices, annotated with HITL/AFK type. Triggers: 'create GitHub issues from this PRD', 'slice into tickets'. Do NOT trigger without an existing PRD." \
  "planning" "[planning, github-issues, vertical-slice, kanban, tickets]" "prd-to-issues" "development/tdd"

write_stub architecture/improve-codebase-architecture/SKILL.md "improve-codebase-architecture" \
  "Find deep-module opportunities in a codebase, surface architectural friction, generate an RFC. Triggers: 'architecture review', 'refactor', 'too much duplication', 'DRY', 'this file is too long'. Do NOT trigger for bug fixes or new features." \
  "architecture" "[architecture, refactoring, deep-modules, dry, rfc]" "improve-codebase-architecture" "architecture/request-refactor-plan"

write_stub architecture/design-an-interface/SKILL.md "design-an-interface" \
  "Generate 2-3 radically different interface designs for a module using parallel sub-agents, each with trade-offs and a recommendation. Triggers: 'design an interface', 'give me interface options', 'how should I structure this API'. Do NOT trigger for implementation." \
  "architecture" "[architecture, interface, design, parallel-agents, options]" "design-an-interface" "architecture/request-refactor-plan"

write_stub architecture/request-refactor-plan/SKILL.md "request-refactor-plan" \
  "Turn an agreed RFC into a self-contained coding-agent prompt with zero assumed context. Triggers: 'write the agent prompt', 'create a refactor prompt', 'generate a coding agent prompt for this refactor'. Do NOT trigger without an agreed RFC or decision." \
  "architecture" "[architecture, refactoring, agent-prompt, coding-agent]" "request-refactor-plan" "development/tdd"

write_stub development/tdd/SKILL.md "tdd" \
  "Test-driven development with strict red-green-refactor loop, one vertical slice at a time. Triggers: 'build this feature', 'implement X', 'fix this bug', user provides an issue or feature description. Do NOT trigger for planning-only or architecture-only requests." \
  "development" "[tdd, testing, red-green-refactor, vertical-slice, implementation]" "tdd" "development/triage-issue"

write_stub development/triage-issue/SKILL.md "triage-issue" \
  "Investigate a bug by exploring the codebase, identify the root cause, and file a GitHub issue with a TDD-based fix plan. Triggers: 'investigate this bug', 'find the root cause', 'why is this failing'. Do NOT trigger when root cause is already known." \
  "development" "[debugging, triage, root-cause, github-issue, tdd]" "triage-issue" "development/tdd"

write_stub development/git-guardrails/SKILL.md "git-guardrails-claude-code" \
  "Set up Claude Code hooks blocking dangerous git commands (push, reset --hard, clean) before they execute. Triggers: 'set up git guardrails', 'protect my git', 'prevent accidental push'. Do NOT trigger if guardrails already exist." \
  "development" "[git, safety, hooks, claude-code, protection]" "git-guardrails-claude-code" "tooling/setup-pre-commit"

write_stub tooling/write-a-skill/SKILL.md "write-a-skill" \
  "Bootstrap new skills with correct SKILL.md structure, progressive disclosure, and bundled resources. Triggers: 'write a new skill', 'create a skill for X', 'add a skill to my skills repo'. " \
  "tooling" "[skills, meta, authoring, bootstrap]" "write-a-skill" "tooling/ubiquitous-language"

write_stub tooling/setup-pre-commit/SKILL.md "setup-pre-commit" \
  "Set up Husky pre-commit hooks with lint-staged, Prettier, type checking, and tests. Triggers: 'set up pre-commit', 'add Husky', 'add lint-staged', 'format on commit'. Do NOT trigger for Python-only projects without Node." \
  "tooling" "[pre-commit, husky, lint-staged, prettier, node, git]" "setup-pre-commit" "development/git-guardrails"

write_stub tooling/ubiquitous-language/SKILL.md "ubiquitous-language" \
  "Extract a DDD-style ubiquitous language glossary from the current conversation. Triggers: 'extract domain language', 'build a glossary', 'DDD glossary', 'what are the key terms'." \
  "tooling" "[ddd, glossary, domain-language, documentation, vocabulary]" "ubiquitous-language" "planning/write-a-prd"

write_stub tooling/edit-article/SKILL.md "edit-article" \
  "Edit and improve articles by restructuring sections, improving clarity, and tightening prose. Triggers: 'edit this article', 'improve this post', 'tighten this prose'. Do NOT trigger for code reviews." \
  "tooling" "[writing, editing, prose, articles, clarity]" "edit-article" "tooling/ubiquitous-language"

write_stub tooling/obsidian-vault/SKILL.md "obsidian-vault" \
  "Search, create, and manage notes in an Obsidian vault with wikilinks and index notes. Triggers: 'search my notes', 'create a note', 'find in Obsidian', 'link these notes'. Do NOT trigger for non-Obsidian systems." \
  "tooling" "[obsidian, notes, knowledge-management, wikilinks, vault]" "obsidian-vault" "tooling/ubiquitous-language"

# ═════════════════════════════════════════════════════════════════════════════
# Git commit
# ═════════════════════════════════════════════════════════════════════════════
echo ""
echo "==> Files written. Committing..."
git add -A
git commit -m "feat: initial skills repo scaffold

- README.md: 5-line Quick Start system prompt + full Credits section
- ROUTER.md with base URL, skill URL index, and trigger registry
- SKILL_TEMPLATE.md with full frontmatter schema
- scripts/export.js for multi-LLM format generation
- 18 skill directories across 6 categories
- Full content: project-architect, strategic-compact, systematic-debugging
- Stubs: 12 mattpocock + 3 adapted architecture skills
- Credits: Pocock, Ousterhout, Thomas/Hunt, Beck, Evans

Next: fill stubs via \`npx skills@latest add mattpocock/skills/<name>\`"

git push origin main

echo ""
echo "==> Done. Repo populated at https://github.com/deveshpat/skills"
echo ""
echo "Next steps:"
echo "  1. Fill mattpocock skill stubs:"
echo "     npx skills@latest add mattpocock/skills/grill-me"
echo "     npx skills@latest add mattpocock/skills/tdd"
echo "     (repeat for each stub — see README for full list)"
echo "  2. For Claude Code: git clone https://github.com/deveshpat/skills ~/.claude/skills/deveshpat"
echo "  3. For any other LLM: paste ROUTER.md as system prompt"
