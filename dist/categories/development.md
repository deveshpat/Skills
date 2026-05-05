# Development skills

Generated from canonical SKILL.md files.

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
