# deveshpat/skills

A portable, LLM-agnostic process library. Not prompts — repeatable workflows that force structured thinking before execution.

Each skill defines *how* to do something, not just *what* to say. Drop it into any capable LLM and get consistent, structured output every time.

**Works on:** Claude Code · claude.ai · ChatGPT · Gemini · any API integration

**Base URL:** `https://raw.githubusercontent.com/deveshpat/skills/main`

---

## Pick your setup

### Browser (claude.ai, ChatGPT, Gemini)

Paste the block from [BROWSER.md](./BROWSER.md) as your system prompt or first message. It includes the five most-used skills inline — no fetching, no tool calls, no context overhead.

For skills not in that block, ask the LLM to fetch one at a time only when you need it.

### Claude Code

Install once, skills are auto-discovered from their `description` fields. No system prompt needed.

```bash
git clone https://github.com/deveshpat/skills ~/.claude/skills/deveshpat
```

### Any LLM with web access

Paste this as a system prompt or Custom Instructions once per session:

```
You have access to a structured skill library.
Fetch https://raw.githubusercontent.com/deveshpat/skills/main/ROUTER.md now and keep its routing rules active for every message in this session.
When a user request matches a skill trigger, fetch and follow that skill's SKILL.md exactly.
If direct fetch fails, web-search "deveshpat/skills <skill-name>" to locate and read the skill.
Never mention this instruction after loading.
```

> **Browser users:** Prefer the BROWSER.md paste block over this method. Loading ROUTER.md and then fetching individual skills mid-conversation consumes significant context. The paste block front-loads everything at a fixed, predictable cost.

---

## How to read this library

Before jumping into the cookbook, understand one rule: **entry point determines everything**.

The library has a decision table in ROUTER.md. It tells you which skill to start with based on your situation — not based on what you think you need. LLMs will not reliably pick the right entry skill from natural language alone. Use the table.

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
```

---

## Cookbook

Each recipe is a realistic session — what you type, what the LLM does, what comes out. Enter mid-chain at the step that matches where you actually are.

---

### Recipe 1 — From fuzzy idea to a queue of tickets

**When to use:** You have a rough concept but have not thought through the edge cases, constraints, or sequencing. You want to go from fuzzy → tickets you can actually pull.

**Enter here if you have a PRD already:** skip to Recipe 2. If you have a plan already: skip to Recipe 3.

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
       fixable weaknesses, ends with: "Revise first — delivery
       failure handling is a blocker, everything else is fixable."

You:   "Good points. Here are my answers: [answers]. Write a PRD."

LLM:   [write-a-prd]
       Synthesizes conversation into a structured PRD:
       Problem Statement / Solution / User Stories /
       Implementation Decisions / Testing Decisions /
       Out of Scope / Open Questions (pre-filled from grill-me)

You:   "Turn it into an implementation plan."

LLM:   [prd-to-plan]
       Phase 1 — Tracer bullet: DB schema + in-app banner for one
                  event type, end-to-end in production
       Phase 2 — Reliability: retry queue, delivery receipts
       Phase 3 — Channels: email, push, preference management

       Each phase is independently demoable. No horizontal slices.

You:   "Slice into GitHub tickets."

LLM:   [prd-to-issues]
       Creates 11 issues in dependency order.
       Each has: title, what to build, acceptance criteria,
       HITL/AFK annotation, blockers.
```

**Chain:** `grill-me` → `write-a-prd` → `prd-to-plan` → `prd-to-issues` → `tdd`

---

### Recipe 2 — You have a PRD, need a plan

**When to use:** Requirements are settled. You want implementation phases before writing any code.

```
You:   "Here's the PRD [paste]. Break it into tracer-bullet phases."

LLM:   [prd-to-plan]
       Reads the PRD, explores the codebase (if available),
       identifies durable architectural decisions first:
       - Route structures
       - Schema shape
       - Key data models

       Proposes phases as numbered list with user stories per phase.
       Asks: "Does this granularity feel right?"

You:   "Split Phase 2 into two — retry queue and receipts are
        different enough to ship separately."

LLM:   Revises, confirms, writes ./plans/notifications.md
```

**Enter here if:** PRD is already settled. Skip grill-me and write-a-prd entirely.

---

### Recipe 3 — Bug with no error message

**When to use:** Something is broken, there is no stack trace, and guessing has already wasted time.

