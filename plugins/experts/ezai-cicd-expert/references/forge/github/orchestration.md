# GitHub Actions — Release & Deploy Orchestration

Multi-workflow patterns for release engineering: numbered reusable workflows, a shared dependency-cache primer, the `tag-sync → publish → docs` cascade driven by a three-state `tag_action`, and Pages deployment. This file owns the **VCS-level orchestration** only — the per-role commands (`install`, `lint`, `test`, `build`, `publish`, `docs-build`) are placeholders here; resolve each to a concrete command via `languages/<language>/tool-registry.md`. For the building blocks (triggers, jobs, matrix, caching), see `github/syntax.md`. For the strategy, see `common/principles.md` → "Validation vs release".

> **Placeholders.** `‹install›`, `‹frozen-install›`, `‹lint›`, `‹test›`, `‹build›`, `‹publish›`, `‹docs-build›`, `‹lockfile›`, `‹version-file›` and `‹lang-setup›` (the setup action + cache, e.g. `setup-node`/`setup-uv`) stand for whatever the language tool-registry resolves. Runner images (`ubuntu-24.04`) and action SHAs are VCS-level and stay concrete.

## Numbered reusable-workflow architecture

Split the pipeline into small **reusable workflows** (`on: workflow_call`), one responsibility each, and number them by dependency order. The number is documentation: a reader sees the cascade at a glance, and the prefix sorts them in the file tree.

```text
00-install-deps   ← primes the dependency-store cache (no logic, just a warm cache)
01-ci             ← lint ∥ test matrix; the quality gate. Called by PRs and by 02.
02-tag-sync       ← orchestrator: CI gate → tag-sync → triggers 03 then 04
03-publish        ← build always, upload only on a real release (OIDC)
04-docs           ← build always, deploy versioned/dev/none by mode
```

| #    | Workflow       | Triggers                                  | Role                                                     |
| :--- | :------------- | :---------------------------------------- | :------------------------------------------------------- |
| 00   | `install-deps` | `workflow_call`                           | Prime the lockfile-keyed store cache for every caller    |
| 01   | `ci`           | `pull_request`, `workflow_call`, dispatch | Lint ∥ tests; release gate (called by 02 on `main`)      |
| 02   | `tag-sync`     | `push: main`, `workflow_dispatch`         | Decide `tag_action`, tag on release, cascade to 03 → 04  |
| 03   | `publish`      | `workflow_call`, `workflow_dispatch`      | Build + package always; upload on `create` only          |
| 04   | `docs`         | `pull_request`, `workflow_call`, dispatch | Build always; deploy `latest`/`dev`/none by `tag_action` |

**Why a single orchestrator (`02`) instead of `on: push: tags`.** A tag pushed by `GITHUB_TOKEN` does **not** trigger another workflow (loop protection). So `02-tag-sync` calls `03` and `04` directly via `uses:` rather than relying on a tag-push event that would never fire.

**No bare `push` trigger on `01-ci`.** PRs cover feature branches; on `main`, CI runs as the release gate via `workflow_call` from `02`. One CI run per change — no double-runs. Same for `04-docs` (PR validation builds + release deploys, never both for one change).

## `00-install-deps` — shared cache primer

A logic-free reusable workflow whose only job is to populate the dependency-store cache, keyed on the lockfile hash. Every downstream job that then runs `‹lang-setup›` with the same cache key gets a hit instead of a network download.

```yaml
# 00-install-deps.yml
on:
  workflow_call:
    inputs:
      lang-version: { required: false, type: string, default: "<pinned>" }

permissions: {}

jobs:
  install:
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@<sha>
      - uses: ‹lang-setup›          # setup-node / setup-uv …, cache keyed on ‹lockfile›
      - run: ‹frozen-install›        # reproducible install (resolve via tool-registry)
```

Callers `needs: [install-deps]`, then repeat `‹lang-setup›` + `‹frozen-install›`. The second install is a near-instant cache hit. Cache the **store** (not the resolved tree like `node_modules`/`.venv`) so the warm cache stays valid across jobs and runners (`common/principles.md` → "Caching").

