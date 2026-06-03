---
name: ezai-project-architect
description:
  "Architecture and design standards for Python and JS/TS projects.
  Covers module structure, public API surface, design patterns (Repository,
  Factory, Composition), Hexagonal architecture (Ports & Adapters), and type
  system contracts. Load this sub-skill from ezai-persona-senior-dev, or invoke
  directly when the task is purely about design: defining a class hierarchy,
  structuring a new module, choosing between patterns, or designing a Port interface.

  Triggers on: 'how should I structure this', 'design a repository for', 'what
  pattern fits here', 'create an interface for', 'define the public API of'."
---

Architecture and design standards. Read `references/index.md` to confirm the language subdirectory, then load the relevant file.

## Language routing

| Language                | File                                    |
| :---------------------- | :-------------------------------------- |
| Python                  | `references/python/architecture.md`     |
| JavaScript / TypeScript | `references/javascript/architecture.md` |

## Cross-language principles

These apply regardless of language:

- **Composition over inheritance** — prefer small, composable units over deep class hierarchies.
- **Explicit public surface** — always define what is public and what is internal.
- **Ports & Adapters** — when Hexagonal applies (see Watchguard in `ezai-persona-senior-dev`), define contracts as structural interfaces, not base classes.
- **Repository pattern** — abstract all data access behind a repository interface; business logic never imports a DB driver directly.
- **Feature-based modules** — organize by business domain, not technical type (`user/`, not `models/`+`controllers/`).
