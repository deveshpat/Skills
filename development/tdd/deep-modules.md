# Deep Modules

From *A Philosophy of Software Design*: a deep module has a small interface and a lot of implementation hidden behind it. A shallow module has a large interface and little implementation.

When designing interfaces, ask:

- Can I reduce the number of methods?
- Can I simplify the parameters?
- Can I hide more complexity inside?
- Would deleting this module make complexity vanish or reappear across callers?
