---
name: git-staging-guardian
description: >
  Verify exact Git paths before staging, committing, cleaning, or reporting repo status.
  Use when the user asks to commit, stage, zip, clean, or verify changes, especially on
  mobile/Codespaces workflows. Do NOT use for conceptual Git explanations.
category: development
tags: [git, staging, commit-safety, verification, codespaces]
target_llms: [all]
source: original
composable_with:
  - development/git-guardrails
---

# Git Staging Guardian

Make Git actions path-explicit and reversible.

## When to Use / Not Use

**Use when:** staging, committing, cleaning, zipping, or summarizing changes.

**Do NOT use when:** the user only asks for Git concept explanations.

## Process

1. Run or request `git status --short` and identify exact paths.
2. Separate tracked modifications, untracked project files, untracked disposable files, and ignored files.
3. Before `git add`, state the exact paths to stage and the exact paths to leave alone.
4. Use path-limited commands: `git add path1 path2`, never broad `git add .` unless the user explicitly approves all paths.
5. Before committing, show `git diff --staged --stat` and the intended commit message.
6. After commit, verify status again.

## Verification

- [ ] No broad staging happened without explicit approval.
- [ ] Untracked project-owned files were not accidentally ignored.
- [ ] Disposable files were not committed accidentally.
