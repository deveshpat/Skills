# All skills

Generated from canonical SKILL.md files. Load this only when you intentionally want every workflow in context. Prefer router.json plus selected SKILL.md files for normal use.

# improve-codebase-architecture

- Category: architecture
- Path: architecture/improve-codebase-architecture/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/architecture/improve-codebase-architecture/SKILL.md
- Tags: architecture, refactoring, deep-modules, dry, rfc
- Chains to: `development/tdd`, `development/triage`

## Trigger contract

Find deep-module opportunities in a codebase, surface architectural friction, generate an RFC. Triggers: 'architecture review', 'refactor', 'too much duplication', 'DRY', 'this file is too long'. Do NOT trigger for bug fixes or new features.

---

# Improve Codebase Architecture

Surface architectural friction and propose **deepening opportunities** — refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability.

## Glossary

Use these terms exactly in every suggestion. Consistent language is the point — don't drift into "component," "service," "API," or "boundary." Full definitions in [LANGUAGE.md](LANGUAGE.md).

- **Module** — anything with an interface and an implementation (function, class, package, slice).
- **Interface** — everything a caller must know to use the module: types, invariants, error modes, ordering, config. Not just the type signature.
- **Implementation** — the code inside.
- **Depth** — leverage at the interface: a lot of behaviour behind a small interface. **Deep** = high leverage. **Shallow** = interface nearly as complex as the implementation.
- **Seam** — where an interface lives; a place behaviour can be altered without editing in place. (Use this, not "boundary.")
- **Adapter** — a concrete thing satisfying an interface at a seam.
- **Leverage** — what callers get from depth.
- **Locality** — what maintainers get from depth: change, bugs, knowledge concentrated in one place.

Key principles (see [LANGUAGE.md](LANGUAGE.md) for the full list):

- **Deletion test**: imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep.
- **The interface is the test surface.**
- **One adapter = hypothetical seam. Two adapters = real seam.**

This skill is _informed_ by the project's domain model — `CONTEXT.md` and any `docs/adr/`. The domain language gives names to good seams; ADRs record decisions the skill should not re-litigate. See [CONTEXT-FORMAT.md](../domain-model/CONTEXT-FORMAT.md) and [ADR-FORMAT.md](../domain-model/ADR-FORMAT.md).

## Process

### 1. Explore

Read existing documentation first:

- `CONTEXT.md` (or `CONTEXT-MAP.md` + each `CONTEXT.md` in a multi-context repo)
- Relevant ADRs in `docs/adr/` (and any context-scoped `docs/adr/` directories)

If any of these files don't exist, proceed silently — don't flag their absence or suggest creating them upfront.

Then use the Agent tool with `subagent_type=Explore` to walk the codebase. Don't follow rigid heuristics — explore organically and note where you experience friction:

- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow** — interface nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they're called (no **locality**)?
- Where do tightly-coupled modules leak across their seams?
- Which parts of the codebase are untested, or hard to test through their current interface?

Apply the **deletion test** to anything you suspect is shallow: would deleting it concentrate complexity, or just move it? A "yes, concentrates" is the signal you want.

### 2. Present candidates

Present a numbered list of deepening opportunities. For each candidate:

- **Files** — which files/modules are involved
- **Problem** — why the current architecture is causing friction
- **Solution** — plain English description of what would change
- **Benefits** — explained in terms of locality and leverage, and also in how tests would improve

**Use CONTEXT.md vocabulary for the domain, and [LANGUAGE.md](LANGUAGE.md) vocabulary for the architecture.** If `CONTEXT.md` defines "Order," talk about "the Order intake module" — not "the FooBarHandler," and not "the Order service."

**ADR conflicts**: if a candidate contradicts an existing ADR, only surface it when the friction is real enough to warrant revisiting the ADR. Mark it clearly (e.g. _"contradicts ADR-0007 — but worth reopening because…"_). Don't list every theoretical refactor an ADR forbids.

Do NOT propose interfaces yet. Ask the user: "Which of these would you like to explore?"

### 3. Grilling loop

Once the user picks a candidate, drop into a grilling conversation. Walk the design tree with them — constraints, dependencies, the shape of the deepened module, what sits behind the seam, what tests survive.

Side effects happen inline as decisions crystallize:

- **Naming a deepened module after a concept not in `CONTEXT.md`?** Add the term to `CONTEXT.md` — same discipline as `/domain-model` (see [CONTEXT-FORMAT.md](../domain-model/CONTEXT-FORMAT.md)). Create the file lazily if it doesn't exist.
- **Sharpening a fuzzy term during the conversation?** Update `CONTEXT.md` right there.
- **User rejects the candidate with a load-bearing reason?** Offer an ADR, framed as: _"Want me to record this as an ADR so future architecture reviews don't re-suggest it?"_ Only offer when the reason would actually be needed by a future explorer to avoid re-suggesting the same thing — skip ephemeral reasons ("not worth it right now") and self-evident ones. See [ADR-FORMAT.md](../domain-model/ADR-FORMAT.md).
- **Want to explore alternative interfaces for the deepened module?** See [INTERFACE-DESIGN.md](INTERFACE-DESIGN.md).


# zoom-out

- Category: architecture
- Path: architecture/zoom-out/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/architecture/zoom-out/SKILL.md
- Tags: architecture, codebase-map, context, module-relationships, onboarding
- Chains to: `architecture/improve-codebase-architecture`, `development/diagnose`, `planning/to-prd`

## Trigger contract

Give broader context and a higher-level map for an unfamiliar section of code or system. Use when the user says 'zoom out', asks how code fits into the bigger picture, or needs module/caller context before planning, debugging, or refactoring.

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


# diagnose

- Category: development
- Path: development/diagnose/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/development/diagnose/SKILL.md
- Tags: debugging, diagnosis, reproduction, instrumentation, root-cause, regression-test
- Chains to: `development/triage`, `development/tdd`, `architecture/improve-codebase-architecture`

## Trigger contract

Disciplined diagnosis loop for hard bugs, silent failures, flaky behavior, and performance regressions: build feedback loop, reproduce, hypothesize, instrument, fix, regression-test. Triggers: 'diagnose this', 'debug this', 'failing silently', 'can't reproduce', 'it worked before', performance regression, or /diagnose. Do NOT use when the root cause is already known.

