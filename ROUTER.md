# Skill Router — deveshpat/skills

**Base URL:** `https://raw.githubusercontent.com/deveshpat/skills/main`

Fetch only the skill relevant to the current request. Announce `[Loading skill: <name>]`, fetch the URL, follow the process exactly.

---

## Entry Table

| Situation | Skill |
|---|---|
| Vague idea, not yet thought through | `grill-me` → `write-a-prd` |
| Clear idea, no requirements doc | `write-a-prd` |
| PRD exists, need implementation plan | `prd-to-plan` |
| Plan exists, need GitHub tickets | `prd-to-issues` |
| Bug, root cause unknown | `systematic-debugging` → `triage-issue` |
| Bug, root cause known | `triage-issue` → `tdd` |
| Feature or fix to implement | `tdd` |
| Architecture friction / duplication / file too long | `improve-codebase-architecture` |
| Architecture direction agreed, need coding-agent prompt | `request-refactor-plan` |
| Context window ≥ 80% or "compact" | `strategic-compact` |
| Multi-session project with BLUEPRINT.md | `project-architect` (load as persona) |
| ML training / GPU workflows / experiment tracking | `ml-engineer` (load as persona) |

---

## Skill Registry

**`grill-me`** · planning  
Stress-test a plan before execution. *Use:* "grill me", "poke holes in this", "stress-test this", "what am I missing". *Not:* when a PRD already exists or implementation is being requested.  
→ `planning/grill-me/SKILL.md` · chains to: `write-a-prd`, `prd-to-plan`, `write-a-skill`

**`write-a-prd`** · planning  
Synthesize conversation and codebase context into a structured PRD. *Use:* "write a PRD", "spec this out", "turn this into requirements". *Not:* when a PRD exists, when the user wants to implement now, or when they ask to be grilled first.  
→ `planning/write-a-prd/SKILL.md` · chains to: `prd-to-plan`

**`prd-to-plan`** · planning  
Turn a PRD into a multi-phase implementation plan using vertical slices. *Use:* "break into phases", "tracer bullets", "implementation plan from PRD". *Not:* without an existing PRD.  
→ `planning/prd-to-plan/SKILL.md` · chains to: `prd-to-issues`

**`prd-to-issues`** · planning  
Break a PRD into independently-grabbable GitHub issues annotated with HITL/AFK type. *Use:* "create GitHub issues from this PRD", "slice into tickets". *Not:* without an existing PRD.  
→ `planning/prd-to-issues/SKILL.md` · chains to: `tdd`

**`improve-codebase-architecture`** · architecture  
Find deep-module opportunities, surface architectural friction, generate an RFC. *Use:* "architecture review", "refactor", "too much duplication", "this file is too long". *Not:* for bug fixes or new features.  
→ `architecture/improve-codebase-architecture/SKILL.md` · chains to: `request-refactor-plan`

**`design-an-interface`** · architecture  
Generate 2–3 radically different interface designs using parallel sub-agents. *Use:* "design an interface", "give me interface options", "how should I structure this API". *Not:* when implementation is being requested.  
→ `architecture/design-an-interface/SKILL.md` · chains to: `request-refactor-plan`

**`request-refactor-plan`** · architecture  
Generate a self-contained coding-agent prompt for a refactor. *Use:* when architecture direction is agreed and a coding-agent prompt is needed. *Not:* when the user wants to perform the refactor directly or still needs architectural diagnosis.  
→ `architecture/request-refactor-plan/SKILL.md` · chains to: `improve-codebase-architecture`, `tdd`

**`tdd`** · development  
Test-driven development with strict red-green-refactor loop, one vertical slice at a time. *Use:* "build this feature", "implement X", "fix this bug". *Not:* planning-only or architecture-only requests.  
→ `development/tdd/SKILL.md` · chains to: `triage-issue`

**`triage-issue`** · development  
Investigate a bug, identify root cause, and file a GitHub issue with a TDD fix plan. *Use:* "investigate this bug", "find the root cause", "why is this failing". *Not:* when root cause is already known.  
→ `development/triage-issue/SKILL.md` · chains to: `tdd`

**`git-guardrails`** · development  
Set up Claude Code hooks blocking dangerous git commands before they execute. *Use:* "set up git guardrails", "protect my git", "prevent accidental push". *Not:* if equivalent guardrails already exist.  
→ `development/git-guardrails/SKILL.md` · chains to: `setup-pre-commit`

