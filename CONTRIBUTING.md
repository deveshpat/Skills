# Contributing to Skill-Binder

This document is for maintainers and contributors. The README is intentionally user-facing; keep implementation, validation, and export details here.

---

## Source-of-truth model

- Canonical skill source: `<category>/<skill>/SKILL.md`
- Public discovery layer: `router.json`
- Chaining metadata: canonical frontmatter field `composable_with`; router emits it as `chains_to`
- Generated convenience bundles: `dist/`
- Human onboarding: `README.md`
- Embedded prompt pack: `AGENT.md`
- Synthesized project knowledge: `WIKI.md` and `wiki/`

Avoid copying exact skill metadata into prose docs unless a test protects the duplication. Prefer links to `router.json`, `dist/skills-index.md`, or the canonical `SKILL.md` file.

---

## Skill authoring contract

Every skill lives at:

```text
<category>/<skill>/SKILL.md
```

A skill should explain:

1. the problem it solves,
2. exact trigger phrases,
3. explicit counter-cases,
4. the process to follow,
5. expected outputs, and
6. any workflow handoff via `composable_with`.

Required frontmatter:

```yaml
name:
description:
category:
tags:
target_llms:
```

Optional frontmatter:

```yaml
source:
aliases:
upstream:
upstream_url:
inputs:
outputs:
composable_with:
```

All current canonical skills should remain LLM-agnostic with:

```yaml
target_llms: [all]
```

Use [SKILL_TEMPLATE.md](./SKILL_TEMPLATE.md) when adding a new skill.

---

## Validation commands

Run the full test suite:

```bash
node --test
```

Validate canonical skills and documentation drift:

```bash
node scripts/validate-skills.js
```

Regenerate `router.json` from canonical `SKILL.md` frontmatter:

```bash
node scripts/validate-skills.js --write-router
```

Validate export generation without writing files:

```bash
node scripts/export.js --all --target all --validate
```

Generate generic bundles under `dist/`:

```bash
node scripts/export.js --all --target all
```

---

## Generated files

The `dist/` directory is a convenience layer, not the canonical source. Regenerate it after changing skill frontmatter or skill bodies.

Current generated targets:

- `dist/all-skills.md`
- `dist/skills-index.md`
- `dist/minimal-system-prompt.md`
- `dist/categories/*.md`

Do not edit generated files by hand unless you also update the generator or intentionally accept regeneration overwriting the change.

---

## Documentation locality

Keep docs shallow at the right place:

| Document | Owns |
|---|---|
| `README.md` | human-facing overview, quick start, workflow recipes |
| `AGENT.md` | compact embedded agent prompt and most-used workflows |
| `CONTRIBUTING.md` | authoring, validation, router/export mechanics |
| `WIKI.md` | wiki schema and maintenance conventions |
| `wiki/` | synthesized understanding, trigger patterns, workflow gotchas |
| `router.json` | machine-readable skill discovery |
| `dist/` | generated convenience bundles |

The wiki should capture synthesized understanding, not restate obvious `SKILL.md` metadata. If a fact can be read directly from `router.json` or frontmatter, link to the source instead of copying it.

---

## Doc-drift rules

Doc-drift checks live in `scripts/lib/doc-lint.js` and are used by both tests and `scripts/validate-skills.js`.

Current checks cover:

- obsolete persona skill file references,
- incorrect canonical skill path placeholders,
- obsolete router filenames,
- stale non-agnostic `target_llms` claims, and
- broken local Markdown links.

Add new rules there when a stale documentation pattern is discovered. Keep tests in `test/doc-drift.test.js` focused on repo-wide invariants rather than one-off prose wording.
