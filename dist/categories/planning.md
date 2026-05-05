# Planning skills

Generated from canonical SKILL.md files.

# grill-me

- Category: planning
- Path: planning/grill-me/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/planning/grill-me/SKILL.md
- Tags: critique, planning, risk, review
- Chains to: `planning/to-prd`, `planning/prd-to-plan`, `tooling/write-a-skill`

## Trigger contract

Stress-test an idea, plan, PRD, or decision before execution. Use when the user asks to be challenged, wants holes found, or asks what they are missing.

---

# Grill Me

Use this skill to pressure-test a proposal before the user commits time, code, money, or reputation.

## When to Use

Use when the user says things like:
- “grill me”
- “poke holes in this”
- “stress-test this”
- “what am I missing?”
- “is this plan solid?”

## Process

1. Identify the user’s core claim or plan.
2. List the strongest assumptions behind it.
3. Attack the plan from practical, technical, strategic, and sequencing angles.
4. Separate fatal flaws from fixable weaknesses.
5. Suggest concrete revisions.
6. End with a decision: proceed, revise first, or stop.

## Output Contract

Return:
- the plan’s strongest point;
- the top risks;
- hidden assumptions;
- missing evidence;
- concrete improvements;
- a final go/no-go recommendation.

## Verification

A good grill should make the plan harder to fool yourself about. It should not merely be negative; it should improve the plan.

## What NOT to Do

- Do not flatter the user into proceeding.
- Do not invent facts.
- Do not critique without offering fixes.
- Do not turn every weakness into a blocker.


# grill-with-docs

- Category: planning
- Path: planning/grill-with-docs/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/planning/grill-with-docs/SKILL.md
- Tags: critique, planning, domain-language, adr, documentation, codebase-context
- Chains to: `planning/to-prd`, `architecture/improve-codebase-architecture`

## Trigger contract

Stress-test a plan against the existing codebase, domain glossary, and documented decisions. Use when the user wants to be grilled but the answer depends on project terminology, CONTEXT.md, ADRs, or current implementation behavior.

---

# Grill With Docs

Interview the user relentlessly about a plan while grounding every question in the existing domain language, documentation, ADRs, and codebase behavior.

Ask questions one at a time. For each question, provide your recommended answer. If a question can be answered by reading docs or code, inspect those sources instead of asking the user.

## Process

### 1. Load domain context

Look for project documentation before grilling:

- `CONTEXT.md` for domain glossary and ubiquitous language.
- `CONTEXT-MAP.md` if the repo has multiple bounded contexts.
- `docs/adr/` or equivalent ADR locations for durable decisions.
- Existing code and tests where the plan claims a behavior already exists.

Create docs lazily only when useful. If no `CONTEXT.md` exists, create or propose one after the first domain term is actually resolved. If no ADR directory exists, create or propose it only when an ADR-worthy decision emerges.

Reference formats:

- [CONTEXT-FORMAT.md](../../architecture/domain-model/CONTEXT-FORMAT.md)
- [ADR-FORMAT.md](../../architecture/domain-model/ADR-FORMAT.md)

### 2. Challenge against the glossary

When the user uses a term that conflicts with the existing language, call it out immediately:

> Your glossary defines "cancellation" as X, but this plan seems to mean Y. Which is correct?

When the user uses vague or overloaded language, propose a precise canonical term.

### 3. Stress-test concrete scenarios

Invent scenarios that probe boundaries between concepts, especially edge cases, state transitions, permissions, failure modes, and irreversible decisions.

### 4. Cross-reference with code

When the user states how the system works, check whether the code agrees. If docs, code, and user intent disagree, surface the contradiction and ask which source should become canonical.

### 5. Update docs inline when decisions crystallize

When a term is resolved, update or propose the `CONTEXT.md` change immediately. Do not batch terminology decisions until the end.

Offer an ADR only when all three are true:

1. The decision is hard to reverse.
2. It will be surprising without context.
3. It reflects a real trade-off between viable alternatives.

### 6. End with a decision

Return the same core decision as `grill-me`: proceed, revise first, or stop. Include documentation changes made/proposed and the recommended next skill, usually `to-prd`.

