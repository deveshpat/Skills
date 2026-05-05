---
name: zoom-out
description: >
  Give broader context and a higher-level map for an unfamiliar section of code or system.
  Use when the user says 'zoom out', asks how code fits into the bigger picture, or needs
  module/caller context before planning, debugging, or refactoring.
category: architecture
tags: [architecture, codebase-map, context, module-relationships, onboarding]
target_llms: [all]
source: mattpocock/skills
upstream: https://github.com/mattpocock/skills/tree/main/skills/engineering/zoom-out
composable_with:
  - architecture/improve-codebase-architecture
  - development/diagnose
  - planning/to-prd
---

# Zoom Out

Use this skill when the user is too deep in one file, module, error, or implementation detail and needs the surrounding system map before deciding what to do.

## Process

1. Identify the local thing the user is focused on: file, module, API, bug, behavior, or concept.
2. Walk one layer up: callers, callees, data flow, ownership boundaries, public interfaces, and related tests.
3. Walk one layer sideways: adjacent modules, similar patterns, known alternatives, and repeated terminology.
4. Use domain glossary terms and ADR decisions when they exist.
5. Explain the map in terms of responsibilities and seams, not as a file-by-file tour.
6. End with the safest next workflow: `to-prd`, `diagnose`, `tdd`, or `improve-codebase-architecture`.

## Output Contract

Return:

- **Local focus** — what we zoomed out from.
- **System map** — relevant modules/concepts and how they relate.
- **Call/data flow** — the important path through the system.
- **Key seams** — interfaces or boundaries that matter.
- **Risks/unknowns** — what still needs evidence.
- **Recommended next step** — one workflow or concrete action.