---

# Diagnose

A discipline for hard bugs. Skip phases only when explicitly justified. Go from "something is wrong" to "I know exactly what is wrong and why" before touching production code.

When exploring the codebase, use the project's domain glossary vocabulary when available and check ADRs in the area being touched.

## Process

### Phase 1 — Build a feedback loop

This is the core of the skill. If you have a fast, deterministic, agent-runnable pass/fail signal for the bug, the rest becomes systematic: bisection, hypothesis testing, instrumentation, and regression tests all consume that signal.

Try feedback loops in roughly this order:

1. Failing test at the seam that reaches the bug: unit, integration, or end-to-end.
2. HTTP or CLI script against a running service.
3. CLI invocation with fixture input and snapshot/diff output.
4. Headless browser script that asserts on DOM, console, or network behavior.
5. Replay of a captured trace, payload, event log, HAR, or fixture.
6. Throwaway harness around the minimal subsystem.
7. Property or fuzz loop for intermittent wrong-output bugs.
8. Bisection harness for regressions between known states.
9. Differential loop comparing old vs. new version, data, or config.
10. HITL script as last resort when a human must click; capture structured output.

Iterate on the loop itself: make it faster, sharper, and more deterministic. A slow flaky loop is barely better than no loop.

For non-deterministic bugs, increase the reproduction rate through repeated runs, stress, parallelism, seed control, or timing probes until the bug is debuggable.

If you cannot build a loop, say so explicitly. List what you tried and ask for access, captured artifacts, or permission to add temporary instrumentation. Do not hypothesize without a loop.

### Phase 2 — Reproduce

Run the loop and watch the bug appear. Confirm:

- The loop reproduces the user's actual failure mode, not a nearby different failure.
- The failure reproduces reliably enough to debug against.
- The exact symptom is captured: error message, wrong output, timing, state, or missing effect.

Do not proceed until you reproduce the bug or clearly document why reproduction is impossible.

### Phase 3 — Hypothesize

Generate three to five ranked, falsifiable hypotheses before testing any one of them. Each hypothesis must state a prediction:

> If <cause> is the cause, then <probe/change> will make the bug disappear, move, or get worse.

If you cannot state the prediction, the hypothesis is a vibe. Discard or sharpen it.

Show the ranked list to the user when useful. They may have domain context that cheaply re-ranks it. If the user is AFK, proceed with your ranking.

### Phase 4 — Instrument

Each probe must map to a specific prediction from Phase 3. Change one variable at a time.

Tool preference:

1. Debugger, REPL, or inspector if available.
2. Targeted logs at boundaries that distinguish hypotheses.
3. Never "log everything and grep".

Tag temporary debug logs with a unique prefix such as `[DEBUG-a4f2]` so cleanup is a single search.

For performance regressions, establish a baseline measurement first, then bisect. Measure first, fix second.

### Phase 5 — Fix + regression test

Write the regression test before the fix, but only at a correct seam: one that exercises the real bug pattern as it occurs at the call site.

If no correct seam exists, document that finding. The architecture may be preventing the bug from being locked down.

If a correct seam exists:

1. Turn the minimized reproduction into a failing test.
2. Watch it fail.
3. Apply the minimal fix.
4. Watch it pass.
5. Re-run the original, unminimized feedback loop.

### Phase 6 — Cleanup + post-mortem

Before declaring done:

- Original reproduction no longer reproduces.
- Regression test passes, or absence of a correct seam is documented.
- Temporary `[DEBUG-...]` instrumentation is removed.
- Throwaway prototypes are deleted or moved to a clearly marked debug location.
- The confirmed root cause is summarized in the issue, PR, or final report.

Then ask what would have prevented the bug. If the answer involves no good test seam, tangled callers, hidden coupling, or shallow modules, hand off to `improve-codebase-architecture` with specifics after the fix is in.


# git-guardrails

- Category: development
- Path: development/git-guardrails/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/development/git-guardrails/SKILL.md
- Tags: git, safety, hooks, claude-code, protection
- Chains to: `tooling/setup-pre-commit`

## Trigger contract

Set up Claude Code hooks blocking dangerous git commands such as push, reset --hard, clean, destructive branch deletion, and whole-tree checkout before they execute. Triggers: 'set up git guardrails', 'protect my git', 'prevent accidental push'. Do NOT trigger if equivalent guardrails already exist.

---

# Setup Git Guardrails

Sets up a PreToolUse hook that intercepts and blocks dangerous git commands before Claude executes them.

## When to Use / Not Use

**Use when:** the user wants local guardrails against accidental destructive Git commands.

**Do NOT use when:** the repository already has equivalent Claude Code hooks or the user is asking for general Git workflow advice.

## What Gets Blocked

- `git push`, including force pushes
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

When blocked, Claude receives a message explaining that the command is not authorized.

## Process

### 1. Ask scope

Ask whether to install for this project only (`.claude/settings.json`) or all projects (`~/.claude/settings.json`).

### 2. Copy the hook script

The bundled script is at [scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh).

Copy it to:

- **Project**: `.claude/hooks/block-dangerous-git.sh`
- **Global**: `~/.claude/hooks/block-dangerous-git.sh`

Make it executable with `chmod +x`.

### 3. Add hook to settings

For project scope, merge this into `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

For global scope, use `~/.claude/hooks/block-dangerous-git.sh` as the command.

If settings already exist, merge the hook into the existing `hooks.PreToolUse` array. Do not overwrite other settings.

### 4. Ask about customization

Ask whether the user wants to add or remove blocked command patterns. Edit the copied script accordingly.

### 5. Verify

Run:

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | .claude/hooks/block-dangerous-git.sh
```

It should exit with code `2` and print a `BLOCKED` message to stderr.

## Verification

- [ ] Hook script exists and is executable.
- [ ] Settings file was merged, not overwritten.
- [ ] Test command exits with code `2`.


# git-staging-guardian

- Category: development
- Path: development/git-staging-guardian/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/development/git-staging-guardian/SKILL.md
- Tags: git, staging, commit-safety, verification, codespaces
- Chains to: `development/git-guardrails`

## Trigger contract

Verify exact Git paths before staging, committing, cleaning, or reporting repo status. Use when the user asks to commit, stage, zip, clean, or verify changes, especially on mobile/Codespaces workflows. Do NOT use for conceptual Git explanations.

