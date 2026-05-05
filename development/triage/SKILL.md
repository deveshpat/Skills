---
name: triage
description: >
  Triage issues through a lightweight state machine and prepare bugs or feature requests for
  humans or AFK agents. Triggers: 'triage this', 'review incoming issues', 'prepare this issue',
  'investigate this bug', 'find the root cause', or /triage. Do NOT use when the user wants
  immediate implementation and the work is already specified.
category: development
tags: [triage, github-issues, root-cause, issue-workflow, agent-brief, tdd]
target_llms: [all]
source: mattpocock/skills
upstream: https://github.com/mattpocock/skills/tree/main/skills/engineering/triage
aliases: [triage-issue]
composable_with:
  - planning/grill-with-docs
  - development/diagnose
  - development/tdd
---

# Triage

Move issues, bugs, and feature requests through a small state machine until they are ready for a human, an AFK agent, or closure.

Every issue comment posted during triage should disclose that it was AI-generated, unless the user's repo has a different required disclaimer.

## Process

### 1. Understand the request

Interpret the user's triage request. Common modes:

- Show what needs attention.
- Triage a specific issue.
- Investigate a reported bug and file a fix plan.
- Move an issue to a specific state.
- Prepare an agent brief for implementation.

If no issue tracker is configured, output the same recommendations and issue/comment bodies locally instead of pretending to publish them.

### 2. Apply the triage state model

Use these canonical roles even if the actual tracker labels differ:

- Category: `bug` or `enhancement`
- State: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, or `wontfix`

Every triaged issue should have exactly one category and one state. If labels conflict, flag it before changing anything.

State flow:

- Unlabeled → `needs-triage`
- `needs-triage` → `needs-info`, `ready-for-agent`, `ready-for-human`, or `wontfix`
- `needs-info` → `needs-triage` once the reporter answers

The maintainer can override the state at any time. For explicit state overrides, confirm the action, then apply it.

### 3. Triage a specific issue

1. Gather context: body, comments, current labels, reporter, dates, and prior triage notes.
2. Explore relevant code using domain glossary vocabulary and ADRs where available.
3. Surface any prior rejection, out-of-scope note, or duplicate pattern if the repo tracks those.
4. Recommend category and state with reasoning.
5. For bugs, attempt reproduction before grilling. Report successful repro, failed repro, or insufficient detail.
6. If the issue needs fleshing out, run `grill-with-docs` so questions are grounded in the codebase and domain docs.

### 4. Prepare the outcome

- `ready-for-agent`: post or output an agent brief with problem, context, acceptance criteria, test strategy, and constraints.
- `ready-for-human`: produce the same structure, but explain why it needs human judgment or access.
- `needs-info`: write specific, actionable questions and capture what is already established.
- `wontfix`: explain politely. For enhancements, record the reusable rationale where the repo stores out-of-scope decisions.
- `needs-triage`: apply the state and optionally add a partial-progress note.

### 5. Bug investigation handoff

When the task is root-cause investigation, produce a durable issue-ready fix plan:

```md
## Problem
Actual behavior, expected behavior, and reproduction steps.

## Root Cause Analysis
The failing behavior, involved domain/module, and why the current behavior fails.
Avoid volatile file paths and line numbers unless the user asked for implementation detail.

## TDD Fix Plan
1. RED: Write a test that captures <observable broken behavior>.
   GREEN: Make the minimal change to pass.

## Acceptance Criteria
- [ ] Reproduction no longer fails.
- [ ] New regression test passes.
- [ ] Existing tests still pass.
```

If the root cause is not known yet, hand off to `diagnose` before writing a fix plan.

## Resuming a Previous Session

Read prior triage notes first. Do not re-ask resolved questions. Update the state from the latest reporter or maintainer activity.