## `01-ci` — parallel quality gate

Three independent jobs hang off `needs: [install-deps]` and run concurrently off the warm cache: `quality` (lint + format), `type-check` (plus any import-contract check), and `security` (SAST + dependency CVEs). The `test` matrix gates on the **deterministic** ones only — `needs: [quality, type-check]` — never on `security`, which reads an external advisory feed and can turn red without the code changing.

On a repo with no type system (plain JS, no `tsc`), drop that job and let `test` gate on `quality` alone. On a small repo the security scan is often folded into `quality` as one extra step rather than a third job; split it out once it needs its own toolchain.

```yaml
# 01-ci.yml (abbreviated)
on:
  pull_request:
    # Omit `paths:` entirely when a check covers the whole tree (repo-wide
    # formatter, generated-index diff) — a filtered trigger hides those breaks.
    paths: ["<source globs>", "‹version-file›", "‹lockfile›", ".github/workflows/01-ci.yml"]
  workflow_call:                      # called by 02-tag-sync as the release gate
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}   # cancel stale PR runs; never on main

jobs:
  install-deps:
    uses: ./.github/workflows/00-install-deps.yml

  quality:
    needs: [install-deps]
    runs-on: ubuntu-24.04
    timeout-minutes: 15
    # ‹generated-file-diff› = ‹regenerate› && git diff --exit-code <generated file>,
    # for any generated artifact that is committed (index, schema, snapshot).
    steps: [ checkout, ‹lang-setup›, ‹frozen-install›, ‹lint›, ‹format-check›, ‹generated-file-diff› ]

  type-check:
    needs: [install-deps]             # parallel with quality
    runs-on: ubuntu-24.04
    timeout-minutes: 15
    steps: [ checkout, ‹lang-setup›, ‹frozen-install›, ‹type-check›, ‹import-contracts› ]

  security:
    needs: [install-deps]             # parallel; deliberately NOT a gate for `test`
    runs-on: ubuntu-24.04
    timeout-minutes: 15
    # SAST on the project's own code + CVEs in the locked deps. Every ignored
    # advisory carries impact and an exit condition in a comment (principles.md).
    steps: [ checkout, ‹lang-setup›, ‹frozen-install›, ‹sast›, ‹dep-audit› ]

  test:
    needs: [quality, type-check]      # deterministic gates only
    runs-on: ${{ matrix.os }}
    timeout-minutes: 25
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-24.04]            # add windows-latest ONLY if behaviour is OS-specific
        version: ["<pinned>", "<floating-major>"]
    env:
      REQUIRE_EXTRAS: "1"             # turns a silently skipped extras suite into a failure
    steps:
      - [ checkout, ‹lang-setup (matrix.version)›, ‹frozen-install› ]
      - ‹test + coverage threshold›   # the threshold lives here, not in the project config
      - uses: actions/upload-artifact@<sha>
        # always(): the report of a failing run is the one worth keeping.
        if: matrix.os == 'ubuntu-24.04' && matrix.version == '<pinned>' && always()
        with: { name: coverage-report, path: <coverage paths>, retention-days: 7 }
```

## `02-tag-sync` — orchestrator with three-state `tag_action`

`tag-sync` does **not** bump the version — the human writes it in `‹version-file›`. The workflow decides what to do from one signal, `tag_action`, which refines the two-mode model (`common/principles.md`) into three concrete branches:

| `tag_action` | When                                        | Tag                           | Publish (03)               | Docs (04)                 |
| :----------- | :------------------------------------------ | :---------------------------- | :------------------------- | :------------------------ |
| `create`     | push to `main`, `vX.Y.Z` doesn't exist yet  | create `vX.Y.Z` + `vX-latest` | upload (OIDC)              | deploy `X.Y.Z` + `latest` |
| `skip`       | push to `main`, `vX.Y.Z` already exists     | none                          | **not called**             | deploy `dev` alias        |
| `preview`    | `workflow_dispatch` off a non-`main` branch | none ever                     | build + package, no upload | build only, no push       |