## Output Contract

- Strongest point
- Top risks
- Domain-language conflicts
- Code/doc contradictions
- Missing evidence
- Decisions resolved
- Docs updated or proposed
- Go/no-go recommendation


# prd-to-plan

- Category: planning
- Path: planning/prd-to-plan/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/planning/prd-to-plan/SKILL.md
- Tags: planning, prd, implementation-plan, tracer-bullet, vertical-slice
- Chains to: `planning/to-issues`

## Trigger contract

Turn a PRD into a multi-phase implementation plan using tracer-bullet vertical slices, saved as a local Markdown file in ./plans/. Use when the user wants to break down a PRD, create an implementation plan, plan phases from a PRD, or mentions 'tracer bullets'. Do NOT trigger without an existing PRD.

---

# PRD to Plan

Break a PRD into a phased implementation plan using vertical slices, also called tracer bullets. Output is a Markdown file in `./plans/`.

## When to Use / Not Use

**Use when:** a PRD exists and the user wants implementation phases, a plan, or tracer-bullet slicing.

**Do NOT use when:** the PRD is absent, the user wants issue tickets directly, or the user wants immediate implementation.

## Process

### 1. Confirm the PRD is in context

The PRD should already be in the conversation or repo. If it is not, ask the user to paste it or point you to the file.

### 2. Explore the codebase

If you have not already explored the codebase, inspect the current architecture, existing patterns, integration layers, and relevant tests.

### 3. Identify durable architectural decisions

Before slicing, identify high-level decisions unlikely to change during implementation:

- Route structures or URL patterns
- Database schema shape
- Key data models
- Authentication and authorization approach
- Third-party service seams

Put these in the plan header so every phase can reference them.

### 4. Draft vertical slices

Break the PRD into tracer-bullet phases. Each phase must be a thin vertical slice through all integration layers, not a horizontal slice of one layer.

- Each slice delivers a narrow but complete path through every layer.
- A completed slice is demoable or independently verifiable.
- Prefer many thin slices over a few thick slices.
- Do not include volatile implementation details likely to change later.
- Do include durable decisions: route paths, schema shapes, and data model names.

### 5. Quiz the user

Present the proposed breakdown as a numbered list. For each phase show:

- **Title** — short descriptive name
- **User stories covered** — which PRD stories it addresses

Ask whether the granularity feels right and whether phases should be merged or split. Iterate until approved.

### 6. Write the plan file

Create `./plans/` if it does not exist. Write a Markdown file named after the feature, such as `./plans/user-onboarding.md`.

## Output Format

```md
# Plan: <Feature>

> Source PRD: <link or title>

## Architectural decisions

Durable decisions that apply across all phases:

- **Routes**: ...
- **Schema**: ...
- **Key models**: ...

---

## Phase 1: <Title>

**User stories**: <list from PRD>

### What to build

A concise description of the end-to-end behavior for this vertical slice.

### Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

---

## Phase 2: <Title>

...
```

## Verification

- [ ] Every phase is independently verifiable.
- [ ] No phase is merely 'database', 'backend', 'frontend', or another horizontal slice.
- [ ] Durable decisions are separated from volatile implementation details.


# to-issues

- Category: planning
- Path: planning/to-issues/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/planning/to-issues/SKILL.md
- Tags: planning, github-issues, vertical-slice, tracer-bullets, tickets
- Chains to: `development/tdd`

## Trigger contract

Break a plan, spec, or PRD into independently-grabbable issues using tracer-bullet vertical slices. Triggers: 'create issues', 'slice into tickets', 'turn this plan into issues', 'implementation tickets', or /to-issues. Do NOT trigger without a plan, spec, PRD, or issue reference to work from.

---

# To Issues

Break a plan, spec, PRD, or existing issue into independently-grabbable implementation issues using tracer-bullet vertical slices.

## Process

### 1. Gather context

Work from the current conversation context. If the user passes an issue number, URL, or local file path, fetch and read the full body plus comments before slicing.

### 2. Explore the codebase when useful

