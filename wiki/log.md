# Wiki Log

Append-only. Newest first.

## [2026-05-05] upstream-deprecated-skill-cleanup | Skill-Binder

Audited against current mattpocock/skills upstream. Retired upstream-deprecated `design-an-interface` and `ubiquitous-language` from canonical discovery, rewrote README/AGENT/minimal prompt around Skill-Binder and caveman-style arrow convention, regenerated router/dist, and added tests/doc-drift guards so deprecated active skill references do not return.
Sources read: README.md, router.json, scripts/validate-skills.js, scripts/export.js, planning/grill-with-docs/SKILL.md, tooling/write-a-skill/SKILL.md, tooling/obsidian-vault/SKILL.md.

## [2026-05-05] docs-drift-cleanup | Skill-Binder

Clarified that Project Architect is a README persona prompt, not a skill. Updated the fuzzy idea chain to make `improve-codebase-architecture` an optional preflight before `grill-me` when architecture/codebase health is explicitly in scope.
Sources read: README.md, router.json, architecture/improve-codebase-architecture/SKILL.md, planning/grill-me/SKILL.md, planning/to-prd/SKILL.md, planning/prd-to-plan/SKILL.md, planning/to-issues/SKILL.md, development/tdd/SKILL.md.

## [2026-04-30] init | Skill-Binder

Initialized wiki. Schema defined in WIKI.md with three page types: skill-pattern, chain, decision.
Synthesized starter pages from existing SKILL.md content and README persona guidance in context.
Sources read: development/tdd/SKILL.md, planning/grill-me/SKILL.md, planning/to-prd/SKILL.md,
development/diagnose/SKILL.md, development/triage/SKILL.md, README.md.
