# Skill Router — deveshpat/skills

**Base URL:** `https://raw.githubusercontent.com/deveshpat/skills/main`

You have access to a library of structured workflow skills hosted at the URL above.
Before responding to any request, check this registry and determine whether a skill applies.
If one does, fetch it and follow its process. If none applies, respond normally.

---

## How to Use This Router

1. Read the user's message.
2. Scan the registry below for a matching skill by name, trigger phrases, or situation.
3. If a match: fetch `{base_url}/{skill-slug}/SKILL.md` from the URL index below.
4. Announce: `[Loading skill: {skill-name}]`, then follow the fetched skill's process exactly.
5. If no match: respond normally without mentioning the router.

**Shortcut:** If the user names a skill directly, fetch it immediately from the URL index below; no need to scan the registry.

**For Claude Code:** this router is unnecessary — skills are auto-discovered from your installed skills directory. No fetching required.

**For Claude Desktop:** this router is unnecessary; skills are auto-discovered from installed `SKILL.md` descriptions.

---

## Skill URL Index

| Skill name | Fetch URL | Category |
|---|---|---|
| `design-an-interface` | `https://raw.githubusercontent.com/deveshpat/skills/main/architecture/design-an-interface/SKILL.md` | architecture |
| `improve-codebase-architecture` | `https://raw.githubusercontent.com/deveshpat/skills/main/architecture/improve-codebase-architecture/SKILL.md` | architecture |
| `request-refactor-plan` | `https://raw.githubusercontent.com/deveshpat/skills/main/architecture/request-refactor-plan/SKILL.md` | architecture |
| `git-guardrails` | `https://raw.githubusercontent.com/deveshpat/skills/main/development/git-guardrails/SKILL.md` | development |
| `git-staging-guardian` | `https://raw.githubusercontent.com/deveshpat/skills/main/development/git-staging-guardian/SKILL.md` | development |
| `refactor-verifier` | `https://raw.githubusercontent.com/deveshpat/skills/main/development/refactor-verifier/SKILL.md` | development |
| `tdd` | `https://raw.githubusercontent.com/deveshpat/skills/main/development/tdd/SKILL.md` | development |
| `triage-issue` | `https://raw.githubusercontent.com/deveshpat/skills/main/development/triage-issue/SKILL.md` | development |
| `ml-engineer` | `https://raw.githubusercontent.com/deveshpat/skills/main/persona/ml-engineer/SKILL.md` | persona |
| `project-architect` | `https://raw.githubusercontent.com/deveshpat/skills/main/persona/project-architect/SKILL.md` | persona |
| `grill-me` | `https://raw.githubusercontent.com/deveshpat/skills/main/planning/grill-me/SKILL.md` | planning |
| `prd-to-issues` | `https://raw.githubusercontent.com/deveshpat/skills/main/planning/prd-to-issues/SKILL.md` | planning |
| `prd-to-plan` | `https://raw.githubusercontent.com/deveshpat/skills/main/planning/prd-to-plan/SKILL.md` | planning |
| `write-a-prd` | `https://raw.githubusercontent.com/deveshpat/skills/main/planning/write-a-prd/SKILL.md` | planning |
| `living-doc-reconciler` | `https://raw.githubusercontent.com/deveshpat/skills/main/session/living-doc-reconciler/SKILL.md` | session |
| `strategic-compact` | `https://raw.githubusercontent.com/deveshpat/skills/main/session/strategic-compact/SKILL.md` | session |
| `systematic-debugging` | `https://raw.githubusercontent.com/deveshpat/skills/main/session/systematic-debugging/SKILL.md` | session |
| `artifact-classifier` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/artifact-classifier/SKILL.md` | tooling |
| `edit-article` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/edit-article/SKILL.md` | tooling |
| `obsidian-vault` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/obsidian-vault/SKILL.md` | tooling |
| `setup-pre-commit` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/setup-pre-commit/SKILL.md` | tooling |
| `skill-audit` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/skill-audit/SKILL.md` | tooling |
| `ubiquitous-language` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/ubiquitous-language/SKILL.md` | tooling |
| `write-a-skill` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/write-a-skill/SKILL.md` | tooling |

---

## Skill Registry (trigger matching)

**`design-an-interface`** — Generate 2-3 radically different interface designs for a module using parallel sub-agents, each with trade-offs and a recommendation. Triggers: 'design an interface', 'give me interface options', 'how should I structure this API'. Do NOT trigger for implementation.

**`improve-codebase-architecture`** — Find deep-module opportunities in a codebase, surface architectural friction, generate an RFC. Triggers: 'architecture review', 'refactor', 'too much duplication', 'DRY', 'this file is too long'. Do NOT trigger for bug fixes or new features.

**`request-refactor-plan`** — Generate a precise coding-agent prompt for a refactor after architecture direction is known. Use when the user wants an implementation prompt, not when they want you to perform the refactor directly.

**`git-guardrails`** — Set up Claude Code hooks blocking dangerous git commands such as push, reset --hard, clean, destructive branch deletion, and whole-tree checkout before they execute. Triggers: 'set up git guardrails', 'protect my git', 'prevent accidental push'. Do NOT trigger if equivalent guardrails already exist.

**`git-staging-guardian`** — Verify exact Git paths before staging, committing, cleaning, or reporting repo status. Use when the user asks to commit, stage, zip, clean, or verify changes, especially on mobile/Codespaces workflows. Do NOT use for conceptual Git explanations.

**`refactor-verifier`** — Verify that a refactor changed the intended entrypoints and behavior, not merely added scaffolding. Use after architecture or implementation refactors to prove old paths call new modules and tests cover the new seams. Do NOT use for brand-new features without a refactor.

**`tdd`** — Test-driven development with strict red-green-refactor loop, one vertical slice at a time. Triggers: 'build this feature', 'implement X', 'fix this bug', user provides an issue or feature description. Do NOT trigger for planning-only or architecture-only requests.

**`triage-issue`** — Investigate a bug by exploring the codebase, identify the root cause, and file a GitHub issue with a TDD-based fix plan. Triggers: 'investigate this bug', 'find the root cause', 'why is this failing'. Do NOT trigger when root cause is already known.

**`ml-engineer`** — Persona for implementing machine-learning workflows with strict evidence gates: environment and GPU verification, reproducible training runs, experiment tracking, checkpoint validation, distributed-run safety, and metrics-backed progress claims. Load as a system prompt for ML implementation sessions. Do NOT invoke as a one-off task skill.

**`project-architect`** — Project Architect and Documentation Manager for any multi-session project with a living BLUEPRINT.md or equivalent master document. Governs session startup ritual, documentation standards, decision-making gate, and signal reconciliation. Use at the START of every session on a persistent project. Triggers: "architect mode", "resume the project", "what's the status", or any session beginning with a pasted BLUEPRINT/status document. Do NOT use for one-off tasks with no persistent project state.

**`grill-me`** — Stress-test an idea, plan, PRD, or decision before execution. Use when the user asks to be challenged, wants holes found, or asks what they are missing.

**`prd-to-issues`** — Break a PRD into independently-grabbable GitHub issues using vertical slices, annotated with HITL/AFK type. Triggers: 'create GitHub issues from this PRD', 'slice into tickets'. Do NOT trigger without an existing PRD.

**`prd-to-plan`** — Turn a PRD into a multi-phase implementation plan using tracer-bullet vertical slices, saved as a local Markdown file in ./plans/. Use when the user wants to break down a PRD, create an implementation plan, plan phases from a PRD, or mentions 'tracer bullets'. Do NOT trigger without an existing PRD.

**`write-a-prd`** — Synthesize the current conversation and codebase context into a structured PRD, usually filed as a GitHub issue. Triggers: 'write a PRD', 'spec this out', 'turn this into requirements'. Do NOT trigger when a PRD already exists, when the user wants implementation now, or when the user explicitly asks to be grilled first.

**`living-doc-reconciler`** — Reconcile project living documents with logs, commits, checkpoints, issues, and other signals before declaring project state. Use when resuming projects, compacting sessions, or updating status docs. Do NOT use for generic summarization without durable project state.

**`strategic-compact`** — Structured context compaction for long-running sessions approaching context limits. Use when context window is at or above 80% capacity, when the user says "compact", "summarize state", "we're running out of context", or when you detect context saturation. Preserves exactly what is needed to resume work without loss. Do NOT trigger preemptively on short sessions.

**`systematic-debugging`** — Structured diagnosis for silent, environment-specific, or hard-to-reproduce failures. Use when: "failing silently", "crashed without output", "can't reproduce this", "it worked before", or any failure where the error is absent or misleading. Do NOT use when the root cause is already known — go directly to development/tdd.

**`artifact-classifier`** — Classify files and generated outputs before cleanup, staging, refactoring, or deletion: project-owned artifact, generated disposable artifact, external cache, log/signal file, or user-owned document. Use when there is risk of deleting or ignoring important artifacts. Do NOT use for ordinary file listings with no action planned.

**`edit-article`** — Edit prose for clarity, structure, argument flow, concision, and reader impact. Use when the user provides an article, draft, essay, post, or long-form writing to improve.

**`obsidian-vault`** — Search, create, and manage notes in an Obsidian vault with wikilinks and index notes. Triggers: 'search my notes', 'create a note', 'find in Obsidian', 'link these notes'. Do NOT trigger for non-Obsidian systems.

**`setup-pre-commit`** — Set up Husky pre-commit hooks with lint-staged, Prettier, type checking, and tests. Triggers: 'set up pre-commit', 'add Husky', 'add lint-staged', 'format on commit'. Do NOT trigger for Python-only projects without Node.

**`skill-audit`** — Audit an agent-skills repository as a workflow runtime: router, README, frontmatter, filesystem layout, bundled resources, local links, source attribution, placeholders, trigger breadth, and composability drift. Use when the user asks to scrutinize or improve a skills repo. Do NOT use for normal codebase refactors.

**`ubiquitous-language`** — Extract a DDD-style ubiquitous language glossary from the current conversation. Triggers: 'extract domain language', 'build a glossary', 'DDD glossary', 'what are the key terms'.

**`write-a-skill`** — Bootstrap new skills with correct SKILL.md structure, progressive disclosure, and bundled resources. Triggers: 'write a new skill', 'create a skill for X', 'add a skill to my skills repo'.

---

## Chaining Skills

| Skill | Composable with |
|---|---|
| `design-an-interface` | `architecture/request-refactor-plan` |
| `improve-codebase-architecture` | `architecture/request-refactor-plan` |
| `request-refactor-plan` | `architecture/improve-codebase-architecture`, `development/tdd` |
| `git-guardrails` | `tooling/setup-pre-commit` |
| `git-staging-guardian` | `development/git-guardrails` |
| `refactor-verifier` | `development/tdd`, `development/git-staging-guardian` |
| `tdd` | `development/triage-issue` |
| `triage-issue` | `development/tdd` |
| `ml-engineer` | `development/tdd`, `session/living-doc-reconciler` |
| `project-architect` | `architecture/improve-codebase-architecture`, `architecture/request-refactor-plan`, `planning/grill-me` |
| `grill-me` | `planning/write-a-prd`, `planning/prd-to-plan`, `tooling/write-a-skill` |
| `prd-to-issues` | `development/tdd` |
| `prd-to-plan` | `planning/prd-to-issues` |
| `write-a-prd` | `planning/prd-to-plan` |
| `living-doc-reconciler` | `persona/project-architect`, `persona/ml-engineer`, `session/strategic-compact` |
| `strategic-compact` | `persona/project-architect` |
| `systematic-debugging` | `development/triage-issue`, `development/tdd` |
| `artifact-classifier` | `development/git-staging-guardian`, `session/living-doc-reconciler` |
| `obsidian-vault` | `tooling/ubiquitous-language` |
| `setup-pre-commit` | `development/git-guardrails` |
| `skill-audit` | `tooling/write-a-skill`, `architecture/request-refactor-plan` |
| `ubiquitous-language` | `planning/write-a-prd` |
| `write-a-skill` | `tooling/ubiquitous-language` |
