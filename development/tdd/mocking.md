# When to Mock

Mock at system boundaries only:

- External APIs
- Databases, when a test database is not practical
- Time and randomness
- File system, when direct file tests are too expensive or brittle

Do not mock your own classes, internal collaborators, or anything you control.

## Designing for Mockability

1. **Use dependency injection.** Pass external dependencies in rather than creating them internally.
2. **Prefer SDK-style interfaces over generic fetchers.** Specific functions for each external operation make mocks simpler and type-safe.
