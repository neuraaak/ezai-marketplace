# Project Architect — References Index

Route to the correct language subdirectory based on the project language.

## Supported languages

| Language              | Subdirectory  | Available files   |
| :-------------------- | :------------ | :---------------- |
| Python                | `python/`     | `architecture.md` |
| JavaScript/TypeScript | `javascript/` | `architecture.md` |

---

## Python (`python/`)

Stack: Python 3.11+, Protocol-based interfaces, Hexagonal / Simple Layered.

| File                     | Load when…                             | Contents                                                                                |
| :----------------------- | :------------------------------------- | :-------------------------------------------------------------------------------------- |
| `python/architecture.md` | Any design, pattern, or structure task | Visibility rules, `__all__`, Protocol, TypedDict, Hexagonal structure, Ports & Adapters |

---

## JavaScript/TypeScript (`javascript/`)

Stack: ES2026, TypeScript 6.0+, ESM, composition-first.

| File                         | Load when…                             | Contents                                                                                         |
| :--------------------------- | :------------------------------------- | :----------------------------------------------------------------------------------------------- |
| `javascript/architecture.md` | Any design, pattern, or structure task | Module organization, `#private` fields, Repository pattern, TS type system, Hexagonal equivalent |
