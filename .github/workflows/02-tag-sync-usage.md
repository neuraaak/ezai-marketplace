# Tag-sync (Release Orchestration) Workflow

`02-tag-sync.yml` is the release orchestrator. On every push to `main` it runs CI as
a gate, then decides — by comparing the `package.json` version against the last
tag — whether this is a **release** or a no-op. It never bumps the version itself
(the human writes it in `package.json`); it only syncs a tag to that version.

## Two modes

| Context                        | CI  | tag-sync                               | publish               | docs                        |
| ------------------------------ | --- | -------------------------------------- | --------------------- | --------------------------- |
| Push `main`, version unchanged | run | **skip** (`vX.Y.Z` already exists)     | —                     | — (push trigger may deploy) |
| Push `main`, version changed   | run | **create** `vX.Y.Z` + move `vX-latest` | build + upload (OIDC) | deploy + Pages              |
| Re-run of a release            | run | tag exists → **no-op**                 | skip-existing = ok    | re-deploy (idempotent)      |

## Flow

```text
ci (reusable 01-ci.yml) ──► tag-sync ──► trigger-publish ──► trigger-deploy-docs
```

Each stage `needs` the previous one. `publish` (irreversible) runs before `docs`.
`trigger-publish` and `trigger-deploy-docs` only run when `released == 'true'`.

## Triggers

| Event               | How                             |
| ------------------- | ------------------------------- |
| `push`              | `main` only                     |
| `workflow_dispatch` | Manual run from the Actions tab |

## Immutability

`vX.Y.Z` is created **once and never moved** — re-running on the same version
finds the tag and skips (no-op). Only the floating major alias `vX-latest` is
force-pushed, letting consumers pin to a major that always points at its newest
release. The release tag itself is never force-pushed.

## Release procedure

1. Bump `version` in `package.json` (and let the pre-commit hook sync plugin versions).
2. Open a PR → CI runs (validation; docs build but don't deploy).
3. Merge to `main` → `tag-sync` runs CI again as the gate, then tags + publishes + deploys.
4. To re-run a failed release, just re-run the workflow — tag/publish/docs are all replay-safe.

## Permissions

| Job                   | Permission                                | Why                         |
| --------------------- | ----------------------------------------- | --------------------------- |
| `tag-sync`            | `contents: write`                         | push tags                   |
| `trigger-publish`     | `contents: read`, `id-token: write`       | OIDC npm trusted publishing |
| `trigger-deploy-docs` | `contents: read`, `pages/id-token: write` | Pages deploy                |
