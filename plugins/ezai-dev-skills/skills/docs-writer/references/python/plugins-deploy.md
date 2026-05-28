# MkDocs Plugins & Deployment

Load this file when configuring MkDocs, setting up plugins, or deploying docs with mike.

## pymdown-extensions

Provides Markdown extensions consumed by MkDocs Material. Minimum recommended set for `mkdocs.yml`:

```yaml
markdown_extensions:
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
  - pymdownx.tabbed:
      alternate_style: true   # required — legacy style is deprecated
  - pymdownx.details          # collapsible ??? blocks
  - pymdownx.highlight:
      anchor_linenums: true
  - pymdownx.inlinehilite     # inline: `#!python x = 1`
  - pymdownx.snippets         # file includes via --8<-- syntax
  - pymdownx.tasklist:
      custom_checkbox: true
  - attr_list                 # required for Material annotations
  - md_in_html                # required for Material annotations
```

Rules:

- `pymdownx.tabbed` requires `alternate_style: true` — omitting it breaks tabbed rendering.
- `pymdownx.details` is the engine behind `???` collapsible admonition blocks.
- `pymdownx.superfences` must be declared **before** `pymdownx.highlight` to avoid conflicts.

---

## mkdocs-coverage

Generates `docs/coverage.md` from a `coverage.xml` report. Not written by hand — built automatically during `mkdocs build`.

```yaml
plugins:
  - coverage:
      page_path: coverage
```

Required run order:

```bash
pytest --cov=my_project --cov-report=xml   # produces coverage.xml
mkdocs build                               # coverage plugin reads coverage.xml → coverage.md
```

---

## mkdocs-section-index

Makes each section's `index.md` simultaneously a navigation node and a clickable page.

```yaml
plugins:
  - section-index
```

Nav requirement — every section with an `index.md` must list it as the **first child entry**:

```yaml
nav:
  - Guides:
      - guides/index.md        # first child — promoted by section-index
      - guides/how-to-configure-x.md
  - API Reference:
      - api/index.md           # first child
      - api/reference/index.md
```

---

## Documentation Versioning (mike)

Use `mike` instead of `mkdocs gh-deploy` for all production deploys.

```yaml
# mkdocs.yml — required
extra:
  version:
    provider: mike
```

| Command                                            | Effect                                          |
| :------------------------------------------------- | :---------------------------------------------- |
| `mike deploy <version> <alias> --push`             | Build, tag, and push docs                       |
| `mike deploy 1.2.0 latest --push --update-aliases` | Push v1.2.0 and move the `latest` alias to it   |
| `mike set-default latest --push`                   | Set the default redirect target on the root URL |
| `mike list`                                        | List all deployed versions                      |
| `mike delete <version> --push`                     | Remove a deployed version                       |

Typical release workflow:

```bash
mike deploy 1.2.0 latest --push --update-aliases
mike set-default latest --push
```

Version alias conventions:

- `latest` — always points to the current stable release.
- Numeric tags follow semver: `1.2.0`, `2.0.0`.
- Do not create a `dev` or `main` alias unless the project explicitly documents pre-release builds.
