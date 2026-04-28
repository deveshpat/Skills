# Deepening

How to deepen a cluster of shallow modules safely, given its dependencies. Assumes the vocabulary in [LANGUAGE.md](LANGUAGE.md): **module**, **interface**, **seam**, and **adapter**.

## Dependency categories

### 1. In-process

Pure computation or in-memory state with no I/O. Always deepenable: merge the modules and test through the new interface directly. No adapter is needed.

### 2. Local-substitutable

Dependencies with local test stand-ins, such as an in-memory filesystem or lightweight database. Deepenable when the stand-in exists. The seam can stay internal.

### 3. Remote but owned

Owned services across a network boundary. Define a port at the seam. Production uses an HTTP/gRPC/queue adapter; tests use an in-memory adapter.

### 4. True external

Third-party services. Inject the external dependency as a port and test with a mock adapter.

## Seam discipline

- One adapter means a hypothetical seam; two adapters mean a real seam.
- Deep modules may have internal seams for their own tests without exposing those seams to callers.
- Replace old shallow-module tests with tests at the deepened module's interface.
