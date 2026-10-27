# Choose whether a platform link is created

Decide whether `ezai install` links the skills into Claude Code, or leaves only the shared
store that the other agents read by themselves.

## 🔧 Prerequisites

- The `ezai` command is available ([Get started](../get-started.md))

## 📝 Steps

1. By default, no flag is needed. `ezai` writes the shared store and links into
   `~/.claude/skills/` when that directory already exists:

   ```bash
   ezai install
   ```

2. Pass `--no-links` to write the shared store and create no link at all:

   ```bash
   ezai install --no-links
   ```

3. `--claude` asks for the same link the default already creates. It is kept for scripts
   that state their intent explicitly, and it cannot be combined with `--no-links`:

   ```bash
   ezai install --claude
   ```

4. On `uninstall` and `purge`, `--claude` selects the link to remove:

   ```bash
   ezai uninstall ezai-docs-writer --claude
   ```

## ✅ Result

One line is printed per link created. A platform directory that does not exist on your
machine is skipped silently — `ezai` never creates `~/.claude/` for you.

There is no flag for Codex, Gemini CLI or Copilot CLI: all three read `~/.agents/skills/`
natively, so they need no link. `--no-links` is the only way to install without touching
`~/.claude/skills/`.

## 📚 What a link does and does not control

Three different things decide whether an agent sees a skill, and a link only controls the
third:

1. **The shared store is always written.** `ezai install` copies the skill files into
   `~/.agents/skills/` on every run, whatever flags you pass.
2. **Most agents read that store by themselves.** Codex, Gemini CLI and Copilot CLI
   discover `~/.agents/skills/` natively, so they find a skill with no link at all.
3. **The link covers the one agent that cannot.** Claude Code reads only
   `~/.claude/skills/`, so its link is the single one `ezai` has to create.

::: warning `--no-links` is not a way to hide a skill
`ezai install --no-links` does not keep the skill away from your agents. It writes the same
shared files, which Codex, Gemini CLI and Copilot CLI still discover. It only skips the
Claude Code link.
:::

## ➡️ Next steps

- [How skill installation works](../../concepts/how-skills-work.md) — why links rather than copies
- [Install to a shared directory](./install-to-a-shared-directory.md)
