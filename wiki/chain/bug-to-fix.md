---
title: Bug to fix chain
type: chain
sources:
  - development/diagnose/SKILL.md
  - development/triage/SKILL.md
  - development/tdd/SKILL.md
updated: 2026-04-30
---

# Bug to fix chain

`diagnose` → `triage` → `tdd`

## Entry condition

Enter at `diagnose` when the error is absent or misleading — silent failures,
environment-specific issues, can't-reproduce situations. Enter at `triage` when
the symptom is clear but the root cause needs codebase exploration. Enter at `tdd` directly
when root cause is already known.

## Handoff contracts

**diagnose → triage**
`diagnose` ends with a single confirmed hypothesis: *"The failure is caused by
[exact mechanism] in [exact location], triggered when [exact condition]."* This hypothesis
is the input to `triage`. If the hypothesis is still probabilistic ("probably"), do
not hand off yet — return to Step 4 of diagnose.

**triage → tdd**
`triage` produces a GitHub issue containing: root cause analysis, a TDD fix plan
(numbered RED-GREEN cycles), and acceptance criteria. The TDD fix plan is the work order
for `tdd`. The issue's "Durability" requirement matters: fix descriptions must survive
radical codebase changes — no specific file paths, no internal structure references.
Write behaviors and contracts.

## The durability requirement

Both `triage` and `tdd` share a durability constraint: tests and issues must describe
*observable outcomes*, not internal state. A test that passes when you rename an internal
function was testing implementation. A good test reads like a spec.

## Where chains break

- **Hypothesizing before Q2 is verbatim** — `diagnose` explicitly says: if you
  cannot answer "What actually happened?" verbatim, get better logging first. Skipping this
  produces hypotheses that chase symptoms.
- **Environment noise** — silent failures are environment failures 60% of the time.
  Systematic-debugging's environment isolation table (runtime version, hardware, deps,
  permissions, cached state) must be cleared before any code hypothesis.
- **Filing the issue too early** — `triage` says do not ask the user to review before
  creating the issue. But the root cause analysis must be sound before filing, or the
  TDD fix plan will be wrong.
