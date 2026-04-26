#!/usr/bin/env bash
# populate-stubs.sh
# Installs full SKILL.md content for all mattpocock/skills stubs in this repo.
# Safe to re-run — each call overwrites only the stub body, frontmatter is preserved.
#
# Usage:
#   bash populate-stubs.sh              # install all stubs
#   bash populate-stubs.sh grill-me     # install one specific skill
#
# Requirements:
#   - Node.js 18+ (check: node --version)
#   - npx available (bundled with Node.js)
#   - Run from the repo root (same directory as README.md)

set -euo pipefail

# ── Skill list ────────────────────────────────────────────────────────────────
ALL_SKILLS=(
  grill-me
  write-a-prd
  prd-to-plan
  prd-to-issues
  improve-codebase-architecture
  design-an-interface
  request-refactor-plan
  tdd
  triage-issue
  git-guardrails-claude-code
  write-a-skill
  setup-pre-commit
  ubiquitous-language
  edit-article
  obsidian-vault
)

# ── Helpers ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

ok()   { echo -e "${GREEN}  ✓${NC} $1"; }
warn() { echo -e "${YELLOW}  ⚠${NC} $1"; }
err()  { echo -e "${RED}  ✗${NC} $1"; }

# ── Guard: must run from repo root ────────────────────────────────────────────
if [[ ! -f "README.md" ]] || [[ ! -f "ROUTER.md" ]]; then
  err "Not in repo root. cd into the skills repo first, then re-run."
  exit 1
fi

# ── Guard: Node.js required ───────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  err "Node.js not found. Install from https://nodejs.org (v18 or later)."
  exit 1
fi

NODE_MAJOR=$(node --version | sed 's/v//' | cut -d. -f1)
if [[ $NODE_MAJOR -lt 18 ]]; then
  warn "Node.js $NODE_MAJOR detected — v18+ recommended. Continuing anyway."
fi

# ── Determine target skills ───────────────────────────────────────────────────
if [[ $# -gt 0 ]]; then
  SKILLS=("$@")
  echo "Installing skill(s): ${SKILLS[*]}"
else
  SKILLS=("${ALL_SKILLS[@]}")
  echo "Installing all ${#SKILLS[@]} mattpocock stubs..."
fi

echo ""

# ── Install loop ──────────────────────────────────────────────────────────────
PASS=0; FAIL=0; SKIP=0

for skill in "${SKILLS[@]}"; do
  echo "→ mattpocock/skills/$skill"

  if npx skills@latest add "mattpocock/skills/$skill" 2>/tmp/skills_err; then
    ok "$skill installed"
    (( PASS++ )) || true
  else
    # Some stubs may not exist upstream yet — log and continue
    ERR_MSG=$(cat /tmp/skills_err)
    if echo "$ERR_MSG" | grep -qi "not found\|404\|does not exist"; then
      warn "$skill — not found upstream, skipping"
      (( SKIP++ )) || true
    else
      err "$skill — unexpected error:"
      echo "    $ERR_MSG"
      (( FAIL++ )) || true
    fi
  fi

  echo ""
done

# ── Summary ───────────────────────────────────────────────────────────────────
echo "────────────────────────────────"
echo -e "  ${GREEN}Installed:${NC} $PASS"
[[ $SKIP -gt 0 ]] && echo -e "  ${YELLOW}Skipped:${NC}   $SKIP"
[[ $FAIL -gt 0 ]] && echo -e "  ${RED}Failed:${NC}    $FAIL"
echo "────────────────────────────────"

if [[ $FAIL -gt 0 ]]; then
  echo ""
  err "Some skills failed. Check output above."
  exit 1
fi

echo ""
echo "Done. Run 'node scripts/export.js --all --validate' to verify all skills are valid."
