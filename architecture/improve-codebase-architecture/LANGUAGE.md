# Language

Shared vocabulary for every suggestion this skill makes. Use these terms exactly; do not drift into overloaded words such as component, service, API, or boundary.

## Terms

**Module**: Anything with an interface and an implementation. Scale-agnostic: a function, class, package, or tier-spanning slice can be a module.

**Interface**: Everything a caller must know to use the module correctly: type signature, invariants, ordering constraints, error modes, required configuration, and performance characteristics.

**Implementation**: The code inside a module.

**Depth**: Leverage at the interface. A module is **deep** when a large amount of behavior sits behind a small interface. A module is **shallow** when the interface is nearly as complex as the implementation.

**Seam**: A place where behavior can be altered without editing that place. The seam is where a module's interface lives.

**Adapter**: A concrete thing that satisfies an interface at a seam.

**Leverage**: What callers get from depth: more capability per unit of interface they must learn.

**Locality**: What maintainers get from depth: change, bugs, knowledge, and verification concentrate in one place.

## Principles

- **Depth is a property of the interface, not the implementation.**
- **The deletion test.** If deleting the module makes complexity vanish, it was a pass-through. If complexity reappears across callers, the module earned its keep.
- **The interface is the test surface.** Callers and tests cross the same seam.
- **One adapter means a hypothetical seam. Two adapters means a real seam.**

## Rejected framings

- **Depth as ratio of implementation-lines to interface-lines**: this rewards padding the implementation.
- **Interface as only a language keyword or public methods**: too narrow.
- **Boundary**: overloaded with DDD's bounded context. Say **seam** or **interface**.
