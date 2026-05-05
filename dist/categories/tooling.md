# Tooling skills

Generated from canonical SKILL.md files.

# edit-article

- Category: tooling
- Path: tooling/edit-article/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/tooling/edit-article/SKILL.md
- Tags: writing, editing, article, prose
- Chains to: none

## Trigger contract

Edit prose for clarity, structure, argument flow, concision, and reader impact. Use when the user provides an article, draft, essay, post, or long-form writing to improve.

---

# Edit Article

Use this skill to improve a piece of writing while preserving the author’s intent and voice.

## When to Use

Use when the user provides prose and asks to:
- edit;
- tighten;
- restructure;
- improve flow;
- make it clearer;
- make it more persuasive;
- prepare it for publication.

## Process

1. Identify the intended audience and purpose from the draft.
2. Preserve the core argument and voice unless the user asks otherwise.
3. Improve structure before sentence-level polish.
4. Remove repetition, filler, and unclear transitions.
5. Strengthen openings, section flow, and conclusions.
6. Flag claims that need evidence rather than silently inventing support.
7. Provide either a revised draft or targeted edits depending on the user’s request.

## Output Contract

When revising, provide:
- a cleaned-up version;
- a short list of major changes;
- optional notes for claims, structure, or tone.

When reviewing, provide:
- structural feedback;
- line-level issues;
- suggested rewrites for weak passages.

## Verification

The edited article should be clearer, tighter, and easier to follow without changing the author’s meaning.

## What NOT to Do

- Do not fabricate citations or facts.
- Do not erase the author’s voice.
- Do not over-polish into generic corporate prose.
- Do not make major argument changes without saying so.


# llm-wiki

- Category: tooling
- Path: tooling/llm-wiki/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/tooling/llm-wiki/SKILL.md
- Tags: wiki, knowledge-base, synthesize, compounding-knowledge, session-continuity
- Chains to: `session/strategic-compact`

## Trigger contract

Build and maintain a persistent, LLM-compiled wiki that accumulates project knowledge across sessions. The project's own files are the source — no duplication. The wiki is a synthesized understanding layer (patterns, decisions, gotchas, prompt behaviors) that reduces re-explanation overhead for both user and LLM. Triggers: 'set up a wiki', 'synthesize wiki page for X', 'what do we know about X', 'update the wiki', 'distill this session', 'lint the wiki'. Do NOT trigger for one-off questions with no intent to persist the answer.

---

# LLM Wiki

A persistent, LLM-maintained wiki that accumulates understanding of a project across
sessions. The project's own files are the source — nothing is duplicated. The wiki
captures what the files mean, not what they say.

Inspired by Karpathy's LLM Wiki pattern, adapted: no raw/ directory, project files
are referenced in place, and the wiki is co-evolved via a schema file.

## When to Use / Not Use

**Use when:** a project accumulates knowledge worth keeping across sessions — architectural
reasoning, behavioral patterns, prompt results, known failure modes, workflow conventions.

**Do NOT use when:** the question is one-off, nothing needs to persist, or no wiki
directory exists or is planned.

---

## Structure

```
<project>/
├── WIKI.md       # Schema: conventions, page types, and workflow rules (you + LLM co-evolve)
└── wiki/
    ├── index.md  # Content catalog — one line per page with summary, LLM-maintained
    ├── log.md    # Append-only operation log
    └── <type>/   # Subdirectories defined in WIKI.md at init — not hardcoded here
```

The project's existing files are the source. Wiki pages declare which project files
they were synthesized from via `sources:` frontmatter. No copying, no raw/ directory.

---

## Page Frontmatter (required on every wiki page)

```yaml
---
title: <page title>
type: <as defined in WIKI.md>
sources:
  - <path/to/project/file>   # files this page was synthesized from
updated: YYYY-MM-DD
---
```

`sources:` is the provenance chain. When a listed file changes, the page may be stale.

---

## Workflows

### Init

When the user asks to set up the wiki:

1. Ask two questions only: (a) what is this project about, and (b) what kinds of
   knowledge do you most want to capture?
2. Write `WIKI.md` tailored to the answers — define page types, naming conventions,
   and the four workflow stubs below. Suggest page types from the table at the end
   of this skill; let the user adjust.
