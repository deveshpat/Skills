---
title: Fuzzy idea to tickets chain
type: chain
sources:
  - architecture/improve-codebase-architecture/SKILL.md
  - planning/grill-me/SKILL.md
  - planning/to-prd/SKILL.md
  - planning/prd-to-plan/SKILL.md
  - planning/to-issues/SKILL.md
  - development/tdd/SKILL.md
updated: 2026-05-05
---

# Fuzzy idea to tickets chain

`[optional improve-codebase-architecture]` → `grill-me` → `to-prd` → `prd-to-plan` → `to-issues` → `tdd`

## Entry condition

Enter at the step that matches where you actually are. Most sessions enter mid-chain.
A clear idea with no spec skips `grill-me`. An existing PRD skips both `grill-me` and
`to-prd`. A known implementation task can go straight to `tdd`.

Use `improve-codebase-architecture` before `grill-me` only when the user explicitly asks to
review codebase health, duplication, module boundaries, deepening opportunities, file size,
or architecture risk before product planning. It is an optional preflight, not a mandatory
start node.

## Handoff contracts

**improve-codebase-architecture → grill-me / to-prd**
The architecture preflight produces friction points, deep-module candidates, and design
decisions. Those findings become planning context. It should not silently become a broad
refactor; implementation still flows through `tdd`.

**grill-me → to-prd**
The grill produces a go/no-go. If go, the user's answers to the grill's questions become
the implicit requirements. `to-prd` synthesizes *from context already provided* —
it should not re-interview unless something is genuinely blocking.

**to-prd → prd-to-plan**
The PRD's User Stories and Implementation Decisions sections drive the plan's vertical slices.
`prd-to-plan` first extracts *durable architectural decisions* (routes, schema, key models)
before slicing into phases. This separation matters: durable decisions go in the plan header;
volatile implementation details stay out.

**prd-to-plan → to-issues**
The plan's phases become the basis for issue granularity. `to-issues` re-slices into
independently-grabbable vertical slices and annotates each as HITL or AFK. A plan phase may
produce multiple issues if it contains natural seams.

**to-issues → tdd**
Issues become the work orders for `tdd`. Each issue should be independently executable and
behavior-focused enough that tests can be written through public interfaces rather than
internal implementation details.

## Where chains break

- **Running architecture preflight automatically** — this burns context and delays ordinary
  idea-to-PRD work. It only runs when architecture is explicitly in scope.
- **Skipping the grill on a vague idea** — the PRD will inherit unexamined assumptions.
- **Horizontal phase naming** — any phase called "Database," "Backend," or "Frontend" in
  `prd-to-plan` is a horizontal slice. Each phase must be independently demoable end-to-end.
- **Blockers not declared in issues** — `to-issues` creates issues in dependency order so
  real issue numbers appear in "Blocked by" fields. Skipping this produces dangling references.