---

# Git Staging Guardian

Make Git actions path-explicit and reversible.

## When to Use / Not Use

**Use when:** staging, committing, cleaning, zipping, or summarizing changes.

**Do NOT use when:** the user only asks for Git concept explanations.

## Process

1. Run or request `git status --short` and identify exact paths.
2. Separate tracked modifications, untracked project files, untracked disposable files, and ignored files.
3. Before `git add`, state the exact paths to stage and the exact paths to leave alone.
4. Use path-limited commands: `git add path1 path2`, never broad `git add .` unless the user explicitly approves all paths.
5. Before committing, show `git diff --staged --stat` and the intended commit message.
6. After commit, verify status again.

## Verification

- [ ] No broad staging happened without explicit approval.
- [ ] Untracked project-owned files were not accidentally ignored.
- [ ] Disposable files were not committed accidentally.


# tdd

- Category: development
- Path: development/tdd/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/development/tdd/SKILL.md
- Tags: tdd, testing, red-green-refactor, vertical-slice, implementation
- Chains to: `development/triage`

## Trigger contract

Test-driven development with strict red-green-refactor loop, one vertical slice at a time. Triggers: 'build this feature', 'implement X', 'fix this bug', user provides an issue or feature description. Do NOT trigger for planning-only or architecture-only requests.

---

# Test-Driven Development

## Philosophy

**Core principle**: Tests should verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't.

**Good tests** are integration-style: they exercise real code paths through public APIs. They describe _what_ the system does, not _how_ it does it. A good test reads like a specification - "user can checkout with valid cart" tells you exactly what capability exists. These tests survive refactors because they don't care about internal structure.

**Bad tests** are coupled to implementation. They mock internal collaborators, test private methods, or verify through external means (like querying a database directly instead of using the interface). The warning sign: your test breaks when you refactor, but behavior hasn't changed. If you rename an internal function and tests fail, those tests were testing implementation, not behavior.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Anti-Pattern: Horizontal Slices

**DO NOT write all tests first, then all implementation.** This is "horizontal slicing" - treating RED as "write all tests" and GREEN as "write all code."

This produces **crap tests**:

- Tests written in bulk test _imagined_ behavior, not _actual_ behavior
- You end up testing the _shape_ of things (data structures, function signatures) rather than user-facing behavior
- Tests become insensitive to real changes - they pass when behavior breaks, fail when behavior is fine
- You outrun your headlights, committing to test structure before understanding the implementation

**Correct approach**: Vertical slices via tracer bullets. One test → one implementation → repeat. Each test responds to what you learned from the previous cycle. Because you just wrote the code, you know exactly what behavior matters and how to verify it.

```
WRONG (horizontal):
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

RIGHT (vertical):
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  RED→GREEN: test3→impl3
  ...
```

## Workflow

### 1. Planning

Before writing any code:

- [ ] Confirm with user what interface changes are needed
- [ ] Confirm with user which behaviors to test (prioritize)
- [ ] Identify opportunities for [deep modules](deep-modules.md) (small interface, deep implementation)
- [ ] Design interfaces for [testability](interface-design.md)
- [ ] List the behaviors to test (not implementation steps)
- [ ] Get user approval on the plan

Ask: "What should the public interface look like? Which behaviors are most important to test?"

**You can't test everything.** Confirm with the user exactly which behaviors matter most. Focus testing effort on critical paths and complex logic, not every possible edge case.

### 2. Tracer Bullet

Write ONE test that confirms ONE thing about the system:

```
RED:   Write test for first behavior → test fails
GREEN: Write minimal code to pass → test passes
```

This is your tracer bullet - proves the path works end-to-end.

### 3. Incremental Loop

For each remaining behavior:

```
RED:   Write next test → fails
GREEN: Minimal code to pass → passes
```

Rules:

- One test at a time
- Only enough code to pass current test
- Don't anticipate future tests
- Keep tests focused on observable behavior

### 4. Refactor

After all tests pass, look for [refactor candidates](refactoring.md):

- [ ] Extract duplication
- [ ] Deepen modules (move complexity behind simple interfaces)
- [ ] Apply SOLID principles where natural
- [ ] Consider what new code reveals about existing code
- [ ] Run tests after each refactor step

**Never refactor while RED.** Get to GREEN first.

## Checklist Per Cycle

```
[ ] Test describes behavior, not implementation
[ ] Test uses public interface only
[ ] Test would survive internal refactor
[ ] Code is minimal for this test
[ ] No speculative features added
```


# triage

- Category: development
- Path: development/triage/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/development/triage/SKILL.md
- Tags: triage, github-issues, root-cause, issue-workflow, agent-brief, tdd
- Chains to: `planning/grill-with-docs`, `development/diagnose`, `development/tdd`

## Trigger contract

Triage issues through a lightweight state machine and prepare bugs or feature requests for humans or AFK agents. Triggers: 'triage this', 'review incoming issues', 'prepare this issue', 'investigate this bug', 'find the root cause', or /triage. Do NOT use when the user wants immediate implementation and the work is already specified.

---

# Triage

Move issues, bugs, and feature requests through a small state machine until they are ready for a human, an AFK agent, or closure.

Every issue comment posted during triage should disclose that it was AI-generated, unless the user's repo has a different required disclaimer.

## Process

### 1. Understand the request

Interpret the user's triage request. Common modes:

- Show what needs attention.
- Triage a specific issue.
- Investigate a reported bug and file a fix plan.
- Move an issue to a specific state.
- Prepare an agent brief for implementation.

If no issue tracker is configured, output the same recommendations and issue/comment bodies locally instead of pretending to publish them.

### 2. Apply the triage state model

Use these canonical roles even if the actual tracker labels differ:

- Category: `bug` or `enhancement`
- State: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, or `wontfix`

Every triaged issue should have exactly one category and one state. If labels conflict, flag it before changing anything.

State flow:

- Unlabeled → `needs-triage`
- `needs-triage` → `needs-info`, `ready-for-agent`, `ready-for-human`, or `wontfix`
- `needs-info` → `needs-triage` once the reporter answers

The maintainer can override the state at any time. For explicit state overrides, confirm the action, then apply it.

### 3. Triage a specific issue

