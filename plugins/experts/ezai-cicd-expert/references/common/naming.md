# Naming — Workflows, Jobs & Steps

One vocabulary for every pipeline, on every forge, in every language. The point is **recognition**: the same role carries the same name across repositories, so a reader who knows one pipeline can read any other, and a diff between two repos shows real differences instead of synonyms.

Deviate only where the forge or the language forces it — and the sections below say exactly where that is.

## The rule

- **Fixed identifiers, flexible detail.** The job key and the role name come from the tables below and are never paraphrased (`quality`, not `lint-and-format`). Everything language- or project-specific goes in the **parenthetical suffix**.
- **Sentence case, no trailing period.** `Resolve version`, not `Resolve Version` or `resolve version.`.
- **No tool names in a role name.** `Security scan`, not `Bandit + pip-audit`. The tool is visible in the step's command; naming it in the role breaks recognition the day the tool changes.
- **One parenthetical, for the discriminator only**: a mode (`(create)`), a registry (`(npm)`), a matrix cell (`(ubuntu-24.04, Python 3.13)`), a protocol (`(OIDC)`). Never two in a row.

## Files & workflow names (GitHub Actions)

`NN-<role>.yml`, role in kebab-case, no language or registry suffix — the same five names in every repo:

| File                  | `name:`             | Role                             |
| :-------------------- | :------------------ | :------------------------------- |
| `00-install-deps.yml` | `00 · Install Deps` | Prime the dependency-store cache |
| `01-ci.yml`           | `01 · CI`           | Quality gate                     |
| `02-tag-sync.yml`     | `02 · Tag Sync`     | Release orchestrator             |
| `03-publish.yml`      | `03 · Publish`      | Build always, upload on release  |
| `04-docs.yml`         | `04 · Docs`         | Build always, deploy by mode     |

The registry belongs to the publish **job** (`Publish (npm)`), not to the file or the workflow name — a repo publishing to two registries then keeps one `03-publish.yml` with two jobs.

> **Renaming `03-publish.yml` is not free.** A registry's Trusted Publisher matches the workflow **filename** and environment; renaming the file breaks OIDC until it is re-registered (npm answers a misleading 404). Normalize the `name:` freely; schedule the file rename.

## Jobs

Job **key** is the stable identifier (also the GitLab job name); job **name** is the human label.

| Key                        | `name:`                | Appears in          | Notes                                                                     |
| :------------------------- | :--------------------- | :------------------ | :------------------------------------------------------------------------ |
| `install` / `install-deps` | `Install & cache deps` | 00 / callers of 00  | `install` inside `00`; `install-deps` for the `uses:` job in every caller |
| `quality`                  | `Lint & format`        | 01                  | Add repo-wide generated-file checks here                                  |
| `type-check`               | `Type check`           | 01                  | `Type check & contracts` when import contracts run too                    |
| `security`                 | `Security scan`        | 01                  | Never the tool names                                                      |
| `test`                     | `Tests`                | 01                  | Matrix suffix below                                                       |
| `ci`                       | `CI gate`              | 02                  | The `uses: ./…/01-ci.yml` release gate                                    |
| `tag-sync`                 | `Tag sync`             | 02                  | Decides `tag_action`, creates the tag                                     |
| `publish`                  | `Publish (<registry>)` | 02 (as `uses:`), 03 | `(npm)`, `(PyPI)`, `(Packagist)`                                          |
| `docs`                     | `Docs`                 | 02 (as `uses:`)     | The cascade's entry to 04                                                 |
| `validate`                 | `Validate & build`     | 03                  | Build + integrity checks, every mode                                      |
| `build`                    | `Build docs`           | 04 (family B)       | Also any build job whose output is an artifact                            |
| `deploy`                   | `Deploy docs`          | 04 (family B)       |                                                                           |
| `docs`                     | `Build & deploy docs`  | 04 (family A)       | One job: the versioning tool builds **and** pushes in a single command    |

**`04` has one job or two, depending on the docs family** (`github/orchestration.md` → `04-docs`). A branch-push tool like `mike` builds and pushes in one command, so splitting it would mean building twice: one `docs` job. A build-time-versioning site hands an artifact to `deploy-pages`: `build` + `deploy`. Don't force one shape onto the other family.

