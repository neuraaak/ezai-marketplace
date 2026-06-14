# ezai-marketplace

[![npm version](https://img.shields.io/npm/v/ezai-marketplace?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com/package/ezai-marketplace)
[![node versions](https://img.shields.io/node/v/ezai-marketplace?style=flat&logo=nodedotjs&logoColor=white)](https://www.npmjs.com/package/ezai-marketplace)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat&logo=github&logoColor=white)](https://github.com/Neuraaak/ezai-marketplace/blob/main/LICENSE)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue?style=flat&logo=readme&logoColor=white)](https://Neuraaak.github.io/ezai-marketplace/)
[![package manager](https://img.shields.io/badge/package%20manager-pnpm-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![linter](https://img.shields.io/badge/linter-eslint-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)
[![formatter](https://img.shields.io/badge/formatter-prettier-F7B93E?style=flat&logo=prettier&logoColor=white)](https://prettier.io/)
[![test runner](https://img.shields.io/badge/test%20runner-jest-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io/)

**ezai-marketplace** — CLI to install curated AI skills into Claude Code, Gemini CLI, and Copilot from a single command.

## 🚀 Quick start

```bash
npm install -g ezai-marketplace

# Install all skills to all detected platforms
ezai install

# Install a single skill
ezai install ezai-code-formatter
```

## ✨ Key features

- One command deploys to Claude Code, Gemini CLI, and Copilot simultaneously
- Install or uninstall individual skills by name
- Safe uninstall — third-party tools are never touched
- Offline-first — catalogue is bundled, no network required
- Windows-compatible — uses directory junctions when symlinks are unavailable

## 📚 Documentation

| Section                                  | Description                                       |
| ---------------------------------------- | ------------------------------------------------- |
| **[Getting Started](./getting-started)** | Installation, first run, and platform setup       |
| **[CLI Reference](./cli/)**              | All commands, options, and flags                  |
| **[Available Skills](./skills/)**        | Catalogue of skills with descriptions             |
| **[User Guides](./guides/)**             | Configuration, platform setup, and advanced usage |
| **[Examples](./examples/)**              | Copy-paste CLI scenarios for common operations    |
| **[Concepts](./concepts/)**              | Design rationale and architecture explanations    |
| **[Changelog](./changelog)**             | Version history and notable changes               |

## 📋 Requirements

- Node.js >= 24.16.0

## ⚖️ License

MIT — see [LICENSE](https://github.com/Neuraaak/ezai-marketplace/blob/main/LICENSE).
