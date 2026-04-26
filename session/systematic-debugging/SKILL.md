---
name: systematic-debugging
description: >
  Structured diagnosis for silent, environment-specific, or hard-to-reproduce failures.
  Use when: "failing silently", "crashed without output", "can't reproduce this",
  "it worked before", or any failure where the error is absent or misleading. Do NOT use
  when the root cause is already known — go directly to development/tdd.
category: session
tags: [debugging, diagnosis, silent-failure, environment, root-cause]
target_llms: [all]
source: community/obra/superpowers
upstream_url: https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md
notes: ML-specific additions (GPU checks, distributed deadlock, checkpoint patterns)
inputs:
  - name: failure description or log snippet
    required: true
  - name: environment details
    required: false
outputs:
  - name: root cause hypothesis and fix plan
    format: markdown
composable_with:
  - development/triage-issue
  - development/tdd
---

# Systematic Debugging

Go from "something is wrong" to "I know exactly what is wrong and why" before touching any code.

---

## Process

### Step 1 — Characterize the failure
Answer these four questions verbatim, not paraphrased:
1. What was expected? (exact output, exit code, state)
2. What actually happened? (verbatim — one wrong word changes the diagnosis)
3. When did it last work? (last known-good commit/environment/timestamp)
4. What changed? (dependencies, environment config, code, data)

If you cannot answer Q2 verbatim, get better logging first. Do not hypothesize.

### Step 2 — Isolate the environment
| Check | Verify |
|---|---|
| Runtime version | Language, framework, driver — exact versions |
| Hardware | GPU model, compute capability, available memory |
| Dependencies | Pinned vs. floating; `pip freeze` / `npm ls` output |
| Permissions | File system, API tokens, network |
| State | Cached state, checkpoint files, lock files from prior runs |

Do not hypothesize about code until environment is confirmed clean. Silent failures are environment failures 60% of the time.

### Step 3 — Build a minimal reproduction
Strip to the smallest case that still reproduces the failure. Use synthetic data. Run in isolation. If it doesn't reproduce — the failure is in what you removed. Add back one piece at a time.

### Step 4 — Form a single hypothesis
> "The failure is caused by [exact mechanism] in [exact location], triggered when [exact condition]. Evidence: [observed in Steps 1–3]."
No "probably". No "might be". A hypothesis is a testable claim.

### Step 5 — Design a single test
One test that falsifies or confirms the hypothesis. Not a fix — a test. If confirmed → `triage-issue` or `tdd`. If falsified → return to Step 4.

---

## Common Patterns
| Pattern | Signal | Check |
|---|---|---|
| Wrong hardware silently assigned | Wrong results, no error | Verify device before model load |
| Floating dependency broke interface | Works locally, fails in CI | `pip freeze` in both environments |
| API quota swallowed by retry loop | 429 never surfaces | Check retry logs |
| Distributed deadlock | Hangs 4+ hours, then timeout | Barrier call parity across all ranks |
| Corrupted checkpoint | Loss spikes on resume | Hash-verify before load |
