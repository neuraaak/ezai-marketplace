# GitHub Actions — Release & Deploy Orchestration

Multi-workflow patterns for release engineering: reusable workflows, the tag-sync → publish → docs cascade, and Pages deployment. For the building blocks (triggers, jobs, matrix, caching), see `github/syntax.md`.

## Reusable & composite workflows

Avoid copy-paste across repos/jobs.

- **Reusable workflow** (`on: workflow_call`) — a whole callable job graph with `inputs`/`secrets`.
- **Composite action** (`runs.using: composite` in `action.yml`) — a bundle of steps reused within jobs.

```yaml
jobs:
  test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      version: "3.12"
```

## `workflow_call` — receiving inputs and secrets

A reusable workflow declares what the caller must pass:

```yaml
on:
  workflow_dispatch:
  workflow_call:
    inputs:
      version:   { required: true, type: string }
      tag:       { required: true, type: string }
      is_prerelease: { required: false, type: string, default: "false" }
    secrets:
      PYPI_API_TOKEN: { required: true }
```

Inputs let the caller pass context (version, tag, prerelease flag) without environment variables. Declaring explicit `secrets:` is safer than `secrets: inherit` when the workflow can be called from untrusted code — see the cascade note below.

## Tag-sync → publish → docs cascade

The orchestration syncs a tag **to the version written in the file** — it does not bump the version (the human does that). On every push to `main` it compares the file version against the last tag and runs in one of two modes (see `common/principles.md` → "Validation vs release"):

- **version changed** → create the immutable `vX.Y.Z` tag, move the floating `vX-latest` alias, then cascade to publish and docs.
- **version unchanged** → skip; no tag, no release.

```yaml
# tag-sync.yml (abbreviated)
on:
  push: { branches: [main] }
  workflow_dispatch:

permissions:
  contents: write          # needed to push tags

jobs:
  tag-sync:
    outputs:
      version: ${{ steps.version.outputs.version }}
      tag_name: ${{ steps.version.outputs.tag_name }}
      released: ${{ steps.gate.outputs.released }}   # "true" only on a real version change
      is_prerelease: ${{ steps.meta.outputs.is_prerelease }}
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }                      # full history: need every tag
      # ... extract VERSION from pyproject.toml / package.json into steps.version ...
      - name: Gate on version change
        id: gate
        run: |
          if git rev-parse -q --verify "refs/tags/v$VERSION" >/dev/null; then
            echo "released=false" >> "$GITHUB_OUTPUT"   # tag already exists -> no-op
          else
            echo "released=true" >> "$GITHUB_OUTPUT"
          fi
      - name: Create immutable tag + move floating alias
        if: steps.gate.outputs.released == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          MAJOR="$(echo "$VERSION" | cut -d. -f1)"
          git tag "v$VERSION"                          # NEVER -f: the release tag is immutable
          git push origin "v$VERSION"
          git tag -f "v${MAJOR}-latest"                # only the alias moves
          git push origin --force "v${MAJOR}-latest"

  trigger-publish:
    needs: tag-sync
    if: needs.tag-sync.outputs.released == 'true'      # validation runs leave the world untouched
    uses: ./.github/workflows/publish.yml
    secrets: inherit
    with:
      version: ${{ needs.tag-sync.outputs.version }}
      tag: ${{ needs.tag-sync.outputs.tag_name }}

  trigger-docs:
    needs: [tag-sync, trigger-publish]                 # publish (irreversible) before docs
    if: needs.tag-sync.outputs.released == 'true'
    uses: ./.github/workflows/docs.yml
    secrets: inherit
    with:
      version: ${{ needs.tag-sync.outputs.version }}
```

**Immutability.** `vX.Y.Z` is created **once, never force-pushed** — re-running the workflow on the same version is a no-op (the gate finds the tag and skips). Only `vX-latest` is force-pushed: the floating alias lets users pin to a major that always points at its newest release, and moving aliases are *meant* to move. Force-pushing the release tag itself would break the "release tag is immutable" rule.

**Validation on PRs — build, don't deliver.** On a PR or feature branch there is no real tag. Build the package and the docs anyway (so a broken build fails the PR), but skip every mutating step — the `released == 'true'` gates above keep publish/deploy off non-release runs. Pass a `tag_preview` flag downstream if you want the same job graph to run end-to-end in dry-run.

**Re-run safe publish.** The called publish job must treat "already published" as success so a replayed release doesn't fail: `twine upload --skip-existing` (Python) or an existence check before `npm publish` (JS). See `common/principles.md` → "Idempotence & replay".

**`secrets: inherit`** is convenient on private repos but passes **all** repo secrets to called workflows. On repos where untrusted PRs can trigger workflows, scope with explicit `secrets:` declarations instead.

## GitHub Pages deploy — two approaches

**Simple (static site, no versioning)** — upload artifact and deploy via `actions/deploy-pages`:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    steps:
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    environment: { name: github-pages, url: "${{ steps.d.outputs.page_url }}" }
    steps:
      - id: d
        uses: actions/deploy-pages@v4
```

**Versioned docs with mike** — `contents: write` pushes to the `gh-pages` branch directly; `mike` handles the alias (`latest`):

```yaml
permissions:
  contents: write

jobs:
  deploy-docs:
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }           # mike needs full history
      - run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git fetch origin gh-pages --depth=1 || true
      - run: |
          VERSION="${{ inputs.version }}"
          IS_PRERELEASE="${{ inputs.is_prerelease }}"
          if [ "$IS_PRERELEASE" = "true" ]; then
            uv run mike deploy --push "$VERSION"
          else
            uv run mike deploy --push --update-aliases "$VERSION" latest
            uv run mike set-default --push latest
          fi
```

With mike, `is_prerelease` controls whether the `latest` alias moves — pre-releases publish the version but leave `latest` pointing at the previous stable.
