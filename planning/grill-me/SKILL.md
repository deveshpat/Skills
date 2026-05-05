---
name: grill-me
description: Stress-test an idea, plan, PRD, or decision before execution. Use when the user asks to be challenged, wants holes found, or asks what they are missing.
category: planning
tags:
  - critique
  - planning
  - risk
  - review
target_llms: [all]
composable_with:
  - planning/to-prd
  - planning/prd-to-plan
  - tooling/write-a-skill
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