**`git-staging-guardian`** · development  
Verify exact Git paths before staging, committing, cleaning, or reporting repo status. *Use:* when asked to commit, stage, zip, clean, or verify changes. *Not:* for Git concept explanations.  
→ `development/git-staging-guardian/SKILL.md` · chains to: `git-guardrails`

**`refactor-verifier`** · development  
Verify that a refactor changed intended entrypoints and behavior, not merely added scaffolding. *Use:* after architecture or implementation refactors. *Not:* for brand-new features without a refactor.  
→ `development/refactor-verifier/SKILL.md` · chains to: `tdd`, `git-staging-guardian`

**`systematic-debugging`** · session  
Structured diagnosis for silent, environment-specific, or hard-to-reproduce failures. *Use:* "failing silently", "can't reproduce", "it worked before", any failure where the error is absent or misleading. *Not:* when root cause is already known.  
→ `session/systematic-debugging/SKILL.md` · chains to: `triage-issue`, `tdd`

**`strategic-compact`** · session  
Structured context compaction for sessions approaching context limits. *Use:* "compact", "summarize state", context ≥ 80%. *Not:* preemptively on short sessions.  
→ `session/strategic-compact/SKILL.md` · chains to: `project-architect`

**`living-doc-reconciler`** · session  
Reconcile project living documents with logs, commits, and checkpoints before declaring project state. *Use:* when resuming projects, compacting sessions, or updating status docs. *Not:* for generic summarization without durable project state.  
→ `session/living-doc-reconciler/SKILL.md` · chains to: `project-architect`, `ml-engineer`, `strategic-compact`

**`project-architect`** · persona  
Project Architect and Documentation Manager for multi-session projects with a living BLUEPRINT.md. *Use:* "architect mode", "resume the project", "what's the status", any session starting with a pasted BLUEPRINT. *Not:* for one-off tasks with no persistent project state. Load as system prompt.  
→ `persona/project-architect/SKILL.md` · chains to: `improve-codebase-architecture`, `request-refactor-plan`, `grill-me`

**`ml-engineer`** · persona  
ML workflow persona with strict evidence gates: GPU verification, reproducible runs, checkpoint validation, distributed-run safety. *Use:* for ML training sessions. *Not:* as a per-task invocation — load as system prompt.  
→ `persona/ml-engineer/SKILL.md` · chains to: `tdd`, `living-doc-reconciler`

**`write-a-skill`** · tooling  
Bootstrap new skills with correct SKILL.md structure. *Use:* "write a new skill", "create a skill for X", "add a skill to my skills repo".  
→ `tooling/write-a-skill/SKILL.md` · chains to: `ubiquitous-language`

**`skill-audit`** · tooling  
Audit a skills repository as a workflow runtime: frontmatter, layout, links, triggers, composability. *Use:* "audit this skills repo", "scrutinize the skills". *Not:* for normal codebase refactors.  
→ `tooling/skill-audit/SKILL.md` · chains to: `write-a-skill`, `request-refactor-plan`

**`ubiquitous-language`** · tooling  
Extract a DDD-style glossary from the current conversation. *Use:* "extract domain language", "build a glossary", "what are the key terms".  
→ `tooling/ubiquitous-language/SKILL.md` · chains to: `write-a-prd`

**`setup-pre-commit`** · tooling  
Set up Husky pre-commit hooks with lint-staged, Prettier, type checking, and tests. *Use:* "set up pre-commit", "add Husky", "format on commit". *Not:* for Python-only projects without Node.  
→ `tooling/setup-pre-commit/SKILL.md` · chains to: `git-guardrails`

**`edit-article`** · tooling  
Edit prose for clarity, structure, argument flow, and concision. *Use:* when the user provides an article, draft, essay, or long-form writing to improve.  
→ `tooling/edit-article/SKILL.md`

**`obsidian-vault`** · tooling  
Search, create, and manage notes in an Obsidian vault with wikilinks and index notes. *Use:* "search my notes", "create a note in Obsidian". *Not:* for non-Obsidian systems.  
→ `tooling/obsidian-vault/SKILL.md` · chains to: `ubiquitous-language`

**`artifact-classifier`** · tooling  
Classify files before cleanup, staging, or deletion. *Use:* when there is risk of deleting or ignoring important artifacts. *Not:* for ordinary file listings with no action planned.  
→ `tooling/artifact-classifier/SKILL.md` · chains to: `git-staging-guardian`, `living-doc-reconciler`
