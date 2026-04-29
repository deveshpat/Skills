# deveshpat/skills — Agent Prompt

You have access to a structured workflow library. Check the entry table, follow the matching embedded skill, or fetch the skill from:
`https://raw.githubusercontent.com/deveshpat/skills/main/ROUTER.md`

Fetch skills only when the request matches a trigger. Do not preload all skills or the full router.

---

## Entry Table

| Situation | Skill |
|---|---|
| Vague idea, not yet thought through | `grill-me` → `write-a-prd` |
| Clear idea, no requirements doc | `write-a-prd` |
| PRD exists, need implementation plan | `prd-to-plan` |
| Plan exists, need GitHub tickets | `prd-to-issues` |
| Bug, root cause unknown | `systematic-debugging` → `triage-issue` |
| Bug, root cause known | `triage-issue` → `tdd` |
| Feature or fix to implement | `tdd` |
| Architecture friction / file too long | fetch `improve-codebase-architecture` |
| Context window ≥ 80% or "compact" | `strategic-compact` |

For skills not embedded below: fetch ROUTER.md, then fetch the listed skill URL.

---

## SKILL: grill-me

**Trigger:** "grill me", "poke holes in this", "stress-test this", "what am I missing", "is this solid"

1. Identify the core claim or plan.
2. List the strongest assumptions behind it.
3. Attack from practical, technical, strategic, and sequencing angles.
4. Separate fatal flaws (blockers) from fixable weaknesses.
5. Offer a concrete revision for every flaw found.
6. End with a go/no-go recommendation.

**Output:** strongest point · top risks · hidden assumptions · missing evidence · improvements · go/no-go.

Do not flatter. Do not critique without offering a fix. Do not make every weakness a blocker.

---

## SKILL: systematic-debugging

**Trigger:** "failing silently", "can't reproduce", "it worked before", error is absent or misleading.
**Not:** when root cause is already known — use `tdd` directly.

1. Answer four questions verbatim before forming any hypothesis:
   - What was expected? (exact output or state)
   - What actually happened? (verbatim — one wrong word changes the diagnosis)
   - When did it last work? (last known-good commit or timestamp)
   - What changed? (deps, config, code, data)
   If Q2 cannot be answered verbatim, improve logging first. Do not hypothesize.
2. Isolate environment: runtime version, hardware, pinned vs floating deps, permissions, cached state. Do not hypothesize about code until environment is confirmed clean.
3. Build a minimal reproduction. Strip to the smallest case that still fails.
4. Form **one** hypothesis: *"Caused by [exact mechanism] at [exact location] when [exact condition]. Evidence: [above]."* No "probably." No "might be."
5. Design one test to falsify or confirm. If confirmed → `triage-issue` or `tdd`. If falsified → return to step 4.

---

## SKILL: tdd

**Trigger:** "build this feature", "implement X", "fix this bug", user provides an issue or feature description.
**Not:** planning-only or architecture-only requests.

**Core rule — vertical slices only:**
```
WRONG: RED: test1 test2 test3 → GREEN: impl1 impl2 impl3
RIGHT: RED→GREEN: test1→impl1, then test2→impl2, then test3→impl3
```

1. Confirm interface changes and which behaviors matter most. Get user approval.
2. Write ONE failing test (RED): observable behavior, public interface only, survives internal refactors.
3. Write minimal code to pass it (GREEN). No speculative features.
4. Repeat per behavior.
5. Refactor only after all tests are GREEN. Look for: duplication, shallow modules, long methods.

Never refactor while RED. If a test reaches behind the interface, the module is the wrong shape.

---

## SKILL: prd-to-plan

**Trigger:** "turn this PRD into a plan", "break into phases", "tracer bullets".
**Not:** without an existing PRD.

1. Confirm PRD is in context. If not, ask the user to paste it.
2. Identify durable architectural decisions: routes, schema, key models, auth approach, third-party seams.
3. Draft vertical slices — thin complete paths through every layer. Each must be demoable or independently verifiable.
4. Present as a numbered list (title + user stories per phase). Ask if granularity is right. Iterate until approved.
5. Write `./plans/<feature>.md` with: Architectural decisions header, then phases.

Never name a phase after a layer (Database, Backend, Frontend). Every phase must be independently verifiable.

---

## SKILL: strategic-compact

**Trigger:** "compact", context window ≥ 80%, agent is repeating information it already processed.
**Not:** preemptively on short sessions.

1. Sort the conversation into three buckets:
   - **Decisions** — irrevocable choices, agreed interfaces, confirmed root causes. Keep verbatim.
   - **Context** — background that shapes future decisions. Compress to 2–4 sentences.
   - **Noise** — tangents, repeated clarifications, routine output. Drop entirely.
2. Produce this output:

```
# Session Compact — <project> — <date>

## Decisions Made (verbatim)
- [Decision]: [exact agreed wording]

## Current State
[what was in progress, files/modules in-flight, blockers resolved and open]

## Compressed Context
[2–4 sentences — a briefing, not a history]

## Immediate Next Step
[one sentence, unambiguous, executable from only this compact]

## What to Discard
[one sentence naming topics safely forgotten]
```

Every irrevocable decision must be in Decisions Made. Never paraphrase decisions — paraphrasing mutates them across sessions. Total compact under 600 words. One next step only.

End with: *"Start a new session and paste this compact as your first message to resume exactly here."*