**Cascade jobs in `02`** keep the role key (`publish`, `docs`) rather than a `trigger-` prefix: the `uses:` line already says it delegates, and the prefix makes the same role unrecognizable between `02` and `03`.

**Matrix suffix** — list only the axes that exist, in this order: OS, then language version.

```text
Tests                                          # single cell
Tests (Python ${{ matrix.python }})            # version axis only
Tests (${{ matrix.os }}, Node ${{ matrix.node }})   # both axes
```

## Steps

**A step gets a `name:` only when its command does not already read as one.** A `- run: pnpm lint` needs no label; a multi-line script or a `uses:` does. Naming the obvious ones is noise that hides the ones that matter.

Verb vocabulary — pick from this list, never a synonym:

| Verb        | Use for                                     | Canonical names                                                                                                 |
| :---------- | :------------------------------------------ | :-------------------------------------------------------------------------------------------------------------- |
| `Resolve`   | Compute a value for later steps             | `Resolve version`, `Resolve docs version`                                                                       |
| `Determine` | Decide a branch of the pipeline             | `Determine tag action`                                                                                          |
| `Verify`    | Assert a fact, fail otherwise               | `Verify catalogue is up to date`, `Verify package contents`, `Verify package metadata`, `Verify version is new` |
| `Enforce`   | Apply a structural contract                 | `Enforce import contracts`                                                                                      |
| `Generate`  | Produce a derived input                     | `Generate changelog`, `Generate coverage report`, `Generate architecture graph`                                 |
| `Create`    | Mutate the repository                       | `Create tag & move alias`                                                                                       |
| `Build`     | Produce the artifact                        | `Build package`, `Build docs`                                                                                   |
| `Configure` | Set up state a later step needs             | `Configure git` (the `github-actions[bot]` identity before any push)                                            |
| `Dry-run`   | Exercise a mutating command without effect  | `Dry-run publish`                                                                                               |
| `Publish`   | The irreversible upload                     | `Publish (OIDC)`                                                                                                |
| `Deploy`    | Ship the built site                         | `Deploy release docs (create)`, `Deploy dev docs (skip)`                                                        |
| `Validate`  | A deploy-shaped command that pushes nothing | `Validate docs build (preview)`                                                                                 |
| `Summary`   | Write to the run summary                    | `Summary` (bare — it is always the last step)                                                                   |

`Verify package contents` covers the tarball (npm) and the wheel (Python) — the artifact differs, the role does not. `Verify package metadata` is the manifest-level check next to it (`twine check`, `publint`).

## GitLab CI mapping

GitLab has no per-job label and no named steps, so the same vocabulary lands one level down — and that is the whole trick to keeping the two forges readable side by side:

| GitHub                      | GitLab                                                               |
| :-------------------------- | :------------------------------------------------------------------- |
| Job key (`type-check`)      | Job name — **identical string**                                      |
| Job `name:` (`Type check`)  | Nothing. The key carries it; don't invent a `variables: JOB_NAME`    |
| Workflow file (`01-ci.yml`) | `stage:` grouping — see below                                        |
| Step `name:`                | A `#` comment on the script line, same canonical string              |
| Matrix suffix               | Generated by `parallel: matrix:` — don't hand-write it into the name |

Fixed stages, in order, covering the same cascade as `00`–`04`:

```yaml
stages: [install, quality, test, release, docs]
```

`install` ← `00`; `quality` holds `quality`/`type-check`/`security`; `test` holds `test`; `release` holds `tag-sync` then `publish` (`needs:` enforces the order); `docs` holds `build`/`deploy`. A job's stage plus its name then tells a reader exactly which GitHub job it mirrors.

## Checklist

- Every job key comes from the table; no synonym, no `trigger-` prefix.
- No tool name inside a role name.
- At most one parenthetical, and it is a discriminator.
- Steps with a self-describing single-line `run:` have no `name:`.
- Step names use a verb from the vocabulary.
- GitLab job names equal the GitHub job keys; stages are the five fixed ones.
