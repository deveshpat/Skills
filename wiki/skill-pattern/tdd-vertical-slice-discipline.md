---
title: TDD vertical slice discipline
type: skill-pattern
sources:
  - development/tdd/SKILL.md
  - development/tdd/tests.md
updated: 2026-04-30
---

# TDD vertical slice discipline

## The core insight

The TDD skill's most important rule is not red-green-refactor — it's **one slice at a time**.
The horizontal anti-pattern (write all tests, then all code) is explicitly called out as producing
"crap tests" because tests written in bulk test *imagined* behavior, not *actual* behavior.
The value of vertical slicing is epistemic: you only know what to test for after writing the code
that tells you what matters.

## How to recognize the anti-pattern mid-session

If a coding agent proposes a test plan covering 5+ behaviors before writing any implementation,
it is horizontal slicing. Interrupt and redirect: "One test → one implementation → repeat."

## What "public interface only" actually means

Tests must cross the same seam callers cross. If a test needs to reach behind the interface
(directly querying a database, calling a private method, asserting on mock call counts), the
module is the wrong shape — not the test. The fix is to reshape the module's interface,
not to write the test anyway.

The mocking rule is a corollary: mock only at system boundaries (external APIs, databases,
time, filesystem). Never mock your own collaborators.

## The refactor step is conditional

Refactoring happens only after all tests are GREEN, and only when there's actual friction:
duplication, shallow modules, long methods, feature envy. It is not a mandatory fourth step.
Many TDD cycles end at GREEN with no refactor needed.

## Common misuse

Triggering `tdd` for architecture-only or planning-only requests. The description says
"Do NOT trigger for planning-only or architecture-only requests." If the user hasn't decided
what to build yet, route to `grill-me` or `to-prd` first.
