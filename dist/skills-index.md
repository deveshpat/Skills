# Skills index

Generated from canonical SKILL.md frontmatter.

## Architecture

| Skill | Trigger contract | Chains to |
|---|---|---|
| [improve-codebase-architecture](../architecture/improve-codebase-architecture/SKILL.md) | Find deep-module opportunities in a codebase, surface architectural friction, generate an RFC. Triggers: 'architecture review', 'refactor', 'too much duplication', 'DRY', 'this file is too long'. Do NOT trigger for bug fixes or new features. | `development/tdd`<br>`development/triage` |
| [zoom-out](../architecture/zoom-out/SKILL.md) | Give broader context and a higher-level map for an unfamiliar section of code or system. Use when the user says 'zoom out', asks how code fits into the bigger picture, or needs module/caller context before planning, debugging, or refactoring. | `architecture/improve-codebase-architecture`<br>`development/diagnose`<br>`planning/to-prd` |

## Development

| Skill | Trigger contract | Chains to |
|---|---|---|
| [diagnose](../development/diagnose/SKILL.md) | Disciplined diagnosis loop for hard bugs, silent failures, flaky behavior, and performance regressions: build feedback loop, reproduce, hypothesize, instrument, fix, regression-test. Triggers: 'diagnose this', 'debug this', 'failing silently', 'can't reproduce', 'it worked before', performance regression, or /diagnose. Do NOT use when the root cause is already known. | `development/triage`<br>`development/tdd`<br>`architecture/improve-codebase-architecture` |
| [git-guardrails](../development/git-guardrails/SKILL.md) | Set up Claude Code hooks blocking dangerous git commands such as push, reset --hard, clean, destructive branch deletion, and whole-tree checkout before they execute. Triggers: 'set up git guardrails', 'protect my git', 'prevent accidental push'. Do NOT trigger if equivalent guardrails already exist. | `tooling/setup-pre-commit` |
| [git-staging-guardian](../development/git-staging-guardian/SKILL.md) | Verify exact Git paths before staging, committing, cleaning, or reporting repo status. Use when the user asks to commit, stage, zip, clean, or verify changes, especially on mobile/Codespaces workflows. Do NOT use for conceptual Git explanations. | `development/git-guardrails` |
| [tdd](../development/tdd/SKILL.md) | Test-driven development with strict red-green-refactor loop, one vertical slice at a time. Triggers: 'build this feature', 'implement X', 'fix this bug', user provides an issue or feature description. Do NOT trigger for planning-only or architecture-only requests. | `development/triage` |
| [triage](../development/triage/SKILL.md) | Triage issues through a lightweight state machine and prepare bugs or feature requests for humans or AFK agents. Triggers: 'triage this', 'review incoming issues', 'prepare this issue', 'investigate this bug', 'find the root cause', or /triage. Do NOT use when the user wants immediate implementation and the work is already specified. | `planning/grill-with-docs`<br>`development/diagnose`<br>`development/tdd` |

## Planning

| Skill | Trigger contract | Chains to |
|---|---|---|
| [grill-me](../planning/grill-me/SKILL.md) | Stress-test an idea, plan, PRD, or decision before execution. Use when the user asks to be challenged, wants holes found, or asks what they are missing. | `planning/to-prd`<br>`planning/prd-to-plan`<br>`tooling/write-a-skill` |
| [grill-with-docs](../planning/grill-with-docs/SKILL.md) | Stress-test a plan against the existing codebase, domain glossary, and documented decisions. Use when the user wants to be grilled but the answer depends on project terminology, CONTEXT.md, ADRs, or current implementation behavior. | `planning/to-prd`<br>`architecture/improve-codebase-architecture` |
| [prd-to-plan](../planning/prd-to-plan/SKILL.md) | Turn a PRD into a multi-phase implementation plan using tracer-bullet vertical slices, saved as a local Markdown file in ./plans/. Use when the user wants to break down a PRD, create an implementation plan, plan phases from a PRD, or mentions 'tracer bullets'. Do NOT trigger without an existing PRD. | `planning/to-issues` |
| [to-issues](../planning/to-issues/SKILL.md) | Break a plan, spec, or PRD into independently-grabbable issues using tracer-bullet vertical slices. Triggers: 'create issues', 'slice into tickets', 'turn this plan into issues', 'implementation tickets', or /to-issues. Do NOT trigger without a plan, spec, PRD, or issue reference to work from. | `development/tdd` |
| [to-prd](../planning/to-prd/SKILL.md) | Turn the current conversation context and codebase understanding into a structured PRD, optionally filed in the project issue tracker. Triggers: 'create a PRD', 'write a PRD', 'spec this out', 'turn this into requirements', or /to-prd. Do NOT interview by default; synthesize what is already known and ask only genuinely blocking clarifications. | `planning/prd-to-plan` |