3. Create `wiki/index.md` and `wiki/log.md` with empty scaffolding.
4. Create subdirectories as defined in `WIKI.md`.
5. Log: `## [YYYY-MM-DD] init | <project name>`.

### Synthesize

When the user asks to create or update a wiki page on a topic:

1. Identify the relevant project files (read them; do not assume their content).
2. Synthesize understanding — not a summary of the files, but what they mean: patterns,
   rationale, behaviors, constraints, gotchas.
3. Write or update the wiki page. If updating, integrate new understanding; do not
   overwrite existing understanding silently.
4. Flag contradictions with existing wiki content explicitly:
   `> ⚠️ Contradicts: [page] — [what conflicts and why]`
5. Update `wiki/index.md` for new pages.
6. Log: `## [YYYY-MM-DD] synthesize | <page title> | sources: <files read>`.

**Rules:**
- Write for the wiki reader, not as a file summary. Capture understanding, not content.
- One synthesize can produce or update multiple pages.
- Prefer deepening an existing page over creating a shallow new one.
- Do not modify any project source file.

### Distill

When the user ends a session or explicitly asks to capture session knowledge:

1. Review what was learned or decided in this session.
2. Identify which wiki pages should be created or updated based on session output.
3. Write or update those pages following Synthesize rules.
4. This is the primary way prompt patterns, debugging discoveries, and design decisions
   enter the wiki — straight from conversation, without needing a file as intermediary.
5. Log: `## [YYYY-MM-DD] distill | <session summary> | pages updated: <list>`.

### Query

When the user asks a question about the project domain:

1. Read `wiki/index.md` to identify relevant pages.
2. Read those pages.
3. Answer from the wiki, citing page names.
4. If the answer requires synthesis not yet on any page, produce it inline and offer
   to run Distill to persist it.

### Lint

When the user asks to check wiki consistency:

1. Verify every page in `index.md` exists on disk.
2. Check all cross-links between wiki pages resolve.
3. Flag pages whose `sources:` files have been modified since `updated:` date
   (potential staleness).
4. Flag orphan pages (no inbound links from other wiki pages or index).
5. Flag near-duplicate pages that should be merged.
6. Report findings. Do not auto-fix without user approval.

---

## Suggested Page Types

These are starting points for `WIKI.md`. Override freely at init.

| Type | What it captures |
|---|---|
| `concept` | How something works: a pattern, algorithm, or system behavior |
| `decision` | An architectural or design choice with rationale and rejected alternatives |
| `pattern` | A recurring implementation pattern with when/why to use it |
| `prompt` | A prompt pattern, system prompt shape, or eval result with context |
| `debug` | A failure mode or gotcha with the fix and root cause |
| `workflow` | A multi-step process the team follows (e.g. deploy, review, onboard) |

---

## Notes on Runtime

**Claude Code / agentic setup:** Full workflow automation — synthesize, distill, and
lint run autonomously with file access. Recommended.

**claude.ai / chat interface:** Works with manual file pasting. Synthesize and Distill
run in-session; you copy wiki page output to disk. Query works if you paste `index.md`
and relevant pages. Lint is manual.

The wiki is always the human-readable artifact — both modes produce the same output.

---

## Verification

- [ ] Every wiki page has `sources:` pointing to real project paths.
- [ ] `index.md` has an entry for every page in `wiki/`.
- [ ] `log.md` has an entry for every operation.
- [ ] No project source file was modified by any wiki operation.
- [ ] Contradictions are flagged, not silently overwritten.


# obsidian-vault

- Category: tooling
- Path: tooling/obsidian-vault/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/tooling/obsidian-vault/SKILL.md
- Tags: obsidian, notes, knowledge-management, wikilinks, vault
- Chains to: none

## Trigger contract

Search, create, and manage notes in an Obsidian vault with wikilinks and index notes. Triggers: 'search my notes', 'create a note', 'find in Obsidian', 'link these notes'. Do NOT trigger for non-Obsidian systems.

---

# Obsidian Vault

## Vault location

`/mnt/d/Obsidian Vault/AI Research/`

Mostly flat at root level.

## Naming conventions

