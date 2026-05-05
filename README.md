# Skill-Binder

It is a portable Markdown library: one `SKILL.md` per workflow, plus `router.json` as the phonebook. Any LLM that can read Markdown can use it.

**Works with:** ChatGPT · Claude · Gemini · local models · coding agents · anything that can fetch or paste Markdown.

---

## Quick start

Paste this into your system prompt or Custom Instructions:

```markdown
# Context & Capabilities

Workspace -> <Project_Name> @ <url_or_path>.
All work -> grounded in current workspace.

Before acting:
- inspect relevant context
- load relevant docs/files
- avoid assumptions when sources exist
- surface conflicts/gaps in evidence

Skill-Binder:
- session start -> internalize capabilities from router.json
- router -> https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/router.json
- announce -> briefly state available/loaded skills
- task matches skill -> fetch only matching <category>/<skill>/SKILL.md
- /<skill> -> assess relevance -> invoke directly
- follow SKILL.md exactly
- chains_to/composable_with -> continue if useful
- avoid loading whole repo

Execution style:
- scrutinize everything
- 95% confident -> approach works
- evidence-based
- workflow-driven
- minimal context usage
- no unnecessary rewrites/work
- established libraries -> no reinventing core pieces
- industry best practices
- implementation -> small validated slices; use TDD skill when behavior changes
- after changes -> report validation run + result
- docs current -> avoid future confusion
- rename/refactor only when task benefits
```

Persona optional. Use it for implementation-heavy sessions. Omit it for one-off writing, planning, or debugging.

---

## How to use

| Need | Use |
|---|---|
| Discover skills on demand | [router.json](./router.json) |
| Paste compact always-on prompt | [AGENT.md](./AGENT.md) |
| Browse human index | [dist/skills-index.md](./dist/skills-index.md) |
| Maintain repo | [CONTRIBUTING.md](./CONTRIBUTING.md) |

`router.json` is source for discovery: skill names, trigger contracts, paths, URLs, aliases, and `chains_to` handoffs.

---

## Start here

| Situation | Start |
|---|---|
| Architecture/codebase health review first | `improve-codebase-architecture` *(optional preflight)* |
| Vague idea | `grill-me` |
| Vague idea + docs/code matter | `grill-with-docs` |
| Clear idea -> requirements | `to-prd` |
| PRD -> phases | `prd-to-plan` |
| Plan/spec -> tickets | `to-issues` |
| Unknown bug cause | `diagnose` |
| Known bug/feature ready | `tdd` |
| Issue workflow | `triage` |
| Need bigger code map | `zoom-out` |
| Reply terse | `caveman` |
| Session handoff | `strategic-compact` |

`improve-codebase-architecture` is an optional architecture preflight, not default start. Use it before planning only when user explicitly wants architecture health, duplication, module depth, or refactor risk reviewed first.

---

## Cookbooks

### Fuzzy idea -> implementation

```text
grill-me or grill-with-docs -> to-prd -> prd-to-plan -> to-issues -> tdd
```

Use `grill-with-docs` when project docs/code can answer some questions. Use `grill-me` when the plan is mostly conceptual.

### Architecture preflight -> PRD

```text
improve-codebase-architecture -> grill-with-docs -> to-prd -> prd-to-plan -> to-issues -> tdd
```

Only when architecture health is part of the ask. Not mandatory.

### Bug -> tested fix

```text
diagnose -> triage -> tdd
```

`diagnose` builds a fast repro loop before guessing. `tdd` locks the fix through public behavior.

### Long session -> next session

```text
strategic-compact
```

Keeps decisions, current state, compressed context, and one executable next step.

---

## Skill families

Canonical list lives in [router.json](./router.json). Generated index lives in [dist/skills-index.md](./dist/skills-index.md).

Old command names remain aliases where useful:

```text
write-a-prd -> to-prd
prd-to-issues -> to-issues
systematic-debugging -> diagnose
triage-issue -> triage
git-guardrails-claude-code -> git-guardrails
```

| Family | Skills |
|---|---|
| Planning | `grill-me`, `grill-with-docs`, `to-prd`, `prd-to-plan`, `to-issues` |
| Architecture | `improve-codebase-architecture`, `zoom-out` |
| Development | `diagnose`, `triage`, `tdd`, `git-staging-guardian`, `git-guardrails` |
| Tooling | `write-a-skill`, `skill-audit`, `llm-wiki`, `setup-pre-commit`, `edit-article`, `obsidian-vault` |
| Productivity | `caveman` |
| Session | `strategic-compact` |

Deprecated upstream skills are not canonical here. If a workflow disappears upstream, keep it out of `router.json` unless Skill-Binder intentionally owns a fork.

---

## For maintainers

Contributor-facing details live in [CONTRIBUTING.md](./CONTRIBUTING.md): authoring rules, validation, router generation, exports, and doc-drift checks.

---

## Credits

**[Matt Pocock](https://github.com/mattpocock/skills)** — skills-as-workflows methodology and upstream source for several core skills.

**[Affaan M](https://github.com/affaan-m/everything-claude-code)** — `strategic-compact`.

**[Jesse Vincent / obra](https://github.com/obra/superpowers)** — `diagnose` base methodology.

**John Ousterhout, Dave Thomas, Andy Hunt, Kent Beck, Eric Evans** — architecture, tracer-bullet, TDD, and domain-language foundations behind several workflows.
