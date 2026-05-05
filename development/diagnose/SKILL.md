---
name: diagnose
description: >
  Disciplined diagnosis loop for hard bugs, silent failures, flaky behavior, and performance
  regressions: build feedback loop, reproduce, hypothesize, instrument, fix, regression-test.
  Triggers: 'diagnose this', 'debug this', 'failing silently', 'can't reproduce', 'it worked
  before', performance regression, or /diagnose. Do NOT use when the root cause is already known.
category: development
tags: [debugging, diagnosis, reproduction, instrumentation, root-cause, regression-test]
target_llms: [all]
source: mattpocock/skills + community/obra/superpowers
upstream: https://github.com/mattpocock/skills/tree/main/skills/engineering/diagnose
aliases: [systematic-debugging]
composable_with:
  - development/triage
  - development/tdd
  - architecture/improve-codebase-architecture
---

# Diagnose

A discipline for hard bugs. Skip phases only when explicitly justified. Go from "something is wrong" to "I know exactly what is wrong and why" before touching production code.

When exploring the codebase, use the project's domain glossary vocabulary when available and check ADRs in the area being touched.

## Process

### Phase 1 — Build a feedback loop

This is the core of the skill. If you have a fast, deterministic, agent-runnable pass/fail signal for the bug, the rest becomes systematic: bisection, hypothesis testing, instrumentation, and regression tests all consume that signal.

Try feedback loops in roughly this order:

1. Failing test at the seam that reaches the bug: unit, integration, or end-to-end.
2. HTTP or CLI script against a running service.
3. CLI invocation with fixture input and snapshot/diff output.
4. Headless browser script that asserts on DOM, console, or network behavior.
5. Replay of a captured trace, payload, event log, HAR, or fixture.
6. Throwaway harness around the minimal subsystem.
7. Property or fuzz loop for intermittent wrong-output bugs.
8. Bisection harness for regressions between known states.
9. Differential loop comparing old vs. new version, data, or config.
10. HITL script as last resort when a human must click; capture structured output.

Iterate on the loop itself: make it faster, sharper, and more deterministic. A slow flaky loop is barely better than no loop.

For non-deterministic bugs, increase the reproduction rate through repeated runs, stress, parallelism, seed control, or timing probes until the bug is debuggable.

If you cannot build a loop, say so explicitly. List what you tried and ask for access, captured artifacts, or permission to add temporary instrumentation. Do not hypothesize without a loop.

### Phase 2 — Reproduce

Run the loop and watch the bug appear. Confirm:

- The loop reproduces the user's actual failure mode, not a nearby different failure.
- The failure reproduces reliably enough to debug against.
- The exact symptom is captured: error message, wrong output, timing, state, or missing effect.

Do not proceed until you reproduce the bug or clearly document why reproduction is impossible.

### Phase 3 — Hypothesize

Generate three to five ranked, falsifiable hypotheses before testing any one of them. Each hypothesis must state a prediction:

> If <cause> is the cause, then <probe/change> will make the bug disappear, move, or get worse.

If you cannot state the prediction, the hypothesis is a vibe. Discard or sharpen it.

Show the ranked list to the user when useful. They may have domain context that cheaply re-ranks it. If the user is AFK, proceed with your ranking.

### Phase 4 — Instrument

Each probe must map to a specific prediction from Phase 3. Change one variable at a time.

Tool preference:

1. Debugger, REPL, or inspector if available.
2. Targeted logs at boundaries that distinguish hypotheses.
3. Never "log everything and grep".

Tag temporary debug logs with a unique prefix such as `[DEBUG-a4f2]` so cleanup is a single search.

For performance regressions, establish a baseline measurement first, then bisect. Measure first, fix second.

### Phase 5 — Fix + regression test

Write the regression test before the fix, but only at a correct seam: one that exercises the real bug pattern as it occurs at the call site.

If no correct seam exists, document that finding. The architecture may be preventing the bug from being locked down.

If a correct seam exists:

1. Turn the minimized reproduction into a failing test.
2. Watch it fail.
3. Apply the minimal fix.
4. Watch it pass.
5. Re-run the original, unminimized feedback loop.

### Phase 6 — Cleanup + post-mortem

Before declaring done:

- Original reproduction no longer reproduces.
- Regression test passes, or absence of a correct seam is documented.
- Temporary `[DEBUG-...]` instrumentation is removed.
- Throwaway prototypes are deleted or moved to a clearly marked debug location.
- The confirmed root cause is summarized in the issue, PR, or final report.

Then ask what would have prevented the bug. If the answer involves no good test seam, tangled callers, hidden coupling, or shallow modules, hand off to `improve-codebase-architecture` with specifics after the fix is in.
