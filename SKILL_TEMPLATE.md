---
name: skill-name
description: >
  Specific trigger contract. State what problem this solves, exact phrases that
  trigger it, and exact situations that do NOT trigger it. Minimum 50 chars.
  This is the router match string and may also be used by tools that auto-discover skills.
category: planning | architecture | development | tooling | session
tags: [tag1, tag2]
target_llms: [all]
source: original | mattpocock/skills | community/<source>
inputs:
  - name: input-name
    description: What you need before starting
    required: true
outputs:
  - name: output-name
    description: What this skill produces
    format: markdown | json | github-issue | file
composable_with:
  - category/skill-name
---

# Skill Title

One sentence: what this skill does and why it exists.

---

## When to Use / Not Use

**Use when:** exact situations.

**Do NOT use when:** counter-cases and what to use instead.

---

## Inputs

- **input-name** — required/optional; expected format.

## Outputs

- **output-name** — exact artifact or response produced.

---

## Process

### Step 1 — Action

Concrete instruction. What to do, how, and what to look for.

### Step 2 — Action

Concrete instruction.

### Step 3 — Produce output

Describe output format precisely. State which skill it feeds into.

---

## Verification

- [ ] Contract can be executed from only the inputs above.
- [ ] Output format is explicit.
- [ ] Local links and bundled resources exist.
- [ ] Description is narrow enough for routing.
- [ ] `composable_with` paths point to existing skills.

## Constraints

- Hard constraint 1: never do X because Y.

## What NOT to Do

Specific anti-patterns for this skill only.

## Composability

Feeds into: **`category/next-skill`** — how to hand off.

Works after: **`category/prev-skill`** — what it assumes.
