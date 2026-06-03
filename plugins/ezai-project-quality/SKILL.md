---
name: ezai-project-quality
description:
  "Testing, security, and input validation standards for Python and
  JS/TS projects. Covers test architecture (pytest / node:test / Vitest),
  property-based testing (hypothesis / fast-check), input validation at I/O
  boundaries (Pydantic / Zod), secret management, and production hardening.
  Load from ezai-persona-senior-dev, or invoke directly for quality-specific tasks.

  Triggers on: 'write tests for', 'add validation for', 'security review',
  'harden this', 'how should I test', 'is this input sanitized'."
---

Testing, security, and quality standards. If a tool to read files is available, read `references/index.md` to determine the language subdirectory, then read the relevant quality file. If no file-reading tool is available, ask the user which language applies and proceed with the cross-language principles below. If any referenced file cannot be read, notify the user that the language-specific standards file is unavailable and fall back to the cross-language principles in this prompt.

## Language routing

| Language                | File                               |
| :---------------------- | :--------------------------------- |
| Python                  | `references/python/quality.md`     |
| JavaScript / TypeScript | `references/javascript/quality.md` |

Mixed (Python + JS/TS) — load both `references/python/quality.md` and `references/javascript/quality.md` and apply each to its respective files.

## Cross-language principles

- **Validate at every boundary:** Treat all external input (HTTP, files, DB reads, LLM output) as untrusted. Fail fast with clear schema errors.
- **Secrets never in source:** Use env variables in dev, vaults in production. Never log them.
- **Fakes over mocks:** For testing Ports/Repositories, prefer a simple in-memory fake over a complex mock setup.
- **Coverage target:** 80–90% for business logic. Don't chase 100% on trivial getters.
- **Property-based testing:** Use for invariants — sorting, serialization round-trips, mathematical properties.
