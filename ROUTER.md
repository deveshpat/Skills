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
