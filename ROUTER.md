# Skill Router — deveshpat/skills

**Base URL:** `https://raw.githubusercontent.com/deveshpat/skills/main`

You have access to a structured skill library. Before responding, check the entry table below, then follow the embedded or fetched skill exactly.

---

## Step 0 — Entry Decision Table

Use this table first. It is a lookup, not a judgment call.

| Situation | Skill to use |
|---|---|
| Vague idea, not yet thought through | `grill-me` → `write-a-prd` |
| Clear idea, no requirements doc yet | `write-a-prd` |
| PRD exists, no implementation plan | `prd-to-plan` |
| Plan exists, need GitHub tickets | `prd-to-issues` |
| Bug, root cause unknown | `systematic-debugging` → `triage-issue` |
| Bug, root cause known | `triage-issue` → `tdd` |
| Feature or fix to implement | `tdd` |
| Architecture friction, duplication, file too long | `improve-codebase-architecture` |
| Architecture direction agreed, need coding-agent prompt | `request-refactor-plan` |
| Context window ≥80% or user says "compact" | `strategic-compact` |
| Session start with BLUEPRINT.md or living doc | `project-architect` (load as persona) |
| ML training, GPU workflows, experiment tracking | `ml-engineer` (load as persona) |

---

## Step 1 — Embedded Skills

For these five skills, follow the process below directly. No fetch needed.

---

### grill-me

**Trigger:** "grill me", "poke holes in this", "stress-test this", "what am I missing", "is this plan solid"

Attack the plan from practical, technical, strategic, and sequencing angles before the user commits time, code, or reputation.

**Process:**
1. Identify the core claim or plan.
2. List the strongest assumptions behind it.
3. Attack from practical, technical, strategic, and sequencing angles.
4. Separate fatal flaws (blockers) from fixable weaknesses.
5. Suggest a concrete revision for each flaw found.
6. End with a go/no-go recommendation.

**Output:** strongest point · top risks · hidden assumptions · missing evidence · concrete improvements · go/no-go.

**Rules:** Do not flatter. Do not critique without offering a fix. Do not make every weakness a blocker. A good grill makes the plan harder to fool yourself about.

---

### systematic-debugging

**Trigger:** "failing silently", "crashed without output", "can't reproduce this", "it worked before", any failure where the error is absent or misleading.

Do not use when root cause is already known — go directly to `tdd`.

**Process:**

Step 1 — Answer these four questions verbatim before forming any hypothesis:
1. What was expected? (exact output, exit code, state)
2. What actually happened? (verbatim — one wrong word changes the diagnosis)
3. When did it last work? (last known-good commit, environment, or timestamp)
4. What changed? (dependencies, config, code, data)

If Q2 cannot be answered verbatim, improve logging first. Do not hypothesize.

Step 2 — Isolate the environment. Verify: runtime version, hardware, pinned vs. floating dependencies, permissions, cached state from prior runs. Do not hypothesize about code until environment is confirmed clean. Silent failures are environment failures 60% of the time.

Step 3 — Build a minimal reproduction. Strip to the smallest case that still fails. If it no longer reproduces, the failure is in what was removed — add back one piece at a time.

Step 4 — Form one hypothesis: *"The failure is caused by [exact mechanism] at [exact location] when [exact condition]. Evidence: [observed above]."* No "probably." No "might be."

Step 5 — Design one test to falsify or confirm the hypothesis. Not a fix — a test. If confirmed → `triage-issue` or `tdd`. If falsified → return to Step 4.

---

### tdd

**Trigger:** "build this feature", "implement X", "fix this bug", user provides an issue or feature description.

Do not trigger for planning-only or architecture-only requests.

**Core rule:** Vertical slices only. Never write all tests first, then all code. That is horizontal slicing and produces tests that verify shape instead of behavior.

```
WRONG: RED: test1 test2 test3 → GREEN: impl1 impl2 impl3
RIGHT: RED→GREEN: test1→impl1, then test2→impl2, then test3→impl3
```

**Process:**
1. Confirm interface changes needed and which behaviors matter most. Get user approval.
2. Write ONE test that fails (RED). It must describe observable behavior, use the public interface only, and survive internal refactors.
3. Write the minimal code to pass it (GREEN). No speculative features.
4. Repeat for each behavior.
5. Refactor only after all tests are GREEN. Look for: duplication, shallow modules, long methods, feature envy.

**Never refactor while RED.** If a test needs to reach behind the interface, the module is the wrong shape.