`create` is **release mode**; `skip` and `preview` are both **validation mode** (nothing mutating gets uploaded). `preview` exercises the whole job graph end-to-end from a branch — proving the pipeline is healthy before it ever runs for real on `main`. `skip` keeps `main` visible between releases via the `dev` docs alias.

```yaml
# 02-tag-sync.yml (abbreviated)
on:
  push: { branches: [main] }
  workflow_dispatch:                  # run from any branch to exercise preview mode

permissions:
  contents: read

concurrency:
  group: tag-sync-${{ github.ref }}
  cancel-in-progress: false           # never interrupt an in-flight release

jobs:
  ci:                                 # release gate — never publish a red commit
    uses: ./.github/workflows/01-ci.yml

  tag-sync:
    needs: ci
    runs-on: ubuntu-24.04
    timeout-minutes: 15
    permissions:
      contents: write                 # push tags
    outputs:
      tag_action: ${{ steps.gate.outputs.tag_action }}   # create | skip | preview
      version: ${{ steps.version.outputs.version }}
      tag_name: ${{ steps.gate.outputs.tag_name }}
    steps:
      - uses: actions/checkout@<sha>
        with: { fetch-depth: 0 }      # full history: need every tag
      - name: Extract version from ‹version-file›
        id: version
        run: |
          # package.json:   VERSION=$(node -p "require('./package.json').version")
          # pyproject.toml: VERSION=$(grep -E '^version\s*=\s*"' pyproject.toml | head -1 \
          #                   | sed 's/.*version\s*=\s*"\([^"]*\)".*/\1/')
          VERSION=‹read-version›
          # An empty version must stop the release, not tag `v`.
          test -n "$VERSION" || { echo "::error::No version found in ‹version-file›"; exit 1; }
          echo "version=$VERSION" >> "$GITHUB_OUTPUT"
      - name: Determine tag action
        id: gate
        run: |
          TAG_NAME="v${{ steps.version.outputs.version }}"
          echo "tag_name=$TAG_NAME" >> "$GITHUB_OUTPUT"
          if [ "${{ github.ref }}" != "refs/heads/main" ]; then
            echo "tag_action=preview" >> "$GITHUB_OUTPUT"          # off main → dry-run
          elif git rev-parse -q --verify "refs/tags/$TAG_NAME" >/dev/null; then
            echo "tag_action=skip" >> "$GITHUB_OUTPUT"             # exists → no release
          else
            echo "tag_action=create" >> "$GITHUB_OUTPUT"          # new version → release
          fi
      - name: Create immutable tag + move floating alias
        if: steps.gate.outputs.tag_action == 'create'
        run: |
          VERSION="${{ steps.version.outputs.version }}"; MAJOR="${VERSION%%.*}"
          git config user.name  "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git tag "v$VERSION"                       # NEVER -f: the release tag is immutable
          git push origin "v$VERSION"
          git tag -f "v${MAJOR}-latest"             # only the alias ever moves
          git push origin --force "v${MAJOR}-latest"

  # publish is irreversible → runs before docs on create (golden rule: publish → docs).
  publish:                            # role key, not `trigger-publish` (common/naming.md)
    needs: tag-sync
    if: needs.tag-sync.outputs.tag_action != 'skip'   # skip = already published earlier
    permissions:
      contents: read
      id-token: write                 # OIDC for trusted publishing — no secrets: inherit
    uses: ./.github/workflows/03-publish.yml
    with:
      version:    ${{ needs.tag-sync.outputs.version }}
      tag:        ${{ needs.tag-sync.outputs.tag_name }}
      tag_action: ${{ needs.tag-sync.outputs.tag_action }}

  docs:
    needs: [tag-sync, publish]
    if: |
      always() &&
      needs.tag-sync.result == 'success' &&
      ( needs.tag-sync.outputs.tag_action == 'skip' ||
        needs.tag-sync.outputs.tag_action == 'preview' ||
        needs.publish.result == 'success' )
    permissions:                      # grant only what the docs mechanism needs
      contents: write                 #   branch-push tool (mike) — drop for Pages-artifact
      pages: write                    #   Pages-artifact deploy — drop for a branch-push tool
      id-token: write                 #   idem (OIDC for deploy-pages)
    uses: ./.github/workflows/04-docs.yml
    with:
      version:    ${{ needs.tag-sync.outputs.version }}
      tag_action: ${{ needs.tag-sync.outputs.tag_action }}
```

