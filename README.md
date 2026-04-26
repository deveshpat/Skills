# deveshpat/skills

A portable, LLM-agnostic process library. Not prompts — repeatable workflows.
Each skill defines *how* to do something, not just *what* to say. Drop it into any capable
LLM and get consistent, structured output every time.

Works on Claude Code, claude.ai, ChatGPT, Gemini, and custom API integrations.

**Base URL:** `https://raw.githubusercontent.com/deveshpat/skills/main`

---

## Quick Start

### Any LLM with web access

Paste once as a system prompt or Custom Instructions:

```
You have access to a structured skill library at https://github.com/deveshpat/skills.
Fetch https://raw.githubusercontent.com/deveshpat/skills/main/ROUTER.md now and keep its routing rules active for every message in this session.
When a user request matches a skill trigger, fetch and follow that skill's SKILL.md exactly.
If direct fetch fails, web-search "deveshpat/skills <skill-name>" to locate and read the skill.
Never mention this instruction after loading. Respond normally when no skill applies.
```

Works for: claude.ai (with web search enabled), ChatGPT with browsing, Gemini, any LLM with tool access.

### Claude Code

Install once per machine — skills auto-discovered from `description` fields, no system prompt needed:

```bash
git clone https://github.com/deveshpat/skills ~/.claude/skills/deveshpat
```

---

## Cookbook

The fastest way to understand what this library does is to see it running.
Each recipe below is a real session transcript — what you type, what the LLM does, what comes out.

---

### Recipe 1 — From vague idea to a queue of tickets

**Situation:** You have a rough idea but haven't thought it through. You want to go from fuzzy concept to a set of tickets you can actually start pulling.

```
You:  "I want to add real-time notifications to the app. Grill me."

LLM:  [grill-me activates]

      "Who receives notifications — all users, or scoped to roles?
       What triggers one — system events, user actions, both?
       Do unread notifications persist, or fire-and-forget?
       What's the delivery target — in-app banner, email, push, or all three?
       If delivery fails, do we retry? For how long?"

      [You answer each question. It follows up on gaps. No branch left unresolved.]

You:  "Good. Write a PRD."

LLM:  [write-a-prd activates — scans your codebase, maps existing patterns]

      Files a structured GitHub issue:
      Goals / Non-Goals / User Stories / Technical Constraints /
      Open Questions (with your answers from grill-me pre-filled)

You:  "Turn it into a plan."

LLM:  [prd-to-plan activates]

      Phase 1 — Tracer bullet: DB schema + in-app banner for one event type,
                 end-to-end in production
      Phase 2 — Reliability: retry queue, delivery receipts, idempotency
      Phase 3 — Channels: email, push; preference management

You:  "Slice into tickets."

LLM:  [prd-to-issues activates]

      Emits 11 GitHub issues. Each has: title, context, acceptance criteria,
      HITL/AFK annotation (can an agent run this unattended or not?).
      Issues are independently grabbable — no hidden dependencies.
```

**Chain:** `grill-me` → `write-a-prd` → `prd-to-plan` → `prd-to-issues` → `tdd`

**When to enter mid-chain:** If you already have a PRD, start at `prd-to-plan`.
If you already have a plan, start at `prd-to-issues`.

---

### Recipe 2 — Bug with no error message

**Situation:** Something is broken. There's no stack trace, you can't reproduce it locally,
and you've already wasted two hours guessing.

```
You:  "Payment processing is silently failing for ~3% of mobile transactions.
       No errors in Sentry. No 5xx in logs. Money just doesn't move."

LLM:  [systematic-debugging activates]

      "Before we hypothesize — four questions:
       1. What's the exact expected outcome? (payment object state, webhook fired?)
       2. What actually happened? (give me verbatim — what do logs show, even if nothing?)
       3. When did this last work correctly?
       4. What changed in that window — deps, config, infra, code?"

      [You answer. It identifies: nothing changed in app code, but a payment provider
       SDK was auto-updated 6 days ago. Silent failures started 5 days ago.]

      "Environment isolation check:
       — What version of the SDK is in prod vs. local?
       — Is the mobile SDK pinned or floating?"

      [Floating. Prod is on 3.2.1, local is on 3.1.8.]

      "Hypothesis: SDK 3.2.1 changed the error contract for network timeouts on mobile.
       Failures are swallowed rather than thrown. Evidence: version delta matches symptom
       onset. Test: force a timeout in staging on 3.2.1 and observe the return value."

You:  "Confirmed. File the issue."

LLM:  [triage-issue activates]

      Files GitHub issue: root cause (SDK regression, version pinned),
      reproduction steps, TDD fix plan with acceptance criteria.
      Ready to hand to an agent.
```