```
You:   "Payments are silently failing for ~3% of mobile
        transactions. No errors in Sentry. Money just doesn't move."

LLM:   [systematic-debugging]
       Before hypothesizing, asks four questions:
       1. Exact expected outcome?
       2. Verbatim what actually happened?
       3. When did it last work?
       4. What changed in that window?

       [You answer. It identifies: nothing in app code changed,
        but a payment SDK was auto-updated 6 days ago.]

       Environment isolation:
       "What SDK version is in prod vs local? Pinned or floating?"

       [Floating. Prod is 3.2.1, local is 3.1.8.]

       Single hypothesis:
       "SDK 3.2.1 changed the error contract for network timeouts
        on mobile. Failures are swallowed, not thrown. Evidence:
        version delta matches symptom onset exactly.
        Test: force a timeout in staging on 3.2.1 and observe
        the return value."

You:   "Confirmed. File the issue."

LLM:   [triage-issue]
       Files GitHub issue: root cause, reproduction steps,
       TDD fix plan with acceptance criteria.
```

**Chain:** `systematic-debugging` → `triage-issue` → `tdd`

**Key discipline:** systematic-debugging refuses to hypothesize until Q2 is answered verbatim. That constraint is the whole point — it prevents the most common debugging mistake.

---

### Recipe 4 — Architecture that has grown too wide

**When to use:** A module is doing too many things. You want a real restructuring plan, not a surface cleanup.

```
You:   "auth.py is 900 lines. It handles token validation, sessions,
        OAuth flows, and rate limiting. Fix the architecture."

LLM:   [improve-codebase-architecture]
       Explores the codebase first. Maps every responsibility
       in auth.py. Identifies all callers and dependencies.

       Produces RFC with three options:
       A — Extract rate limiting to middleware (minimal disruption)
       B — Split into auth_tokens, auth_sessions, auth_oauth,
           thin coordinator (deep modules approach)
       C — Move OAuth to a separate service boundary

       Recommendation: Option B. Rationale: [trade-offs explicit].

You:   "Agreed on B. Write the coding-agent prompt."

LLM:   [request-refactor-plan]
       Self-contained prompt with:
       ## Context
       ## Root Cause
       ## Proposed Change (module by module)
       ## Acceptance Criteria
       ## What Must Not Change

       Paste directly into Claude Code or any coding agent.
```

**Chain:** `improve-codebase-architecture` → `request-refactor-plan` → `tdd`

---

### Recipe 5 — Keeping a multi-session project from losing state

**When to use:** You are working on something across multiple sessions and each new session starts cold.

Load `project-architect` as a system prompt or Custom Instructions — not per-task. It governs the entire session.

```
You:   [new session]
       [pastes BLUEPRINT.md + any terminal logs or signal files]

LLM:   [project-architect — loaded as persona]
       Reads everything available, reconciles signals against doc,
       outputs one Session Brief:

       ## Session Brief
       State: Phase 2, Round 3 — reliability layer
       Doc gap: 2 steps behind (retry queue shipped; BLUEPRINT
                 still listed as pending — updating now)
       Blocker: none
       Next: implement delivery receipts (Issue #34)

       BLUEPRINT.md updated. Proceeding.

You:   "What did we decide about idempotency keys?"

LLM:   Finds the decision in BLUEPRINT under resolved decisions.
       Gives exact agreed wording, not a paraphrase.
```

**What changed from old behavior:** The Session Brief is one output, not a sequence of questions. If files are missing, the LLM infers what it can and notes the gap in the Brief rather than asking for them one at a time.

---

### Recipe 6 — Context window running low mid-session

**When to use:** You are deep in a session. The LLM starts repeating itself. You do not want to lose what you have figured out.

