---
title: grill-me trigger precision
type: skill-pattern
sources:
  - planning/grill-me/SKILL.md
  - planning/write-a-prd/SKILL.md
updated: 2026-04-30
---

# grill-me trigger precision

## When grill-me is the right entry

The skill is for *stress-testing* — finding holes in something the user already believes.
It activates on explicit challenge language: "grill me", "poke holes", "stress-test this",
"what am I missing", "is this solid."

The output is a **go/no-go recommendation with concrete fixes** — not a list of concerns.
Every weakness must come with a suggested revision. Critique without a fix is not the contract.

## When to skip it

`write-a-prd` explicitly says: do NOT trigger when the user asks to be grilled first.
This means the two skills have a sequencing contract — `grill-me` comes before `write-a-prd`,
not after. If a PRD already exists, grilling it retroactively has diminishing value;
use `triage-issue` or `improve-codebase-architecture` depending on the problem type.

## The fatal flaw vs. fixable weakness distinction

`grill-me` requires separating **fatal flaws** (blockers that invalidate the plan) from
**fixable weaknesses** (real risks with known mitigations). Collapsing these into a single
list removes the decision signal. The go/no-go at the end depends on whether any fatal flaws
remain after revisions are applied.

## Target LLM note

`grill-me` lists `target_llms: [chatgpt, claude-code]` — not `all`. This is likely an
oversight from the upstream mattpocock/skills source rather than an intentional restriction.
The skill works on any capable model.
