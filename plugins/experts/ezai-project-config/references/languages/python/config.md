# Config & Toolchain — Python

## Rules

- **VENV**: always `.venv`. Never install globally.
- **TOOLS**: `uv` (packages), `ruff` (lint/format), `ty` (types — see note), `poethepoet` (tasks), `pre-commit` (gates), `mkdocs` (docs).
- **TYPES**: `ty` (Astral) is the forward default but still **in preview** — recommend it for new projects, and keep `mypy` as the stable fallback for teams that need maturity today. Pick one; don't run both as blocking gates. `basedpyright` is a solid alternative for VS Code/Cursor teams (open-source Pylance features).
- **LINT (deep)**: `ruff` covers PEP8 + a dozen tools, but `pylint` adds inter-file semantic analysis Ruff doesn't yet do — add it as a **CI-only second pass** if the project needs it, never as a pre-commit gate (too slow/noisy).
- **BACKEND**: `hatchling` as the build backend — no `setuptools`, no `flit`.
- **CENTRAL**: all tool config in `pyproject.toml` — no `setup.cfg`, no `tox.ini`.
- **VERSION**: Python 3.13+ minimum. Pin in `.python-version`.

## Environment

```bash
uv venv                          # create .venv
uv sync                          # install deps from uv.lock
uv run poe lint                  # tasks declared in [tool.poe.tasks]
uv run poe test
uv run poe check                 # lint + typecheck + test in one pass

uv run pytest                    # raw form — same thing, spelled out
uv run ruff check .
uv run ruff format .
uv run ty check
```

Declare each dev command once in `[tool.poe.tasks]` and call it from the README, the
pipeline and `pre-commit` — the role `package.json` scripts play in JS and
`composer.json` scripts in PHP. Raw invocations stay valid; they just duplicate.

## `.python-version`

```text
3.14
```

Commit this file to pin the Python version used by `uv` and `pyenv`. It pins the
**dev interpreter** (latest stable) — the supported floor is `requires-python`
(3.13+), which is what the CI matrix drives from.

## `pyproject.toml` — full structure

Section order (the emojis aid visual navigation):

```toml
# 🔨 Build system
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

# src-layout: hatchling cannot guess the package path, the wheel ships empty without this
[tool.hatch.build.targets.wheel]
packages = ["src/my_project"]

# 📦 Metadata
[project]
name = "my-project"
version = "0.1.0"
requires-python = ">=3.13"
dependencies = []

# 🧰 Dev tooling (PEP 735 — `dev` is installed by `uv sync` by default)
[dependency-groups]
lint = ["ruff", "pre-commit"]
typing = ["ty"]
test = ["pytest", "pytest-cov"]
docs = ["mkdocs", "mkdocs-material"]
dev = [
    "poethepoet",
    {include-group = "lint"},
    {include-group = "typing"},
    {include-group = "test"},
    {include-group = "docs"},
]

# 🎯 Tasks (poethepoet — the project's command surface)
[tool.poe.tasks]
lint = "ruff check ."
format = "ruff format ."
typecheck = "ty check"
test = "pytest --cov"
check = ["lint", "typecheck", "test"]   # aggregate — what CI and contributors run

# 🎨 Linting
[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "F",   # pyflakes
    "I",   # isort
    "S",   # bandit (security)
    "UP",  # pyupgrade
]
ignore = []

# 🖌️ Formatting
[tool.ruff.format]
quote-style = "double"
indent-style = "space"
line-ending = "auto"

# 🔍 Type checking — ty (preview default)
[tool.ty]
strict = true

# Stable fallback — use instead of [tool.ty] if you need maturity today
# [tool.mypy]
# strict = true

# 🧪 Tests
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-v --tb=short"
```

Always document ruff rule selections with inline comments.

## Dependency groups (PEP 735)

`[dependency-groups]` declares dependencies the **project** needs but the
**package** does not. They are never published: they live only in the source
tree, so a consumer installing the wheel never resolves them.

### Nomenclature

Use these names — a CI job, a `poe` task and a contributor should guess the
group without reading `pyproject.toml`. One group per gate of `poe check`.

| Group    | Holds                                                                              | Who installs it             |
| :------- | :--------------------------------------------------------------------------------- | :-------------------------- |
| `lint`   | `ruff`, `pre-commit`                                                               | the lint job, the hooks     |
| `typing` | `ty` (or `mypy`)                                                                   | the typecheck job           |
| `test`   | `pytest` and its plugins, fixtures, factories                                      | the test matrix             |
| `docs`   | `mkdocs` and its plugins                                                           | the docs build, ReadTheDocs |
| `dev`    | nothing of its own but `poethepoet` — it aggregates the others via `include-group` | a contributor's `uv sync`   |

Add a group only when something installs it alone. `bench`, `typing-stubs` or
`security` earn their place the day a job asks for them, not before.

`dev` is special: `uv sync` installs it with no flag, so it must pull in every
group a contributor needs. Keep it an aggregate — a tool pinned directly in
`dev` is a tool no CI job can install without dragging in the whole toolchain.

### Installing

