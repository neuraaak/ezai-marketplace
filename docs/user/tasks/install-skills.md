# Install skills

Install every skill in the catalogue, or a single one by name. Running the command again
on a skill you already have replaces it with the current version.

## 🔧 Prerequisites

- The `ezai` command is available ([Get started](../get-started.md))
- The exact skill name, if you want only one — see [Find a skill before installing](./find-a-skill.md)

## 📝 Steps

1. Install everything:

   ```bash
   ezai install
   ```

2. Or install one skill, naming it exactly as the catalogue does:

   ```bash
   ezai install ezai-project-quality
   ```

## ✅ Result

The skill files are copied to `~/.agents/skills/<skill-name>/`, which Codex, Gemini CLI
and Copilot CLI read directly. `ezai` then creates a link in each platform directory that
already exists on your machine — `~/.claude/skills/`, `~/.gemini/skills/`,
`~/.copilot/skills/` — so Claude Code finds the skill too.

One line is printed per copied file, then one line per link, then a summary naming the
directory the skills were installed into.

::: warning An agent that was already running
An agent discovers skills when it starts. Restart your agent session after installing.
:::

If the command failed, see [Troubleshooting](../troubleshooting.md).

## ➡️ Next steps

- [Choose which platform links are created](./choose-platform-links.md)
- [Update installed skills](./update-skills.md)
- [Remove a skill](./remove-a-skill.md)
