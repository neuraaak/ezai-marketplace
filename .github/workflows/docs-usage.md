# Deploy Documentation Workflow

`docs.yml` generates the changelog, builds the VitePress documentation, and
deploys it to GitHub Pages (`https://neuraaak.github.io/ezai-marketplace/`).
It is normally called by `auto-tag.yml` after a successful publish, but also
fires on direct pushes to `docs/**` and can be run manually.

## Triggers

| Event               | How                                                                  |
| ------------------- | -------------------------------------------------------------------- |
| `push`              | Changes to `docs/**`, `package.json`, `pnpm-lock.yaml`, `cliff.toml` |
| `workflow_call`     | Called by `auto-tag.yml` after publish succeeds                      |
| `workflow_dispatch` | Manual run from the Actions tab                                      |

## Jobs

```text
build (changelog + vitepress build + artifact upload) ──► deploy (Pages)
```

### `build`

Steps in order:

| Step             | Command / Action                                                              |
| ---------------- | ----------------------------------------------------------------------------- |
| Checkout         | Full history (`fetch-depth: 0`) required by `lastUpdated` and git-cliff       |
| Changelog        | `orhun/git-cliff-action` writes `docs/changelog.md` from conventional commits |
| Install          | `pnpm install --frozen-lockfile --ignore-scripts`                             |
| Rebuild binaries | `pnpm rebuild esbuild es5-ext vue-demi` (native deps for VitePress)           |
| Build            | `pnpm docs:build` → `vitepress build docs`                                    |
| Upload artifact  | `actions/upload-pages-artifact` from `docs/.vitepress/dist`                   |

### `deploy`

Downloads the artifact produced by `build` and deploys it to GitHub Pages via
`actions/deploy-pages` (OIDC). The job targets the `github-pages` environment.

## Concurrency

- `build` uses a per-ref group (`docs-build-${{ github.ref }}`) with
  `cancel-in-progress: true` — a new push supersedes the previous build.
- `deploy` uses a global `pages` group with `cancel-in-progress: false` —
  a Pages deployment in progress is never interrupted mid-push.

## Permissions

| Job      | Permission        | Why                              |
| -------- | ----------------- | -------------------------------- |
| `build`  | `contents: read`  | Checkout only                    |
| `deploy` | `pages: write`    | Push to GitHub Pages             |
| `deploy` | `id-token: write` | Mint OIDC token for Pages deploy |

## GitHub Pages setup

Pages must be configured to serve from GitHub Actions (not a branch):

```text
Repository → Settings → Pages → Source: GitHub Actions
```

`actions/deploy-pages` handles the rest automatically.

## Local preview

```bash
# Generate changelog first
pnpm changelog

# Serve locally
pnpm docs:dev
# Open http://localhost:5173

# Full production build
pnpm docs:build
pnpm docs:preview
```

## Manual trigger

```bash
gh workflow run docs.yml
```

## Troubleshooting

**Changelog not updating** — ensure `cliff.toml` exists at the repo root and
that commits follow the conventional commit format (`feat:`, `fix:`, etc.).

**VitePress build fails** — run `pnpm docs:build` locally to reproduce.
Common cause: broken markdown, missing files referenced in the sidebar config,
or a `docs/.vitepress/config.mjs` syntax error.

**`pnpm rebuild` fails** — a new dep may need to be added to the
`pnpm.onlyBuiltDependencies` list in `package.json`, or to the `rebuild` step.

**Pages not updating** — check that the Pages source is set to "GitHub Actions"
(not a branch). If it was previously set to `gh-pages`, switch it in Settings.
