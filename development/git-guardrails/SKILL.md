---
name: git-guardrails
description: >
  Set up Claude Code hooks blocking dangerous git commands such as push,
  reset --hard, clean, destructive branch deletion, and whole-tree checkout before
  they execute. Triggers: 'set up git guardrails', 'protect my git', 'prevent
  accidental push'. Do NOT trigger if equivalent guardrails already exist.
category: development
tags: [git, safety, hooks, claude-code, protection]
target_llms: [all]
source: mattpocock/skills
upstream: https://github.com/mattpocock/skills/tree/main/git-guardrails-claude-code
aliases: [git-guardrails-claude-code]
composable_with:
  - tooling/setup-pre-commit
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
