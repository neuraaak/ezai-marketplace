# Project Quality — Scoping questions

Ordered list used by the **Scope** step of `SKILL.md`. Walk it top to bottom, drop every question the request or the repository already answers, then ask the **first three remaining** in a single call. For any question left unasked, apply the recommended option and state it in the response.

Options are listed recommended first, as `label` — `description`. Never add an "Other" option: every harness appends a free-form one.

## 1. `task` — header `Task`

**Ask when** the request does not name the quality concern ("write tests for", "add validation", "security review" already answer it).
**Question:** Which quality concern should be addressed?

- `Write tests (Recommended)` — Unit tests, parametrized cases and property-based invariants.
- `Harden the code` — Input validation, endpoint security, secret handling, structured logging.
- `Review the code` — Find quality and security issues in existing code.

## 2. `target` — header `Target`

**Ask when** the request neither names a file, function or endpoint nor pastes code.
**Question:** Which code is in scope?

- `Changed code (Recommended)` — What the working tree modifies; keeps the work reviewable.
- `Specific module` — One module, function or endpoint; the user names it via the free-form answer.
- `Whole project` — Everything; for a full project audit, pair with `ezai-senior-dev-persona`.

## 3. `level` — header `Test level`

**Ask when** the task is writing tests and the request does not say which kind.
**Question:** Which kind of tests should be written?

- `Unit tests (Recommended)` — Business logic in isolation, with in-memory fakes for ports and repositories.
- `Integration tests` — Against real databases or services, slower and fewer.
- `Both` — Unit tests for logic, a few integration tests for the boundaries.

## 4. `exposure` — header `Exposure`

**Ask when** the task is hardening or review and the code does not show who calls it (no route, CLI entry point or auth layer in sight).
**Question:** Who can reach this code?

- `Public internet (Recommended)` — Treat every input as hostile; strictest validation and auth checks.
- `Internal callers` — Authenticated services or staff behind a trusted boundary.
- `Local only` — A CLI or script run by its own user.

## 5. `findings` — header `Findings`

**Ask when** the task is a review.
**Question:** What should happen with the findings?

- `Report only (Recommended)` — Findings ranked by severity, no code changed.
- `Report and fix` — Apply the fixes after the report, highest severity first.

## 6. `properties` — header `Properties`

**Ask when** the task is writing tests and the target has invariants (serialization round-trips, sorting, parsing, arithmetic).
**Question:** Should property-based tests cover the invariants?

- `Yes, for invariants (Recommended)` — Add property-based tests next to the example-based ones.
- `Examples only` — Parametrized example-based tests, no new test dependency.

## Why these questions

- **Exposure** sets the threat model. Its default is the worst case on purpose: an unasked question must never under-protect an endpoint.
- **Level** follows the "fakes over mocks" rule: unit tests with fakes are the default, integration tests are added at the boundaries only.
- **Findings** keeps a review read-only unless the user asks otherwise: a review that silently rewrites code is no longer a review.
