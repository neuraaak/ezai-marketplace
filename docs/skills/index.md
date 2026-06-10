# Available skills

All skills are installed to `~/.agents/skills/<name>/` and symlinked into each platform directory.

## 📋 Catalogue

| Skill                          | Category    | Description                                                                                                                                                                                                     |
| :----------------------------- | :---------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ezai-cicd-expert`             | development | CI/CD expert for GitHub Actions and GitLab CI: write, audit, and debug pipelines; caching, matrix builds, OIDC publishing, reusable workflows, and deployment gates for Python and JS/TS projects.              |
| `ezai-code-formatter`          | development | Apply source file visual structure to match project conventions: section header comments, import ordering, spacing, and formatting — without touching logic.                                                    |
| `ezai-docs-specialist-persona` | development | Audit and upgrade an entire documentation site through a 5-stage multi-subagent pipeline: detection, audit, planning (with human gate), generation (via ezai-docs-writer), and validation.                      |
| `ezai-docs-writer`             | development | Write a single documentation artifact for a software project: one .md page (any Diátaxis type), a README, docstrings, or a badge block. For whole-site audits and upgrades, use `ezai-docs-specialist-persona`. |
| `ezai-senior-dev-persona`      | development | Elite Senior Developer persona for enterprise-grade Python and JavaScript/TypeScript projects. Apply for significant development tasks requiring senior-level judgment.                                         |
| `ezai-project-architect`       | development | Architecture and design standards for Python and JS/TS projects: module structure, public API surface, design patterns (Repository, Factory, Composition), Hexagonal architecture, and type system contracts.   |
| `ezai-project-config`          | development | Toolchain setup, project configuration, and infrastructure standards for Python and JS/TS projects: pyproject.toml, package.json, linters, Docker, lockfiles, env vars, and observability.                      |
| `ezai-project-performance`     | development | Concurrency, async patterns, and performance optimization for Python and JS/TS projects: async/await, threading vs multiprocessing, profiling, streaming, and cancellation patterns.                            |
| `ezai-project-quality`         | development | Testing, security, and input validation for Python and JS/TS projects: write tests, secure endpoints, validate schemas, manage secrets, and harden production code.                                             |

## 🔧 Install a skill

```bash
# Install a single skill to all platforms
ezai install ezai-code-formatter

# Install to Claude Code only
ezai install ezai-code-formatter --claude
```

## 🔍 Search skills

```bash
# Filter by keyword
ezai search formatter
ezai search quality

# View full details for a skill
ezai info ezai-project-architect
```