If the plan depends on current architecture, inspect the relevant modules first. Issue titles and descriptions should use the project's domain glossary vocabulary when available and should respect ADRs covering the affected area.

### 3. Draft vertical slices

Each issue is a thin vertical slice that cuts through **all required integration layers end-to-end**, not a horizontal slice of one layer.

Slices may be `HITL` or `AFK`:

- `HITL`: requires human interaction, such as architectural judgment, design review, or external approval.
- `AFK`: can be implemented and merged without human interaction. Prefer `AFK` where accurate.

Vertical-slice rules:

- Each slice delivers a narrow but complete path through the necessary layers.
- Each completed slice is demoable or independently verifiable.
- Prefer many thin slices over few thick slices.
- Never name slices after layers like "Database", "Backend", or "Frontend".

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Type**: `HITL` / `AFK`
- **Blocked by**: which other slices must complete first, if any
- **User stories covered**: which user stories this addresses, if the source has them

Ask whether the granularity, dependencies, and `HITL`/`AFK` labels are right. Iterate until approved.

### 5. Publish or output issues

For each approved slice, publish a new issue to the configured issue tracker, or output issue bodies if no tracker is configured. Apply the configured triage label when filing.

Publish in dependency order so blocker references can point at real issue identifiers.

## Issue Template

```md
## Parent
A reference to the parent issue, PRD, or plan if applicable.

## What to build
A concise description of this vertical slice. Describe end-to-end behavior, not layer-by-layer implementation.

## Acceptance criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by
- A reference to the blocking ticket, or "None — can start immediately".
```

Do **not** close or modify the parent issue unless the user explicitly asks.


# to-prd

- Category: planning
- Path: planning/to-prd/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/planning/to-prd/SKILL.md
- Tags: planning, prd, requirements, github-issue, deep-modules
- Chains to: `planning/prd-to-plan`

## Trigger contract

Turn the current conversation context and codebase understanding into a structured PRD, optionally filed in the project issue tracker. Triggers: 'create a PRD', 'write a PRD', 'spec this out', 'turn this into requirements', or /to-prd. Do NOT interview by default; synthesize what is already known and ask only genuinely blocking clarifications.

---

# To PRD

This skill turns the current conversation context and repo understanding into a PRD. Do **not** restart discovery or interview the user by default. Synthesize what is already known, then ask only for information that blocks a correct PRD.

## When to Use / Not Use

**Use when:** the user wants a PRD, requirements document, product spec, implementation brief, or issue-ready specification from current context.

**Do NOT use when:** the user asks to implement now, already has an approved PRD, or explicitly wants critique first. Use `grill-me` or `grill-with-docs` first when the idea is still vague or the codebase/domain language needs challenging.

## Process

1. Explore the repo if needed. Use the project's domain glossary vocabulary when available, and respect ADRs that cover the area being changed.
2. Sketch the major modules that must be built or modified. Look for deep-module opportunities: simple, testable interfaces that encapsulate meaningful complexity.
3. Check only load-bearing uncertainties with the user: module boundaries, test scope, irreversible decisions, or unresolved product behavior. Do not ask filler questions just to complete a template.
4. Write the PRD using the output format below. If an issue tracker is configured and the user asked for filing, publish it and apply the appropriate triage label.

## Output Format

```md
## Problem Statement
The problem from the user's perspective.

## Solution
The solution from the user's perspective.

## User Stories
1. As a <role>, I want <capability>, so that <outcome>.

## Implementation Decisions
- Modules to build/modify
- Interfaces to change
- Technical clarifications
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include volatile file paths or code snippets.

## Testing Decisions
- What makes a good test for this feature
- Which modules will be tested
- Similar tests or prior art in the codebase

## Out of Scope
Explicitly excluded work.

## Further Notes
Useful context that did not fit elsewhere.
```

## Verification

- [ ] PRD uses current context rather than inventing requirements.
- [ ] Open questions are truly blocking.
- [ ] Implementation decisions avoid brittle file-path commitments.
- [ ] Testing decisions focus on public behavior.
- [ ] If filed as an issue, it enters the configured triage flow.
