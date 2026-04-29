# deveshpat/skills

A portable, LLM-agnostic process library. Not prompts — repeatable workflows that force structured thinking before execution.

Each skill defines *how* to do something, not just *what* to say. Drop it into any capable LLM and get consistent, structured output every time.

**Works on:** Claude Code · claude.ai · ChatGPT · Gemini · any API integration

---

## Quick Setup

Paste this as your system prompt or Custom Instructions, replacing the placeholders:

```markdown
# Persona
[project-architect](https://raw.githubusercontent.com/deveshpat/skills/main/persona/project-architect/SKILL.md)

# Skills
https://raw.githubusercontent.com/deveshpat/skills/main/ROUTER.md
Load relevant skills only — avoid fetching skills preemptively to preserve context.

# Context
Current Working Repo → <GitHub_Repo> @ <url>
```

**`# Persona`** — Optional. Load a persona skill as a standing role for the session (e.g. `project-architect` for multi-session projects, `ml-engineer` for training runs). Omit for one-off tasks.

**`# Skills`** — Points the LLM to the router. It fetches ROUTER.md on demand and from there fetches individual skill URLs only when a trigger matches. For the five most-used skills without any fetching, use [AGENT_PROMPT.md](./AGENT_PROMPT.md) instead.

**`# Context`** — Ground the LLM in your repo. Replace with your actual repo name and URL.

---

## Two Ways to Load Skills

### 1. AGENT_PROMPT.md — five skills, zero fetches

[AGENT_PROMPT.md](./AGENT_PROMPT.md) embeds the five most-used skills inline. Paste it (or instruct the LLM to fetch it) when you want `grill-me`, `tdd`, `systematic-debugging`, `prd-to-plan`, and `strategic-compact` immediately available at a fixed, predictable context cost.

For all other skills, AGENT_PROMPT.md points to ROUTER.md.

```
Fetch https://raw.githubusercontent.com/deveshpat/skills/main/AGENT_PROMPT.md
and keep its workflows active for this session.
```

### 2. ROUTER.md — on-demand registry

[ROUTER.md](./ROUTER.md) is a concise skill registry: entry table, one-line trigger/not-trigger per skill, fetch URL, and chaining info. The LLM fetches it when it needs to look up a skill it does not already have.

```
Fetch https://raw.githubusercontent.com/deveshpat/skills/main/ROUTER.md
when you need to look up a skill.
```

### Claude Code

Skills are auto-discovered from their `description` fields — no system prompt needed.

```bash
git clone https://github.com/deveshpat/skills ~/.claude/skills/deveshpat
```

---

## Entry Point — Start Here

Before anything else, use this table. It is a lookup, not a judgment call.

```
Where are you?                          Start here
──────────────────────────────────────────────────
Vague idea, not yet thought through  →  grill-me
Clear idea, no spec yet              →  write-a-prd
Spec exists, need a phased plan      →  prd-to-plan
Plan exists, need GitHub tickets     →  prd-to-issues
Bug, root cause unknown              →  systematic-debugging
Bug, root cause known                →  triage-issue
Implementing a feature or fix        →  tdd
Architecture is the problem          →  improve-codebase-architecture
Context window filling up            →  strategic-compact
Starting a multi-session project     →  project-architect (persona)
ML training / GPU / experiments      →  ml-engineer (persona)
```

---

## Cookbook

Each recipe is a realistic session — what you type, what the LLM does, what comes out. Enter mid-chain at the step that matches where you actually are.

---

### Recipe 1 — From fuzzy idea to a queue of tickets

**When to use:** You have a rough concept but have not thought through edge cases, constraints, or sequencing.

```
You:   "I want to add real-time notifications to the app. Grill me."

LLM:   [grill-me]
       Identifies the strongest assumptions:
       - Who receives notifications?
       - What triggers one?
       - Fire-and-forget or persistent unread state?
       - Delivery targets: in-app, email, push, or all three?
       - Retry behavior on delivery failure?

       Attacks from multiple angles, separates fatal flaws from
       fixable weaknesses, ends with a go/no-go recommendation.

You:   "Good points. Here are my answers: [answers]. Write a PRD."

LLM:   [write-a-prd]
       Problem Statement / Solution / User Stories /
       Implementation Decisions / Testing Decisions / Out of Scope

You:   "Turn it into an implementation plan."

LLM:   [prd-to-plan]
       Phase 1 — Tracer bullet: DB schema + in-app banner, end-to-end
       Phase 2 — Reliability: retry queue, delivery receipts
       Phase 3 — Channels: email, push, preference management

You:   "Slice into GitHub tickets."

LLM:   [prd-to-issues]
       11 issues in dependency order, HITL/AFK annotated.
```

