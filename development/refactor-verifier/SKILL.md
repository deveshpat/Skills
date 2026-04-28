---
name: refactor-verifier
description: >
  Verify that a refactor changed the intended entrypoints and behavior, not merely added
  scaffolding. Use after architecture or implementation refactors to prove old paths call
  new modules and tests cover the new seams. Do NOT use for brand-new features without a refactor.
category: development
tags: [refactor, verification, entrypoints, tests, scaffolding]
target_llms: [all]
source: original
composable_with:
  - development/tdd
  - development/git-staging-guardian
---

# Refactor Verifier

Prove the refactor is wired, not merely present.

## When to Use / Not Use

**Use when:** a refactor has supposedly moved logic, deepened modules, or changed entrypoints.

**Do NOT use when:** no existing behavior was moved or preserved.

## Process

1. Identify intended entrypoints and behavior that must remain unchanged.
2. Identify new modules/seams introduced by the refactor.
3. Trace old entrypoints to confirm they now call the new implementation path.
4. Search for duplicate old logic that should have been removed.
5. Run focused tests through public interfaces, not just new unit tests for scaffolding.
6. Compare line count or file presence only as secondary evidence, never as proof.
7. Produce a verification table.

## Output Format

```md
| Intended change | Evidence | Test/command | Status |
|---|---|---|---|
```

## Verification

- [ ] Every old entrypoint reaches the new path or is deliberately removed.
- [ ] No orphan scaffolding is counted as success.
- [ ] Tests exercise behavior through public interfaces.
