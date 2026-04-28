# ADR Format

ADRs live in `docs/adr/` and use sequential numbering: `0001-slug.md`, `0002-slug.md`, etc. Create the directory lazily only when the first ADR is needed.

## Template

```md
# {Short title of the decision}

{1-3 sentences: context, decision, and why.}
```

That can be enough. The value is recording that a decision was made and why, not filling out ritual sections.

## Optional sections

Only include these when they add genuine value:

- **Status**: proposed, accepted, deprecated, superseded by ADR-NNNN
- **Considered Options**: only when rejected alternatives are worth remembering
- **Consequences**: only when downstream effects are non-obvious

## When to offer an ADR

All three must be true:

1. **Hard to reverse** — changing later is meaningfully costly.
2. **Surprising without context** — a future reader will wonder why.
3. **A real trade-off** — there were genuine alternatives and one was selected for specific reasons.
