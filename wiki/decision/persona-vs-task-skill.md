---
title: Persona vs task skill — the design decision
type: decision
sources:
  - persona/project-architect/SKILL.md
  - persona/ml-engineer/SKILL.md
updated: 2026-04-30
---

# Persona vs task skill — the design decision

## The distinction

**Task skills** are invoked per-request. They activate when a trigger matches, execute a
workflow, produce output, and disengage.

**Persona skills** (`project-architect`, `ml-engineer`) are loaded into the system prompt
or Custom Instructions for an entire session. They define a *standing role* — a set of
behaviors that shape every response in the session, not just one response.

## Why personas can't be task skills

`project-architect` needs to run the startup ritual *before any other action* and maintain
the 95% certainty gate *throughout the session*. If invoked per-task, a user could bypass
it by not triggering it. The role only works as a persistent constraint.

Similarly, `ml-engineer` must enforce evidence gates (GPU verification, checkpoint validation)
on every training claim in a session. A per-task invocation would let training claims slip
through between invocations.

## The role boundary between the two personas

When both are loaded, `project-architect` governs decisions and maintains BLUEPRINT.md.
`ml-engineer` implements. The division is explicit in `ml-engineer`'s responsibility table:
it does not govern decisions, does not maintain BLUEPRINT, and escalates architectural
questions rather than answering them. This prevents the implementer from silently making
architectural choices.

## When to load one vs. both

Load `project-architect` alone for any multi-session project with a living document.
Load `ml-engineer` alone for a focused training/experiment session with no broader project
governance needed — it produces its own Session Brief when no architect is present.
Load both for a multi-session ML project where experiment decisions need to be governed.

## The "not for one-off tasks" constraint

Both personas explicitly say "Do NOT invoke as a one-off task skill." Invoking them
per-task produces the startup ritual overhead without the persistent constraint — the worst
of both worlds. If you only need a single debugging session or a single TDD cycle,
use `systematic-debugging` or `tdd` directly.
