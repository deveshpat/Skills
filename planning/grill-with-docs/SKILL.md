---
name: grill-with-docs
description: >
  Stress-test a plan against the existing codebase, domain glossary, and documented decisions.
  Use when the user wants to be grilled but the answer depends on project terminology,
  CONTEXT.md, ADRs, or current implementation behavior.
category: planning
tags: [critique, planning, domain-language, adr, documentation, codebase-context]
target_llms: [all]
source: mattpocock/skills
upstream: https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs
composable_with:
  - planning/to-prd
  - architecture/improve-codebase-architecture
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
