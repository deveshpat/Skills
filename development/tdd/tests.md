# Good and Bad Tests

## Good Tests

Good tests are integration-style. They test observable behavior through public interfaces and survive internal refactors.

```typescript
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

Characteristics:

- Tests behavior users or callers care about
- Uses public API only
- Survives internal refactors
- Describes what, not how
- Has one logical assertion per test

## Bad Tests

Implementation-detail tests couple to internal structure.

```typescript
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

Red flags:

- Mocking internal collaborators
- Testing private methods
- Asserting on call counts or order
- Breaking during refactor even when behavior did not change
- Verifying by bypassing the interface
