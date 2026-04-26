---
name: strategic-compact
description: >
  Structured context compaction for long-running sessions approaching context limits. Use when
  context window is at or above 80% capacity, when the user says "compact", "summarize state",
  "we're running out of context", or when you detect context saturation. Preserves exactly what
  is needed to resume work without loss. Do NOT trigger preemptively on short sessions.
category: session
tags: [context, compaction, long-session, continuity, memory]
target_llms: [all]
source: community/affaan-m/everything-claude-code
upstream_url: https://github.com/affaan-m/everything-claude-code/tree/main/skills/strategic-compact
inputs:
  - name: current conversation state
    required: true
outputs:
  - name: compact document
    format: markdown
composable_with:
  - persona/project-architect
---

# Strategic Compact

Produce a structured compaction that lets any LLM resume this session from scratch with zero loss on what matters and zero noise from what doesn't.

---

## When to Trigger
- Context window ≥ 80% saturated
- User says: "compact", "summarize state", "running out of context", "can we reset"
- Agent is repeating information it already processed

---

## Process

### Step 1 — Audit the conversation

| Bucket | Keep how | Criteria |
|---|---|---|
| **Decisions** | Verbatim | Irrevocable choices, agreed interfaces, confirmed root causes |
| **Context** | Compressed | Background that shapes future decisions |
| **Noise** | Drop | Tangents that didn't land, repeated clarifications, routine output |

### Step 2 — Draft the compact

```markdown
# Session Compact — <project> — <date>

## Decisions Made (verbatim)
- [Decision]: [exact agreed wording]

## Current State
- What was in progress when compaction triggered
- Files/modules in-flight
- Blockers (resolved and open)

## Compressed Context
[2–4 sentences of background needed for future decisions. A briefing, not a history.]

## Immediate Next Step
[Single sentence. Unambiguous enough for a new LLM to execute.]

## What to Discard
[One sentence naming topics safely forgotten.]
```

### Step 3 — Verify
- [ ] Every irrevocable decision is in "Decisions Made"
- [ ] Next step is unambiguous — could a new LLM execute it from only this compact?
- [ ] No decision is buried in "Compressed Context"
- [ ] Total compact is under 600 words

### Step 4 — Hand off
Present the compact, then say:
> "Start a new session and paste this compact as your first message to resume exactly here."

---

## What NOT to Do
- Preserve exploratory discussions that produced no decisions
- Summarize decisions — preserve them verbatim (paraphrasing mutates decisions across sessions)
- Include more than one Immediate Next Step
