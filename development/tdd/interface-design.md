# Interface Design for Testability

Good interfaces make testing natural.

1. **Accept dependencies; do not create them internally.**
2. **Return results; do not rely only on side effects.**
3. **Keep surface area small.** Fewer methods and parameters mean fewer tests and less setup.
4. **Test through the same interface callers use.** If a test needs to reach behind the interface, the module may be the wrong shape.
