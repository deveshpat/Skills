---
name: artifact-classifier
description: >
  Classify files and generated outputs before cleanup, staging, refactoring, or deletion:
  project-owned artifact, generated disposable artifact, external cache, log/signal file,
  or user-owned document. Use when there is risk of deleting or ignoring important artifacts.
  Do NOT use for ordinary file listings with no action planned.
category: tooling
tags: [artifacts, cleanup, safety, classification, project-state]
target_llms: [all]
source: original
composable_with:
  - development/git-staging-guardian
  - session/living-doc-reconciler
---

# Artifact Classifier

Prevent the agent from treating project-owned artifacts as disposable output.

## When to Use / Not Use

**Use when:** deleting, cleaning, archiving, ignoring, staging, or summarizing files where ownership is uncertain.

**Do NOT use when:** no file action is planned or the user already identified the file's role.

## Process

1. List candidate artifacts and the intended action.
2. Classify each artifact as one of:
   - **Project-owned**: source, docs, logs, notebooks, or state files that belong in the repo.
   - **Generated but committed**: reproducible outputs intentionally versioned.
   - **Generated disposable**: build products, caches, temporary exports.
   - **External/local cache**: machine-specific state that should not be committed.
   - **User-owned document**: uploaded/user files that must not be mutated without explicit instruction.
3. For uncertain files, inspect references from README, scripts, docs, tests, and git history when available.
4. Only then recommend staging, deletion, `.gitignore`, or preservation.

## Output Format

```md
| Path | Classification | Evidence | Safe action |
|---|---|---|---|
```

## Verification

- [ ] Every destructive action has classification evidence.
- [ ] Project-owned logs/state files are preserved unless user explicitly says otherwise.
