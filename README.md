# ezai-marketplace

[![npm version](https://img.shields.io/npm/v/ezai-marketplace?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com/package/ezai-marketplace)
[![node versions](https://img.shields.io/node/v/ezai-marketplace?style=flat&logo=nodedotjs&logoColor=white)](https://www.npmjs.com/package/ezai-marketplace)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat&logo=github&logoColor=white)](https://github.com/Neuraaak/ezai-marketplace/blob/main/LICENSE)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue?style=flat&logo=readme&logoColor=white)](https://Neuraaak.github.io/ezai-marketplace/)
[![package manager](https://img.shields.io/badge/package%20manager-pnpm-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![linter](https://img.shields.io/badge/linter-eslint-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)
[![formatter](https://img.shields.io/badge/formatter-prettier-F7B93E?style=flat&logo=prettier&logoColor=white)](https://prettier.io/)
[![test runner](https://img.shields.io/badge/test%20runner-jest-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io/)

**ezai-marketplace** is a CLI that installs curated AI skills into Claude Code, Gemini CLI, and Copilot from a single command.

## 📦 Installation

ezai-marketplace works the same whether you pull it from the public npm registry or
straight from git — the package bundles every plugin, so installation never needs a
runtime registry fetch (see [Why git/offline install works](#why-gitoffline-install-works)).
Pick whichever path your environment allows.

### From npm (convenience)

```bash
npm install -g ezai-marketplace
```

> Use this only if the public npm registry is reachable from your machine.

### From git (no registry needed)

```bash
# Pin a tag (recommended)
npm install -g "git+https://github.com/Neuraaak/ezai-marketplace.git#v1.2.1"

# Short form (latest default branch)
npm install -g github:Neuraaak/ezai-marketplace
```

> If a restricted environment blocks the `prepare` hook, append `--ignore-scripts`.

### Clone + link

```bash
git clone https://github.com/Neuraaak/ezai-marketplace.git && cd ezai-marketplace && npm install && npm link
```

### Run from a clone (no install)

```bash
node bin/ezai.js install <plugin>
```

### Windows without Node

From a cloned copy, use the bundled batch wrapper. Like `ezai install`, it
copies `SKILL.md` + `references/` into `.agents\skills\` and creates junctions
into the platform skills folders (`~\.claude`, `~\.gemini`, `~\.copilot`) that
exist:

```bat
scripts\install.bat              REM all plugins
scripts\install.bat <plugin>     REM a single plugin
scripts\install.bat <plugin> <dest>   REM custom destination (default: %USERPROFILE%)
```

### Why git/offline install works

The npm package bundles all plugins — `package.json`'s `files` field includes `plugins/`
and `.claude-plugin/`. The `install` command reads them from the local package, with no
runtime registry fetch, and the catalogue is local by default (`EZAI_CATALOGUE_URL` only
overrides the remote _listing_, not installation). So once you have the package by any
means, `ezai install` works fully offline.

**Requirements:** Node.js >= 24.16.0 (contributors also need pnpm >= 11).

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

# Install dependencies (also sets up git hooks via husky)
npm install

# Rebuild the marketplace index
npm run build-index
```

The `prepare` script configures a `pre-commit` hook that rebuilds `marketplace.json`, stages it, runs lint-staged, and executes the test suite before each commit.

## 🎨 Main Components

- **`src/catalogue.js`** — loads and queries the bundled `marketplace.json` catalogue
- **`src/commands/install.js`** — copies skill files and creates platform symlinks or junctions
- **`src/commands/uninstall.js`** — removes marketplace-managed skills and symlinks safely
- **`src/commands/purge.js`** — drops stale `ezai-` skills no longer in the catalogue
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

### `ezai purge`

Drops **stale** `ezai-` skills installed locally but no longer in the catalogue
(typically orphans left after a skill is renamed or removed upstream). Skills
still in the catalogue are untouched, and no reinstall is performed — run it after
upgrading the package to clean up.

```bash
# Drop every stale skill, then refresh
ezai purge
ezai install
```

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

| Package       | Role                   | Version   |
| :------------ | :--------------------- | :-------- |
| `commander`   | CLI framework          | `^12.0.0` |
| `eslint`      | Linter                 | `^10.4.0` |
| `prettier`    | Formatter              | `^3.8.3`  |
| `jest`        | Test runner            | `^29.0.0` |
| `lint-staged` | Pre-commit lint runner | `^17.0.5` |
| `husky`       | Git hooks manager      | `^9.1.7`  |

## 📝 License

MIT — see [LICENSE](LICENSE).

## 🔗 Links

- **Repository**: [github.com/Neuraaak/ezai-marketplace](https://github.com/Neuraaak/ezai-marketplace)
- **npm**: [npmjs.com/package/ezai-marketplace](https://www.npmjs.com/package/ezai-marketplace)
- **Docs**: [Neuraaak.github.io/ezai-marketplace](https://Neuraaak.github.io/ezai-marketplace/)
- **Issues**: [github.com/Neuraaak/ezai-marketplace/issues](https://github.com/Neuraaak/ezai-marketplace/issues)

---

**ezai-marketplace** – One command to skill up every AI agent on your machine.