1. Gather context: body, comments, current labels, reporter, dates, and prior triage notes.
2. Explore relevant code using domain glossary vocabulary and ADRs where available.
3. Surface any prior rejection, out-of-scope note, or duplicate pattern if the repo tracks those.
4. Recommend category and state with reasoning.
5. For bugs, attempt reproduction before grilling. Report successful repro, failed repro, or insufficient detail.
6. If the issue needs fleshing out, run `grill-with-docs` so questions are grounded in the codebase and domain docs.

### 4. Prepare the outcome

- `ready-for-agent`: post or output an agent brief with problem, context, acceptance criteria, test strategy, and constraints.
- `ready-for-human`: produce the same structure, but explain why it needs human judgment or access.
- `needs-info`: write specific, actionable questions and capture what is already established.
- `wontfix`: explain politely. For enhancements, record the reusable rationale where the repo stores out-of-scope decisions.
- `needs-triage`: apply the state and optionally add a partial-progress note.

### 5. Bug investigation handoff

When the task is root-cause investigation, produce a durable issue-ready fix plan:

```md
## Problem
Actual behavior, expected behavior, and reproduction steps.

## Root Cause Analysis
The failing behavior, involved domain/module, and why the current behavior fails.
Avoid volatile file paths and line numbers unless the user asked for implementation detail.

## TDD Fix Plan
1. RED: Write a test that captures <observable broken behavior>.
   GREEN: Make the minimal change to pass.

## Acceptance Criteria
- [ ] Reproduction no longer fails.
- [ ] New regression test passes.
- [ ] Existing tests still pass.
```

If the root cause is not known yet, hand off to `diagnose` before writing a fix plan.

## Resuming a Previous Session

Read prior triage notes first. Do not re-ask resolved questions. Update the state from the latest reporter or maintainer activity.


# grill-me

- Category: planning
- Path: planning/grill-me/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/planning/grill-me/SKILL.md
- Tags: critique, planning, risk, review
- Chains to: `planning/to-prd`, `planning/prd-to-plan`, `tooling/write-a-skill`

## Trigger contract

Stress-test an idea, plan, PRD, or decision before execution. Use when the user asks to be challenged, wants holes found, or asks what they are missing.

---

# Grill Me

Use this skill to pressure-test a proposal before the user commits time, code, money, or reputation.

## When to Use

Use when the user says things like:
- “grill me”
- “poke holes in this”
- “stress-test this”
- “what am I missing?”
- “is this plan solid?”

## Process

1. Identify the user’s core claim or plan.
2. List the strongest assumptions behind it.
3. Attack the plan from practical, technical, strategic, and sequencing angles.
4. Separate fatal flaws from fixable weaknesses.
5. Suggest concrete revisions.
6. End with a decision: proceed, revise first, or stop.

## Output Contract

Return:
- the plan’s strongest point;
- the top risks;
- hidden assumptions;
- missing evidence;
- concrete improvements;
- a final go/no-go recommendation.

## Verification

A good grill should make the plan harder to fool yourself about. It should not merely be negative; it should improve the plan.

## What NOT to Do

- Do not flatter the user into proceeding.
- Do not invent facts.
- Do not critique without offering fixes.
- Do not turn every weakness into a blocker.


# grill-with-docs

- Category: planning
- Path: planning/grill-with-docs/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/planning/grill-with-docs/SKILL.md
- Tags: critique, planning, domain-language, adr, documentation, codebase-context
- Chains to: `planning/to-prd`, `architecture/improve-codebase-architecture`

## Trigger contract

Stress-test a plan against the existing codebase, domain glossary, and documented decisions. Use when the user wants to be grilled but the answer depends on project terminology, CONTEXT.md, ADRs, or current implementation behavior.

---

# Grill With Docs

Interview the user relentlessly about a plan while grounding every question in the existing domain language, documentation, ADRs, and codebase behavior.

Ask questions one at a time. For each question, provide your recommended answer. If a question can be answered by reading docs or code, inspect those sources instead of asking the user.

## Process

### 1. Load domain context

Look for project documentation before grilling:

- `CONTEXT.md` for domain glossary and ubiquitous language.
- `CONTEXT-MAP.md` if the repo has multiple bounded contexts.
- `docs/adr/` or equivalent ADR locations for durable decisions.
- Existing code and tests where the plan claims a behavior already exists.

Create docs lazily only when useful. If no `CONTEXT.md` exists, create or propose one after the first domain term is actually resolved. If no ADR directory exists, create or propose it only when an ADR-worthy decision emerges.

Reference formats:

- [CONTEXT-FORMAT.md](../../architecture/domain-model/CONTEXT-FORMAT.md)
- [ADR-FORMAT.md](../../architecture/domain-model/ADR-FORMAT.md)

### 2. Challenge against the glossary

When the user uses a term that conflicts with the existing language, call it out immediately:

> Your glossary defines "cancellation" as X, but this plan seems to mean Y. Which is correct?

When the user uses vague or overloaded language, propose a precise canonical term.

### 3. Stress-test concrete scenarios

Invent scenarios that probe boundaries between concepts, especially edge cases, state transitions, permissions, failure modes, and irreversible decisions.

### 4. Cross-reference with code

When the user states how the system works, check whether the code agrees. If docs, code, and user intent disagree, surface the contradiction and ask which source should become canonical.

### 5. Update docs inline when decisions crystallize

When a term is resolved, update or propose the `CONTEXT.md` change immediately. Do not batch terminology decisions until the end.

Offer an ADR only when all three are true:

1. The decision is hard to reverse.
2. It will be surprising without context.
3. It reflects a real trade-off between viable alternatives.

### 6. End with a decision

Return the same core decision as `grill-me`: proceed, revise first, or stop. Include documentation changes made/proposed and the recommended next skill, usually `to-prd`.

## Output Contract

- Strongest point
- Top risks
- Domain-language conflicts
- Code/doc contradictions
- Missing evidence
- Decisions resolved
- Docs updated or proposed
- Go/no-go recommendation


# prd-to-plan

- Category: planning
- Path: planning/prd-to-plan/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/planning/prd-to-plan/SKILL.md
- Tags: planning, prd, implementation-plan, tracer-bullet, vertical-slice
- Chains to: `planning/to-issues`

## Trigger contract

