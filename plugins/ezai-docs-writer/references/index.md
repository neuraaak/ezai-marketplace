# Documentation References Index

Route to the correct language subdirectory based on the project language.

## Supported languages

| Language              | Subdirectory  | Available files                                               |
| :-------------------- | :------------ | :------------------------------------------------------------ |
| Python                | `python/`     | `quadrants-templates.md`, `standards.md`, `plugins-deploy.md` |
| JavaScript/TypeScript | `javascript/` | `standards.md`                                                |

---

## Python (`python/`)

Stack: MkDocs + Material + mkdocstrings + Diátaxis framework.

Load only the file(s) needed for the current task:

| File                            | Load when…                                                                 | Contents                                                                                     |
| :------------------------------ | :------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| `python/quadrants-templates.md` | Generating or auditing any doc page                                        | Diátaxis table, nav structure, all 7 page templates, badges, naming                          |
| `python/standards.md`           | Writing/auditing docstrings, checking emoji/admonitions, reviewing quality | Core rules, Google docstrings, admonitions, Material annotations, emoji table, anti-patterns |
| `python/plugins-deploy.md`      | Configuring MkDocs, setting up plugins, deploying                          | pymdown-extensions, mkdocs-coverage, section-index, mike versioning                          |

Most tasks need only one file. Full audit → load all three.

---

## JavaScript/TypeScript (`javascript/`)

Stack: VitePress or Docusaurus + TypeDoc + JSDoc/TSDoc comments + Diátaxis framework.

Load only the file(s) needed for the current task:

| File                      | Load when…                                              | Contents                                                              |
| :------------------------ | :------------------------------------------------------ | :-------------------------------------------------------------------- |
| `javascript/standards.md` | Writing/auditing JSDoc, reviewing doc quality for JS/TS | Core rules, JSDoc format (TS vs JS), TypeDoc toolchain, anti-patterns |

For page templates (Tutorial, How-To, Reference, Explanation, CLI, Examples, Homepage), use `python/quadrants-templates.md` — the templates are language-agnostic; replace Python code snippets with TypeScript/JavaScript equivalents.

---

---

## Common (`common/`)

Language-agnostic references shared across all projects.

| File                       | Load when…                                                          | Contents                                                                                                                                                |
| :------------------------- | :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `common/readme.md`         | Generating or auditing a `README.md`                                | Project profile (public-oss vs internal), badges block (GitHub vs GitLab, Python vs JS/TS), section structure with emoji, docs nav table, anti-patterns |
| `common/badge-registry.md` | Selecting tool badges (linter, type checker, package manager, etc.) | Catalog of tool badges by role for Python and JS/TS, with detection signals and logo slugs                                                              |

---

## Adding a new language

1. Create a `<language>/` subdirectory here.
2. Add at minimum a `standards.md` covering docstring style and quality rules.
3. Register the language in the table above with its available files.
