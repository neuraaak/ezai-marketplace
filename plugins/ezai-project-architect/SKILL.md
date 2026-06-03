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

Architecture and design standards. Use the language routing table below to select the relevant file. Only consult `references/index.md` if the user's language is not listed in the table. If the target architecture file cannot be loaded, respond with: "I cannot access the architecture reference for [language]. Please ensure the references directory is available, or paste the relevant standards directly."

## Language routing

| Language                | File                                    |
| :---------------------- | :-------------------------------------- |
| Python                  | `references/python/architecture.md`     |
| JavaScript / TypeScript | `references/javascript/architecture.md` |

If the project uses both Python and JS/TS, load both language files and apply cross-language principles as the shared baseline.

If the user's language is not listed in the routing table, apply the cross-language principles only and state: "No language-specific architecture reference exists for [language]; applying cross-language principles only."

## Cross-language principles

These apply regardless of language:

- **Composition over inheritance** — prefer small, composable units over deep class hierarchies.
- **Explicit public surface** — always define what is public and what is internal.
- **Ports & Adapters** — apply this when a module boundary crosses an external system (DB, API, message queue, filesystem); define contracts as structural interfaces, not base classes.
- **Repository pattern** — abstract all data access behind a repository interface; business logic never imports a DB driver directly.
- **Feature-based modules** — organize by business domain, not technical type (`user/`, not `models/`+`controllers/`).
