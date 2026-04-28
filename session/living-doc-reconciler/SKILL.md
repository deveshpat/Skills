---
name: living-doc-reconciler
description: >
  Reconcile project living documents with logs, commits, checkpoints, issues, and other
  signals before declaring project state. Use when resuming projects, compacting sessions,
  or updating status docs. Do NOT use for generic summarization without durable project state.
category: session
tags: [living-docs, status, reconciliation, logs, project-state]
target_llms: [all]
source: original
composable_with:
  - persona/project-architect
  - persona/ml-engineer
  - session/strategic-compact
---

# Living Doc Reconciler

Keep living project documents aligned with evidence.

## When to Use / Not Use

**Use when:** resuming a multi-session project, updating `BLUEPRINT.md`, compacting handoff state, or reconciling logs/checkpoints/commits with declared status.

**Do NOT use when:** the user only wants a casual summary or there is no durable project state document.

## Process

1. Identify the living document(s): `BLUEPRINT.md`, `CONTEXT.md`, `terminal_logs.md`, plans, ADRs, issue queue, or project-specific equivalents.
2. Identify evidence sources: git status/log, test output, terminal logs, checkpoints, W&B/TensorBoard runs, issue state, and generated artifacts.
3. Compare claimed state against evidence.
4. Mark each claim as confirmed, stale, contradicted, or unknown.
5. Update living docs only where evidence supports the change.
6. Preserve project-owned signal files; do not classify them as disposable output.

## Output Format

```md
## Reconciliation

| Claim | Evidence | Status | Doc update |
|---|---|---|---|

## Current State
- Confirmed state
- Stale/contradicted items fixed
- Unknowns and next verification step
```

## Verification

- [ ] No status claim is updated without an evidence source.
- [ ] Contradictions are called out explicitly.
- [ ] Project-owned logs/signals are preserved.
