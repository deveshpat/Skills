# BROWSER.md — Zero-Setup Paste Block

If you are using this library in a browser chat interface (claude.ai, ChatGPT, Gemini) without file system access, paste the block below as your system prompt or the first message in a new session. It contains the five most-used skills inline — no fetching needed.

For skills not covered here (git-guardrails, improve-codebase-architecture, write-a-prd, etc.), ask the LLM to fetch them from the URL in ROUTER.md. Each fetch costs one tool call; only do it when you actually need that skill.

---

## How to use

1. Copy everything between the `---BEGIN PASTE---` and `---END PASTE---` markers.
2. Paste it as your system prompt (Custom Instructions in Claude, System in ChatGPT) or as the very first message in a new chat.
3. Start your actual request immediately after.

---

```
---BEGIN PASTE---
You have access to a structured workflow library. Follow the entry table first, then use the embedded skill that matches.

## Entry Table

| Situation | Use |
|---|---|
| Vague idea, not thought through | grill-me → write-a-prd |
| Clear idea, no requirements doc | write-a-prd |
| PRD exists, need implementation plan | prd-to-plan |
| Plan exists, need tickets | prd-to-issues |
| Bug, root cause unknown | systematic-debugging → triage-issue |
| Bug, root cause known | triage-issue → tdd |
| Feature or fix to implement | tdd |
| Architecture friction / file too long | fetch improve-codebase-architecture |
| Context window ≥ 80% or user says "compact" | strategic-compact |

---

## SKILL: grill-me

Triggers: "grill me", "poke holes in this", "stress-test this", "what am I missing", "is this solid"

Process:
1. Identify the core claim or plan.
2. List strongest assumptions behind it.
3. Attack from practical, technical, strategic, and sequencing angles.
4. Separate fatal flaws (blockers) from fixable weaknesses.
5. Offer a concrete revision for every flaw found.
6. End with go/no-go.

Output: strongest point · top risks · hidden assumptions · missing evidence · improvements · go/no-go.

Do not flatter. Do not critique without offering a fix. Do not make every weakness a blocker.

---

## SKILL: systematic-debugging

Triggers: "failing silently", "can't reproduce", "it worked before", "no error message", error is absent or misleading.

Do NOT use when root cause is already known.

Process:
1. Answer four questions verbatim before forming any hypothesis:
   - What was expected? (exact output or state)
   - What actually happened? (verbatim)
   - When did it last work? (last known-good commit or timestamp)
   - What changed? (deps, config, code, data)
   If Q2 cannot be answered verbatim, improve logging first.

2. Isolate environment: runtime version, hardware, pinned vs floating deps, permissions, cached state. Do not hypothesize about code until environment is confirmed clean.

3. Build a minimal reproduction. Strip to the smallest case that still fails.

4. Form one hypothesis: "The failure is caused by [exact mechanism] at [exact location] when [exact condition]. Evidence: [from steps above]." No "probably." No "might be."

5. Design one test to falsify or confirm the hypothesis. Not a fix — a test.
   If confirmed → triage-issue or tdd. If falsified → return to step 4.

---

## SKILL: tdd

Triggers: "build this feature", "implement X", "fix this bug", user provides an issue or feature description.

Core rule — vertical slices only:
WRONG: write all tests first, then all code (horizontal slicing)
RIGHT: RED→GREEN per behavior, one at a time

Process:
1. Confirm interface changes and which behaviors matter most. Get approval.
2. Write ONE failing test (RED). Must: describe observable behavior, use public interface only, survive internal refactors.
3. Write minimal code to pass it (GREEN). No speculative features.
4. Repeat per behavior.
5. Refactor only after all GREEN. Look for: duplication, shallow modules, long methods.

Never refactor while RED. If a test reaches behind the interface, the module is the wrong shape.

---

## SKILL: prd-to-plan

Triggers: "turn this PRD into a plan", "break into phases", "tracer bullets"

Do NOT trigger without an existing PRD.

Process:
1. Confirm PRD is in context.
2. Identify durable architectural decisions: routes, schema, key models, auth approach.
3. Draft vertical slices — thin complete paths through every layer. Each must be demoable on its own.
4. Present numbered list (title + user stories per phase). Ask if granularity is right. Iterate.
5. Write ./plans/<feature>.md with: Architectural decisions section, then Phase 1, Phase 2, etc.

Each phase: title, user stories, what to build, acceptance criteria checkboxes.
Never name a phase after a layer (Database, Backend, Frontend).

---

## SKILL: strategic-compact

Triggers: "compact", context window ≥ 80%, agent repeating itself.

Process:
1. Sort conversation into: Decisions (keep verbatim) · Context (compress to 2–4 sentences) · Noise (drop).
2. Output:

# Session Compact — <project> — <date>

## Decisions Made (verbatim)
- [Decision]: [exact wording]

## Current State
[what was in progress, files in-flight, blockers]

## Compressed Context
[2–4 sentences, briefing not history]

## Immediate Next Step
[one sentence, executable from only this compact]

## What to Discard
[one sentence]

Rules: every irrevocable decision in Decisions Made. Never paraphrase decisions. Under 600 words total. One next step only.

End with: "Start a new session and paste this compact as your first message to resume exactly here."

---
---END PASTE---
```

---

## Notes

- The paste block is ~900 words. It uses roughly 1,200 tokens — far less than loading ROUTER.md and then fetching individual skills.
- Skills not embedded here (write-a-prd, prd-to-issues, improve-codebase-architecture, project-architect, ml-engineer, git-guardrails, and others) should be fetched individually when needed. Ask the LLM: *"Fetch and follow the [skill-name] skill from https://raw.githubusercontent.com/deveshpat/skills/main/[category]/[skill-name]/SKILL.md"*
- If the LLM does not have web access, paste the relevant SKILL.md content directly into the chat.