```bash
uv sync                           # default group: dev (so: everything)
uv sync --group test              # one gate only — what a CI job runs
uv sync --no-default-groups       # runtime deps alone
uv run --group docs mkdocs build  # one-shot, without touching .venv's groups
```

### Not `[project.optional-dependencies]`

The two look alike and do opposite jobs:

|                        | `[dependency-groups]`       | `[project.optional-dependencies]` |
| :--------------------- | :-------------------------- | :-------------------------------- |
| Published in the wheel | no                          | yes                               |
| Installed by           | `uv sync --group X`         | `pip install pkg[X]`              |
| For                    | the project's own toolchain | features a **consumer** opts into |

So: `test`, `lint`, `docs` are groups. `postgres`, `redis`, `cli` — extras a
user of your library enables — stay extras. A tool in `optional-dependencies`
leaks your CI into every install of your package; a feature extra hidden in a
group is unreachable for anyone who installed from PyPI.

Only extras can be self-referenced (`pkg[all] = ["pkg[postgres]", …]`); groups
compose with `include-group` instead, and may not be cyclic.

## Monorepo — uv workspaces

One lockfile, one `.venv`, several packages. Each member keeps its own
`pyproject.toml`; the root declares the workspace:

```toml
# pyproject.toml (root)
[tool.uv.workspace]
members = ["packages/*"]

# a member depending on another member
[project]
dependencies = ["my-core"]

[tool.uv.sources]
my-core = { workspace = true }
```

```bash
uv sync                      # resolves the whole workspace at once
uv run --package my-api pytest   # act on one member
```

`[tool.uv.sources]` is dev-only metadata: on publish, `my-core` resolves from
PyPI like any other dependency, so a workspace member stays installable alone.
Dependency groups are declared per member, not at the root — a package that
needs `pytest` says so itself.

Reach for a workspace when the packages are released together. Two products on
their own release cadence are two repositories.

## `pre-commit` — config

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.9.0          # pin to the latest ruff release
    hooks:
      - id: ruff-check   # the `ruff` hook was renamed `ruff-check`
        args: [--fix]
      - id: ruff-format
  # Type-check with the same checker declared in pyproject.toml (ty)
  - repo: local
    hooks:
      - id: ty
        name: ty
        entry: uv run ty check
        language: system
        types: [python]
        pass_filenames: false
# Stable fallback — swap the local `ty` hook for mypy if you chose it instead:
#   - repo: local
#     hooks:
#       - id: mypy
#         name: mypy
#         entry: uv run mypy
#         language: system
#         types: [python]
```

```bash
uv run pre-commit install   # enable Git hooks
uv run pre-commit run --all-files  # run manually
```

## `mkdocs` — minimal config

```yaml
# mkdocs.yml
site_name: My Project
theme:
  name: material
nav:
  - Home: index.md
  - API: api/
plugins:
  - search
  - mkdocstrings:
      handlers:
        python:
          options:
            docstring_style: google
```

## Core syntax (3.13+)

```python
from pathlib import Path             # pathlib only, not os.path

def read_file(path: str | Path) -> bytes:   # union with |, not Union[]
    with Path(path).open("rb") as f:
        return f.read()
```

- **`from __future__ import annotations`: drop it the day `requires-python`
  reaches `>=3.14`; keep it below.** PEP 649 evaluates
  annotations lazily by default, so forward references already work unquoted.
  The future import is deprecated (removal planned once 3.13 is EOL) and opts
  back into the old stringified behaviour, which costs runtime introspection
  (`annotationlib`, `pydantic`, `dataclasses`).
- `pathlib.Path` exclusively for filesystem operations
- Union syntax `int | str` (not `Union`)
- `with` statements for any resource cleanup
- `t-strings` (PEP 750) for safe templating in 3.14+

## Docker multi-stage (Python)

```dockerfile
# Build stage
FROM python:3.14-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Runtime stage
FROM python:3.14-slim
RUN useradd -m appuser
USER appuser
WORKDIR /app
COPY --from=builder /app/.venv .venv
COPY src/ src/
HEALTHCHECK --interval=30s --timeout=5s CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"
CMD [".venv/bin/python", "-m", "my_project"]
```

- Exact tags — never `python:latest`
- `--frozen` in CI to honor the lockfile
- Non-root user in the runtime stage

## Environment variables

```python
import os

def get_env(key: str, default: str | None = None) -> str:
    value = os.environ.get(key, default)
    if value is None:
        raise RuntimeError(f"Required environment variable '{key}' is not set")
    return value

DATABASE_URL = get_env("DATABASE_URL")
API_KEY = get_env("API_KEY")
```

## Success criteria

- `uv` exclusively for package management; `uv.lock` committed.
- `pyproject.toml` is the single source of truth.
- `hatchling` as the build backend.
- `ruff lint` + `ruff format` configured with commented rules.
- Dev commands declared once in `[tool.poe.tasks]` — not duplicated across README, CI and `pre-commit`.
- `pre-commit` installed with ruff + a type-check hook (`ty` by default, `mypy` as the stable fallback).
- Multi-stage Docker images, non-root, pinned tags.
- Secrets via environment variables — never hard-coded.
