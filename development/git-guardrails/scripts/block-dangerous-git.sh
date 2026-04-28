#!/usr/bin/env bash
set -euo pipefail

INPUT=$(cat)
COMMAND=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty')

DANGEROUS_PATTERNS=(
  "(^|[[:space:]])git[[:space:]]+push([[:space:]]|$)"
  "(^|[[:space:]])git[[:space:]]+reset[[:space:]]+--hard([[:space:]]|$)"
  "(^|[[:space:]])git[[:space:]]+clean[[:space:]]+-f(d)?([[:space:]]|$)"
  "(^|[[:space:]])git[[:space:]]+branch[[:space:]]+-D([[:space:]]|$)"
  "(^|[[:space:]])git[[:space:]]+checkout[[:space:]]+\.([[:space:]]|$)"
  "(^|[[:space:]])git[[:space:]]+restore[[:space:]]+\.([[:space:]]|$)"
  "(^|[[:space:]])push[[:space:]]+--force([[:space:]]|$)"
  "(^|[[:space:]])reset[[:space:]]+--hard([[:space:]]|$)"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if printf '%s' "$COMMAND" | grep -Eq "$pattern"; then
    echo "BLOCKED: '$COMMAND' matches dangerous pattern '$pattern'. The user has prevented you from doing this." >&2
    exit 2
  fi
done

exit 0
