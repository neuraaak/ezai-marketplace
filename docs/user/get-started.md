# Get started with ezai

At the end of this page, every curated ezai skill is installed on your machine and
available to the AI agents you already use.

## 🔧 Prerequisites

- Node.js 24.22.1 or later ([nodejs.org](https://nodejs.org))
- At least one agent installed: Codex, Claude Code, Gemini CLI or Copilot CLI

::: tip No Node.js on Windows?
Skip to [Set up on Windows](./tasks/set-up-on-windows.md), which uses a bundled batch
script instead.
:::

## 📝 Steps

1. Install the CLI from npm:

   ```bash
   npm install -g ezai-marketplace
   ```

   If the public npm registry is not reachable from your machine, install it straight from
   git instead:

   ```bash
   npm install -g "git+https://github.com/neuraaak/ezai-marketplace.git#v1.6.3"
   ```

   ::: tip
   If a restricted environment blocks the `prepare` hook, append `--ignore-scripts`.
   :::

2. Check that the command is available:

   ```bash
   ezai --version
   ```

   The installed version number is printed.

3. See which skills are on offer:

   ```bash
   ezai list
   ```

   One line per skill is printed, with its category and description.

4. Install all of them:

   ```bash
   ezai install
   ```

   One line is printed per copied file, then one line per link created.

5. Check what landed:

   ```bash
   ls ~/.agents/skills/
   ```

## ✅ Result

`~/.agents/skills/` holds one directory per skill. Codex, Gemini CLI and Copilot CLI read
that directory directly. For Claude Code — and for Gemini CLI and Copilot CLI, which also
accept their own directory — `ezai` created a link in each platform directory that already
existed on your machine, for example `~/.claude/skills/`.

You never need to repeat the installation per agent: the files exist once and every link
points at them.

## ➡️ Next steps

- [Install a single skill](./tasks/install-skills.md) — add or refresh one skill by name
- [Find a skill before installing](./tasks/find-a-skill.md) — search and inspect the catalogue
- [Choose which platform links are created](./tasks/choose-platform-links.md)
- [Troubleshooting](./troubleshooting.md) — if a command failed
