# Documentation References Index

Root router. Four reference groups, loaded on demand. All paths below are
written from this `references/` root.

| Need                                                              | Go to                | What lives there                                             |
| :---------------------------------------------------------------- | :------------------- | :----------------------------------------------------------- |
| Language-specific docs (docstrings, toolchain, deploy, badges)    | `languages/index.md` | per-language routing + "load when" for Python, JS/TS and PHP |
| A badge block (CI/Docs/License shields)                           | `forge/index.md`     | per-forge routing for GitHub and GitLab (badges only)        |
| Page structure and templates for the site's documentation profile | `profiles/index.md`  | profile selection, then structure rules and page templates   |
| Cross-cutting, language-agnostic                                  | `common/`            | shared writing rules, README rules, scoping questions        |

## How to route

1. **Detect the language** (`pyproject.toml` → Python, `package.json` → JS/TS, `composer.json` → PHP), then open `languages/index.md` and load the files it lists for the task.
2. **For a badge block**, also detect the forge (GitHub vs GitLab) and open `forge/index.md` — load the **pair**: `forge/<host>/badge-registry.md` + `languages/<lang>/badge-registry.md`.
3. **Always pair the language `standards.md` with `common/standards.md`.** Page structure and templates (`profiles/`) are language-agnostic.

---

## Common (`common/`)

- `common/standards.md` — rules shared by every language and profile: heading case, emoji set, badges, admonition semantics (always pair with the language `standards.md`)
- `common/readme.md` — generating a `README.md`
- `common/scoping.md` — Scope step, before anything else: ordered scoping questions and recommended defaults

## Profiles (`profiles/`)

- `profiles/index.md` — pick the documentation profile, then load its `structure.md` + `templates.md`

For everything language- or forge-specific, defer to `languages/index.md` and
`forge/index.md`.