- **Index notes**: aggregate related topics (e.g., `Ralph Wiggum Index.md`, `Skills Index.md`, `RAG Index.md`)
- **Title case** for all note names
- No folders for organization - use links and index notes instead

## Linking

- Use Obsidian `[[wikilinks]]` syntax: `[[Note Title]]`
- Notes link to dependencies/related notes at the bottom
- Index notes are just lists of `[[wikilinks]]`

## Workflows

### Search for notes

```bash
# Search by filename
find "/mnt/d/Obsidian Vault/AI Research/" -name "*.md" | grep -i "keyword"

# Search by content
grep -rl "keyword" "/mnt/d/Obsidian Vault/AI Research/" --include="*.md"
```

Or use Grep/Glob tools directly on the vault path.

### Create a new note

1. Use **Title Case** for filename
2. Write content as a unit of learning (per vault rules)
3. Add `[[wikilinks]]` to related notes at the bottom
4. If part of a numbered sequence, use the hierarchical numbering scheme

### Find related notes

Search for `[[Note Title]]` across the vault to find backlinks:

```bash
grep -rl "\\[\\[Note Title\\]\\]" "/mnt/d/Obsidian Vault/AI Research/"
```

### Find index notes

```bash
find "/mnt/d/Obsidian Vault/AI Research/" -name "*Index*"
```


# setup-pre-commit

- Category: tooling
- Path: tooling/setup-pre-commit/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/tooling/setup-pre-commit/SKILL.md
- Tags: pre-commit, husky, lint-staged, prettier, node, git
- Chains to: `development/git-guardrails`

## Trigger contract

Set up Husky pre-commit hooks with lint-staged, Prettier, type checking, and tests. Triggers: 'set up pre-commit', 'add Husky', 'add lint-staged', 'format on commit'. Do NOT trigger for Python-only projects without Node.

---

# Setup Pre-Commit Hooks

## What This Sets Up

- **Husky** pre-commit hook
- **lint-staged** running Prettier on all staged files
- **Prettier** config (if missing)
- **typecheck** and **test** scripts in the pre-commit hook

## Steps

### 1. Detect package manager

Check for `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (yarn), `bun.lockb` (bun). Use whichever is present. Default to npm if unclear.

### 2. Install dependencies

Install as devDependencies:

```
husky lint-staged prettier
```

### 3. Initialize Husky

```bash
npx husky init
```

This creates `.husky/` dir and adds `prepare: "husky"` to package.json.

### 4. Create `.husky/pre-commit`

Write this file (no shebang needed for Husky v9+):

```
npx lint-staged
npm run typecheck
npm run test
```

**Adapt**: Replace `npm` with detected package manager. If repo has no `typecheck` or `test` script in package.json, omit those lines and tell the user.

### 5. Create `.lintstagedrc`

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. Create `.prettierrc` (if missing)

Only create if no Prettier config exists. Use these defaults:

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. Verify

- [ ] `.husky/pre-commit` exists and is executable
- [ ] `.lintstagedrc` exists
- [ ] `prepare` script in package.json is `"husky"`
- [ ] `prettier` config exists
- [ ] Run `npx lint-staged` to verify it works

### 8. Commit

Stage all changed/created files and commit with message: `Add pre-commit hooks (husky + lint-staged + prettier)`

This will run through the new pre-commit hooks — a good smoke test that everything works.

## Notes

- Husky v9+ doesn't need shebangs in hook files
- `prettier --ignore-unknown` skips files Prettier can't parse (images, etc.)
- The pre-commit runs lint-staged first (fast, staged-only), then full typecheck and tests


# skill-audit

- Category: tooling
- Path: tooling/skill-audit/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/tooling/skill-audit/SKILL.md
- Tags: skills, audit, validation, router, metadata
- Chains to: `tooling/write-a-skill`

## Trigger contract

Audit an agent-skills repository as a workflow runtime: router, README, frontmatter, filesystem layout, bundled resources, local links, source attribution, placeholders, trigger breadth, and composability drift. Use when the user asks to scrutinize or improve a skills repo. Do NOT use for normal codebase refactors.

---

# Skill Audit

Audit a skills repository as a workflow runtime, not as a loose prompt collection.

## When to Use / Not Use

**Use when:** the user asks to inspect, validate, improve, or debug an agent skills repository.

**Do NOT use when:** the user wants to write application code or improve a normal codebase module.

## Process

1. Identify the canonical contract: README promises, router behavior, template schema, and export/validation tooling.
2. Inventory filesystem skills and every `SKILL.md`.
3. Validate frontmatter shape, required fields, and slug/name alignment.
4. Compare README, ROUTER, registry, filesystem, and exported metadata.
5. Check local links, bundled scripts/resources, and upstream attribution.
6. Flag placeholders, thin workflows, contradictory trigger/body instructions, broad triggers, and invalid `composable_with` targets.
7. Produce confirmed defects separately from design recommendations.
8. Recommend a patch order that fixes parser/registry foundations before workflow content.

## Output Format

```md
## Confirmed defects
- Finding, evidence, impact, fix

