# WIKI.md — Schema & Conventions

## What this wiki is

A synthesized understanding layer over deveshpat/skills. The project's own SKILL.md files
are the source of truth — this wiki captures what they mean, not what they say.
It accumulates patterns, trigger decisions, chaining logic, and known gotchas across sessions.

## Page types

| Type | Subdirectory | What it captures |
|---|---|---|
| `skill-pattern` | `wiki/skill-pattern/` | How a specific skill behaves in practice: trigger precision, edge cases, common misuse, output shape |
| `chain` | `wiki/chain/` | A multi-skill workflow: when to enter, how handoff works, where it breaks |
| `decision` | `wiki/decision/` | An architectural decision about the skills library itself: why a skill was designed a certain way, what was rejected |

## Naming conventions

- Files: `kebab-case.md`
- Titles: sentence case (e.g. `TDD vertical slice discipline`)
- `sources:` must list the SKILL.md (or other project file) the page was synthesized from
- One concept per page; prefer deepening existing pages over creating shallow new ones

## Workflows

### Synthesize
When a skill's behavior, a chain, or a design decision becomes clear in session:
read the relevant source files → write understanding (not summary) → update index.md → log.

### Distill
At session end: identify what was learned → create or update pages → log with session summary.

### Query
Read index.md → read relevant pages → answer citing page names.
If answer requires synthesis not yet on a page, produce inline and offer to Distill.

### Lint
Verify all index.md entries exist on disk. Check `sources:` files haven't changed since `updated:`.
Flag orphan pages. Flag near-duplicates. Do not auto-fix without approval.

## What NOT to capture

- Content already in SKILL.md files verbatim (no duplication)
- Volatile implementation details (file paths, line numbers)
- Anything a future reader can trivially derive from reading the skill itself
