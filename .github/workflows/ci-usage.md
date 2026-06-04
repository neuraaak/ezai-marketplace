# CI Workflow

`ci.yml` runs on every push to `main` and on every pull request. It is the primary
quality gate — release workflows never run if this one is red.

## Triggers

| Event               | Branches |
| ------------------- | -------- |
| `push`              | `main`   |
| `pull_request`      | all      |
| `workflow_dispatch` | manual   |

Concurrent runs on the same ref are cancelled automatically (new push supersedes
the old run). Deploy jobs are never affected because they live in separate workflows.

## Jobs

```text
quality ──► test (Node 18 / 20 / 22, parallel)
```

### `quality` — Lint & Format

Runs first and gates the test matrix. Steps:

1. `pnpm install --frozen-lockfile` — reproducible install from `pnpm-lock.yaml`
2. `pnpm lint` — ESLint on `src/` and `bin/`
3. `pnpm exec prettier --check .` — format check (read-only, never auto-fixes)

### `test` — Jest matrix

Runs only after `quality` passes. Covers Node 18, 20, and 22 in parallel
(`fail-fast: false` so all cells report even if one fails).

Steps:

1. `pnpm install --frozen-lockfile`
2. `pnpm test` — Jest, reads config from `package.json`

## Local equivalent

```bash
# Quality gate
pnpm lint
pnpm exec prettier --check .

# Tests
pnpm test
```

## Notes

- The install is always frozen (`pnpm install --frozen-lockfile`). Never mutates `pnpm-lock.yaml`.
- `pnpm lint` and `prettier --check` are read-only — they never auto-fix in CI.
- No type-check step: the project has no `tsconfig.json`.
- Node 18 is the minimum declared in `engines.node`; 22 is the current LTS.
