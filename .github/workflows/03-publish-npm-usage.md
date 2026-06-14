# Publish to npm Workflow

`03-publish-npm.yml` validates the package and publishes it to npm. It is normally
triggered by `02-tag-sync.yml` after a new version tag is created, but can also
be run manually. Publishing is re-run safe: if the version is already on npm the
publish step is skipped (a replayed release is a no-op, not a failure).

## Triggers

| Event               | How                                                       |
| ------------------- | --------------------------------------------------------- |
| `workflow_call`     | Called by `02-tag-sync.yml` with `version` + `tag` inputs |
| `workflow_dispatch` | Manual run from the Actions tab                           |

Manual runs expose a `skip_tests` option (default `false`, not recommended).

## Authentication

Publishing uses **OIDC Trusted Publishing** — no stored `NPM_TOKEN`. The workflow
mints a short-lived token that npm trusts directly via the `id-token: write`
permission. The trusted publisher must be configured on npmjs.com.

**One-time setup:**

```text
npmjs.com → Account → Packages → ezai-marketplace → Publishing → Trusted Publishers
  → Add: GitHub Actions
  → Owner: Neuraaak
  → Repository: ezai-marketplace
  → Workflow: 03-publish-npm.yml
  → Environment: npm
```

## Jobs

```text
validate (lint + test + pack) ──► publish (OIDC deploy)
```

### `validate` — Validate & Pack

1. Extract version from `package.json` and compare with the `version` input
   (mismatch → immediate failure)
2. `pnpm install --frozen-lockfile`
3. `pnpm lint` — ESLint
4. `pnpm test` — Jest suite (skipped if `skip_tests=true`)
5. `npm pack --dry-run` — verifies that `files` in `package.json` captures
   the right paths and that the package metadata is valid

### `publish` — Publish to npm (OIDC)

Runs only if `validate` succeeds. Steps:

1. Checkout (needed to read `package.json` for provenance metadata)
2. `actions/setup-node` with `registry-url: https://registry.npmjs.org`
3. Existence check — `npm view <pkg>@<version>`; if already published, the
   publish step is skipped (re-run safe)
4. `npm publish --provenance --access public` — signed attestation via OIDC

The job runs in the `npm` environment. Configure required reviewers there
in Repository → Settings → Environments to add a manual gate before publish.

## Concurrency

A `publish` concurrency group with `cancel-in-progress: false` prevents two
simultaneous publish runs. A run in progress is never interrupted.

## Notes

- `--no-git-checks` is intentionally absent. The `release` script in
  `package.json` uses it for local publishes; CI goes through `npm publish`
  directly, which has no such flag and respects normal git state.
- `--provenance` attaches a signed SLSA provenance attestation to the package,
  verifiable via `npm audit signatures`.

## Troubleshooting

**Version mismatch** — the `version` input from `tag-sync` differs from
`package.json`. Bump the version, commit, and push again.

**OIDC failure** — check that the Trusted Publisher on npmjs.com matches the
repo name (`ezai-marketplace`), workflow filename (`03-publish-npm.yml`), and
environment name (`npm`) exactly. Any mismatch causes a 401.

**`npm pack --dry-run` lists unexpected files** — review the `files` field in
`package.json`. Only `bin/`, `src/`, `plugins/`, and `.claude-plugin/` should
be included. Add entries to `.npmignore` if needed.

**Tests fail** — run `pnpm test` locally, fix, push. Do not use `skip_tests=true`
to work around failures.
