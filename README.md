# ezai-marketplace

[![npm version](https://img.shields.io/npm/v/ezai-marketplace?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com/package/ezai-marketplace)
[![Node.js](https://img.shields.io/node/v/ezai-marketplace?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat&logo=github&logoColor=white)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-Jest-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io)

**ezai-marketplace** — CLI to install curated AI skills into Claude Code, Gemini CLI, and Copilot.

## 🚀 Quick start

```bash
# Install the CLI globally
npm install -g ezai-marketplace

# Install all skills (deployed to ~/.claude/skills/, ~/.gemini/skills/, ~/.copilot/skills/)
ezai install

# Or install a single skill
ezai install ezai-code-formatter
```

Skills are copied to `~/.agents/skills/<name>/` and symlinked into each platform's skills directory automatically.

## ✨ Key features

- **One command, all platforms** — installs and symlinks to Claude Code, Gemini CLI, and Copilot in one shot
- **Atomic control** — install or uninstall individual skills by name
- **Platform flags** — deploy only to the platforms you use (`--claude`, `--gemini`, `--copilot`)
- **Safe uninstall** — only removes skills known to the marketplace; third-party tools are never touched
- **Offline-first** — catalogue is bundled with the package, no network required

## 📦 Available skills

| Skill | Description |
| :---- | :---------- |
| `ezai-code-formatter` | Apply visual source structure: section headers, import ordering, spacing — without touching logic |
| `ezai-docs-writer` | Produce MkDocs pages, API references, changelogs, and technical writing |
| `ezai-persona-senior-dev` | Elite Senior Developer persona for enterprise-grade Python and JS/TS projects |
| `ezai-project-architect` | Architecture and design standards: module structure, public API surface, design patterns |
| `ezai-project-config` | Toolchain setup and configuration: pyproject.toml, package.json, linters, CI/CD |
| `ezai-project-performance` | Concurrency, async patterns, profiling, and caching strategies |
| `ezai-project-quality` | Testing, security, and input validation standards |

## 💻 CLI reference

### `ezai list`

List all available skills in the marketplace.

```bash
ezai list
```

### `ezai search <term>`

Search skills by name, category, or description.

```bash
ezai search formatter
ezai search development
```

### `ezai info <skill>`

Display detailed information about a skill.

```bash
ezai info ezai-code-formatter
```

### `ezai install [skill]`

Install one skill or all skills into `~/.agents/skills/` and symlink them to platform directories.

```bash
# Install all skills to all platforms
ezai install

# Install a specific skill
ezai install ezai-project-quality

# Install only to Claude Code
ezai install --claude

# Install a skill to Gemini CLI and Copilot only
ezai install ezai-docs-writer --gemini --copilot
```

| Option | Description |
| :----- | :---------- |
| `--dest <path>` | Override the base destination directory (default: home directory) |
| `--claude` | Deploy symlinks to `~/.claude/skills/` only |
| `--gemini` | Deploy symlinks to `~/.gemini/skills/` only |
| `--copilot` | Deploy symlinks to `~/.copilot/skills/` only |

When no platform flag is set, symlinks are deployed to every platform directory that already exists on your machine.

### `ezai uninstall [skill]`

Remove one skill or all marketplace skills from `~/.agents/skills/` and their platform symlinks.

```bash
# Remove all marketplace skills
ezai uninstall

# Remove a specific skill
ezai uninstall ezai-code-formatter

# Remove only the Claude Code symlink (keep the skill files)
ezai uninstall ezai-code-formatter --claude
```

| Option | Description |
| :----- | :---------- |
| `--dest <path>` | Override the base directory (default: home directory) |
| `--claude` | Remove symlinks from `~/.claude/skills/` only |
| `--gemini` | Remove symlinks from `~/.gemini/skills/` only |
| `--copilot` | Remove symlinks from `~/.copilot/skills/` only |

Skills not present in the marketplace catalogue are never touched, regardless of what is found in `~/.agents/skills/`.

## ⚙️ How it works

```
npm install -g ezai-marketplace
        │
        ▼
ezai install [skill]
        │
        ├─ copies plugin files → ~/.agents/skills/<name>/
        │
        └─ creates symlinks   → ~/.claude/skills/<name>
                               → ~/.gemini/skills/<name>
                               → ~/.copilot/skills/<name>
```

On Windows, directory junctions are used instead of symlinks (no administrator rights required).

The catalogue (`marketplace.json`) is bundled with the package. Set `EZAI_CATALOGUE_URL` to override with a remote catalogue URL.

## 📋 Requirements

- Node.js >= 18.0.0

## ⚖️ License

MIT — see [LICENSE](LICENSE).
