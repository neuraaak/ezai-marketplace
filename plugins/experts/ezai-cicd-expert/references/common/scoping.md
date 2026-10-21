# CI/CD Expert — Scoping questions

Ordered list used by the **Scope** step of `SKILL.md`. Walk it top to bottom, drop every question the request or the repository already answers, then ask the **first three remaining** in a single call. For any question left unasked, apply the recommended option and state it in the response.

Options are listed recommended first, as `label` — `description`. Never add an "Other" option: every harness appends a free-form one.

When the task is **Debug**, skip every question after `task`: the failing log is the scope.

## 1. `task` — header `Task`

**Ask when** the request does not name the operation (a pasted failing log means Debug; "write a workflow" means Write).
**Question:** What should be done with the pipeline?

- `Write a pipeline (Recommended)` — Generate the workflows from the project's actual toolchain.
- `Audit the pipeline` — Review the existing one: security, correctness, speed, then style.
- `Debug a failure` — Diagnose a failing job from its log.

## 2. `platform` — header `Platform`

**Ask when** there is neither `.github/workflows/` nor `.gitlab-ci.yml`, and the git remote does not point to GitHub or GitLab.
**Question:** Which CI platform runs the pipeline?

- `GitHub Actions (Recommended)` — Workflows in `.github/workflows/`.
- `GitLab CI` — A single `.gitlab-ci.yml` with the five fixed stages.

## 3. `delivery` — header `Delivery`

**Ask when** writing a pipeline and the request does not say what it ships.
**Question:** What should the pipeline deliver beyond validation?

- `Validation only (Recommended)` — Lint, type-check, test and build; nothing leaves CI.
- `Publish a package` — Validate on every PR, publish to PyPI / npm / Packagist when the version changes.
- `Deploy an application` — Validate, then deploy to protected environments.

## 4. `matrix` — header `Matrix`

**Ask when** writing a pipeline and no test matrix exists yet.
**Question:** Which runtime versions should the tests cover?

- `Supported range (Recommended)` — One job per supported version, from the declared floor to the latest.
- `Single version` — The pinned dev version only; cheapest, enough for an application.
- `Versions × OS` — Range crossed with Linux, macOS and Windows; only for cross-platform code.

## 5. `auth` — header `Auth`

**Ask when** the delivery includes publishing and no publish workflow exists yet.
**Question:** How should the registry authenticate the publish job?

- `OIDC trusted publishing (Recommended)` — Short-lived token; requires registering the workflow file on the registry.
- `Stored token` — A registry token in CI secrets; works everywhere, must be rotated.

## 6. `environments` — header `Envs`

**Ask when** the delivery is "Deploy an application" and no environment is declared yet.
**Question:** Which deploy environments should the pipeline target?

- `Staging + production (Recommended)` — Automatic staging on the default branch, manual approval for production.
- `Production only` — One protected environment behind a manual approval.

## 7. `docs` — header `Docs`

**Ask when** a docs tool is configured (`mkdocs.yml`, VitePress, Docusaurus) and no docs workflow exists.
**Question:** Should the pipeline also deploy the documentation?

- `Versioned docs (Recommended)` — Build on every path, deploy one folder per release after publish.
- `Latest only` — Build on every path, deploy a single site from the default branch.
- `No docs deploy` — Build-check only, never deploy.

## Why these questions

- **Delivery** decides the pipeline shape: validation mode only, or validation plus a release mode (tag → publish → docs).
- **Matrix** is the main cost lever: each cell costs runner minutes, so a library pays for its supported range while an application tests its pinned version.
- **Auth** is asked before writing because OIDC requires a one-time registration of the exact workflow filename on the registry — renaming that file later breaks publishing.
- Production always gets a manual gate (see `principles.md`), so `environments` asks which targets exist, never whether to gate them.
