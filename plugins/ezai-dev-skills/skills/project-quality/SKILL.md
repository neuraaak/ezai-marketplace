---
name: project-quality
description:
  "[CLAUDE] - Testing, security, and input validation standards for Python and
  JS/TS projects. Covers test architecture (pytest / node:test / Vitest),
  property-based testing (hypothesis / fast-check), input validation at I/O
  boundaries (Pydantic / Zod), secret management, and production hardening.
  Load from persona-senior-dev, or invoke directly for quality-specific tasks.

  Triggers on: 'write tests for', 'add validation for', 'security review',
  'harden this', 'how should I test', 'is this input sanitized'."
---

Testing, security, and quality standards. Read `references/index.md` to confirm the language subdirectory, then load the relevant file.

## Language routing

| Language                | File                               |
| :---------------------- | :--------------------------------- |
| Python                  | `references/python/quality.md`     |
| JavaScript / TypeScript | `references/javascript/quality.md` |

## Cross-language principles

- **Validate at every boundary:** Treat all external input (HTTP, files, DB reads, LLM output) as untrusted. Fail fast with clear schema errors.
- **Secrets never in source:** Use env variables in dev, vaults in production. Never log them.
- **Fakes over mocks:** For testing Ports/Repositories, prefer a simple in-memory fake over a complex mock setup.
- **Coverage target:** 80–90% for business logic. Don't chase 100% on trivial getters.
- **Property-based testing:** Use for invariants — sorting, serialization round-trips, mathematical properties.
