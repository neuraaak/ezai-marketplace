# Languages Index

Routing for language-specific references. All paths are written from the
`references/` root.

| Language              | Subdirectory            | Detect via                     |
| :-------------------- | :---------------------- | :----------------------------- |
| Python                | `languages/python/`     | `pyproject.toml`, `*.py`       |
| JavaScript/TypeScript | `languages/javascript/` | `package.json`, `*.ts`, `*.js` |
| PHP                   | `languages/php/`        | `composer.json`, `*.php`       |

Each language pairs with `common/` for the language-agnostic layer. Load only
what the task needs.

---

## Python (`languages/python/`)

Stack: MkDocs + Material + mkdocstrings + Diátaxis framework.

- `languages/python/standards.md` — Python/MkDocs specifics: Google-style docstrings, admonition/annotation syntax (**pair with** `common/standards.md`)
- `languages/python/toolchain.md` — choosing the docs tool stack, scaffolding `mkdocs.yml` from scratch (canonical config + best practices)
- `languages/python/plugins-deploy.md` — configuring MkDocs plugins, deploying with mike, release cascade (auto-tag → publish-pypi → docs), git-cliff changelog
- `languages/python/badge-registry.md` — emitting a badge block (PyPI version + tool badges); pair with the forge registry in `forge/`

---

## JavaScript/TypeScript (`languages/javascript/`)

Stack: VitePress or Docusaurus + TypeDoc + JSDoc/TSDoc + Diátaxis framework.

- `languages/javascript/standards.md` — JS/TS specifics: JSDoc/TSDoc syntax, VitePress admonition syntax (**pair with** `common/standards.md`)
- `languages/javascript/toolchain.md` — choosing the docs tool stack, scaffolding `docs/.vitepress/config.mts` from scratch (canonical config + best practices)
- `languages/javascript/plugins-deploy.md` — wiring VitePress nav/sidebar, API reference, versioning, deploying to GitHub Pages
- `languages/javascript/badge-registry.md` — emitting a badge block (npm version + tool badges); pair with the forge registry in `forge/`
- `languages/javascript/docusaurus.md` — Docusaurus sites (`docusaurus.config.*`): config, sidebar, landing page and badges, admonitions, TypeDoc plugin, versioning, deploy. Load **instead of** the VitePress parts of `toolchain.md` and `plugins-deploy.md`
- `languages/javascript/starlight.md` — Starlight sites (`astro.config.*` importing `@astrojs/starlight`): config, content collection, sidebar, front matter titles and badges, asides, TypeDoc plugin, i18n, deploy. Load **instead of** the VitePress parts of `toolchain.md` and `plugins-deploy.md`

For page templates, use the site profile's `profiles/<profile>/templates.md` — replace Python snippets with TypeScript/JavaScript equivalents.

---

## PHP (`languages/php/`)

Stack: phpDocumentor or Doctum (API reference) + VitePress for prose + Diátaxis framework.

- `languages/php/standards.md` — PHP specifics: PHPDoc tag syntax, the PHP 8 attribute rule, `@api`/`@internal` scoping (**pair with** `common/standards.md`)
- `languages/php/toolchain.md` — choosing the docs tool stack, scaffolding `phpdoc.dist.xml` / `doctum.php` from scratch (canonical configs + best practices)
- `languages/php/plugins-deploy.md` — running phpDocumentor/Doctum, multi-version, deploying the API + prose site to GitHub Pages
- `languages/php/badge-registry.md` — emitting a badge block (Packagist version + tool badges); pair with the forge registry in `forge/`

PHP API generators render the reference only — prose pages reuse the VitePress prose layer with the site profile's `profiles/<profile>/templates.md` (replace snippets with PHP equivalents).

---

## Adding a new language

1. Create a `languages/<language>/` subdirectory.
2. Add `standards.md` and `badge-registry.md` at minimum.
3. Register in the routing table above.
