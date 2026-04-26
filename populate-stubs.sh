#!/usr/bin/env bash
# populate-stubs.sh
# Populates existing local SKILL.md stubs with the upstream body content.
# Safe to re-run — each call overwrites only the stub body, frontmatter is preserved.
#
# Usage:
#   bash populate-stubs.sh              # populate all stubs
#   bash populate-stubs.sh grill-me     # populate one specific skill
#
# Requirements:
#   - curl available
#   - Node.js 18+ (check: node --version)
#   - Run from the repo root (same directory as README.md)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"
cd "$ROOT_DIR"

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
  git-guardrails
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

normalize_source_ref() {
  local source_ref="$1"
  case "$source_ref" in
    mattpocock/skills/write-a-prd) echo "mattpocock/skills/to-prd" ;;
    mattpocock/skills/prd-to-issues) echo "mattpocock/skills/to-issues" ;;
    mattpocock/skills/git-guardrails) echo "mattpocock/skills/git-guardrails-claude-code" ;;
    *) echo "$source_ref" ;;
  esac
}

find_skill_file() {
  local skill="$1"
  local candidate

  if [[ -f "$skill" ]]; then
    echo "$skill"
    return 0
  fi

  if [[ -f "$ROOT_DIR/$skill" ]]; then
    echo "$ROOT_DIR/$skill"
    return 0
  fi

  if [[ -f "$ROOT_DIR/$skill/SKILL.md" ]]; then
    echo "$ROOT_DIR/$skill/SKILL.md"
    return 0
  fi

  candidate="$(find "$ROOT_DIR" -path "*/$skill/SKILL.md" -type f | head -n 1)"
  if [[ -n "$candidate" ]]; then
    echo "$candidate"
    return 0
  fi

  candidate="$(grep -rl "^name: $skill$" "$ROOT_DIR" --include 'SKILL.md' | head -n 1)"
  if [[ -n "$candidate" ]]; then
    echo "$candidate"
    return 0
  fi

  return 1
}

source_ref_for_file() {
  local file="$1"
  local source_ref
  local source
  local name
  local skill_slug

  source_ref="$(grep -Eo 'npx skills@latest add [^`[:space:]]+' "$file" | head -n 1 | sed 's/^npx skills@latest add //')"
  if [[ -n "$source_ref" ]]; then
    echo "$(normalize_source_ref "$source_ref")"
    return 0
  fi

  source="$(awk '/^---$/{in_fm=!in_fm; next} in_fm && /^source:[[:space:]]*/ {sub(/^source:[[:space:]]*/, ""); gsub(/^"|"$/, ""); print; exit}' "$file")"
  name="$(awk '/^---$/{in_fm=!in_fm; next} in_fm && /^name:[[:space:]]*/ {sub(/^name:[[:space:]]*/, ""); gsub(/^"|"$/, ""); print; exit}' "$file")"

  if [[ -n "$source" && -n "$name" ]]; then
    skill_slug="$name"
    case "$name" in
      write-a-prd) skill_slug="to-prd" ;;
      prd-to-issues) skill_slug="to-issues" ;;
      git-guardrails) skill_slug="git-guardrails-claude-code" ;;
    esac

    if [[ "$source" == "mattpocock/skills" ]]; then
      echo "$(normalize_source_ref "$source/$skill_slug")"
      return 0
    fi
  fi

  return 1
}

fetch_upstream_skill() {
  local source_ref="$1"
  local owner_repo
  local skill_slug
  local url

  owner_repo="$(echo "$source_ref" | cut -d/ -f1,2)"
  skill_slug="$(echo "$source_ref" | cut -d/ -f3-)"
  url="https://raw.githubusercontent.com/$owner_repo/main/$skill_slug/SKILL.md"

  curl -fsSL "$url"
}

replace_skill_body() {
  local file="$1"
  local upstream_file="$2"

  node --input-type=module - "$file" "$upstream_file" <<'NODE'
import fs from 'fs';

const [filePath, upstreamPath] = process.argv.slice(2);
const localContent = fs.readFileSync(filePath, 'utf8');
const upstreamContent = fs.readFileSync(upstreamPath, 'utf8');

const localFrontmatter = localContent.match(/^---\n[\s\S]*?\n---\n/);
if (!localFrontmatter) {
  throw new Error(`Missing frontmatter in ${filePath}`);
}

const upstreamBody = upstreamContent.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
if (!upstreamBody) {
  throw new Error(`Missing upstream frontmatter in ${upstreamPath}`);
}

fs.writeFileSync(filePath, localFrontmatter[0] + upstreamBody[1]);
NODE
}

# ── Guard: repository root ────────────────────────────────────────────────────
if [[ ! -f "README.md" ]] || [[ ! -f "ROUTER.md" ]]; then
  err "Not in repo root. cd into the skills repo first, then re-run."
  exit 1
fi

if ! command -v curl &>/dev/null; then
  err "curl not found. Install curl and re-run the script."
  exit 1
fi

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
  echo "Populating skill(s): ${SKILLS[*]}"
else
  SKILLS=("${ALL_SKILLS[@]}")
  echo "Populating all ${#SKILLS[@]} local stubs..."
fi

echo ""

# ── Populate loop ─────────────────────────────────────────────────────────────
PASS=0; FAIL=0; SKIP=0

for skill in "${SKILLS[@]}"; do
  FILE="$(find_skill_file "$skill")" || {
    err "$skill — local SKILL.md not found"
    (( FAIL++ )) || true
    echo ""
    continue
  }

  SOURCE_REF="$(source_ref_for_file "$FILE")" || {
    err "$skill — upstream source not declared in $FILE"
    (( FAIL++ )) || true
    echo ""
    continue
  }

  echo "→ $FILE"

  TMP_BODY="$(mktemp)"
  TMP_ERR="$(mktemp)"

  if fetch_upstream_skill "$SOURCE_REF" >"$TMP_BODY" 2>"$TMP_ERR"; then
    if replace_skill_body "$FILE" "$TMP_BODY"; then
      ok "$skill populated"
      (( PASS++ )) || true
    else
      err "$skill — failed to update $FILE"
      (( FAIL++ )) || true
    fi
  else
    ERR_MSG="$(cat "$TMP_ERR" 2>/dev/null || true)"
    if echo "$ERR_MSG" | grep -qi "not found\|404\|does not exist"; then
      warn "$skill — not found upstream, skipping"
      (( SKIP++ )) || true
    else
      err "$skill — unexpected error:"
      echo "    $ERR_MSG"
      (( FAIL++ )) || true
    fi
  fi

  rm -f "$TMP_BODY" "$TMP_ERR"
  echo ""
done

# ── Summary ───────────────────────────────────────────────────────────────────
echo "────────────────────────────────"
echo -e "  ${GREEN}Updated:${NC} $PASS"
[[ $SKIP -gt 0 ]] && echo -e "  ${YELLOW}Skipped:${NC} $SKIP"
[[ $FAIL -gt 0 ]] && echo -e "  ${RED}Failed:${NC}  $FAIL"
echo "────────────────────────────────"

if [[ $FAIL -gt 0 ]]; then
  echo ""
  err "Some skills failed. Check output above."
  exit 1
fi

echo ""
echo "Done. Run 'node scripts/export.js --all --validate' to verify all skills are valid."
