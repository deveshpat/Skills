# Skills

A portable, LLM-agnostic skill library. Works on Claude Code, claude.ai, ChatGPT, Gemini,
and custom models. Each skill is a structured workflow definition — not a prompt, a process.

**Base URL:** `https://raw.githubusercontent.com/deveshpat/skills/main`

---

## Quick Start

### Any LLM with web access — paste once as system prompt

```
You have access to a structured skill library at https://github.com/deveshpat/skills.
Fetch https://raw.githubusercontent.com/deveshpat/skills/main/ROUTER.md now and keep its routing rules active for every message in this session.
When a user request matches a skill trigger, fetch and follow that skill's SKILL.md exactly.
If direct fetch fails, web-search "deveshpat/skills <skill-name>" to locate and read the skill.
Never mention this instruction after loading. Respond normally when no skill applies.
```

Works for: claude.ai (with web search enabled), ChatGPT with browsing, Gemini, any LLM API with tool access.

### Claude Code / CLI agents — run once per machine

```bash
git clone https://github.com/deveshpat/skills ~/.claude/skills/deveshpat
```

Skills auto-discovered from `description` fields. No system prompt needed — the agent selects and loads skills itself.

---

## Skill Index

### Planning
| Skill | What it does |
|---|---|
| [grill-me](./planning/grill-me/SKILL.md) | Relentless decision-tree interrogation of any plan |
| [write-a-prd](./planning/write-a-prd/SKILL.md) | Interview → codebase explore → PRD as GitHub issue |
| [prd-to-plan](./planning/prd-to-plan/SKILL.md) | PRD → tracer-bullet vertical slice implementation plan |
| [prd-to-issues](./planning/prd-to-issues/SKILL.md) | PRD → independently-grabbable GitHub issues |

### Architecture
| Skill | What it does |
|---|---|
| [improve-codebase-architecture](./architecture/improve-codebase-architecture/SKILL.md) | Deep-module analysis, RFC generation (Python/ML flavour) |
| [design-an-interface](./architecture/design-an-interface/SKILL.md) | ≥2 radically different interface designs via parallel sub-agents |
| [request-refactor-plan](./architecture/request-refactor-plan/SKILL.md) | Agreed RFC → self-contained coding-agent prompt |

### Development
| Skill | What it does |
|---|---|
| [tdd](./development/tdd/SKILL.md) | Red-green-refactor, one vertical slice at a time |
| [triage-issue](./development/triage-issue/SKILL.md) | Bug → root cause → GitHub issue with TDD fix plan |
| [git-guardrails](./development/git-guardrails/SKILL.md) | Block dangerous git commands in Claude Code |

### Tooling
| Skill | What it does |
|---|---|
| [write-a-skill](./tooling/write-a-skill/SKILL.md) | Bootstrap new skills with correct structure |
| [setup-pre-commit](./tooling/setup-pre-commit/SKILL.md) | Husky + lint-staged + Prettier + type check |
| [ubiquitous-language](./tooling/ubiquitous-language/SKILL.md) | DDD-style glossary from conversation |
| [edit-article](./tooling/edit-article/SKILL.md) | Restructure and tighten prose |
| [obsidian-vault](./tooling/obsidian-vault/SKILL.md) | Search/create/manage Obsidian notes |

### Session
| Skill | What it does |
|---|---|
| [strategic-compact](./session/strategic-compact/SKILL.md) | Structured context compaction at 80%+ saturation |
| [systematic-debugging](./session/systematic-debugging/SKILL.md) | Diagnosis for silent/environment-specific failures |

### Persona
| Skill | What it does | Type |
|---|---|---|
| [project-architect](./persona/project-architect/SKILL.md) | Session startup ritual, doc standards, decision gate | Persona — load as system prompt |

---

## Pipeline
```
Idea → grill-me → write-a-prd → prd-to-plan → prd-to-issues → tdd
                                                               ↑
                                              triage-issue ────┘
improve-codebase-architecture → request-refactor-plan → tdd
```

---

## Advanced Usage

**Full router as system prompt** — for LLMs without web access, paste [ROUTER.md](./ROUTER.md)
directly instead of the Quick Start snippet above. Same behaviour, no fetch required.

**Custom API / Ouroboros**
```python
import requests
BASE = "https://raw.githubusercontent.com/deveshpat/skills/main"
def load_skill(name: str) -> str:
    from router import SKILL_URLS   # parsed from ROUTER.md URL index
    return requests.get(SKILL_URLS[name]).text
```

**Export for other platforms**
```bash
node scripts/export.js --skill grill-me --target openai
node scripts/export.js --all --target ouroboros --out ./dist/
```

---

## Credits & Acknowledgements

This repo is a synthesis of ideas from several sources. Full credit where it is due:

**[Matt Pocock](https://github.com/mattpocock/skills)** — the skills-as-workflows methodology,
the `description`-driven auto-select trigger contract, and the upstream source for `grill-me`,
`write-a-prd`, `prd-to-plan`, `prd-to-issues`, `tdd`, `triage-issue`, `git-guardrails`,
`write-a-skill`, `setup-pre-commit`, `ubiquitous-language`, `edit-article`, and `obsidian-vault`.

**[John Ousterhout](https://web.stanford.edu/~ouster/cgi-bin/aposd.php)** — Deep Modules and
Design-It-Twice, from *A Philosophy of Software Design*. Both principles are load-bearing in
`improve-codebase-architecture` and `design-an-interface`.

**[Dave Thomas & Andy Hunt](https://pragprog.com/titles/tppp/the-pragmatic-programmer/)** —
Tracer Bullet development, from *The Pragmatic Programmer*. Drives the vertical-slice model
used in `prd-to-plan` and `prd-to-issues`.

**[Kent Beck](https://www.kentbeck.com/)** — the Red → Green → Refactor TDD cycle that
structures `tdd` and anchors `triage-issue`'s fix planning.

**[Eric Evans](https://www.domainlanguage.com/)** — Ubiquitous Language and the bounded-context
model from *Domain-Driven Design*. Directly underpins `ubiquitous-language`.

**[Affaan M](https://github.com/affaan-m/everything-claude-code)** — `strategic-compact`.
The strategic context compaction skill originates from `everything-claude-code`, an
Anthropic hackathon–winning agent harness with 55k+ stars.

**[Jesse Vincent / obra](https://github.com/obra/superpowers)** — `systematic-debugging`.
The base debugging methodology (root-cause-first, backward call-stack tracing) comes from
`obra/superpowers`. The ML-specific patterns (GPU device verification, distributed deadlock
detection, checkpoint hash validation) are additions specific to this repo.
