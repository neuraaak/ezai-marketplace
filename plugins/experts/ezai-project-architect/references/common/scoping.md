# Project Architect — Scoping questions

Ordered list used by the **Scope** step of `SKILL.md`. Walk it top to bottom, drop every question the request or the repository already answers, then ask the **first three remaining** in a single call. For any question left unasked, apply the recommended option and state it in the response.

Options are listed recommended first, as `label` — `description`. Never add an "Other" option: every harness appends a free-form one.

Questions 2 to 5 feed the Watchguard in `architecture.md`. When the request targets a single pattern (a Value Object, a Factory, a type contract, a public API surface), the overall architecture is not at stake: skip every question after `task`.

## 1. `task` — header `Task`

**Ask when** the request does not say whether the code exists yet.
**Question:** What should the design work produce?

- `Design new structure (Recommended)` — Lay out modules and layers for code that does not exist yet.
- `Refactor existing code` — Move current code toward the target structure, step by step.
- `Review a design` — Assess a proposed or existing structure and recommend changes.

## 2. `size` — header `Size`

**Ask when** the repository is new or nearly empty, so its size and contributors do not answer it.
**Question:** How large is the project expected to grow?

- `Small (Recommended)` — Under ~1,000 lines, one or two developers.
- `Large` — Beyond ~1,000 lines or three or more developers.
- `Prototype` — Short-lived or throwaway; the simplest structure that works.

## 3. `boundaries` — header `Boundaries`

**Ask when** dependencies and config do not reveal the external systems (no DB driver, HTTP client or queue client yet).
**Question:** Which external systems will the business logic depend on?

- `One system (Recommended)` — A single database or API.
- `Several systems` — For example a database plus an API or a message queue.
- `None` — Pure logic, no I/O beyond the entry point.

## 4. `isolation` — header `Isolation`

**Ask when** at least one external system is involved.
**Question:** Must the business logic be testable without its infrastructure?

- `Yes (Recommended)` — Unit tests run with in-memory fakes, no database or network.
- `No` — Integration tests against real services are enough.

## 5. `adapters` — header `Adapters`

**Ask when** at least one external system is involved and the Watchguard score is still undecided (2 or 3).
**Question:** Will any external system need an alternative implementation?

- `No (Recommended)` — One implementation per boundary.
- `Yes` — For example SQLite in development and Postgres in production, or a swappable provider.

## Why these questions

- The Watchguard scores four criteria; only the code size is reliably visible in an existing repository. The other three describe intentions — planned systems, test strategy, planned adapters — and cannot be inferred, so asking beats guessing.
- The recommended options lean toward **Simple Layered** on purpose: an unasked question must never push a small project into Hexagonal, which the Watchguard calls over-architecture.
