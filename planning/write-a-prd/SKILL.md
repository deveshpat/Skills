---
name: write-a-prd
description: >
  Synthesize the current conversation and codebase context into a structured PRD,
  usually filed as a GitHub issue. Triggers: 'write a PRD', 'spec this out',
  'turn this into requirements'. Do NOT trigger when a PRD already exists, when
  the user wants implementation now, or when the user explicitly asks to be grilled first.
category: planning
tags: [planning, prd, requirements, github-issue]
target_llms: [all]
source: mattpocock/skills
upstream: https://github.com/mattpocock/skills/tree/main/to-prd
aliases: [to-prd]
composable_with:
  - planning/prd-to-plan
---

# Write a PRD

This skill takes the current conversation context and codebase understanding and produces a PRD. Do **not** run a fresh interview by default. If truly blocking information is missing, ask the smallest possible clarification; otherwise synthesize what is already known.

## When to Use / Not Use

**Use when:** the user wants a PRD, requirements document, product spec, or GitHub issue from context already provided.

**Do NOT use when:** the user asks to implement now, already has a PRD, or asks to be challenged first. Use `grill-me` first when the problem is still vague.

## Process

1. Explore the repo to understand current architecture and existing patterns, if that has not already happened.
2. Sketch the major modules that must be built or modified. Look for opportunities to extract deep modules that can be tested in isolation.
3. Confirm only genuinely load-bearing uncertainties. Do not interview the user just to fill a template.
4. Write the PRD using the output format below and submit/file it where the user asked.

## Output Format

```md
## Problem Statement
The problem from the user's perspective.

## Solution
The solution from the user's perspective.

## User Stories
1. As a <role>, I want <capability>, so that <outcome>.

## Implementation Decisions
- Modules to build/modify
- Interfaces to change
- Technical clarifications
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include volatile file paths or code snippets.

## Testing Decisions
- What makes a good test for this feature
- Which modules will be tested
- Similar tests or prior art in the codebase

## Out of Scope
Explicitly excluded work.

## Further Notes
Useful context that did not fit elsewhere.
```

## Verification

- [ ] PRD uses current context rather than inventing requirements.
- [ ] Open questions are truly blocking.
- [ ] Implementation decisions avoid brittle file-path commitments.
- [ ] Testing decisions focus on public behavior.