**Chain:** `grill-me` → `write-a-prd` → `prd-to-plan` → `prd-to-issues` → `tdd`

---

### Recipe 2 — You have a PRD, need a plan

```
You:   "Here's the PRD [paste]. Break it into tracer-bullet phases."

LLM:   [prd-to-plan]
       Identifies durable decisions (routes, schema, key models) first.
       Proposes phases as a numbered list.

You:   "Split Phase 2 into two."

LLM:   Revises, confirms, writes ./plans/notifications.md
```

---

### Recipe 3 — Bug with no error message

```
You:   "Payments are silently failing for ~3% of mobile transactions."

LLM:   [systematic-debugging]
       Refuses to hypothesize until four questions are answered verbatim.
       Isolates environment. Finds SDK version delta matches symptom onset.
       Forms one hypothesis. Designs one falsifying test.

You:   "Confirmed. File the issue."

LLM:   [triage-issue]
       GitHub issue: root cause, reproduction, TDD fix plan.
```

**Chain:** `systematic-debugging` → `triage-issue` → `tdd`

---

### Recipe 4 — Architecture that has grown too wide

```
You:   "auth.py is 900 lines. Fix the architecture."

LLM:   [improve-codebase-architecture]
       Explores codebase. Maps responsibilities. Produces RFC with 3 options.
       Recommends Option B with explicit trade-offs.

You:   "Agreed on B. Write the coding-agent prompt."

LLM:   [request-refactor-plan]
       Self-contained prompt: Context → Root Cause → Fix → Acceptance Criteria.
       Paste directly into Claude Code or any coding agent.
```

**Chain:** `improve-codebase-architecture` → `request-refactor-plan` → `tdd`

---

### Recipe 5 — Multi-session project

Load `project-architect` as your persona (in the system prompt, not per-task).

```
You:   [new session — pastes BLUEPRINT.md + signal files]

LLM:   [project-architect]
       Produces one Session Brief: state, doc gap, blocker, next action.
       Updates BLUEPRINT.md to match signals. Proceeds.
```

---

### Recipe 6 — Context window running low

```
You:   "Compact."

LLM:   [strategic-compact]
       Audits conversation. Preserves decisions verbatim. Drops noise.
       Produces a ≤600-word compact. Ends with handoff instruction.
```

---

## Skill Index

### Planning

| Skill | Triggers | Output |
|---|---|---|
| [grill-me](./planning/grill-me/SKILL.md) | "grill me", "stress-test this", "what am I missing" | Go/no-go with risks and fixes |
| [write-a-prd](./planning/write-a-prd/SKILL.md) | "write a PRD", "spec this out" | Structured PRD |
| [prd-to-plan](./planning/prd-to-plan/SKILL.md) | "turn this into a plan", "tracer bullets" | Phased implementation plan |
| [prd-to-issues](./planning/prd-to-issues/SKILL.md) | "slice into tickets", "create GitHub issues" | GitHub issues with HITL/AFK tags |

### Architecture

| Skill | Triggers | Output |
|---|---|---|
| [improve-codebase-architecture](./architecture/improve-codebase-architecture/SKILL.md) | "architecture review", "too long", "too much duplication" | RFC with options + recommendation |
| [design-an-interface](./architecture/design-an-interface/SKILL.md) | "design an interface", "give me API options" | ≥2 radically different designs |
| [request-refactor-plan](./architecture/request-refactor-plan/SKILL.md) | "write the agent prompt", "coding agent prompt" | Self-contained coding-agent prompt |

### Development

| Skill | Triggers | Output |
|---|---|---|
| [tdd](./development/tdd/SKILL.md) | "implement X", "build this feature", "fix this bug" | Working code via red→green→refactor |
| [triage-issue](./development/triage-issue/SKILL.md) | "find the root cause", "investigate this bug" | GitHub issue with TDD fix plan |
| [git-guardrails](./development/git-guardrails/SKILL.md) | "protect my git", "prevent accidental push" | Claude Code hooks |
| [git-staging-guardian](./development/git-staging-guardian/SKILL.md) | "commit", "stage these changes" | Path-verified staging |
| [refactor-verifier](./development/refactor-verifier/SKILL.md) | after any refactor | Wiring verification table |

