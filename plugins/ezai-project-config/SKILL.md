---
name: ezai-project-config
description:
  "Toolchain setup, project configuration, and infrastructure
  standards for Python and JS/TS projects. Covers pyproject.toml / package.json
  structure, build backends, linters, type checkers, Docker multi-stage builds,
  lockfiles, and observability setup. Load from ezai-persona-senior-dev, or invoke
  directly for setup tasks.

  Triggers on: 'set up the project', 'configure ruff/ty/uv', 'write a Dockerfile',
  'set up pre-commit', 'configure tsconfig', 'add OpenTelemetry', 'lockfile issue'."
---

Project toolchain, configuration, and infrastructure standards. Use the language routing table below to select the relevant reference file. Only consult `references/index.md` if the language cannot be determined from the user's request or the routing table. If `references/index.md` or the routed config file is not available in context, notify the user with: "I could not locate [filename]. Please provide it or confirm the language so I can proceed."

## Language routing

| Language                | File                              |
| :---------------------- | :-------------------------------- |
| Python                  | `references/python/config.md`     |
| JavaScript / TypeScript | `references/javascript/config.md` |

For monorepos or projects using both Python and JS/TS, load both `references/python/config.md` and `references/javascript/config.md` and apply each to its respective subdirectory.

## Cross-language infrastructure principles

- **Lockfiles:** Always commit lockfiles (`uv.lock`, `pnpm-lock.yaml`) for reproducible builds.
- **Docker:** Multi-stage builds — separate build-time deps from the runtime image. Non-root user in production.
- **Observability:** OpenTelemetry for tracing, metrics, and structured logs. JSON output.
- **Health checks:** Define `HEALTHCHECK` in Docker for orchestration awareness.
- **Never `latest` tags** in Docker — pin to exact versions.
