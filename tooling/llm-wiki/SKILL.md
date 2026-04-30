---
name: llm-wiki
description: >
  Build and maintain a persistent, LLM-compiled wiki that accumulates project knowledge
  across sessions. The project's own files are the source — no duplication. The wiki is
  a synthesized understanding layer (patterns, decisions, gotchas, prompt behaviors) that
  reduces re-explanation overhead for both user and LLM. Triggers: 'set up a wiki',
  'synthesize wiki page for X', 'what do we know about X', 'update the wiki', 'distill
  this session', 'lint the wiki'. Do NOT trigger for one-off questions with no intent
  to persist the answer.
category: tooling
tags: [wiki, knowledge-base, synthesize, compounding-knowledge, session-continuity]
target_llms: [all]
source: original
composable_with:
  - session/strategic-compact
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