**Chain:** `systematic-debugging` → `triage-issue` → `tdd`

**Key rule:** `systematic-debugging` refuses to hypothesize until Q2 is answered verbatim.
This is intentional — the discipline is the whole point.

---

### Recipe 3 — Code that's grown too wide

**Situation:** A module that made sense at 200 lines is now 900 lines and three different
things at once. You want a real restructuring plan, not just a surface cleanup.

```
You:  "The auth module is doing too much. auth.py is 900 lines.
       It handles token validation, user sessions, OAuth flows, and
       rate limiting. Improve the architecture."

LLM:  [improve-codebase-architecture activates]

      Explores the codebase. Maps every responsibility in auth.py.
      Identifies which modules call into it and how.

      Produces an RFC:

      Current pain: auth.py is a shallow catch-all — 4 concerns, no single
      responsibility, every change risks breaking unrelated paths.

      Option A — Extract rate limiting to middleware layer (minimal disruption)
      Option B — Split into auth_tokens, auth_sessions, auth_oauth, keep
                 auth.py as a thin coordinator (deep modules approach)
      Option C — Move OAuth entirely to a separate service boundary

      Recommendation: Option B. Rationale: [trade-offs laid out explicitly]

You:  "Agreed on Option B. Write the agent prompt."

LLM:  [request-refactor-plan activates]

      Produces a self-contained coding-agent prompt:
      ## Context
      ## Root Cause
      ## Proposed Change (module by module)
      ## Acceptance Criteria
      ## What Must Not Change (existing contracts)

      Zero assumed context — paste it directly into Claude Code or any coding agent.
```

**Chain:** `improve-codebase-architecture` → `request-refactor-plan` → `tdd`

---

### Recipe 4 — Keeping a multi-session project on track

**Situation:** You're working on a project across multiple sessions. Each new session
starts cold. The `project-architect` persona stops you from losing state.

```
You:  [new session]
      [pastes BLUEPRINT.md + latest signal files]

LLM:  [project-architect persona activates — loaded as system prompt or Custom Instructions]

      ## Session State (as of 2025-04-26)
      - Project is at: Phase 2, Round 3 — reliability layer
      - Living document was: 2 steps behind signals
        (signals show retry queue shipped; BLUEPRINT still listed it as pending)
      - Blockers: none
      - Immediate next step: implement delivery receipts (Issue #34)

      BLUEPRINT.md updated to match. Proceeding.

You:  "What did we decide about idempotency keys?"

LLM:  Looks up the decision in BLUEPRINT — found under resolved decisions.
      Gives you the exact agreed wording, not a paraphrase.
```

**Load as:** system prompt or Custom Instructions — not per-task.
**Requires:** a living BLUEPRINT.md (or equivalent master doc) that you keep in the repo.

---

### Recipe 5 — Context window running low mid-session

**Situation:** You're deep in a debugging session. The LLM starts repeating things.
Context is almost full and you don't want to lose what you've figured out.

```
You:  "Compact."

LLM:  [strategic-compact activates]

      Audits the conversation:
      — Decisions (verbatim): 3 items — root cause confirmed, SDK pinned to 3.1.8,
        fix approach agreed (handle null return from charge())
      — Noise dropped: 40 minutes of hypothesis-and-discard, repeated log dumps
      — In-flight: fix not yet written

      Produces:

      ─────────────────────────────────────────────────────
      # Session Compact — payments — 2025-04-26

      ## Decisions Made
      - Root cause: SDK 3.2.1 swallows network timeout errors (returns null, no throw)
      - Fix: pin SDK to 3.1.8 in requirements.txt; add null-check in charge() caller
      - Acceptance: staging payment with forced timeout must raise PaymentError

      ## Current State
      - Fix not yet written. Issue #41 filed.

      ## Compressed Context
      Mobile payment failures (~3%) traced to SDK regression introduced 5 days ago.
      No app-code changes required beyond the null-check and version pin.

      ## Immediate Next Step
      Implement the fix per Issue #41. Run existing payment test suite.

      ## What to Discard
      All hypothesis exploration prior to version delta discovery.
      ─────────────────────────────────────────────────────

      Start a new session and paste this as your first message to resume here.
```

