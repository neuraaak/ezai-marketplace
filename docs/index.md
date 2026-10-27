# ezai-marketplace

[![npm version](https://img.shields.io/npm/v/ezai-marketplace?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com/package/ezai-marketplace)
[![node versions](https://img.shields.io/node/v/ezai-marketplace?style=flat&logo=nodedotjs&logoColor=white)](https://www.npmjs.com/package/ezai-marketplace)
[![CI](https://img.shields.io/github/actions/workflow/status/neuraaak/ezai-marketplace/01-ci.yml?style=flat&label=ci&logo=githubactions&logoColor=white)](https://github.com/neuraaak/ezai-marketplace/actions/workflows/01-ci.yml)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue?style=flat&logo=materialformkdocs&logoColor=white)](https://neuraaak.github.io/ezai-marketplace/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat&logo=github&logoColor=white)](https://github.com/neuraaak/ezai-marketplace/blob/main/LICENSE)
[![package manager](https://img.shields.io/badge/package%20manager-pnpm-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![linter](https://img.shields.io/badge/linter-biome-60A5FA?style=flat&logo=biome&logoColor=white)](https://biomejs.dev/)
[![test runner](https://img.shields.io/badge/test%20runner-jest-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io/)

**ezai-marketplace** — CLI to install curated AI skills for Codex, Claude Code, Gemini CLI, Copilot, Vibe, and Kimi Code from a single command.

## 🚀 Quick start

```bash
npm install -g ezai-marketplace

# Install all skills to all detected platforms
ezai install

# Install a single skill
ezai install ezai-code-formatter
```

## ✨ Key features

- One command installs skills for Codex, Gemini CLI, Copilot, Vibe, and Kimi Code, and links them into Claude Code
- Install or uninstall individual skills by name
- Safe uninstall — third-party tools are never touched
- Offline-first — catalogue is bundled, no network required
- Windows-compatible — uses directory junctions when symlinks are unavailable

## 📚 Documentation

The site has two zones. Pick the one that matches why you are here.

### User guide — for people using the skills

| Page                                          | Audience  | Description                                             |
| --------------------------------------------- | --------- | ------------------------------------------------------- |
| **[Get started](./user/get-started)**         | End users | Install the CLI and run your first installation         |
| **[Guides](./user/tasks/)**                   | End users | One page per thing you can do with `ezai`               |
| **[Troubleshooting](./user/troubleshooting)** | End users | Symptoms, causes and fixes for the errors `ezai` prints |
| **[FAQ](./user/faq)**                         | End users | Short answers to recurring questions                    |
| **[Release notes](./user/release-notes)**     | End users | What changed for you in each version                    |

### Developer reference — for contributors and integrators

| Page                                     | Audience     | Description                                      |
| ---------------------------------------- | ------------ | ------------------------------------------------ |
| **[Getting Started](./getting-started)** | Contributors | Every installation route, including from a clone |
| **[CLI Reference](./cli/)**              | Contributors | All commands, options, and flags                 |
| **[Available Skills](./skills/)**        | Contributors | Catalogue of skills with descriptions            |
| **[Concepts](./concepts/)**              | Contributors | Design rationale and architecture explanations   |
| **[Changelog](./changelog)**             | Contributors | Version history and notable changes              |

## 📋 Requirements

- Node.js >= 24.22.1

## ⚖️ License

MIT — see [LICENSE](https://github.com/neuraaak/ezai-marketplace/blob/main/LICENSE).