---

### strategic-compact

**Trigger:** user says "compact", context window is at or above 80% capacity, or the agent is repeating information it already processed.

Do not trigger preemptively on short sessions.

**Process:**

Step 1 — Audit the conversation into three buckets:
- **Decisions** — irrevocable choices, agreed interfaces, confirmed root causes. Keep verbatim.
- **Context** — background that shapes future decisions. Compress to 2–4 sentences.
- **Noise** — tangents that landed nowhere, repeated clarifications, routine output. Drop entirely.

Step 2 — Produce this output:

```
# Session Compact — <project> — <date>

## Decisions Made (verbatim)
- [Decision]: [exact agreed wording]

## Current State
- What was in progress when compaction triggered
- Files/modules in-flight
- Blockers (resolved and open)

## Compressed Context
[2–4 sentences. A briefing, not a history.]

## Immediate Next Step
[One sentence. Unambiguous enough for a new LLM to execute from only this compact.]

## What to Discard
[One sentence naming topics safely forgotten.]
```

**Rules:** Every irrevocable decision must be in Decisions Made. Never paraphrase decisions — paraphrasing mutates them across sessions. Total compact must be under 600 words. Next step must be executable with zero additional context.

Step 3 — End with: *"Start a new session and paste this compact as your first message to resume exactly here."*

---

### prd-to-plan

**Trigger:** "turn this PRD into a plan", "break into phases", "tracer bullets", user wants implementation phases from a PRD.

Do not trigger without an existing PRD.

**Process:**
1. Confirm the PRD is in context. If not, ask the user to paste it.
2. Explore the codebase: existing architecture, patterns, integration layers, relevant tests.
3. Identify durable architectural decisions unlikely to change during implementation: route structures, schema shape, key models, auth approach, third-party seams. Put these in the plan header.
4. Draft vertical slices. Each phase must be a thin complete path through every layer — not a horizontal slice of one layer. A completed phase is demoable or independently verifiable. Prefer many thin slices over a few thick ones.
5. Present as a numbered list: title + user stories covered per phase. Ask whether granularity is right and whether phases should be merged or split. Iterate until approved.
6. Create `./plans/` if it does not exist. Write `./plans/<feature-name>.md`.

**Output format:**
```md
# Plan: <Feature>
> Source PRD: <title>

## Architectural decisions
- Routes: ...
- Schema: ...
- Key models: ...

## Phase 1: <Title>
**User stories**: ...
### What to build
### Acceptance criteria
- [ ] ...
```

**Never** name a phase after a layer ("Database", "Backend", "Frontend"). Every phase must be independently verifiable.

---

## Step 2 — All Other Skills (fetch from URL)

Announce `[Loading skill: <name>]`, fetch the URL, follow the process exactly.

| Skill name | Fetch URL | Category |
|---|---|---|
| `design-an-interface` | `https://raw.githubusercontent.com/deveshpat/skills/main/architecture/design-an-interface/SKILL.md` | architecture |
| `improve-codebase-architecture` | `https://raw.githubusercontent.com/deveshpat/skills/main/architecture/improve-codebase-architecture/SKILL.md` | architecture |
| `request-refactor-plan` | `https://raw.githubusercontent.com/deveshpat/skills/main/architecture/request-refactor-plan/SKILL.md` | architecture |
| `git-guardrails` | `https://raw.githubusercontent.com/deveshpat/skills/main/development/git-guardrails/SKILL.md` | development |
| `git-staging-guardian` | `https://raw.githubusercontent.com/deveshpat/skills/main/development/git-staging-guardian/SKILL.md` | development |
| `refactor-verifier` | `https://raw.githubusercontent.com/deveshpat/skills/main/development/refactor-verifier/SKILL.md` | development |
| `triage-issue` | `https://raw.githubusercontent.com/deveshpat/skills/main/development/triage-issue/SKILL.md` | development |
| `ml-engineer` | `https://raw.githubusercontent.com/deveshpat/skills/main/persona/ml-engineer/SKILL.md` | persona |
| `project-architect` | `https://raw.githubusercontent.com/deveshpat/skills/main/persona/project-architect/SKILL.md` | persona |
| `prd-to-issues` | `https://raw.githubusercontent.com/deveshpat/skills/main/planning/prd-to-issues/SKILL.md` | planning |
| `write-a-prd` | `https://raw.githubusercontent.com/deveshpat/skills/main/planning/write-a-prd/SKILL.md` | planning |
| `living-doc-reconciler` | `https://raw.githubusercontent.com/deveshpat/skills/main/session/living-doc-reconciler/SKILL.md` | session |
| `artifact-classifier` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/artifact-classifier/SKILL.md` | tooling |
| `edit-article` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/edit-article/SKILL.md` | tooling |
| `obsidian-vault` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/obsidian-vault/SKILL.md` | tooling |
| `setup-pre-commit` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/setup-pre-commit/SKILL.md` | tooling |
| `skill-audit` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/skill-audit/SKILL.md` | tooling |
| `ubiquitous-language` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/ubiquitous-language/SKILL.md` | tooling |
| `write-a-skill` | `https://raw.githubusercontent.com/deveshpat/skills/main/tooling/write-a-skill/SKILL.md` | tooling |