**Keep `preview` in the docs condition.** (Job keys here are the canonical roles — see `common/naming.md`.) Dropping the `preview` branch appears to work — on `preview` the publish job runs (dry-run) and succeeds, so `needs.publish.result == 'success'` happens to be true. That is an accident: the moment publish is also skipped on `preview`, docs silently stop running. Name all three modes explicitly.

**Docs gating subtlety.** The `docs` job uses `always()` because `skip`/`preview` deliberately do **not** run publish, so the job must not inherit the `publish` job's `skipped` result as a failure. The explicit `if` re-encodes the intent: deploy when tag-sync succeeded **and** either we're on a non-publish path (`skip`/`preview`) **or** publish actually succeeded (`create`). This preserves **publish → docs** ordering on release while letting the other two modes proceed independently.

**Immutability.** `vX.Y.Z` is created **once, never force-pushed** — replaying `02` on the same version yields `tag_action=skip` (the gate finds the tag). Only `vX-latest` is force-pushed: a moving major-alias is *meant* to move (`common/principles.md`).

**No `secrets: inherit`.** The cascade passes typed `with:` inputs only and relies on **OIDC** (`id-token: write`) for publishing. `secrets: inherit` hands *all* repo secrets to the called workflow — avoid it; with trusted publishing there's no token to pass anyway.

## `03-publish` — build always, upload on `create`

The called publish workflow keys every mutating step on the `tag_action` **input** — never on `github.event_name`. On `preview` it builds and packages only (dry-run resilience check); on `create` it uploads via OIDC. It is never called on `skip`. The actual build/package/publish commands and the existence-check come from the language tool-registry — the **gating** is VCS-level:

```yaml
# 03-publish.yml (publish job, abbreviated)
on:
  workflow_call:
    inputs:
      version:    { required: true, type: string }
      tag:        { required: true, type: string }
      tag_action: { required: true, type: string }   # create | preview
  workflow_dispatch: # manual run: defaults to preview, `create` is opt-in
    inputs:
      tag_action:
        description: "create = upload (irreversible) | preview = build only"
        required: true
        type: choice
        default: preview
        options: [preview, create]

jobs:
  validate:                          # ‹lint› + ‹test› + ‹package --dry-run› (runs on every mode)
    ...
  publish:
    needs: validate
    # Gate on the INPUT alone. `github.event_name` is inherited from the caller
    # in a reusable workflow (so `== 'workflow_call'` never matches), and an
    # `event_name == 'workflow_dispatch'` escape hatch would let a manual run
    # from an arbitrary ref fire the irreversible upload.
    if: inputs.tag_action == 'create'
    runs-on: ubuntu-24.04
    permissions:
      contents: read
      id-token: write                # mint OIDC token for Trusted Publishing
    environment:
      name: <registry>               # protected environment; also what the Trusted Publisher matches
    steps:
      - uses: actions/checkout@<sha>
      - uses: ‹lang-setup (with registry config)›
      - name: Skip if already published   # re-run safe — replay doesn't conflict
        id: published
        run: ‹registry existence check → exists=true|false›
      - if: steps.published.outputs.exists == 'false'
        run: ‹publish --provenance›    # resolve via tool-registry (npm publish / twine / uv publish)
```

**Attestations break under `workflow_call`.** With the publish job invoked from `02`, the OIDC token's Build Config URI reflects the **caller**, not `03-publish.yml`, so registry-side attestation verification fails. Disable them on the publish action (`attestations: false` for `gh-action-pypi-publish`) while keeping the Trusted Publisher match itself — or publish from a directly-triggered workflow. npm's `--provenance` is unaffected: it signs from the job's own `id-token`.

