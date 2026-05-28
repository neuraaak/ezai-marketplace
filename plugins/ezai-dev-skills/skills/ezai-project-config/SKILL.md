---
name: ezai-project-config
description:
  "[CLAUDE] - Toolchain setup, project configuration, and infrastructure
  standards for Python and JS/TS projects. Covers pyproject.toml / package.json
  structure, build backends, linters, type checkers, Docker multi-stage builds,
  lockfiles, and observability setup. Load from persona-senior-dev, or invoke
  directly for setup tasks.

  Triggers on: 'set up the project', 'configure ruff/ty/uv', 'write a Dockerfile',
  'set up pre-commit', 'configure tsconfig', 'add OpenTelemetry', 'lockfile issue'."
---

Project toolchain, configuration, and infrastructure standards. Read `references/index.md` to confirm the language subdirectory, then load the relevant file.

## Language routing

| Language                | File                              |
| :---------------------- | :-------------------------------- |
| Python                  | `references/python/config.md`     |
| JavaScript / TypeScript | `references/javascript/config.md` |

## Cross-language infrastructure principles

- **Lockfiles:** Always commit lockfiles (`uv.lock`, `pnpm-lock.yaml`) for reproducible builds.
- **Docker:** Multi-stage builds — separate build-time deps from the runtime image. Non-root user in production.
- **Observability:** OpenTelemetry for tracing, metrics, and structured logs. JSON output.
- **Health checks:** Define `HEALTHCHECK` in Docker for orchestration awareness.
- **Never `latest` tags** in Docker — pin to exact versions.
