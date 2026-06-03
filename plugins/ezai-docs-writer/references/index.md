# Documentation References Index

Route to the correct files based on the project language **and** platform.

## Language routing

| Language              | Subdirectory  |
| :-------------------- | :------------ |
| Python                | `python/`     |
| JavaScript/TypeScript | `javascript/` |

## Platform routing (badges only)

| Platform | Detect via                             | Badge registry             |
| :------- | :------------------------------------- | :------------------------- |
| GitHub   | `github.com` remote / `.github/`       | `github/badge-registry.md` |
| GitLab   | `gitlab.com` remote / `.gitlab-ci.yml` | `gitlab/badge-registry.md` |

When emitting a badge block, load the **pair**: platform registry + language registry. For JS/TS page templates, also load `python/quadrants-templates.md` — templates are language-agnostic.

---

## Python (`python/`)

Stack: MkDocs + Material + mkdocstrings + Diátaxis framework.

- `python/quadrants-templates.md` — generating or auditing any doc page
- `python/standards.md` — writing/auditing docstrings, checking emoji/admonitions, reviewing quality
- `python/plugins-deploy.md` — configuring MkDocs plugins, deploying with mike, release cascade (auto-tag → publish-pypi → docs), git-cliff changelog
- `python/badge-registry.md` — emitting a badge block (PyPI version + tool badges)

---

## JavaScript/TypeScript (`javascript/`)

Stack: VitePress or Docusaurus + TypeDoc + JSDoc/TSDoc + Diátaxis framework.

- `javascript/standards.md` — writing/auditing JSDoc, reviewing JS/TS doc quality
- `javascript/badge-registry.md` — emitting a badge block (npm version + tool badges)
- `javascript/plugins-deploy.md` — configuring VitePress plugins (versioning, sidebar), deploying to GitHub Pages

For page templates, use `python/quadrants-templates.md` — replace Python snippets with TypeScript/JavaScript equivalents.

---

## Common (`common/`)

- `common/readme.md` — generating or auditing a `README.md`

---

## Platform (`github/` · `gitlab/`)

- `github/badge-registry.md` — core badges for GitHub projects (CI, Docs, License)
- `gitlab/badge-registry.md` — core badges for GitLab projects (CI, Docs, License)

---

## Adding a new language

1. Create a `<language>/` subdirectory.
2. Add `standards.md` and `badge-registry.md` at minimum.
3. Register in the language routing table above.
