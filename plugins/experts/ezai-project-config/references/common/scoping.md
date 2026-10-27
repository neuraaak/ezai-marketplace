# Project Config — Scoping questions

Ordered list used by the **Scope** step of `SKILL.md`. Walk it top to bottom, drop every question the request or the repository already answers, then ask the **first three remaining** in a single call. For any question left unasked, apply the recommended option and state it in the response.

Options are listed recommended first, as `label` — `description`. Never add an "Other" option: every harness appends a free-form one.

## 1. `task` — header `Task`

**Ask when** the request does not name the operation ("write a Dockerfile", "configure ruff" already answer it).
**Question:** What should be done to the project's config?

- `Initialize (Recommended)` — Set up the toolchain from scratch with the skill defaults.
- `Audit and fix` — Review the existing config against the standards and correct the gaps.
- `Add one tool` — Configure a single tool without touching the rest.

## 2. `nature` — header `Nature`

**Ask when** neither `[project.scripts]`, `bin` / `exports`, nor a Dockerfile settles it.
**Question:** What kind of project is this?

- `Application or service (Recommended)` — Deployed or run as-is; runtime pinned, Docker relevant.
- `Published library` — Installed by others; supported version range and public exports matter.
- `Internal tool` — Scripts or CLI for the team; minimal packaging.

## 3. `scope` — header `Scope`

**Ask when** the task is not "Add one tool".
**Question:** How far should the configuration go?

- `Baseline + CI (Recommended)` — Lint, format, typecheck, lockfile, plus pre-commit hooks and CI gates.
- `Baseline only` — Lint, format, typecheck and lockfile.
- `Full stack` — Baseline + CI, plus Docker and OpenTelemetry observability.

## 4. `adoption` — header `Adoption`

**Ask when** source code or legacy tools are present (black, flake8, `.eslintrc`, PHP-CS-Fixer without PHPStan, …).
**Question:** How should existing code and tools be handled?

- `Progressive baseline (Recommended)` — Migrate to the standard tools and baseline current violations so the gate stays green.
- `Strict migration` — Migrate and fix every violation now.
- `Keep and complement` — Keep the current tools and only fill the gaps.

## 5. `floor` — header `Floor`

**Ask when** the project is a library and `requires-python` / `engines` / `require.php` is absent.
**Question:** Which minimum runtime version must be supported?

- `Skill default (Recommended)` — Python 3.13, Node 24 or PHP 8.4, matching the language reference.
- `Older version` — Support an older runtime; the user gives it via the free-form answer.

## 6. `typecheck` — header `Typecheck`

**Ask when** the project is Python, type checking is in scope, and no type checker is configured.
**Question:** Which Python type checker?

- `ty (Recommended)` — Fast Astral checker, still in preview.
- `mypy` — Mature and stable, slower.

## 7. `deploy` — header `Deploy`

**Ask when** Docker is in scope.
**Question:** Which target for the container image?

- `Generic OCI image (Recommended)` — Portable multi-stage image with a health check.
- `Specific platform` — Tune for one platform; the user names it via the free-form answer.

## Why these questions

- **Nature** drives the build backend, the `exports` / `[project.scripts]` surface, and whether Docker makes sense at all.
- **Adoption** matters because turning on ruff, Biome or PHPStan on an existing codebase can surface hundreds of errors: a progressive baseline (`per-file-ignores`, `phpstan-baseline.neon`, raising the PHPStan level step by step) keeps the gate green while the debt is paid down.
- **Floor** only matters for libraries: an application picks its own runtime, a library excludes every user below its floor.
- **Typecheck** is the one tool choice the language references leave open. The JS lint toolchain is not asked: Biome for new projects, ESLint + Prettier when already in place.
