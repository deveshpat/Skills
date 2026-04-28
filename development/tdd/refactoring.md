# Refactor Candidates

After a TDD cycle reaches green, look for:

- Duplication → extract function or class
- Long methods → break into helpers while keeping tests on the public interface
- Shallow modules → combine or deepen
- Feature envy → move logic to where data lives
- Primitive obsession → introduce value objects
- Existing code that the new code reveals as problematic

Never refactor while red.