**Disable lifecycle scripts when publishing.** `npm publish --ignore-scripts` (and equivalents): the publish job is the one place holding a live release credential, and a compromised `prepublishOnly` anywhere in the tree would run there.

**Trusted Publishing + reusable workflows.** When `03` is invoked via `workflow_call` from `02`, the npm/PyPI Trusted Publisher must be registered against **the file that contains the publish job** (`03-publish.yml`) and its `environment` — not the caller. Renaming the workflow file or environment breaks the OIDC match and the registry rejects the upload (npm returns a misleading **404** on `PUT`). Re-register the Trusted Publisher after any rename.

## `04-docs` — build always, deploy by mode

Docs mirror publish: build on every path (PR validation included), deploy conditionally on `tag_action`. The `‹docs-build›` command and the versioned-docs tool come from the language tool-registry; the **deploy mechanics and gating** are VCS-level.

**Two families — pick one before writing the workflow.** They differ in where versioning happens, and that decides the job split *and* the permissions:

| Family                                                          | Versioning            | Deploy                                      | Permissions on deploy              |
| :-------------------------------------------------------------- | :-------------------- | :------------------------------------------ | :--------------------------------- |
| **A — branch-push tool** (`mike` for MkDocs, `gh-pages` for others) | at **deploy** time, one commit per version on the docs branch | the tool pushes (`--push`) | `contents: write` only             |
| **B — build-time versioning** (e.g. a VitePress versioning plugin) | at **build** time, every version compiled into one artifact | `upload-pages-artifact` + `deploy-pages`   | `pages: write` + `id-token: write` |

Family **A** is **one job** (`docs`): the tool builds and pushes in the same command, so a separate deploy job would build twice. It carries the three `tag_action` steps below, since the mode changes the *command*. Family **B** is **two jobs** (`build` + `deploy`) around the Pages artifact, and the mode only decides *whether* deploy runs — so the three-step block collapses into one `if`. Never grant both permission sets: `contents: write` on a Pages-artifact deploy is useless privilege, and `pages: write` on a branch-push tool is too.

**The docs build generates its own inputs** (in the `build` job for family B, inside `docs` for family A). All three reference chains produce part of the docs during the build: a changelog (`orhun/git-cliff-action`, pinned), a coverage HTML report, an architecture graph. They are build steps, not committed files — and they need `fetch-depth: 0` (changelog and "last updated" both read the full history).

```yaml
# 04-docs.yml (family A — one `docs` job, abbreviated)
on:
  pull_request:
    paths: ["docs/**", "‹version-file›", "‹lockfile›"]
  workflow_dispatch:
  workflow_call:
    inputs:
      version:    { required: false, type: string }
      tag_action: { required: false, type: string, default: "preview" }

jobs:
  docs:                              # one job: ‹docs-build› happens inside the deploy command
    name: Build & deploy docs
    # Gate on the INPUT, never on github.event_name: a reusable workflow
    # inherits the caller's event (`push`), and a pull_request supplies no
    # input at all — so `event_name != 'pull_request'` would also let a manual
    # dispatch from an arbitrary ref push the `latest` alias.
    if: inputs.tag_action == 'create' || inputs.tag_action == 'skip'
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    permissions:
      contents: write                # family A only (branch-push tool)
    concurrency:
      group: pages
      cancel-in-progress: false      # never interrupt a live Pages deploy
    steps:
      - uses: actions/checkout@<sha>
        with: { fetch-depth: 0 }     # versioned-docs tool needs full history
      - run: ‹git config user.name/email as github-actions[bot]›
      - name: Deploy (create — versioned release)
        if: inputs.tag_action == 'create'
        run: ‹docs-deploy $VERSION + 'latest' alias›  # then: set the default to 'latest'
      - name: Deploy (skip — dev alias for main between releases)
        if: inputs.tag_action == 'skip'
        run: ‹docs-deploy dev alias›
      - name: Validate (preview — no push)
        if: inputs.tag_action == 'preview'
        run: ‹docs-deploy without push›   # validates the versioning config, touches nothing
```