## Productivity

| Skill | Trigger contract | Chains to |
|---|---|---|
| [caveman](../productivity/caveman/SKILL.md) | Ultra-compressed communication mode that cuts filler, articles, hedging, and pleasantries while keeping full technical accuracy. Use when user says 'caveman mode', 'talk like caveman', 'use caveman', 'less tokens', 'be brief', or invokes /caveman. | — |

## Session

| Skill | Trigger contract | Chains to |
|---|---|---|
| [strategic-compact](../session/strategic-compact/SKILL.md) | Structured context compaction for long-running sessions approaching context limits. Use when context window is at or above 80% capacity, when the user says "compact", "summarize state", "we're running out of context", or when you detect context saturation. Preserves exactly what is needed to resume work without loss. Do NOT trigger preemptively on short sessions. | — |

## Tooling

| Skill | Trigger contract | Chains to |
|---|---|---|
| [edit-article](../tooling/edit-article/SKILL.md) | Edit prose for clarity, structure, argument flow, concision, and reader impact. Use when the user provides an article, draft, essay, post, or long-form writing to improve. | — |
| [llm-wiki](../tooling/llm-wiki/SKILL.md) | Build and maintain a persistent, LLM-compiled wiki that accumulates project knowledge across sessions. The project's own files are the source — no duplication. The wiki is a synthesized understanding layer (patterns, decisions, gotchas, prompt behaviors) that reduces re-explanation overhead for both user and LLM. Triggers: 'set up a wiki', 'synthesize wiki page for X', 'what do we know about X', 'update the wiki', 'distill this session', 'lint the wiki'. Do NOT trigger for one-off questions with no intent to persist the answer. | `session/strategic-compact` |
| [obsidian-vault](../tooling/obsidian-vault/SKILL.md) | Search, create, and manage notes in an Obsidian vault with wikilinks and index notes. Triggers: 'search my notes', 'create a note', 'find in Obsidian', 'link these notes'. Do NOT trigger for non-Obsidian systems. | — |
| [setup-pre-commit](../tooling/setup-pre-commit/SKILL.md) | Set up Husky pre-commit hooks with lint-staged, Prettier, type checking, and tests. Triggers: 'set up pre-commit', 'add Husky', 'add lint-staged', 'format on commit'. Do NOT trigger for Python-only projects without Node. | `development/git-guardrails` |
| [skill-audit](../tooling/skill-audit/SKILL.md) | Audit an agent-skills repository as a workflow runtime: router, README, frontmatter, filesystem layout, bundled resources, local links, source attribution, placeholders, trigger breadth, and composability drift. Use when the user asks to scrutinize or improve a skills repo. Do NOT use for normal codebase refactors. | `tooling/write-a-skill` |
| [write-a-skill](../tooling/write-a-skill/SKILL.md) | Bootstrap new skills with correct SKILL.md structure, progressive disclosure, and bundled resources. Triggers: 'write a new skill', 'create a skill for X', 'add a skill to my skills repo'. | `tooling/skill-audit` |