## Design risks
- Risk, why it matters, recommended direction

## Patch order
1. Foundation fixes
2. Registry/tooling fixes
3. Skill content fixes
4. New skills or workflow additions
```

## Verification

- [ ] Every confirmed defect has a file/path or source reference.
- [ ] Recommendations distinguish blocking parser failures from content quality issues.
- [ ] Patch order avoids fixing generated files before their generator/source of truth.


# write-a-skill

- Category: tooling
- Path: tooling/write-a-skill/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/tooling/write-a-skill/SKILL.md
- Tags: skills, meta, authoring, bootstrap
- Chains to: `tooling/skill-audit`

## Trigger contract

Bootstrap new skills with correct SKILL.md structure, progressive disclosure, and bundled resources. Triggers: 'write a new skill', 'create a skill for X', 'add a skill to my skills repo'.

---

# Writing Skills

## Process

1. **Gather requirements** - ask user about:
   - What task/domain does the skill cover?
   - What specific use cases should it handle?
   - Does it need executable scripts or just instructions?
   - Any reference materials to include?

2. **Draft the skill** - create:
   - SKILL.md with concise instructions
   - Additional reference files if content exceeds 500 lines
   - Utility scripts if deterministic operations needed

3. **Review with user** - present draft and ask:
   - Does this cover your use cases?
   - Anything missing or unclear?
   - Should any section be more/less detailed?

## Skill Structure

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── REFERENCE.md       # Detailed docs (if needed)
├── EXAMPLES.md        # Usage examples (if needed)
└── scripts/           # Utility scripts (if needed)
    └── helper.js
```

## SKILL.md Template

```md
---
name: skill-name
description: Brief description of capability. Use when [specific triggers].
---

# Skill Name

## Quick start

[Minimal working example]

## Workflows

[Step-by-step processes with checklists for complex tasks]

## Advanced features

[Link to separate files: See [REFERENCE.md](REFERENCE.md)]
```

## Description Requirements

The description is **the only thing your agent sees** when deciding which skill to load. It's surfaced in the system prompt alongside all other installed skills. Your agent reads these descriptions and picks the relevant skill based on the user's request.

**Goal**: Give your agent just enough info to know:

1. What capability this skill provides
2. When/why to trigger it (specific keywords, contexts, file types)

**Format**:

- Max 1024 chars
- Write in third person
- First sentence: what it does
- Second sentence: "Use when [specific triggers]"

**Good example**:

```
Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when user mentions PDFs, forms, or document extraction.
```

**Bad example**:

```
Helps with documents.
```

The bad example gives your agent no way to distinguish this from other document skills.

## When to Add Scripts

Add utility scripts when:

- Operation is deterministic (validation, formatting)
- Same code would be generated repeatedly
- Errors need explicit handling

Scripts save tokens and improve reliability vs generated code.

## When to Split Files

Split into separate files when:

- SKILL.md exceeds 100 lines
- Content has distinct domains (finance vs sales schemas)
- Advanced features are rarely needed

## Review Checklist

After drafting, verify:

- [ ] Description includes triggers ("Use when...")
- [ ] SKILL.md under 100 lines
- [ ] No time-sensitive info
- [ ] Consistent terminology
- [ ] Concrete examples included
- [ ] References one level deep
