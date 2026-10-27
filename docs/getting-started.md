# Getting started

Install ezai-marketplace and run your first skill installation in under two minutes.

## 🔧 Prerequisites

- Node.js >= 24.22.1 ([nodejs.org](https://nodejs.org))
- One or more AI platforms installed: Codex, Claude Code, Gemini CLI, Copilot, Vibe, or Kimi Code

## 📝 Step 1 — Install the CLI

Pick the path that fits your environment. They all produce the same `ezai` command — the
package bundles every plugin, so installation never needs to reach a registry at runtime.

**Quick path — from npm** (if the public registry is reachable):

```bash
npm install -g ezai-marketplace
```

**From git** (no registry needed):

```bash
# Pin a tag (recommended)
npm install -g "git+https://github.com/neuraaak/ezai-marketplace.git#v1.6.3"

# Short form
npm install -g github:neuraaak/ezai-marketplace
```

If a restricted environment blocks the `prepare` hook, append `--ignore-scripts`.

**Clone + link** (work from a local checkout):

```bash
git clone https://github.com/neuraaak/ezai-marketplace.git && cd ezai-marketplace && npm install && npm link
```

**Run from a clone** (no install at all):

```bash
node bin/ezai.js install <plugin>
```

**Windows without Node** — from a cloned copy:

```bat
scripts\install.bat              REM all plugins
scripts\install.bat <plugin>     REM a single plugin
```

> Offline-first: every plugin ships inside the package and the catalogue is local by
> default, so once you have the package by any means, `ezai install` works without network
> access.

Verify the installation:

```bash
ezai --version
```

You should see the current version number printed to the terminal.

## 📝 Step 2 — Browse available skills

```bash
ezai list
```

You should see a table listing all skills in the catalogue with their category and description.

## 📝 Step 3 — Install all skills

```bash
ezai install
```

ezai installs skills in `~/.agents/skills/`, where Codex, Gemini CLI, Copilot CLI, Vibe, and Kimi Code discover them directly. It also deploys a symlink to `~/.claude/skills/` when that directory exists, because Claude Code reads only its own.

You should see one line of output per platform directory where skills were deployed.

## 📝 Step 4 — Verify the installation

Check the shared store used by Codex and other compatible harnesses:

```bash
ls ~/.agents/skills/
```

If Claude Code is installed, check its platform links too:

```bash
ls ~/.claude/skills/
```

You should see one directory per installed skill in the shared store and, when applicable, in the Claude Code directory.

## ✅ What you built

You installed the ezai-marketplace CLI and stored the curated skills in `~/.agents/skills/` for Codex and other compatible harnesses. An existing Claude Code directory also received links.

## ➡️ Next steps

- [CLI Reference](./cli/) — explore all commands and flags
- [Available Skills](./skills/) — learn what each skill does
- [User guide](./user/) — task guides, troubleshooting and FAQ for people using the skills
