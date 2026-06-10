# CI Workflow

`ci.yml` runs on pushes to `main` (and PRs) that touch `src/`, `bin/`, `tests/`,
`package.json`, `pnpm-lock.yaml`, or the workflow file itself. It is the primary
quality gate — release workflows never run if this one is red.

## Triggers

| Event               | Branches | Path filter                                          |
| ------------------- | -------- | ---------------------------------------------------- |
| `push`              | **all**  | `src/**`, `bin/**`, `tests/**`, `package.json`, etc. |
| `pull_request`      | all      | same                                                 |
| `workflow_dispatch` | manual   | —                                                    |

Concurrent runs on the same ref are cancelled automatically (new push supersedes
the old run). Deploy/publish workflows are never triggered by CI — they live in
`auto-tag.yml` and are gated to `main` only.

## Jobs

```text
quality ──► test (Node 22 / 24, parallel)
```

### `quality` — Lint & Format

Timeout: 15 min. Runs first and gates the test matrix. Steps:

1. `pnpm install --frozen-lockfile` — reproducible install from `pnpm-lock.yaml`
2. `pnpm lint` — ESLint on `src/` and `bin/`
3. `pnpm exec prettier --check .` — format check (read-only, never auto-fixes)

### `test` — Jest matrix

Needs: `[quality]`. Timeout: 25 min. Node **22 and 24** in parallel
(`fail-fast: false` so both cells report even if one fails).

Steps:

1. `pnpm install --frozen-lockfile`
2. `pnpm test` — Jest, reads config from `package.json`
3. `pnpm test:coverage` — threshold check (Node 22 only)
4. Upload `coverage/` as artifact — **always** (even on failure), retained 7 days (Node 22 only)

## Local equivalent

```bash
# Quality gate
pnpm lint
pnpm exec prettier --check .

# Tests
pnpm test

# Coverage threshold
pnpm test:coverage
```

## Notes

- The install is always frozen (`pnpm install --frozen-lockfile`). Never mutates `pnpm-lock.yaml`.
- `pnpm lint` and `prettier --check` are read-only — they never auto-fix in CI.
- No type-check step: the project has no `tsconfig.json`.
- Node 22 is the current LTS; 24 is the next major. Node 18/20 are no longer in the matrix.
