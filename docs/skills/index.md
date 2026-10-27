# Available skills

All skills are installed to `~/.agents/skills/<name>/`, which Codex, Gemini CLI, Copilot CLI, Vibe, and Kimi Code discover directly. ezai also creates a link in an existing Claude Code directory, the one harness that reads only its own.

## 📋 Catalogue

| Skill                          | Category    | Description                                                                                                                                                                                                                                                                                 |
| :----------------------------- | :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ezai-cicd-expert`             | development | CI/CD expert for GitHub Actions and GitLab CI: write, audit, and debug pipelines; caching, matrix builds, OIDC publishing, reusable workflows, and deployment gates for Python and JS/TS projects.                                                                                          |
| `ezai-code-formatter`          | development | Apply source file visual structure to match project conventions: section header comments, import ordering, spacing, and formatting — without touching logic.                                                                                                                                |
| `ezai-docs-specialist-persona` | development | Audit and upgrade an entire documentation site through a 5-stage multi-subagent pipeline: detection, audit, planning (with human gate), generation (via ezai-docs-writer), and validation.                                                                                                  |
| `ezai-docs-writer`             | development | Write a single documentation artifact for a software project: one .md page (a Diátaxis page for developer docs, or a product page for end users and admins), release notes, a README, docstrings, or a badge block. For whole-site audits and upgrades, use `ezai-docs-specialist-persona`. |
| `ezai-senior-dev-persona`      | development | Elite Senior Developer persona for enterprise-grade Python and JavaScript/TypeScript projects. Apply for significant development tasks requiring senior-level judgment.                                                                                                                     |
| `ezai-project-architect`       | development | Architecture and design standards for Python and JS/TS projects: module structure, public API surface, design patterns (Repository, Factory, Composition), Hexagonal architecture, and type system contracts.                                                                               |
| `ezai-project-config`          | development | Toolchain setup, project configuration, and infrastructure standards for Python and JS/TS projects: pyproject.toml, package.json, linters, Docker, lockfiles, env vars, and observability.                                                                                                  |
| `ezai-project-performance`     | development | Concurrency, async patterns, and performance optimization for Python and JS/TS projects: async/await, threading vs multiprocessing, profiling, streaming, and cancellation patterns.                                                                                                        |
| `ezai-project-quality`         | development | Testing, security, and input validation for Python and JS/TS projects: write tests, secure endpoints, validate schemas, manage secrets, and harden production code.                                                                                                                         |

## ➡️ Next steps

- [CLI Reference](../cli/) — the `install`, `search` and `info` commands
- [Find a skill before installing](../user/tasks/find-a-skill.md) — search and inspect the catalogue
- [Install skills](../user/tasks/install-skills.md) — install everything, or one skill by name
