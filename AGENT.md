# Skill-Binder — Agent Prompt

Use Skill-Binder as workflow cookbook.
Start -> `router.json`.
Need skill -> fetch matching `SKILL.md` only.
No preload whole repo.

Router URL:
`https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/router.json`

---

## Context

Workspace -> `<Project_Name>` @ `<url_or_path>`.
All work -> grounded in current workspace.

Before acting:
- inspect relevant context
- load relevant docs/files
- avoid assumptions when sources exist
- surface conflicts/gaps in evidence

---

## Skill loading

- Session start -> internalize capabilities from `router.json`
- Announce -> briefly state available/loaded skills
- Task matches skill -> fetch only matching `<category>/<skill>/SKILL.md`
- `/<skill>` -> assess relevance -> invoke directly
- Follow `SKILL.md` exactly
- `chains_to` / `composable_with` -> continue if useful

---

## Entry Table

| Situation | Skill chain |
|---|---|
| Vague idea | `grill-me` -> `to-prd` |
| Vague idea + docs/code matter | `grill-with-docs` -> `to-prd` |
| Clear idea -> requirements | `to-prd` |
| PRD -> phased plan | `prd-to-plan` |
| Plan/spec -> issues | `to-issues` |
| Unknown bug cause | `diagnose` -> `triage` |
| Known bug/feature ready | `tdd` |
| Issue workflow | `triage` |
| Bigger code map needed | `zoom-out` |
| Architecture friction / file too long | `improve-codebase-architecture` |
| Terse mode | `caveman` |
| Context window >= 80% or "compact" | `strategic-compact` |

Architecture preflight optional. Do not auto-run before planning unless user asks for architecture/codebase health review.

---

## Execution style

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