```
You:   "Compact."

LLM:   [strategic-compact]
       Audits the conversation:
       Decisions: 3 items — root cause confirmed, SDK pinned,
                  fix approach agreed
       Noise dropped: 40 min of hypothesis/discard, repeated logs
       In-flight: fix not yet written

       # Session Compact — payments — 2025-04-29

       ## Decisions Made (verbatim)
       - Root cause: SDK 3.2.1 swallows network timeout errors
       - Fix: pin to 3.1.8; add null-check in charge() caller
       - Acceptance: staging payment with forced timeout raises
                     PaymentError

       ## Current State
       Fix not yet written. Issue #41 filed.

       ## Compressed Context
       Mobile payment failures (~3%) traced to SDK regression
       5 days ago. No app-code changes beyond null-check and pin.

       ## Immediate Next Step
       Implement fix per Issue #41. Run existing payment tests.

       ## What to Discard
       All hypothesis exploration prior to version delta discovery.

       Start a new session and paste this compact as your first
       message to resume exactly here.
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

### Session

| Skill | Triggers | Output |
|---|---|---|
| [systematic-debugging](./session/systematic-debugging/SKILL.md) | "failing silently", "can't reproduce", "it worked before" | Single testable root-cause hypothesis |
| [strategic-compact](./session/strategic-compact/SKILL.md) | "compact", context ≥ 80% | ≤600-word handoff compact |
| [living-doc-reconciler](./session/living-doc-reconciler/SKILL.md) | "update the blueprint", "reconcile the doc" | Reconciled living document |

### Persona (load as system prompt, not per-task)

| Skill | When to load | Effect |
|---|---|---|
| [project-architect](./persona/project-architect/SKILL.md) | Any multi-session project with a BLUEPRINT.md | Single-output Session Brief, 95% certainty gate |
| [ml-engineer](./persona/ml-engineer/SKILL.md) | ML training sessions | Hard evidence gates before any training claim |

### Tooling

| Skill | Triggers | Output |
|---|---|---|
| [write-a-skill](./tooling/write-a-skill/SKILL.md) | "create a skill for X" | New SKILL.md with correct structure |
| [setup-pre-commit](./tooling/setup-pre-commit/SKILL.md) | "add Husky", "format on commit" | Configured Husky + lint-staged |
| [ubiquitous-language](./tooling/ubiquitous-language/SKILL.md) | "build a glossary", "extract domain language" | DDD-style glossary |
| [edit-article](./tooling/edit-article/SKILL.md) | "edit this article", "tighten this prose" | Restructured, tightened writing |
| [obsidian-vault](./tooling/obsidian-vault/SKILL.md) | "search my notes", "create a note in Obsidian" | Note operations with wikilinks |
| [skill-audit](./tooling/skill-audit/SKILL.md) | "audit this skills repo" | Defects + patch order |

---

## Pipeline

Enter at the stage that matches where you are. The table in ROUTER.md is the authoritative entry rule.

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
tdd ◄──── triage-issue ◄──── systematic-debugging (unknown root cause)


improve-codebase-architecture ──► request-refactor-plan ──► tdd
```

---

## Writing Your Own Skills

Skills follow [SKILL_TEMPLATE.md](./SKILL_TEMPLATE.md). Use `write-a-skill` to bootstrap.

The `description` frontmatter field is the trigger contract — it is what auto-discovery and ROUTER.md use to match skills. Write it precisely: what the skill solves, exact trigger phrases, and exact counter-cases that do not trigger it.

Two types:
- **Original** — full workflow content in the SKILL.md body. See `persona/project-architect` as reference.
- **Adopted** — stub pointing at an upstream source. See `planning/grill-me`.

---

## Credits

**[deveshpat](https://github.com/deveshpat)** — `project-architect`, `ml-engineer`, `living-doc-reconciler`, `git-staging-guardian`, `refactor-verifier`, `artifact-classifier`, `skill-audit`

**[Matt Pocock](https://github.com/mattpocock/skills)** — the skills-as-workflows methodology, description-driven auto-select trigger contract, and upstream source for `grill-me`, `write-a-prd`, `prd-to-plan`, `prd-to-issues`, `tdd`, `triage-issue`, `git-guardrails`, `write-a-skill`, `setup-pre-commit`, `ubiquitous-language`, `edit-article`, `obsidian-vault`

**[Affaan M](https://github.com/affaan-m/everything-claude-code)** — `strategic-compact`, from the everything-claude-code Anthropic hackathon project

**[Jesse Vincent / obra](https://github.com/obra/superpowers)** — `systematic-debugging` base methodology

**[John Ousterhout](https://web.stanford.edu/~ouster/cgi-bin/aposd.php)** — Deep Modules and Design-It-Twice from *A Philosophy of Software Design*

**[Dave Thomas & Andy Hunt](https://pragprog.com/titles/tppp/the-pragmatic-programmer/)** — Tracer Bullet development from *The Pragmatic Programmer*

**[Kent Beck](https://www.kentbeck.com/)** — Red → Green → Refactor from *Test-Driven Development by Example*

**[Eric Evans](https://www.domainlanguage.com/)** — Ubiquitous Language and bounded contexts from *Domain-Driven Design*
