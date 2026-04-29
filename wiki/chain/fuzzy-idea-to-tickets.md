---
title: Fuzzy idea to tickets chain
type: chain
sources:
  - planning/grill-me/SKILL.md
  - planning/write-a-prd/SKILL.md
  - planning/prd-to-plan/SKILL.md
  - planning/prd-to-issues/SKILL.md
updated: 2026-04-30
---

# Fuzzy idea to tickets chain

`grill-me` → `write-a-prd` → `prd-to-plan` → `prd-to-issues`

## Entry condition

Enter at the step that matches where you actually are. Most sessions enter mid-chain.
A clear idea with no spec skips `grill-me`. An existing PRD skips both.

## Handoff contracts

**grill-me → write-a-prd**
The grill produces a go/no-go. If go, the user's answers to the grill's questions become
the implicit requirements. `write-a-prd` synthesizes *from context already provided* —
it should not re-interview unless something is genuinely blocking.

**write-a-prd → prd-to-plan**
The PRD's User Stories and Implementation Decisions sections drive the plan's vertical slices.
`prd-to-plan` first extracts *durable architectural decisions* (routes, schema, key models)
before slicing into phases. This separation matters: durable decisions go in the plan header;
volatile implementation details stay out.

**prd-to-plan → prd-to-issues**
The plan's phases become the basis for issue granularity. `prd-to-issues` re-slices into
independently-grabbable vertical slices and annotates each as HITL or AFK. A plan phase may
produce multiple issues if it contains natural seams.

## Where chains break

- **Skipping the grill on a vague idea** — the PRD will inherit the unexamined assumptions.
- **Horizontal phase naming** — any phase called "Database," "Backend," or "Frontend" in `prd-to-plan`
  is a horizontal slice. Each phase must be independently demoable end-to-end.
- **Blockers not declared in issues** — `prd-to-issues` creates issues in dependency order so
  real issue numbers appear in "Blocked by" fields. Skipping this produces dangling references.