### Session

| Skill | Triggers | Output |
|---|---|---|
| [systematic-debugging](./session/systematic-debugging/SKILL.md) | "failing silently", "can't reproduce", "it worked before" | Single testable root-cause hypothesis |
| [strategic-compact](./session/strategic-compact/SKILL.md) | "compact", context ≥ 80% | ≤600-word handoff compact |
| [living-doc-reconciler](./session/living-doc-reconciler/SKILL.md) | "update the blueprint", "reconcile the doc" | Reconciled living document |

### Persona — load as system prompt, not per-task

| Skill | When to load | Effect |
|---|---|---|
| [project-architect](./persona/project-architect/SKILL.md) | Any multi-session project with a BLUEPRINT.md | Single-output Session Brief, 95% certainty gate |
| [ml-engineer](./persona/ml-engineer/SKILL.md) | ML training sessions | Hard evidence gates before any training claim |

### Tooling

| Skill | Triggers | Output |
|---|---|---|
| [write-a-skill](./tooling/write-a-skill/SKILL.md) | "create a skill for X" | New SKILL.md with correct structure |
| [skill-audit](./tooling/skill-audit/SKILL.md) | "audit this skills repo" | Defects + patch order |
| [setup-pre-commit](./tooling/setup-pre-commit/SKILL.md) | "add Husky", "format on commit" | Configured Husky + lint-staged |
| [ubiquitous-language](./tooling/ubiquitous-language/SKILL.md) | "build a glossary", "extract domain language" | DDD-style glossary |
| [edit-article](./tooling/edit-article/SKILL.md) | "edit this article", "tighten this prose" | Restructured, tightened writing |
| [obsidian-vault](./tooling/obsidian-vault/SKILL.md) | "search my notes", "create a note in Obsidian" | Note operations with wikilinks |
| [artifact-classifier](./tooling/artifact-classifier/SKILL.md) | before cleanup / deletion | File classification table |

---

## Pipeline

```
vague idea
    │
    ▼
grill-me ──────────────────────────────────── (skip if idea is clear)
    │
    ▼
write-a-prd ───────────────────────────────── (skip if PRD exists)
    │
    ▼
prd-to-plan ───────────────────────────────── (skip if plan exists)
    │
    ▼
prd-to-issues
    │
    ▼
tdd ◄──── triage-issue ◄──── systematic-debugging


improve-codebase-architecture ──► request-refactor-plan ──► tdd
```

---

## Writing Your Own Skills

Skills follow [SKILL_TEMPLATE.md](./SKILL_TEMPLATE.md). Use `write-a-skill` to bootstrap.

The `description` frontmatter field is the trigger contract — it is what Claude Code auto-discovery and ROUTER.md use to match skills. Write it precisely: what the skill solves, exact trigger phrases, and exact counter-cases.

Validate and regenerate the registry:

```bash
node scripts/validate-skills.js --write-registry
```

---

## Credits

**[deveshpat](https://github.com/deveshpat)** — `project-architect`, `ml-engineer`, `living-doc-reconciler`, `git-staging-guardian`, `refactor-verifier`, `artifact-classifier`, `skill-audit`

**[Matt Pocock](https://github.com/mattpocock/skills)** — the skills-as-workflows methodology, description-driven auto-select trigger contract, and upstream source for `grill-me`, `write-a-prd`, `prd-to-plan`, `prd-to-issues`, `tdd`, `triage-issue`, `git-guardrails`, `write-a-skill`, `setup-pre-commit`, `ubiquitous-language`, `edit-article`, `obsidian-vault`

**[Affaan M](https://github.com/affaan-m/everything-claude-code)** — `strategic-compact`

**[Jesse Vincent / obra](https://github.com/obra/superpowers)** — `systematic-debugging` base methodology

**[John Ousterhout](https://web.stanford.edu/~ouster/cgi-bin/aposd.php)** — Deep Modules and Design-It-Twice from *A Philosophy of Software Design*

**[Dave Thomas & Andy Hunt](https://pragprog.com/titles/tppp/the-pragmatic-programmer/)** — Tracer Bullet development from *The Pragmatic Programmer*

**[Kent Beck](https://www.kentbeck.com/)** — Red → Green → Refactor from *Test-Driven Development by Example*

**[Eric Evans](https://www.domainlanguage.com/)** — Ubiquitous Language and bounded contexts from *Domain-Driven Design*
