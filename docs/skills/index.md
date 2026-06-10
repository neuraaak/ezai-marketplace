# Available skills

All skills are installed to `~/.agents/skills/<name>/` and symlinked into each platform directory.

## 📋 Catalogue

| Skill                      | Category    | Description                                                                                                                                                                                |
| :------------------------- | :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ezai-cicd-expert`         | development | CI/CD pipeline expert for GitHub Actions and GitLab CI on Python and JS/TS projects: write, audit, and debug pipelines, plus strategy on caching, secrets, environments, and deploy gates. |
| `ezai-code-formatter`      | development | Apply source file visual structure to match project conventions: section header comments, import ordering, spacing, and formatting — without touching logic.                               |
| `ezai-docs-writer`         | development | Produce documentation content for software projects: MkDocs pages, API references, changelogs, and technical writing in a consistent style.                                                |
| `ezai-senior-dev-persona`  | development | Elite Senior Developer persona for enterprise-grade Python and JavaScript/TypeScript projects. Apply for significant development tasks requiring senior-level judgment.                    |
| `ezai-project-architect`   | development | Architecture and design standards for Python and JS/TS projects: module structure, public API surface, and design patterns (Repository, Service, Factory).                                 |
| `ezai-project-config`      | development | Toolchain setup, project configuration, and infrastructure standards for Python and JS/TS projects: pyproject.toml, package.json, linters, CI/CD.                                          |
| `ezai-project-performance` | development | Concurrency, async patterns, and performance optimization for Python and JS/TS projects: async/await, threading vs multiprocessing, profiling, and caching strategies.                     |
| `ezai-project-quality`     | development | Testing, security, and input validation standards for Python and JS/TS projects: test architecture with pytest/Vitest, security patterns, and code quality enforcement.                    |

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
