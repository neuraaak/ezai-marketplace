# README Reference

Standards for writing and auditing `README.md` files for open-source Python and JavaScript/TypeScript projects.

---

## Template variables

Every `{placeholder}` in this file resolves from the project's manifest and remote config:

| Variable     | Source                                                | Example                             |
| :----------- | :---------------------------------------------------- | :---------------------------------- |
| `{pkg}`      | Distribution name (`pyproject.toml` / `package.json`) | `ezplog`                            |
| `{owner}`    | Repo owner / namespace                                | `neuraaak`                          |
| `{repo}`     | Repo slug                                             | `ezplog`                            |
| `{workflow}` | CI workflow filename (without `.yml`)                 | `publish-pypi`                      |
| `{docs_url}` | Hosted docs root (see below)                          | `https://neuraaak.github.io/ezplog` |

`{docs_url}` resolves to `https://{owner}.github.io/{repo}` (GitHub Pages) or `https://{owner}.gitlab.io/{repo}` (GitLab Pages).

Internal profile adds: `{version}` (hard-coded release string), `{repo_url}` (clone URL), `{owning_team}`, `{team_channel_or_email}`, `{tracker_url}`.

Resolve all variables before emitting the README — never leave a literal `{...}` in output.

---

## Project profile

Pick a profile before generating — it changes the badge policy, the install section, and which sections apply. Detect it from project signals; do not ask the user if the signals are conclusive.

| Profile      | Detect when…                               |
| :----------- | :----------------------------------------- |
| `public-oss` | Public repo, public registry, OSI license. |
| `internal`   | Private repo, no public registry/license.  |

Default to `public-oss` when signals are mixed or absent. The rest of this file describes `public-oss`; the **Internal profile** subsections below state the deltas.

> This profile is about distribution context, not platform. GitHub vs GitLab is an orthogonal axis handled per-badge above — an `internal` project can be on either.

---

## Badges block

The badges block appears in **two places** in every project — keep them in sync:

| File            | Position                                                      |
| :-------------- | :------------------------------------------------------------ |
| `README.md`     | Immediately after the H1 title, before the logo image         |
| `docs/index.md` | Immediately after the H1 title (no logo on the docs homepage) |

Use `style=flat` for all badges.

### GitHub projects

```markdown
[![PyPI version](https://img.shields.io/pypi/v/{pkg}?style=flat&logo=pypi&logoColor=white)](https://pypi.org/project/{pkg}/)
[![Python versions](https://img.shields.io/pypi/pyversions/{pkg}?style=flat&logo=python&logoColor=white)](https://pypi.org/project/{pkg}/)
[![PyPI status](https://img.shields.io/pypi/status/{pkg}?style=flat&logo=pypi&logoColor=white)](https://pypi.org/project/{pkg}/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat&logo=github&logoColor=white)](https://github.com/{owner}/{repo}/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/{owner}/{repo}/{workflow}.yml?style=flat&label=publish&logo=githubactions&logoColor=white)](https://github.com/{owner}/{repo}/actions/workflows/{workflow}.yml)
[![Docs](https://img.shields.io/badge/docs-Github%20Pages-blue?style=flat&logo=materialformkdocs&logoColor=white)](https://{owner}.github.io/{repo}/)
```

These six are the **core badges** — present on (almost) every project.

> **Tool badges** (package manager, linter, formatter, type checker, test runner, coverage, bundler) are project-specific. Do not hard-code any stack. Detect which tools the project actually uses, then emit their badges from **`common/badge-registry.md`**. A project that configures none of them gets none.

### GitLab projects

Replace the CI and Docs badges — all others are identical:

```markdown
[![CI](https://img.shields.io/gitlab/pipeline-status/{owner}/{repo}?branch=main&style=flat&logo=gitlab&logoColor=white)](https://gitlab.com/{owner}/{repo}/-/pipelines)
[![Docs](https://img.shields.io/badge/docs-GitLab%20Pages-blue?style=flat&logo=gitlab&logoColor=white)](https://{owner}.gitlab.io/{repo}/)
```

### JavaScript/TypeScript projects (npm)

Replace the PyPI badges with npm equivalents:

```markdown
[![npm version](https://img.shields.io/npm/v/{pkg}?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com/package/{pkg})
[![node versions](https://img.shields.io/node/v/{pkg}?style=flat&logo=nodedotjs&logoColor=white)](https://www.npmjs.com/package/{pkg})
[![License](https://img.shields.io/badge/license-MIT-green?style=flat&logo=github&logoColor=white)](https://github.com/{owner}/{repo}/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/{owner}/{repo}/{workflow}.yml?style=flat&label=ci&logo=githubactions&logoColor=white)](https://github.com/{owner}/{repo}/actions)
[![Docs](https://img.shields.io/badge/docs-Github%20Pages-blue?style=flat&logo=readme&logoColor=white)](https://{owner}.github.io/{repo}/)
```

### Internal profile — static badges only

A private registry is unreachable by shields.io, so **never use dynamic version/status badges** — they render as `invalid` or leak internal endpoints. Use static badges with hard-coded values, and drop any badge that would query a public service (PyPI/npm version, PyPI status).

Keep only badges whose value is known at write time:

```markdown
[![version](https://img.shields.io/badge/version-{version}-blue?style=flat)](#)
[![python](https://img.shields.io/badge/python-3.11%2B-blue?style=flat&logo=python&logoColor=white)](#)
[![license](https://img.shields.io/badge/license-Proprietary-red?style=flat)](#)
[![status](https://img.shields.io/badge/status-internal-lightgrey?style=flat)](#)
```

Update `{version}` manually on each release — it does not auto-refresh. Tool badges (`uv`/`ruff`/`ty`) follow the same conditional rule as above and stay dynamic (they point at public tool repos, not your registry).

