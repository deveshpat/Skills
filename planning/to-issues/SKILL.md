---
name: to-issues
description: >
  Break a plan, spec, or PRD into independently-grabbable issues using tracer-bullet
  vertical slices. Triggers: 'create issues', 'slice into tickets', 'turn this plan into
  issues', 'implementation tickets', or /to-issues. Do NOT trigger without a plan, spec,
  PRD, or issue reference to work from.
category: planning
tags: [planning, github-issues, vertical-slice, tracer-bullets, tickets]
target_llms: [all]
source: mattpocock/skills
upstream: https://github.com/mattpocock/skills/tree/main/skills/engineering/to-issues
aliases: [prd-to-issues]
composable_with:
  - development/tdd
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
