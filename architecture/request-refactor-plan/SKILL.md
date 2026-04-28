---
name: request-refactor-plan
description: Generate a precise coding-agent prompt for a refactor after architecture direction is known. Use when the user wants an implementation prompt, not when they want you to perform the refactor directly.
category: architecture
tags:
  - refactor
  - prompt
  - coding-agent
  - architecture
target_llms:
  - claude-code
  - chatgpt
composable_with:
  - architecture/improve-codebase-architecture
  - development/tdd
---

# Request Refactor Plan

Use this skill to turn an architectural decision into an implementation-ready coding-agent prompt.

## When to Use

Use this when:
- the architecture direction is already known;
- the user wants a prompt for another coding agent;
- the task should be scoped, staged, and verifiable;
- the user needs guardrails against broad, unsafe rewrites.

Do not use this when the user is still asking for architectural diagnosis. In that case, use `improve-codebase-architecture` first.

## Inputs

Collect or infer:
- repository/project name;
- current pain point;
- target files/modules;
- constraints and non-goals;
- expected verification commands;
- expected output format.

## Process

1. Restate the refactor objective in one sentence.
2. Identify exact files or areas to inspect first.
3. Specify what must change and what must not change.
4. Require a plan before edits if the work is risky.
5. Require small, reviewable changes.
6. Require tests, static checks, or manual verification.
7. Require a final summary with changed files and verification results.

## Output Contract

Produce a prompt that includes:
- context;
- objective;
- constraints;
- implementation steps;
- verification checklist;
- explicit stop conditions;
- expected final response format.

## Verification

The prompt is successful only if a coding agent can execute it without inventing missing context or making broad unrelated changes.

## What NOT to Do

- Do not ask for a vague “clean up the codebase.”
- Do not authorize unrelated rewrites.
- Do not omit verification.
- Do not let the coding agent decide the project’s architecture from scratch.