---

## Logo and tagline

After the badges block:

```markdown
![Logo](docs/assets/logo-min.png)

**{PackageName}** is a {one-line description — what it does and for whom}.
```

The short description must be **bold**, one sentence, and end with a period.

End the README with a footer tagline:

```markdown
---

**{PackageName}** – {Short tagline, imperative or noun phrase}.
```

---

## Section structure

Use this order. All H2 headings carry an emoji prefix.

> **Heading case:** README headings use **Title Case** (e.g. "Quick Start", "Development Setup") — this is an exception to the sentence-case rule that applies to `docs/` pages.
>
> **Emoji set:** The emojis in the table below are authoritative for the README. They may differ from the `docs/` homepage set in `python/standards.md` (e.g. Key Features `🎯` here vs `✨` on the homepage) — this divergence is intentional; do not reconcile.

| #   | Heading                 | Required                     | Notes                                                                                                             |
| --- | ----------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 1   | `📦 Installation`        | Always                       | Include `pip install` or `npm install`. Add subsections if multiple install paths exist (standard, dev, offline). |
| 2   | `🚀 Quick Start`         | Always                       | Self-contained runnable code example.                                                                             |
| 3   | `🎯 Key Features`        | Always                       | Bullet list with `✅` prefix per item.                                                                             |
| 4   | `📚 Documentation`       | Always                       | Navigation table linking to the hosted docs site. See template below.                                             |
| 5   | `🧪 Testing`             | Always                       | Commands to run unit and integration tests.                                                                       |
| 6   | `🛠️ Development Setup`   | Always                       | Clone → install → hooks setup.                                                                                    |
| 7   | `🎨 Main Components`     | When API surface > 3 symbols | Bullet list: `**ClassName**`: one-line role.                                                                      |
| 8   | `📦 Dependencies`        | Always                       | Table or bullet list with version constraints.                                                                    |
| 9   | `🔧 Quick API Reference` | Optional                     | Code block covering the most common call patterns.                                                                |
| 10  | `🛡️ Robustness`          | Optional                     | When error handling is a selling point.                                                                           |
| 11  | `💻 CLI Usage`           | When CLI exists              | Key commands with flags.                                                                                          |
| 12  | `🤝 Contributing`        | Optional                     | Fork → branch → commit → PR steps.                                                                                |
| 13  | `📝 License`             | Always                       | One line + link to LICENSE file.                                                                                  |
| 14  | `🔗 Links`               | Always                       | Repository, PyPI/npm, Docs, Issues.                                                                               |

### Internal profile — section deltas

Apply these changes on top of the table above when the profile is `internal`:

- **`📦 Installation`** — install from source/git only (`pip install git+{repo_url}` or `pip install -e .`). No public registry command.
- **`👥 Ownership`** — **add** after `📝 License`: owning team, contacts, and a link to `CODEOWNERS`. See template below.
- **`📝 License`** — `Proprietary` / `Internal use only` unless an OSI license is explicitly present.
- **`🤝 Contributing`** — internal contribution flow (branch policy, mandatory review via CODEOWNERS). No "fork the project".
- **`🔗 Links`** — replace PyPI/npm and public Issues with the internal repo, docs, and tracker URLs.

```markdown
## 👥 Ownership

Maintained by **{owning_team}**.

- **Code owners**: see [CODEOWNERS](.github/CODEOWNERS)
- **Contact**: {team_channel_or_email}
```

---

## Documentation navigation table (GitHub Pages)

```markdown
## 📚 Documentation

Complete documentation is available at **[{owner}.github.io/{repo}]({docs_url})**

| Section                                            | Description                                    |
| -------------------------------------------------- | ---------------------------------------------- |
| **[Getting Started]({docs_url}/getting-started/)** | Installation, basic usage, and first steps     |
| **[API Reference]({docs_url}/api/)**               | Complete API documentation with examples       |
| **[CLI Reference]({docs_url}/cli/)**               | Command-line interface guide                   |
| **[User Guides]({docs_url}/guides/)**              | Configuration, development, and testing guides |
| **[Examples]({docs_url}/examples/)**               | Practical examples and demonstrations          |
```

For GitLab Pages, replace `{owner}.github.io/{repo}` with `{owner}.gitlab.io/{repo}`.

---

## Anti-patterns

- No emoji in the H1 title or in prose sentences.
- No duplicate `📦` heading (Installation and Dependencies both use it — this is intentional and accepted).
- No relative links to `docs/` pages in the Documentation section — always link to the hosted site.
- No `## Changelog` section in the README — link to `docs/changelog.md` or the releases page instead.
- The footer tagline must not be the same sentence as the H1 short description.
- No centered badges (`<div align="center">`) — keep badges left-aligned, one per line, no HTML wrapper.

---

## Audit checklist

When auditing an existing `README.md`, verify:

- [ ] Profile (`public-oss` / `internal`) correctly identified, and badge policy + sections match it.
- [ ] Badge block present and left-aligned, immediately after H1.
- [ ] Internal profile only: no dynamic registry/version badges; `👥 Ownership` present; no public registry install command.
- [ ] Badge block matches the one in `docs/index.md` (same badges, same order). Flag any drift.
- [ ] Every tool badge maps to a tool actually configured in the project (cross-check against `badge-registry.md`); no tool badge for an absent tool.
- [ ] CI/Docs badges use the platform-correct variant (GitHub vs GitLab).
- [ ] No literal `{placeholder}` left unresolved.
- [ ] Required sections (Always rows) all present and in canonical order.
- [ ] Documentation section links to the hosted site, not relative `docs/` paths.
- [ ] Footer tagline differs from the H1 short description.