Turn a PRD into a multi-phase implementation plan using tracer-bullet vertical slices, saved as a local Markdown file in ./plans/. Use when the user wants to break down a PRD, create an implementation plan, plan phases from a PRD, or mentions 'tracer bullets'. Do NOT trigger without an existing PRD.

---

# PRD to Plan

Break a PRD into a phased implementation plan using vertical slices, also called tracer bullets. Output is a Markdown file in `./plans/`.

## When to Use / Not Use

**Use when:** a PRD exists and the user wants implementation phases, a plan, or tracer-bullet slicing.

**Do NOT use when:** the PRD is absent, the user wants issue tickets directly, or the user wants immediate implementation.

## Process

### 1. Confirm the PRD is in context

The PRD should already be in the conversation or repo. If it is not, ask the user to paste it or point you to the file.

### 2. Explore the codebase

If you have not already explored the codebase, inspect the current architecture, existing patterns, integration layers, and relevant tests.

### 3. Identify durable architectural decisions

Before slicing, identify high-level decisions unlikely to change during implementation:

- Route structures or URL patterns
- Database schema shape
- Key data models
- Authentication and authorization approach
- Third-party service seams

Put these in the plan header so every phase can reference them.

### 4. Draft vertical slices

Break the PRD into tracer-bullet phases. Each phase must be a thin vertical slice through all integration layers, not a horizontal slice of one layer.

- Each slice delivers a narrow but complete path through every layer.
- A completed slice is demoable or independently verifiable.
- Prefer many thin slices over a few thick slices.
- Do not include volatile implementation details likely to change later.
- Do include durable decisions: route paths, schema shapes, and data model names.

### 5. Quiz the user

Present the proposed breakdown as a numbered list. For each phase show:

- **Title** — short descriptive name
- **User stories covered** — which PRD stories it addresses

Ask whether the granularity feels right and whether phases should be merged or split. Iterate until approved.

### 6. Write the plan file

Create `./plans/` if it does not exist. Write a Markdown file named after the feature, such as `./plans/user-onboarding.md`.

## Output Format

```md
# Plan: <Feature>

> Source PRD: <link or title>

## Architectural decisions

Durable decisions that apply across all phases:

- **Routes**: ...
- **Schema**: ...
- **Key models**: ...

---

## Phase 1: <Title>

**User stories**: <list from PRD>

### What to build

A concise description of the end-to-end behavior for this vertical slice.

### Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

---

## Phase 2: <Title>

...
```

## Verification

- [ ] Every phase is independently verifiable.
- [ ] No phase is merely 'database', 'backend', 'frontend', or another horizontal slice.
- [ ] Durable decisions are separated from volatile implementation details.


# to-issues

- Category: planning
- Path: planning/to-issues/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/planning/to-issues/SKILL.md
- Tags: planning, github-issues, vertical-slice, tracer-bullets, tickets
- Chains to: `development/tdd`

## Trigger contract

Break a plan, spec, or PRD into independently-grabbable issues using tracer-bullet vertical slices. Triggers: 'create issues', 'slice into tickets', 'turn this plan into issues', 'implementation tickets', or /to-issues. Do NOT trigger without a plan, spec, PRD, or issue reference to work from.

---

# To Issues

Break a plan, spec, PRD, or existing issue into independently-grabbable implementation issues using tracer-bullet vertical slices.

## Process

### 1. Gather context

Work from the current conversation context. If the user passes an issue number, URL, or local file path, fetch and read the full body plus comments before slicing.

### 2. Explore the codebase when useful

If the plan depends on current architecture, inspect the relevant modules first. Issue titles and descriptions should use the project's domain glossary vocabulary when available and should respect ADRs covering the affected area.

### 3. Draft vertical slices

Each issue is a thin vertical slice that cuts through **all required integration layers end-to-end**, not a horizontal slice of one layer.

Slices may be `HITL` or `AFK`:

- `HITL`: requires human interaction, such as architectural judgment, design review, or external approval.
- `AFK`: can be implemented and merged without human interaction. Prefer `AFK` where accurate.

Vertical-slice rules:

- Each slice delivers a narrow but complete path through the necessary layers.
- Each completed slice is demoable or independently verifiable.
- Prefer many thin slices over few thick slices.
- Never name slices after layers like "Database", "Backend", or "Frontend".

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Type**: `HITL` / `AFK`
- **Blocked by**: which other slices must complete first, if any
- **User stories covered**: which user stories this addresses, if the source has them

Ask whether the granularity, dependencies, and `HITL`/`AFK` labels are right. Iterate until approved.

### 5. Publish or output issues

For each approved slice, publish a new issue to the configured issue tracker, or output issue bodies if no tracker is configured. Apply the configured triage label when filing.

Publish in dependency order so blocker references can point at real issue identifiers.

## Issue Template

```md
## Parent
A reference to the parent issue, PRD, or plan if applicable.

## What to build
A concise description of this vertical slice. Describe end-to-end behavior, not layer-by-layer implementation.

## Acceptance criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by
- A reference to the blocking ticket, or "None — can start immediately".
```

Do **not** close or modify the parent issue unless the user explicitly asks.


# to-prd

- Category: planning
- Path: planning/to-prd/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/planning/to-prd/SKILL.md
- Tags: planning, prd, requirements, github-issue, deep-modules
- Chains to: `planning/prd-to-plan`

## Trigger contract

Turn the current conversation context and codebase understanding into a structured PRD, optionally filed in the project issue tracker. Triggers: 'create a PRD', 'write a PRD', 'spec this out', 'turn this into requirements', or /to-prd. Do NOT interview by default; synthesize what is already known and ask only genuinely blocking clarifications.

---

# To PRD

This skill turns the current conversation context and repo understanding into a PRD. Do **not** restart discovery or interview the user by default. Synthesize what is already known, then ask only for information that blocks a correct PRD.

## When to Use / Not Use

**Use when:** the user wants a PRD, requirements document, product spec, implementation brief, or issue-ready specification from current context.

**Do NOT use when:** the user asks to implement now, already has an approved PRD, or explicitly wants critique first. Use `grill-me` or `grill-with-docs` first when the idea is still vague or the codebase/domain language needs challenging.

## Process