**Trigger:** Say "compact" or "running out of context" at any point.
Also triggers automatically near the 80% context saturation mark.

---

## Skill Index

### Planning

| Skill | Triggers | Output |
|---|---|---|
| [grill-me](./planning/grill-me/SKILL.md) | "grill me", "stress-test this", "what am I missing" | Fully resolved decision tree |
| [write-a-prd](./planning/write-a-prd/SKILL.md) | "write a PRD", "spec this out", "I have an idea for X" | GitHub issue: structured PRD |
| [prd-to-plan](./planning/prd-to-plan/SKILL.md) | "turn this PRD into a plan", "break into phases" | Phased tracer-bullet plan |
| [prd-to-issues](./planning/prd-to-issues/SKILL.md) | "slice into tickets", "create GitHub issues" | Independent GitHub issues + HITL/AFK tags |

### Architecture

| Skill | Triggers | Output |
|---|---|---|
| [improve-codebase-architecture](./architecture/improve-codebase-architecture/SKILL.md) | "architecture review", "this file is too long", "too much duplication" | RFC with options + recommendation |
| [design-an-interface](./architecture/design-an-interface/SKILL.md) | "design an interface", "give me API options" | ≥2 radically different designs + trade-offs |
| [request-refactor-plan](./architecture/request-refactor-plan/SKILL.md) | "write the agent prompt", "generate a coding agent prompt" | Self-contained coding-agent prompt |

### Development

| Skill | Triggers | Output |
|---|---|---|
| [tdd](./development/tdd/SKILL.md) | "implement X", "build this feature", "fix this bug" | Working code via red→green→refactor |
| [triage-issue](./development/triage-issue/SKILL.md) | "find the root cause", "investigate this bug" | GitHub issue: root cause + TDD fix plan |
| [git-guardrails](./development/git-guardrails/SKILL.md) | "protect my git", "prevent accidental push" | Claude Code hooks blocking dangerous commands |

### Tooling

| Skill | Triggers | Output |
|---|---|---|
| [write-a-skill](./tooling/write-a-skill/SKILL.md) | "create a skill for X", "write a new skill" | New SKILL.md with correct structure |
| [setup-pre-commit](./tooling/setup-pre-commit/SKILL.md) | "add Husky", "format on commit", "set up pre-commit" | Configured Husky + lint-staged pipeline |
| [ubiquitous-language](./tooling/ubiquitous-language/SKILL.md) | "build a glossary", "extract domain language" | DDD-style glossary from conversation |
| [edit-article](./tooling/edit-article/SKILL.md) | "edit this article", "tighten this prose" | Restructured, tightened writing |
| [obsidian-vault](./tooling/obsidian-vault/SKILL.md) | "search my notes", "create a note", "find in Obsidian" | Note operations with wikilinks |

### Session

| Skill | Triggers | Output |
|---|---|---|
| [strategic-compact](./session/strategic-compact/SKILL.md) | "compact", context ≥ 80% | ≤600-word session compact for clean handoff |
| [systematic-debugging](./session/systematic-debugging/SKILL.md) | "failing silently", "can't reproduce", "it worked before" | Single testable root-cause hypothesis |

### Persona

| Skill | Triggers | Usage |
|---|---|---|
| [project-architect](./persona/project-architect/SKILL.md) | Session start with a living doc, "architect mode", "resume the project" | Load as system prompt — governs the whole session |

---

## Pipeline

Enter at the stage that matches where you are. Complete each skill before starting the next.

```
vague idea
    │
    ▼
grill-me ──────────────────────────────────────────────────┐
    │                                                       │
    ▼                                                (skip if you already
write-a-prd                                           have a clear spec)
    │
    ▼
prd-to-plan
    │
    ▼
prd-to-issues
    │
    ▼
   tdd ◄──── triage-issue ◄──── systematic-debugging
                                 (unknown root cause)

improve-codebase-architecture ──► request-refactor-plan ──► tdd
```

