# CI/CD Pipeline

Numbered reusable workflows, one responsibility each, numbered by dependency
order. The number sorts them in the file tree and documents the cascade.

```text
00-install-deps  ← primes the pnpm store cache (keyed on pnpm-lock.yaml)
01-ci            ← lint, format, catalogue drift, audit; tests + coverage gate
02-tag-sync      ← orchestrator: CI gate → tag → publish → docs
03-publish       ← npm publish via OIDC Trusted Publishing (no stored token)
04-docs          ← VitePress build + GitHub Pages deploy
```

Only `02-tag-sync` (push to `main`), `01-ci` / `04-docs` (pull requests) and
manual dispatches start a run. Everything else is `workflow_call` only.

## Release modes

`02-tag-sync` does **not** bump the version — a human writes it in
`package.json`. One `tag_action` drives the whole cascade:

| Context                            | `tag_action` | Tag                    | npm         | Docs         |
| ---------------------------------- | ------------ | ---------------------- | ----------- | ------------ |
| push to `main`, version is new     | `create`     | `vX.Y.Z` + `vX-latest` | publish     | build+deploy |
| push to `main`, tag already exists | `skip`       | none                   | none        | build+deploy |
| `workflow_dispatch` off `main`     | `preview`    | none                   | `--dry-run` | build only   |
| pull request                       | —            | none                   | none        | build only   |
| manual dispatch of `03` / `04`     | `preview`    | none                   | `--dry-run` | build only   |

`preview` exists to exercise the full pipeline without mutating anything
outside the runner. `03` and `04` gate their side effects on the `tag_action`
**input**, never on `github.event_name`: a reusable workflow inherits the
caller's event, so an `event_name == 'workflow_dispatch'` check would turn a
manual run from any branch into a real npm upload. A manual dispatch defaults
to `preview` and must opt in to `create` explicitly.

## Tag immutability

- **`vX.Y.Z`** — created once, **never force-pushed**. Bump the version to
  release again.
- **`vX-latest`** — floating major alias, force-pushed on every release.

## Why a single orchestrator (`02`)

A tag pushed by `GITHUB_TOKEN` does **not** trigger another workflow (loop
protection). So `02-tag-sync` calls `01-ci`, `03` and `04` directly via
`uses:` rather than relying on a `push: tags` event that would never fire.

Ordering inside the cascade: **publish before docs** — publishing is
irreversible, docs are replayable.

## Replay safety

- `03-publish` checks npm for the version first and treats "already
  published" as success, so a replayed release does not 409.
- `03` validates with `npm publish --dry-run` and asserts the packed tarball
  really contains the `bin` entry point and the catalogue before the real
  upload; the
  upload itself runs in the protected `npm` environment with `id-token: write`
  (OIDC, no `NPM_TOKEN` secret anywhere).

## CI gates everything

`tag-sync` runs `needs: ci`, where `ci: uses: ./01-ci.yml`. A failing lint,
format, catalogue-drift or test step blocks the tag — and therefore the
publish and the deploy.

## Local equivalents

```bash
# 01-ci
pnpm lint
pnpm exec prettier --check .
pnpm build-index && git diff --exit-code .claude-plugin/marketplace.json
pnpm audit --audit-level high --prod
pnpm test:coverage

# 03-publish (validation only)
npm publish --dry-run --access public --ignore-scripts
npm pack --ignore-scripts && tar -tzf ./*.tgz

# 04-docs
pnpm docs:build
```
