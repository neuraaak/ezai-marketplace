# Getting started

Install ezai-marketplace and run your first skill installation in under two minutes.

## 🔧 Prerequisites

- Node.js >= 18.0.0 ([nodejs.org](https://nodejs.org))
- One or more AI platforms installed: Claude Code, Gemini CLI, or Copilot

## 📝 Step 1 — Install the CLI

```bash
npm install -g ezai-marketplace
```

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