---

## Skill Registry (full trigger descriptions)

**`design-an-interface`** — Generate 2-3 radically different interface designs for a module using parallel sub-agents, each with trade-offs and a recommendation. Triggers: 'design an interface', 'give me interface options', 'how should I structure this API'. Do NOT trigger for implementation.

**`improve-codebase-architecture`** — Find deep-module opportunities in a codebase, surface architectural friction, generate an RFC. Triggers: 'architecture review', 'refactor', 'too much duplication', 'DRY', 'this file is too long'. Do NOT trigger for bug fixes or new features.

**`request-refactor-plan`** — Generate a precise coding-agent prompt for a refactor after architecture direction is known. Use when the user wants an implementation prompt, not when they want you to perform the refactor directly.

**`git-guardrails`** — Set up Claude Code hooks blocking dangerous git commands such as push, reset --hard, clean, destructive branch deletion, and whole-tree checkout before they execute. Triggers: 'set up git guardrails', 'protect my git', 'prevent accidental push'. Do NOT trigger if equivalent guardrails already exist.

**`git-staging-guardian`** — Verify exact Git paths before staging, committing, cleaning, or reporting repo status. Use when the user asks to commit, stage, zip, clean, or verify changes, especially on mobile/Codespaces workflows. Do NOT use for conceptual Git explanations.

**`refactor-verifier`** — Verify that a refactor changed the intended entrypoints and behavior, not merely added scaffolding. Use after architecture or implementation refactors to prove old paths call new modules and tests cover the new seams. Do NOT use for brand-new features without a refactor.

**`triage-issue`** — Investigate a bug by exploring the codebase, identify the root cause, and file a GitHub issue with a TDD-based fix plan. Triggers: 'investigate this bug', 'find the root cause', 'why is this failing'. Do NOT trigger when root cause is already known.

**`ml-engineer`** — Persona for implementing machine-learning workflows with strict evidence gates: environment and GPU verification, reproducible training runs, experiment tracking, checkpoint validation, distributed-run safety, and metrics-backed progress claims. Load as a system prompt for ML implementation sessions. Do NOT invoke as a one-off task skill.

**`project-architect`** — Project Architect and Documentation Manager for any multi-session project with a living BLUEPRINT.md or equivalent master document. Governs session startup ritual, documentation standards, decision-making gate, and signal reconciliation. Use at the START of every session on a persistent project. Triggers: "architect mode", "resume the project", "what's the status", or any session beginning with a pasted BLUEPRINT/status document. Do NOT use for one-off tasks with no persistent project state.

**`prd-to-issues`** — Break a PRD into independently-grabbable GitHub issues using vertical slices, annotated with HITL/AFK type. Triggers: 'create GitHub issues from this PRD', 'slice into tickets'. Do NOT trigger without an existing PRD.

**`write-a-prd`** — Synthesize the current conversation and codebase context into a structured PRD, usually filed as a GitHub issue. Triggers: 'write a PRD', 'spec this out', 'turn this into requirements'. Do NOT trigger when a PRD already exists, when the user wants implementation now, or when the user explicitly asks to be grilled first.

**`living-doc-reconciler`** — Reconcile project living documents with logs, commits, checkpoints, issues, and other signals before declaring project state. Use when resuming projects, compacting sessions, or updating status docs. Do NOT use for generic summarization without durable project state.

**`strategic-compact`** — Structured context compaction for long-running sessions approaching context limits. (Embedded above — use directly.)

**`systematic-debugging`** — Structured diagnosis for silent, environment-specific, or hard-to-reproduce failures. (Embedded above — use directly.)

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
