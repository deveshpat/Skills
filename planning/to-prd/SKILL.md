---
name: to-prd
description: >
  Turn the current conversation context and codebase understanding into a structured PRD,
  optionally filed in the project issue tracker. Triggers: 'create a PRD', 'write a PRD',
  'spec this out', 'turn this into requirements', or /to-prd. Do NOT interview by default;
  synthesize what is already known and ask only genuinely blocking clarifications.
category: planning
tags: [planning, prd, requirements, github-issue, deep-modules]
target_llms: [all]
source: mattpocock/skills
upstream: https://github.com/mattpocock/skills/tree/main/skills/engineering/to-prd
aliases: [write-a-prd]
composable_with:
  - planning/prd-to-plan
---

# To PRD

This skill turns the current conversation context and repo understanding into a PRD. Do **not** restart discovery or interview the user by default. Synthesize what is already known, then ask only for information that blocks a correct PRD.

## When to Use / Not Use

**Use when:** the user wants a PRD, requirements document, product spec, implementation brief, or issue-ready specification from current context.

**Do NOT use when:** the user asks to implement now, already has an approved PRD, or explicitly wants critique first. Use `grill-me` or `grill-with-docs` first when the idea is still vague or the codebase/domain language needs challenging.

## Process

1. Explore the repo if needed. Use the project's domain glossary vocabulary when available, and respect ADRs that cover the area being changed.
2. Sketch the major modules that must be built or modified. Look for deep-module opportunities: simple, testable interfaces that encapsulate meaningful complexity.
3. Check only load-bearing uncertainties with the user: module boundaries, test scope, irreversible decisions, or unresolved product behavior. Do not ask filler questions just to complete a template.
4. Write the PRD using the output format below. If an issue tracker is configured and the user asked for filing, publish it and apply the appropriate triage label.

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
- [ ] If filed as an issue, it enters the configured triage flow.