1. Explore the repo if needed. Use the project's domain glossary vocabulary when available, and respect ADRs that cover the area being changed.
2. Sketch the major modules that must be built or modified. Look for deep-module opportunities: simple, testable interfaces that encapsulate meaningful complexity.
3. Check only load-bearing uncertainties with the user: module boundaries, test scope, irreversible decisions, or unresolved product behavior. Do not ask filler questions just to complete a template.
4. Write the PRD using the output format below. If an issue tracker is configured and the user asked for filing, publish it and apply the appropriate triage label.

## Output Format

```md
## Problem Statement
The problem from the user's perspective.

## Solution
The solution from the user's perspective.

## User Stories
1. As a <role>, I want <capability>, so that <outcome>.

## Implementation Decisions
- Modules to build/modify
- Interfaces to change
- Technical clarifications
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include volatile file paths or code snippets.

## Testing Decisions
- What makes a good test for this feature
- Which modules will be tested
- Similar tests or prior art in the codebase

## Out of Scope
Explicitly excluded work.

## Further Notes
Useful context that did not fit elsewhere.
```

## Verification

- [ ] PRD uses current context rather than inventing requirements.
- [ ] Open questions are truly blocking.
- [ ] Implementation decisions avoid brittle file-path commitments.
- [ ] Testing decisions focus on public behavior.
- [ ] If filed as an issue, it enters the configured triage flow.


# caveman

- Category: productivity
- Path: productivity/caveman/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/productivity/caveman/SKILL.md
- Tags: brevity, token-saving, communication, terse-mode
- Chains to: none

## Trigger contract

Ultra-compressed communication mode that cuts filler, articles, hedging, and pleasantries while keeping full technical accuracy. Use when user says 'caveman mode', 'talk like caveman', 'use caveman', 'less tokens', 'be brief', or invokes /caveman.

---

# Caveman

Respond terse like smart caveman. All technical substance stays. Only fluff dies.

## Process

Once triggered, stay active for every response until the user says `stop caveman`, `normal mode`, or clearly asks for the usual style.

Rules:

- Drop articles: `a`, `an`, `the`.
- Drop filler: `just`, `really`, `basically`, `actually`, `simply`.
- Drop pleasantries and hedging.
- Fragments are fine when clear.
- Prefer short synonyms: `fix`, not `implement a solution for`.
- Abbreviate common technical terms: DB, auth, config, req, res, fn, impl.
- Use arrows for causality: `X -> Y`.
- One word when one word is enough.

Keep exact technical terms, code blocks, quoted errors, commands, filenames, APIs, and safety warnings accurate.

Pattern:

```text
[thing] [action] [reason]. [next step].
```

## Examples

Question: Why does this React component re-render?

> Inline object prop -> new ref -> re-render. Use `useMemo`.

Question: Explain database connection pooling.

> Pool = reuse DB conn. Skip handshake -> faster under load.

## Auto-Clarity Exception

Temporarily drop caveman mode for security warnings, irreversible action confirmations, multi-step instructions where fragments risk misread, or when the user asks for clarification. Resume caveman after the clear part is done.

Example:

> **Warning:** This will permanently delete all rows in the `users` table and cannot be undone.
>
> ```sql
> DROP TABLE users;
> ```
>
> Caveman resume. Verify backup first.


# strategic-compact

- Category: session
- Path: session/strategic-compact/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/session/strategic-compact/SKILL.md
- Tags: context, compaction, long-session, continuity, memory
- Chains to: none

## Trigger contract

Structured context compaction for long-running sessions approaching context limits. Use when context window is at or above 80% capacity, when the user says "compact", "summarize state", "we're running out of context", or when you detect context saturation. Preserves exactly what is needed to resume work without loss. Do NOT trigger preemptively on short sessions.

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


# edit-article

- Category: tooling
- Path: tooling/edit-article/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/tooling/edit-article/SKILL.md
- Tags: writing, editing, article, prose
- Chains to: none

## Trigger contract

Edit prose for clarity, structure, argument flow, concision, and reader impact. Use when the user provides an article, draft, essay, post, or long-form writing to improve.

---

# Edit Article

Use this skill to improve a piece of writing while preserving the author’s intent and voice.

## When to Use

Use when the user provides prose and asks to:
- edit;
- tighten;
- restructure;
- improve flow;
- make it clearer;
- make it more persuasive;
- prepare it for publication.

## Process

1. Identify the intended audience and purpose from the draft.
2. Preserve the core argument and voice unless the user asks otherwise.
3. Improve structure before sentence-level polish.
4. Remove repetition, filler, and unclear transitions.
5. Strengthen openings, section flow, and conclusions.
6. Flag claims that need evidence rather than silently inventing support.
7. Provide either a revised draft or targeted edits depending on the user’s request.

## Output Contract

When revising, provide:
- a cleaned-up version;
- a short list of major changes;
- optional notes for claims, structure, or tone.

When reviewing, provide:
- structural feedback;
- line-level issues;
- suggested rewrites for weak passages.

## Verification

The edited article should be clearer, tighter, and easier to follow without changing the author’s meaning.

## What NOT to Do

- Do not fabricate citations or facts.
- Do not erase the author’s voice.
- Do not over-polish into generic corporate prose.
- Do not make major argument changes without saying so.


# llm-wiki

- Category: tooling
- Path: tooling/llm-wiki/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/tooling/llm-wiki/SKILL.md
- Tags: wiki, knowledge-base, synthesize, compounding-knowledge, session-continuity
- Chains to: `session/strategic-compact`

## Trigger contract

Build and maintain a persistent, LLM-compiled wiki that accumulates project knowledge across sessions. The project's own files are the source — no duplication. The wiki is a synthesized understanding layer (patterns, decisions, gotchas, prompt behaviors) that reduces re-explanation overhead for both user and LLM. Triggers: 'set up a wiki', 'synthesize wiki page for X', 'what do we know about X', 'update the wiki', 'distill this session', 'lint the wiki'. Do NOT trigger for one-off questions with no intent to persist the answer.

---

# LLM Wiki

A persistent, LLM-maintained wiki that accumulates understanding of a project across
sessions. The project's own files are the source — nothing is duplicated. The wiki
captures what the files mean, not what they say.

Inspired by Karpathy's LLM Wiki pattern, adapted: no raw/ directory, project files
are referenced in place, and the wiki is co-evolved via a schema file.

