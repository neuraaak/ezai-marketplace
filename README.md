# ezai-marketplace

[![npm version](https://img.shields.io/npm/v/ezai-marketplace?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com/package/ezai-marketplace)
[![node versions](https://img.shields.io/node/v/ezai-marketplace?style=flat&logo=nodedotjs&logoColor=white)](https://www.npmjs.com/package/ezai-marketplace)
[![CI](https://img.shields.io/github/actions/workflow/status/neuraaak/ezai-marketplace/01-ci.yml?style=flat&label=ci&logo=githubactions&logoColor=white)](https://github.com/neuraaak/ezai-marketplace/actions/workflows/01-ci.yml)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue?style=flat&logo=materialformkdocs&logoColor=white)](https://neuraaak.github.io/ezai-marketplace/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat&logo=github&logoColor=white)](https://github.com/neuraaak/ezai-marketplace/blob/main/LICENSE)
[![package manager](https://img.shields.io/badge/package%20manager-pnpm-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![linter](https://img.shields.io/badge/linter-eslint-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)
[![formatter](https://img.shields.io/badge/formatter-prettier-F7B93E?style=flat&logo=prettier&logoColor=white)](https://prettier.io/)
[![test runner](https://img.shields.io/badge/test%20runner-jest-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io/)

**ezai-marketplace** is a CLI that installs curated AI skills for Codex, Claude Code, Gemini CLI, and Copilot from a single command.

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
npm install -g "git+https://github.com/neuraaak/ezai-marketplace.git#v1.6.3"

# Short form (latest default branch)
npm install -g github:neuraaak/ezai-marketplace
```

> If a restricted environment blocks the `prepare` hook, append `--ignore-scripts`.

### Clone + link

```bash
git clone https://github.com/neuraaak/ezai-marketplace.git && cd ezai-marketplace && npm install && npm link
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

**Requirements:** Node.js >= 24.22.1 (contributors also need pnpm >= 11).

## 🚀 Quick Start

```bash
# Install all skills to all detected platforms
ezai install

# Install a single skill
ezai install ezai-code-formatter

# Create only the Claude Code platform links
ezai install --claude
```

Skills are copied to `~/.agents/skills/<name>/`, where Codex discovers them directly. When their directories exist, Claude Code receives links in `~/.claude/skills/`; Gemini CLI and Copilot CLI can also discover the shared store directly, and ezai creates links in their platform directories when selected. On Windows, directory junctions are used instead of symlinks (no administrator rights required).

## 🎯 Key Features

- ✅ **One command, all platforms** — installs for Codex and creates links for Claude Code, Gemini CLI, and Copilot in one shot
- ✅ **Atomic control** — install or uninstall individual skills by name
- ✅ **Platform flags** — select which platform links to create (`--claude`, `--gemini`, `--copilot`); shared skills remain discoverable
- ✅ **Safe uninstall** — only removes skills known to the marketplace; third-party tools are never touched
- ✅ **Offline-first** — catalogue is bundled with the package, no network required
- ✅ **Windows-compatible** — uses directory junctions when symlinks are unavailable

## 📚 Documentation

Complete documentation is available at **[neuraaak.github.io/ezai-marketplace](https://neuraaak.github.io/ezai-marketplace/)**

| Section                                                                             | Audience     | Description                                       |
| ----------------------------------------------------------------------------------- | ------------ | ------------------------------------------------- |
| **[User Guide](https://neuraaak.github.io/ezai-marketplace/user/)**                 | End users    | Get started, task guides, troubleshooting, FAQ    |
| **[Release Notes](https://neuraaak.github.io/ezai-marketplace/user/release-notes)** | End users    | What changed in each version, and what to redo    |
| **[Getting Started](https://neuraaak.github.io/ezai-marketplace/getting-started/)** | Contributors | Every installation route, including from a clone  |
| **[CLI Reference](https://neuraaak.github.io/ezai-marketplace/cli/)**               | Contributors | All commands, options, and flags                  |
| **[Available Skills](https://neuraaak.github.io/ezai-marketplace/skills/)**         | Contributors | Catalogue of skills with descriptions             |
| **[Concepts](https://neuraaak.github.io/ezai-marketplace/concepts/)**               | Contributors | How installation works, and the design trade-offs |

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
git clone https://github.com/neuraaak/ezai-marketplace.git
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

| Command                  | What it does                                          |
| :----------------------- | :---------------------------------------------------- |
| `ezai list`              | Lists every skill in the catalogue                    |
| `ezai search <term>`     | Filters skills by name, category, or description      |
| `ezai info <skill>`      | Shows one skill's metadata and capabilities           |
| `ezai install [skill]`   | Installs every skill, or one by name                  |
| `ezai uninstall [skill]` | Removes every marketplace skill, or one by name       |
| `ezai purge`             | Drops stale `ezai-` skills no longer in the catalogue |

```bash
# Install everything, then install one skill for Gemini CLI and Copilot only
ezai install
ezai install ezai-docs-writer --gemini --copilot
```

`install` and `uninstall` take the same options:

| Option          | Description                                                       |
| :-------------- | :---------------------------------------------------------------- |
| `--dest <path>` | Override the base destination directory (default: home directory) |
| `--claude`      | Select the links in `~/.claude/skills/`                           |
| `--gemini`      | Select the links in `~/.gemini/skills/`                           |
| `--copilot`     | Select the links in `~/.copilot/skills/`                          |

Three things are worth knowing before you use them:

- A platform flag selects **which links are created or removed** — it is not exclusive
  access. Skills always land in the shared `~/.agents/skills/` store, which Codex reads
  directly and the other agents can read too. With no flag, links go to every platform
  directory that already exists.
- `uninstall` deletes the skill files from `~/.agents/skills/` **even with a platform
  flag**, so links in the unselected directories may be left broken. Skills absent from
  the catalogue are never touched.
- `--dest` must point inside your home or current working directory. For a shared
  directory elsewhere, set `EZAI_ALLOWED_DEST_ROOT` to its absolute path first.

Full command reference, flag by flag, in the
**[CLI Reference](https://neuraaak.github.io/ezai-marketplace/cli/)**; step-by-step
recipes in the **[User Guide](https://neuraaak.github.io/ezai-marketplace/user/tasks/)**.

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

- **Repository**: [github.com/neuraaak/ezai-marketplace](https://github.com/neuraaak/ezai-marketplace)
- **npm**: [npmjs.com/package/ezai-marketplace](https://www.npmjs.com/package/ezai-marketplace)
- **Docs**: [neuraaak.github.io/ezai-marketplace](https://neuraaak.github.io/ezai-marketplace/)
- **Issues**: [github.com/neuraaak/ezai-marketplace/issues](https://github.com/neuraaak/ezai-marketplace/issues)

---

**ezai-marketplace** – One command to skill up every AI agent on your machine.
