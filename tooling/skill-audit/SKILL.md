---
name: skill-audit
description: >
  Audit an agent-skills repository as a workflow runtime: router, README, frontmatter,
  filesystem layout, bundled resources, local links, source attribution, placeholders,
  trigger breadth, and composability drift. Use when the user asks to scrutinize or
  improve a skills repo. Do NOT use for normal codebase refactors.
category: tooling
tags: [skills, audit, validation, router, metadata]
target_llms: [all]
source: original
composable_with:
  - tooling/write-a-skill
---

# Skill Audit

Audit a skills repository as a workflow runtime, not as a loose prompt collection.

## When to Use / Not Use

**Use when:** the user asks to inspect, validate, improve, or debug an agent skills repository.

**Do NOT use when:** the user wants to write application code or improve a normal codebase module.

## Process

1. Identify the canonical contract: README promises, router behavior, template schema, and export/validation tooling.
2. Inventory filesystem skills and every `SKILL.md`.
3. Validate frontmatter shape, required fields, and slug/name alignment.
4. Compare README, ROUTER, registry, filesystem, and exported metadata.
5. Check local links, bundled scripts/resources, and upstream attribution.
6. Flag placeholders, thin workflows, contradictory trigger/body instructions, broad triggers, and invalid `composable_with` targets.
7. Produce confirmed defects separately from design recommendations.
8. Recommend a patch order that fixes parser/registry foundations before workflow content.

## Output Format

```md
## Confirmed defects
- Finding, evidence, impact, fix

## Design risks
- Risk, why it matters, recommended direction

## Patch order
1. Foundation fixes
2. Registry/tooling fixes
3. Skill content fixes
4. New skills or workflow additions
```

## Verification

- [ ] Every confirmed defect has a file/path or source reference.
- [ ] Recommendations distinguish blocking parser failures from content quality issues.
- [ ] Patch order avoids fixing generated files before their generator/source of truth.