The three steps are mutually exclusive on `tag_action`: **`create`** publishes the version and moves the `latest` alias — and sets it as the site default — now that publish has succeeded upstream; **`skip`** refreshes the `dev` alias without touching any release version; **`preview`** runs the same command **without pushing**, so a broken versioning config fails in CI instead of on the docs branch. `preview` is also reachable from `workflow_dispatch`, which must default to it: the choice input lists `preview | skip | create` with `preview` first.

**Family B** keeps the same `on:` block and the same input-keyed `if`, but splits in two: a `build` job that runs on every path, and a deploy job holding a single step:

```yaml
  build:                             # name: Build docs — ‹docs-build› + upload-pages-artifact
    ...
  deploy:
    name: Deploy docs
    needs: build
    if: inputs.tag_action == 'create' || inputs.tag_action == 'skip'
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    permissions:
      pages: write                   # no contents: write — nothing is pushed to a branch
      id-token: write
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    concurrency: { group: pages, cancel-in-progress: false }
    steps:
      - id: deployment
        uses: actions/deploy-pages@<sha>
```

Here `preview` and `pull_request` are covered for free: the build job still runs (and `upload-pages-artifact` still validates the output), only the deploy is gated.

## Trigger scoping & parallelism

Two questions decide how much a cascade costs: **what starts a run**, and **what inside it has to wait**.

### Where a `paths` filter belongs

Filters apply to `push` and `pull_request` **only** — `workflow_call` and `workflow_dispatch` ignore them entirely. So scoping a trigger never affects the cascade from `02` nor `preview` mode; it only decides whether a *PR* opens a run.

| Workflow | `paths` filter on its PR trigger?                                                                           |
| :------- | :---------------------------------------------------------------------------------------------------------- |
| `00`     | n/a — `workflow_call` only                                                                                  |
| `01`     | **Only if no job checks the whole tree.** A repo-wide formatter or a generated-index diff makes a filter a hole |
| `02`     | **Never.** It is the gate *and* the decision; a filtered orchestrator means pushes to `main` that run nothing |
| `03`     | n/a — called, or dispatched                                                                                 |
| `04`     | **Yes**: `docs/**`, the docs config, `‹version-file›`, `‹lockfile›`. The docs build reads nothing else       |

> **A `paths` filter on a required check blocks every PR that doesn't match.** A required status check that never reports leaves the PR stuck on "Expected — waiting for status", forever. Either leave the required workflow unfiltered, or pair the filter with a same-named no-op job on the inverse condition. Decide this *before* adding the filter — it is the single most common way a scoped trigger turns into a merge freeze.

### Not deploying docs on a `skip` push

`create` always deploys (the version dimension moved). On `skip` — a push to `main` with no version change — the docs rebuild is only worth it if the docs actually changed. Compute it in `tag-sync`, no extra action needed:

```yaml
  # tag-sync job: outputs: { …, docs_changed: "${{ steps.changed.outputs.docs }}" }
      - name: Determine changed paths
        id: changed
        run: |
          BEFORE="${{ github.event.before }}"
          # First push to a branch (all-zero SHA) or a dispatch: assume changed.
          case "$BEFORE" in ""|0000000000000000000000000000000000000000) echo "docs=true" >> "$GITHUB_OUTPUT"; exit 0;; esac
          git diff --name-only "$BEFORE" HEAD > /tmp/changed.txt
          grep -qE '^(docs/|mkdocs\.yml|‹docs-config›)' /tmp/changed.txt \
            && echo "docs=true" >> "$GITHUB_OUTPUT" || echo "docs=false" >> "$GITHUB_OUTPUT"
```

then add `( needs.tag-sync.outputs.tag_action != 'skip' || needs.tag-sync.outputs.docs_changed == 'true' )` to the `docs` job's condition. It needs the `fetch-depth: 0` checkout that is already there, and it degrades to "run it" whenever the range is unknown — a scoping optimization must never be the reason a release is missing its docs.

