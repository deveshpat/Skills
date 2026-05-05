# Architecture skills

Generated from canonical SKILL.md files.

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
