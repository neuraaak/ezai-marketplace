# ezai-marketplace

[![npm version](https://img.shields.io/npm/v/ezai-marketplace?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com/package/ezai-marketplace)
[![node versions](https://img.shields.io/node/v/ezai-marketplace?style=flat&logo=nodedotjs&logoColor=white)](https://www.npmjs.com/package/ezai-marketplace)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat&logo=github&logoColor=white)](https://github.com/Neuraaak/ezai-marketplace/blob/main/LICENSE)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue?style=flat&logo=readme&logoColor=white)](https://Neuraaak.github.io/ezai-marketplace/)
[![package manager](https://img.shields.io/badge/package%20manager-npm-CB3837?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![linter](https://img.shields.io/badge/linter-eslint-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)
[![formatter](https://img.shields.io/badge/formatter-prettier-F7B93E?style=flat&logo=prettier&logoColor=white)](https://prettier.io/)
[![test runner](https://img.shields.io/badge/test%20runner-jest-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io/)

**ezai-marketplace** is a CLI that installs curated AI skills into Claude Code, Gemini CLI, and Copilot from a single command.

## 📦 Installation

```bash
npm install -g ezai-marketplace
```

Requires Node.js >= 18.0.0.

## 🚀 Quick Start

```bash
# Install all skills to all detected platforms
ezai install

# Install a single skill
ezai install ezai-code-formatter

# Install only to Claude Code
ezai install --claude
```

Skills are copied to `~/.agents/skills/<name>/` and symlinked into each platform's skills directory automatically. On Windows, directory junctions are used instead of symlinks (no administrator rights required).

## 🎯 Key Features

- ✅ **One command, all platforms** — installs and symlinks to Claude Code, Gemini CLI, and Copilot in one shot
- ✅ **Atomic control** — install or uninstall individual skills by name
- ✅ **Platform flags** — deploy only to the platforms you use (`--claude`, `--gemini`, `--copilot`)
- ✅ **Safe uninstall** — only removes skills known to the marketplace; third-party tools are never touched
- ✅ **Offline-first** — catalogue is bundled with the package, no network required
- ✅ **Windows-compatible** — uses directory junctions when symlinks are unavailable

## 📚 Documentation

Complete documentation is available at **[Neuraaak.github.io/ezai-marketplace](https://Neuraaak.github.io/ezai-marketplace/)**

| Section                                                                             | Description                                       |
| ----------------------------------------------------------------------------------- | ------------------------------------------------- |
| **[Getting Started](https://Neuraaak.github.io/ezai-marketplace/getting-started/)** | Installation, basic usage, and first steps        |
| **[CLI Reference](https://Neuraaak.github.io/ezai-marketplace/cli/)**               | All commands, options, and flags                  |
| **[Available Skills](https://Neuraaak.github.io/ezai-marketplace/skills/)**         | Catalogue of skills with descriptions             |
| **[User Guides](https://Neuraaak.github.io/ezai-marketplace/guides/)**              | Configuration, platform setup, and advanced usage |

## 🧪 Testing

```bash
# Run the full test suite
npm test

# Run lint checks
npm run lint
```

## 🛠️ Development Setup

```bash
# Clone the repository
git clone https://github.com/Neuraaak/ezai-marketplace.git
cd ezai-marketplace

# Install dependencies (also sets up git hooks via simple-git-hooks)
npm install

# Rebuild the marketplace index
npm run build-index
```

The `prepare` script configures a `pre-commit` hook that rebuilds `marketplace.json`, stages it, runs lint-staged, and executes the test suite before each commit.

## 🎨 Main Components

- **`src/catalogue.js`** — loads and queries the bundled `marketplace.json` catalogue
- **`src/commands/install.js`** — copies skill files and creates platform symlinks or junctions
- **`src/commands/uninstall.js`** — removes marketplace-managed skills and symlinks safely
- **`src/commands/list.js`** — lists all skills available in the catalogue
- **`src/commands/search.js`** — filters skills by name, category, or description keyword
- **`src/commands/info.js`** — displays detailed metadata for a single skill

## 💻 CLI Usage

### `ezai list`

```bash
ezai list
```

### `ezai search <term>`

```bash
ezai search formatter
ezai search development
```

### `ezai info <skill>`

```bash
ezai info ezai-code-formatter
```

### `ezai install [skill]`

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

| Option          | Description                                                       |
| :-------------- | :---------------------------------------------------------------- |
| `--dest <path>` | Override the base destination directory (default: home directory) |
| `--claude`      | Deploy symlinks to `~/.claude/skills/` only                       |
| `--gemini`      | Deploy symlinks to `~/.gemini/skills/` only                       |
| `--copilot`     | Deploy symlinks to `~/.copilot/skills/` only                      |

When no platform flag is set, symlinks are deployed to every platform directory that already exists on your machine.

### `ezai uninstall [skill]`

```bash
# Remove all marketplace skills
ezai uninstall

# Remove a specific skill
ezai uninstall ezai-code-formatter

# Remove only the Claude Code symlink (keep the skill files)
ezai uninstall ezai-code-formatter --claude
```

| Option          | Description                                           |
| :-------------- | :---------------------------------------------------- |
| `--dest <path>` | Override the base directory (default: home directory) |
| `--claude`      | Remove symlinks from `~/.claude/skills/` only         |
| `--gemini`      | Remove symlinks from `~/.gemini/skills/` only         |
| `--copilot`     | Remove symlinks from `~/.copilot/skills/` only        |

Skills not present in the marketplace catalogue are never touched, regardless of what is found in `~/.agents/skills/`.

## 📦 Dependencies

| Package            | Role                   | Version   |
| :----------------- | :--------------------- | :-------- |
| `commander`        | CLI framework          | `^12.0.0` |
| `eslint`           | Linter                 | `^10.4.0` |
| `prettier`         | Formatter              | `^3.8.3`  |
| `jest`             | Test runner            | `^29.0.0` |
| `lint-staged`      | Pre-commit lint runner | `^17.0.5` |
| `simple-git-hooks` | Git hooks manager      | `^2.13.1` |

## 📝 License

MIT — see [LICENSE](LICENSE).

## 🔗 Links

- **Repository**: [github.com/Neuraaak/ezai-marketplace](https://github.com/Neuraaak/ezai-marketplace)
- **npm**: [npmjs.com/package/ezai-marketplace](https://www.npmjs.com/package/ezai-marketplace)
- **Docs**: [Neuraaak.github.io/ezai-marketplace](https://Neuraaak.github.io/ezai-marketplace/)
- **Issues**: [github.com/Neuraaak/ezai-marketplace/issues](https://github.com/Neuraaak/ezai-marketplace/issues)

---

**ezai-marketplace** – One command to skill up every AI agent on your machine.