### Don't re-do what the gate already proved

`02` runs `01-ci` on the exact commit it is about to release. Downstream, in the same run:

- **`03`'s `validate` job builds and checks the artifact — it does not re-run lint, type-check or the test suite.** Those passed on this SHA minutes ago. Keep manifest-level work: resolve the version (and fail on a mismatch with the input), build, `Verify package metadata`, `Verify package contents`, `Dry-run publish`.
- **`04` likewise builds the docs; it does not re-run the test suite.** A coverage report *rendered into* the docs is a docs input, not a test run — generate it with reporting flags, not with the threshold gate.

A manual `workflow_dispatch` of `03` has no upstream gate, which is the one case this costs something. Keep the gate-equivalent steps, behind that event:

```yaml
      - if: github.event_name == 'workflow_dispatch'
        run: ‹lint›
      - if: github.event_name == 'workflow_dispatch'
        run: ‹test›
```

`github.event_name` is the correct signal **here** — and only here. A `workflow_call` inherits the caller's event (`push`), so it never matches, which is exactly the semantics wanted: "was there an upstream gate?". It stays forbidden for gating a *mutating* step, where the inheritance works against you (see `03-publish` above).

### Call the cache primer once

`00` pays off from about three consumers (`common/principles.md` → "Caching"). In the cascade, `01` has three (`quality`, `type-check`, `security` — `test` too); `03` has one job that installs (`validate`, since `publish` only downloads the artifact) and `04` has one (`build`). **So `00` is called by `01` only.** In `03` and `04` the primer is a serial job that warms a cache its single consumer would have warmed itself — and inside `02`'s cascade that cache is already hot from the gate.

### What parallelizes — and what must not

| Jobs                                    | Verdict                                                                                          |
| :-------------------------------------- | :----------------------------------------------------------------------------------------------- |
| `quality` ∥ `type-check` ∥ `security`   | **Parallel.** Independent, all on `needs: [install-deps]`, all read-only                          |
| `test` matrix cells                     | **Parallel** with `fail-fast: false` — one failing version must not hide another                  |
| `test` ∥ `security`                     | **Parallel.** `test` gates on `quality`/`type-check` only                                         |
| `ci` → `tag-sync`                       | **Serial.** The gate exists to stop a red commit before anything mutates                          |
| `tag-sync` → `publish`                  | **Serial.** Publish consumes the decision and the resolved version                                |
| `validate` → `publish`                  | **Serial.** Publish uploads the artifact `validate` produced — never rebuild it in the upload job |
| `publish` → `docs`                      | **Serial by design.** Irreversible first; docs for a version whose package failed are a lie       |
| `build` → `deploy` (docs family B)      | **Serial.** Artifact handoff                                                                      |

The release path is deliberately a chain: everything parallel lives *inside* `01`. If a release feels slow, the lever is the duplicated work above, not the ordering.

## Reusable & composite workflows — the two tools

- **Reusable workflow** (`on: workflow_call`) — a whole callable job graph with typed `inputs`/`secrets`. This is what `00`–`04` are.
- **Composite action** (`runs.using: composite` in `action.yml`) — a bundle of *steps* reused **within** a job (e.g. the repeated `checkout → ‹lang-setup› → ‹install›` prelude). Reach for this if the per-job boilerplate grows; for a handful of jobs the inline repetition is clearer than the indirection.

## Simple (unversioned) Pages deploy

When there's no version dimension at all, skip the versioning tool entirely — upload an artifact and deploy (this is family B with a single version):

```yaml
permissions: { contents: read, pages: write, id-token: write }
jobs:
  build:
    steps:
      - uses: actions/upload-pages-artifact@<sha>
        with: { path: <built-site-dir> }
  deploy:
    needs: build
    environment: { name: github-pages, url: "${{ steps.d.outputs.page_url }}" }
    steps:
      - id: d
        uses: actions/deploy-pages@<sha>
```