## When to Use / Not Use

**Use when:** a project accumulates knowledge worth keeping across sessions — architectural
reasoning, behavioral patterns, prompt results, known failure modes, workflow conventions.

**Do NOT use when:** the question is one-off, nothing needs to persist, or no wiki
directory exists or is planned.

---

## Structure

```
<project>/
├── WIKI.md       # Schema: conventions, page types, and workflow rules (you + LLM co-evolve)
└── wiki/
    ├── index.md  # Content catalog — one line per page with summary, LLM-maintained
    ├── log.md    # Append-only operation log
    └── <type>/   # Subdirectories defined in WIKI.md at init — not hardcoded here
```

The project's existing files are the source. Wiki pages declare which project files
they were synthesized from via `sources:` frontmatter. No copying, no raw/ directory.

---

## Page Frontmatter (required on every wiki page)

```yaml
---
title: <page title>
type: <as defined in WIKI.md>
sources:
  - <path/to/project/file>   # files this page was synthesized from
updated: YYYY-MM-DD
---
```

`sources:` is the provenance chain. When a listed file changes, the page may be stale.

---

## Workflows

### Init

When the user asks to set up the wiki:

1. Ask two questions only: (a) what is this project about, and (b) what kinds of
   knowledge do you most want to capture?
2. Write `WIKI.md` tailored to the answers — define page types, naming conventions,
   and the four workflow stubs below. Suggest page types from the table at the end
   of this skill; let the user adjust.
3. Create `wiki/index.md` and `wiki/log.md` with empty scaffolding.
4. Create subdirectories as defined in `WIKI.md`.
5. Log: `## [YYYY-MM-DD] init | <project name>`.

### Synthesize

When the user asks to create or update a wiki page on a topic:

1. Identify the relevant project files (read them; do not assume their content).
2. Synthesize understanding — not a summary of the files, but what they mean: patterns,
   rationale, behaviors, constraints, gotchas.
3. Write or update the wiki page. If updating, integrate new understanding; do not
   overwrite existing understanding silently.
4. Flag contradictions with existing wiki content explicitly:
   `> ⚠️ Contradicts: [page] — [what conflicts and why]`
5. Update `wiki/index.md` for new pages.
6. Log: `## [YYYY-MM-DD] synthesize | <page title> | sources: <files read>`.

**Rules:**
- Write for the wiki reader, not as a file summary. Capture understanding, not content.
- One synthesize can produce or update multiple pages.
- Prefer deepening an existing page over creating a shallow new one.
- Do not modify any project source file.

### Distill

When the user ends a session or explicitly asks to capture session knowledge:

1. Review what was learned or decided in this session.
2. Identify which wiki pages should be created or updated based on session output.
3. Write or update those pages following Synthesize rules.
4. This is the primary way prompt patterns, debugging discoveries, and design decisions
   enter the wiki — straight from conversation, without needing a file as intermediary.
5. Log: `## [YYYY-MM-DD] distill | <session summary> | pages updated: <list>`.

### Query

When the user asks a question about the project domain:

1. Read `wiki/index.md` to identify relevant pages.
2. Read those pages.
3. Answer from the wiki, citing page names.
4. If the answer requires synthesis not yet on any page, produce it inline and offer
   to run Distill to persist it.

### Lint

When the user asks to check wiki consistency:

1. Verify every page in `index.md` exists on disk.
2. Check all cross-links between wiki pages resolve.
3. Flag pages whose `sources:` files have been modified since `updated:` date
   (potential staleness).
4. Flag orphan pages (no inbound links from other wiki pages or index).
5. Flag near-duplicate pages that should be merged.
6. Report findings. Do not auto-fix without user approval.

---

## Suggested Page Types

These are starting points for `WIKI.md`. Override freely at init.

| Type | What it captures |
|---|---|
| `concept` | How something works: a pattern, algorithm, or system behavior |
| `decision` | An architectural or design choice with rationale and rejected alternatives |
| `pattern` | A recurring implementation pattern with when/why to use it |
| `prompt` | A prompt pattern, system prompt shape, or eval result with context |
| `debug` | A failure mode or gotcha with the fix and root cause |
| `workflow` | A multi-step process the team follows (e.g. deploy, review, onboard) |

---

## Notes on Runtime

**Claude Code / agentic setup:** Full workflow automation — synthesize, distill, and
lint run autonomously with file access. Recommended.

**claude.ai / chat interface:** Works with manual file pasting. Synthesize and Distill
run in-session; you copy wiki page output to disk. Query works if you paste `index.md`
and relevant pages. Lint is manual.

The wiki is always the human-readable artifact — both modes produce the same output.

---

## Verification

- [ ] Every wiki page has `sources:` pointing to real project paths.
- [ ] `index.md` has an entry for every page in `wiki/`.
- [ ] `log.md` has an entry for every operation.
- [ ] No project source file was modified by any wiki operation.
- [ ] Contradictions are flagged, not silently overwritten.


# obsidian-vault

- Category: tooling
- Path: tooling/obsidian-vault/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/tooling/obsidian-vault/SKILL.md
- Tags: obsidian, notes, knowledge-management, wikilinks, vault
- Chains to: none

## Trigger contract

Search, create, and manage notes in an Obsidian vault with wikilinks and index notes. Triggers: 'search my notes', 'create a note', 'find in Obsidian', 'link these notes'. Do NOT trigger for non-Obsidian systems.

---

# Obsidian Vault

## Vault location

`/mnt/d/Obsidian Vault/AI Research/`

Mostly flat at root level.

## Naming conventions

- **Index notes**: aggregate related topics (e.g., `Ralph Wiggum Index.md`, `Skills Index.md`, `RAG Index.md`)
- **Title case** for all note names
- No folders for organization - use links and index notes instead

## Linking

- Use Obsidian `[[wikilinks]]` syntax: `[[Note Title]]`
- Notes link to dependencies/related notes at the bottom
- Index notes are just lists of `[[wikilinks]]`

## Workflows

### Search for notes

```bash
# Search by filename
find "/mnt/d/Obsidian Vault/AI Research/" -name "*.md" | grep -i "keyword"

# Search by content
grep -rl "keyword" "/mnt/d/Obsidian Vault/AI Research/" --include="*.md"
```

