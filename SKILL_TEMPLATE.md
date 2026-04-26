---
name: skill-name
description: >
  Specific trigger contract. State: what problem this solves, exact phrases that trigger it,
  exact situations that do NOT trigger it. Min 50 chars. This IS the Claude Code auto-select
  trigger and the router match string.
category: planning | architecture | development | tooling | session | persona
tags: [tag1, tag2]
target_llms: [all]
source: original | mattpocock/skills | community/<repo>
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

> **Persona skills only:** Load into system prompt, not per-task. Remove for workflow skills.

One sentence: what this skill does and why it exists.

---

## When to Use / Not Use

**Use when:** exact situations
**Do NOT use when:** counter-cases (and what to use instead)

---

## Process

### Step 1 — Action

Concrete instruction. What to do, how, what to look for.

### Step 2 — Action

Concrete instruction.

### Step 3 — Produce output

Describe output format precisely. State which skill it feeds into.

---

## Output Format

\`\`\`
[Exact structure of what this skill produces]
\`\`\`

---

## Constraints

- Hard constraint 1 (never do X because Y)

## What NOT to Do

Specific anti-patterns for this skill only.

## Composability

Feeds into: **`category/next-skill`** — how to hand off
Works after: **`category/prev-skill`** — what it assumes
