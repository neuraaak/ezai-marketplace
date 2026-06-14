# Getting started

Install ezai-marketplace and run your first skill installation in under two minutes.

## 🔧 Prerequisites

- Node.js >= 24.16.0 ([nodejs.org](https://nodejs.org))
- One or more AI platforms installed: Claude Code, Gemini CLI, or Copilot

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
npm install -g "git+https://github.com/Neuraaak/ezai-marketplace.git#v1.2.1"

# Short form
npm install -g github:Neuraaak/ezai-marketplace
```

If a restricted environment blocks the `prepare` hook, append `--ignore-scripts`.

**Clone + link** (work from a local checkout):

```bash
git clone https://github.com/Neuraaak/ezai-marketplace.git && cd ezai-marketplace && npm install && npm link
```

**Run from a clone** (no install at all):

```bash
node bin/ezai.js install <plugin>
```

**Windows without Node** — from a cloned copy:

```bat
scripts\install.bat <plugin>
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

ezai detects which platform directories exist on your machine (`~/.claude/skills/`, `~/.gemini/skills/`, `~/.copilot/skills/`) and deploys symlinks to each one automatically.

You should see one line of output per platform directory where skills were deployed.

## 📝 Step 4 — Verify the installation

Check that skills are visible to Claude Code:

```bash
ls ~/.claude/skills/
```

You should see one directory per installed skill.

## ✅ What you built

You installed the ezai-marketplace CLI and deployed all curated AI skills to every AI platform detected on your machine. Skills are stored once in `~/.agents/skills/` and symlinked into each platform directory.

## ➡️ Next steps

- [CLI Reference](./cli/) — explore all commands and flags
- [Available Skills](./skills/) — learn what each skill does
- [Guides](./guides/) — configure platforms individually or set a custom install path
