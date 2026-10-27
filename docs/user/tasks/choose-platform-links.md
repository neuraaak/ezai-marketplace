# Choose which platform links are created

Limit `ezai install` to the agents you care about, instead of linking into every platform
directory it finds.

## 🔧 Prerequisites

- The `ezai` command is available ([Get started](../get-started.md))

## 📝 Steps

1. By default, no flag is needed. `ezai` links into every platform directory that already
   exists:

   ```bash
   ezai install
   ```

2. Pass one or more flags to restrict that to specific agents:

   ```bash
   # Claude Code link only
   ezai install --claude

   # Gemini CLI link only
   ezai install --gemini

   # Copilot link only
   ezai install --copilot

   # Gemini CLI and Copilot links, without a Claude Code link
   ezai install --gemini --copilot
   ```

3. The same three flags work on `uninstall` and `purge`, where they select which links are
   removed:

   ```bash
   ezai uninstall ezai-docs-writer --claude
   ```

## ✅ Result

One line is printed per link created. A platform directory that does not exist on your
machine is skipped silently — `ezai` never creates `~/.gemini/` or `~/.copilot/` for you.

The available flags are `--claude`, `--gemini` and `--copilot`. There is no flag for Codex,
because Codex reads the shared store directly and needs no link.

## 📚 What a flag does and does not control

Three different things decide whether an agent sees a skill, and a flag only controls the
third:

1. **The shared store is always written.** `ezai install` copies the skill files into
   `~/.agents/skills/` on every run, whatever flags you pass.
2. **Some agents read that store by themselves.** Codex, Gemini CLI and Copilot CLI
   discover `~/.agents/skills/` natively, so they can find a skill with no link at all.
3. **A flag selects which links `ezai` creates.** The links matter for Claude Code, which
   reads only `~/.claude/skills/`, and they are a convenience for Gemini CLI and Copilot
   CLI, which also accept their own directory.

::: warning A flag is not exclusive access
`ezai install --claude` does not hide the skill from the other agents. It writes the same
shared files and simply creates fewer links. Use the flags to control where links go, not
to restrict a skill to one agent.
:::

## ➡️ Next steps

- [How skill installation works](../../concepts/how-skills-work.md) — why links rather than copies
- [Install to a shared directory](./install-to-a-shared-directory.md)