Or use Grep/Glob tools directly on the vault path.

### Create a new note

1. Use **Title Case** for filename
2. Write content as a unit of learning (per vault rules)
3. Add `[[wikilinks]]` to related notes at the bottom
4. If part of a numbered sequence, use the hierarchical numbering scheme

### Find related notes

Search for `[[Note Title]]` across the vault to find backlinks:

```bash
grep -rl "\\[\\[Note Title\\]\\]" "/mnt/d/Obsidian Vault/AI Research/"
```

### Find index notes

```bash
find "/mnt/d/Obsidian Vault/AI Research/" -name "*Index*"
```


# setup-pre-commit

- Category: tooling
- Path: tooling/setup-pre-commit/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/tooling/setup-pre-commit/SKILL.md
- Tags: pre-commit, husky, lint-staged, prettier, node, git
- Chains to: `development/git-guardrails`

## Trigger contract

Set up Husky pre-commit hooks with lint-staged, Prettier, type checking, and tests. Triggers: 'set up pre-commit', 'add Husky', 'add lint-staged', 'format on commit'. Do NOT trigger for Python-only projects without Node.

---

# Setup Pre-Commit Hooks

## What This Sets Up

- **Husky** pre-commit hook
- **lint-staged** running Prettier on all staged files
- **Prettier** config (if missing)
- **typecheck** and **test** scripts in the pre-commit hook

## Steps

### 1. Detect package manager

Check for `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (yarn), `bun.lockb` (bun). Use whichever is present. Default to npm if unclear.

### 2. Install dependencies

Install as devDependencies:

```
husky lint-staged prettier
```

### 3. Initialize Husky

```bash
npx husky init
```

This creates `.husky/` dir and adds `prepare: "husky"` to package.json.

### 4. Create `.husky/pre-commit`

Write this file (no shebang needed for Husky v9+):

```
npx lint-staged
npm run typecheck
npm run test
```

**Adapt**: Replace `npm` with detected package manager. If repo has no `typecheck` or `test` script in package.json, omit those lines and tell the user.

### 5. Create `.lintstagedrc`

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. Create `.prettierrc` (if missing)

Only create if no Prettier config exists. Use these defaults:

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. Verify

- [ ] `.husky/pre-commit` exists and is executable
- [ ] `.lintstagedrc` exists
- [ ] `prepare` script in package.json is `"husky"`
- [ ] `prettier` config exists
- [ ] Run `npx lint-staged` to verify it works

### 8. Commit

Stage all changed/created files and commit with message: `Add pre-commit hooks (husky + lint-staged + prettier)`

This will run through the new pre-commit hooks — a good smoke test that everything works.

## Notes

- Husky v9+ doesn't need shebangs in hook files
- `prettier --ignore-unknown` skips files Prettier can't parse (images, etc.)
- The pre-commit runs lint-staged first (fast, staged-only), then full typecheck and tests


# skill-audit

- Category: tooling
- Path: tooling/skill-audit/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/tooling/skill-audit/SKILL.md
- Tags: skills, audit, validation, router, metadata
- Chains to: `tooling/write-a-skill`

## Trigger contract

Audit an agent-skills repository as a workflow runtime: router, README, frontmatter, filesystem layout, bundled resources, local links, source attribution, placeholders, trigger breadth, and composability drift. Use when the user asks to scrutinize or improve a skills repo. Do NOT use for normal codebase refactors.

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


# write-a-skill

- Category: tooling
- Path: tooling/write-a-skill/SKILL.md
- URL: https://raw.githubusercontent.com/deveshpat/Skill-Binder/main/tooling/write-a-skill/SKILL.md
- Tags: skills, meta, authoring, bootstrap
- Chains to: `tooling/skill-audit`

## Trigger contract

Bootstrap new skills with correct SKILL.md structure, progressive disclosure, and bundled resources. Triggers: 'write a new skill', 'create a skill for X', 'add a skill to my skills repo'.

---

# Writing Skills

## Process

1. **Gather requirements** - ask user about:
   - What task/domain does the skill cover?
   - What specific use cases should it handle?
   - Does it need executable scripts or just instructions?
   - Any reference materials to include?

2. **Draft the skill** - create:
   - SKILL.md with concise instructions
   - Additional reference files if content exceeds 500 lines
   - Utility scripts if deterministic operations needed

3. **Review with user** - present draft and ask:
   - Does this cover your use cases?
   - Anything missing or unclear?
   - Should any section be more/less detailed?

## Skill Structure

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── REFERENCE.md       # Detailed docs (if needed)
├── EXAMPLES.md        # Usage examples (if needed)
└── scripts/           # Utility scripts (if needed)
    └── helper.js
```

## SKILL.md Template

```md
---
name: skill-name
description: Brief description of capability. Use when [specific triggers].
---

# Skill Name

## Quick start

[Minimal working example]

## Workflows

[Step-by-step processes with checklists for complex tasks]

## Advanced features

[Link to separate files: See [REFERENCE.md](REFERENCE.md)]
```

## Description Requirements

The description is **the only thing your agent sees** when deciding which skill to load. It's surfaced in the system prompt alongside all other installed skills. Your agent reads these descriptions and picks the relevant skill based on the user's request.

**Goal**: Give your agent just enough info to know:

1. What capability this skill provides
2. When/why to trigger it (specific keywords, contexts, file types)

**Format**:

- Max 1024 chars
- Write in third person
- First sentence: what it does
- Second sentence: "Use when [specific triggers]"

**Good example**:

```
Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when user mentions PDFs, forms, or document extraction.
```

**Bad example**:

```
Helps with documents.
```

The bad example gives your agent no way to distinguish this from other document skills.

## When to Add Scripts

Add utility scripts when:

- Operation is deterministic (validation, formatting)
- Same code would be generated repeatedly
- Errors need explicit handling

Scripts save tokens and improve reliability vs generated code.

## When to Split Files

Split into separate files when:

- SKILL.md exceeds 100 lines
- Content has distinct domains (finance vs sales schemas)
- Advanced features are rarely needed

## Review Checklist

After drafting, verify:

- [ ] Description includes triggers ("Use when...")
- [ ] SKILL.md under 100 lines
- [ ] No time-sensitive info
- [ ] Consistent terminology
- [ ] Concrete examples included
- [ ] References one level deep