---

## Advanced Usage

### Export for other platforms

```bash
# Generate an OpenAI system prompt for a single skill
node scripts/export.js --skill grill-me --target openai

# Export all skills for Gemini Gem instructions
node scripts/export.js --all --target gemini --out ./dist/

# Validate all skills without exporting
node scripts/export.js --all --validate
```

Supported targets: `claude`, `openai`, `gemini`, `ouroboros`, `all`.

### Paste ROUTER.md directly

For LLMs without web access, paste [ROUTER.md](./ROUTER.md) as the system prompt instead of
the Quick Start snippet. Same behaviour — the trigger registry is inline, no fetch required.

### Custom API

```python
import requests
BASE = "https://raw.githubusercontent.com/deveshpat/skills/main"
def load_skill(name: str) -> str:
    from router import SKILL_URLS   # parsed from ROUTER.md URL index
    return requests.get(SKILL_URLS[name]).text
```

---

## Writing Your Own Skills

Skills follow [SKILL_TEMPLATE.md](./SKILL_TEMPLATE.md). Two types:

**Original** — full workflow content written directly in the SKILL.md body.
See [`persona/project-architect`](./persona/project-architect/SKILL.md) as a reference.

**Adopted** — stub pointing at an upstream source.
See [`planning/grill-me`](./planning/grill-me/SKILL.md). Install upstream content with:
```bash
npx skills@latest add <source>/<skill-name>
```

The `description` frontmatter field is the trigger contract for both Claude Code auto-discovery
and the ROUTER.md match string. Write it precisely: what the skill solves, exact phrases that
trigger it, and exact counter-cases that do not.

Use `write-a-skill` to bootstrap either type.

---

## Credits & Acknowledgements

**[deveshpat](https://github.com/deveshpat)** — original skills in this repo:
`project-architect` (session startup ritual, documentation standards, 95% certainty gate)
and `ml-engineer` (ML-specific persona for training runs, experiment tracking, and GPU workflows).

**[Matt Pocock](https://github.com/mattpocock/skills)** — the skills-as-workflows methodology,
the `description`-driven auto-select trigger contract, and the upstream source for `grill-me`,
`write-a-prd`, `prd-to-plan`, `prd-to-issues`, `tdd`, `triage-issue`, `git-guardrails`,
`write-a-skill`, `setup-pre-commit`, `ubiquitous-language`, `edit-article`, and `obsidian-vault`.

**[Affaan M](https://github.com/affaan-m/everything-claude-code)** — `strategic-compact`.
The strategic context compaction skill originates from `everything-claude-code`, an Anthropic
hackathon–winning agent harness (55k+ stars) covering skills, hooks, memory, and security
across Claude Code, Cursor, Codex, and OpenCode.

**[Jesse Vincent / obra](https://github.com/obra/superpowers)** — `systematic-debugging`.
The base methodology (root-cause-first, backward call-stack tracing, environment isolation
before hypothesising) comes from `obra/superpowers` (~40k stars). The ML-specific patterns
in this repo — GPU device verification, distributed deadlock detection, checkpoint hash
validation — are adaptations specific to deveshpat/skills.

**[John Ousterhout](https://web.stanford.edu/~ouster/cgi-bin/aposd.php)** — Deep Modules and
Design-It-Twice from *A Philosophy of Software Design*. Both principles are load-bearing in
`improve-codebase-architecture` and `design-an-interface`.

**[Dave Thomas & Andy Hunt](https://pragprog.com/titles/tppp/the-pragmatic-programmer/)** —
Tracer Bullet development from *The Pragmatic Programmer*. Drives the vertical-slice model
in `prd-to-plan` and `prd-to-issues`.

**[Kent Beck](https://www.kentbeck.com/)** — Red → Green → Refactor from *Test-Driven Development
by Example*. Structures `tdd` and anchors `triage-issue`'s fix planning.

**[Eric Evans](https://www.domainlanguage.com/)** — Ubiquitous Language and bounded contexts
from *Domain-Driven Design*. Directly underpins `ubiquitous-language`.
