---
name: prd-to-plan
description: >
  Turn a PRD into a multi-phase implementation plan using tracer-bullet vertical
  slices, saved as a local Markdown file in ./plans/. Use when the user wants to
  break down a PRD, create an implementation plan, plan phases from a PRD, or
  mentions 'tracer bullets'. Do NOT trigger without an existing PRD.
category: planning
tags: [planning, prd, implementation-plan, tracer-bullet, vertical-slice]
target_llms: [all]
source: mattpocock/skills
upstream: https://github.com/mattpocock/skills/tree/main/prd-to-plan
composable_with:
  - planning/prd-to-issues
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
