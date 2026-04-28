# CONTEXT.md Format

## Structure

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**: {A concise description of the term}
_Avoid_: Purchase, transaction

**Invoice**: A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

## Relationships

- An **Order** produces one or more **Invoices**

## Example dialogue

> **Dev:** "When a **Customer** places an **Order**, do we create the **Invoice** immediately?"
> **Domain expert:** "No — an **Invoice** is only generated once a **Fulfillment** is confirmed."

## Flagged ambiguities

- "account" was used to mean both **Customer** and **User** — resolved: these are distinct concepts.
```

## Rules

- Be opinionated: pick the best word and list aliases to avoid.
- Flag conflicts explicitly.
- Keep definitions to one sentence.
- Show relationships and cardinality where obvious.
- Include only project-domain concepts, not general programming concepts.
- Group terms under subheadings when natural clusters emerge.
- Include an example dialogue.

## Single vs multi-context repos

Single-context repos usually have one root `CONTEXT.md`. Multi-context repos use `CONTEXT-MAP.md` to point to context-specific `CONTEXT.md` files and describe relationships between contexts.
