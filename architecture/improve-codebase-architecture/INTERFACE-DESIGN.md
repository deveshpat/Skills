# Interface Design

Use this when the user wants to explore alternative interfaces for a chosen deepening candidate. It follows the "Design It Twice" discipline: the first design is unlikely to be the best.

## Process

### 1. Frame the problem space

Write a user-facing explanation of:

- constraints the new interface must satisfy
- dependencies it relies on and their category from [DEEPENING.md](DEEPENING.md)
- a rough illustrative code sketch to ground the constraints, not a proposal

### 2. Spawn sub-agents

Spawn 3+ parallel sub-agents. Each must produce a radically different interface for the deepened module.

Give each agent a different design constraint:

- minimize the interface
- maximize flexibility
- optimize for the most common caller
- design around ports and adapters when cross-seam dependencies require it

Each sub-agent outputs:

1. Interface, including methods, params, invariants, ordering, and error modes
2. Usage example
3. What the implementation hides behind the seam
4. Dependency strategy and adapters
5. Trade-offs

### 3. Present and compare

Present designs sequentially, then compare by **depth**, **locality**, and **seam placement**. Recommend the strongest design, or a hybrid if warranted.
