---
name: git-guardrails-claude-code
description: >
  Set up Claude Code hooks blocking dangerous git commands (push, reset --hard, clean) before they execute. Triggers: 'set up git guardrails', 'protect my git', 'prevent accidental push'. Do NOT trigger if guardrails already exist.
category: development
tags: [git, safety, hooks, claude-code, protection]
target_llms: [all]
source: mattpocock/skills
composable_with:
  - tooling/setup-pre-commit
---

> **Content source:** [mattpocock/skills/git-guardrails-claude-code](https://github.com/mattpocock/skills/tree/main/git-guardrails-claude-code)
> Install full content: `npx skills@latest add mattpocock/skills/git-guardrails-claude-code`

Replace this file's body with the upstream SKILL.md content after installing.
The frontmatter above is already correctly structured for this repo.
