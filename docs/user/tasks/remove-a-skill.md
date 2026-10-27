# Remove a skill

Remove one skill, or every ezai skill, from your machine.

## 🔧 Prerequisites

- The `ezai` command is available ([Get started](../get-started.md))
- The skill is installed and is listed in the catalogue

## 📝 Steps

1. Remove a single skill, naming it exactly:

   ```bash
   ezai uninstall ezai-code-formatter
   ```

2. Or remove every ezai skill at once:

   ```bash
   ezai uninstall
   ```

3. Add a platform flag to choose which link is deleted — read the warning below first,
   because this still deletes the shared files:

   ```bash
   ezai uninstall ezai-docs-writer --claude
   ```

## ✅ Result

The skill's files are deleted from `~/.agents/skills/<skill-name>/` and its links are
removed from the selected platform directories. One line is printed per removed link, then
one per removed skill, then a summary.

Other skills are left in place, and so is anything you installed from outside the ezai
catalogue: `uninstall` refuses a name the catalogue does not list, and it deletes a
platform entry only when that entry is a link.

::: warning A platform flag does not keep the skill for the other agents
`uninstall` always deletes the shared files in `~/.agents/skills/`, whichever flags you
pass. A flag only selects which _links_ are removed, so
`ezai uninstall ezai-docs-writer --claude` deletes the files and the Claude Code link, and
leaves any link an earlier version of ezai created elsewhere pointing at something that no
longer exists.
There is no way to remove a skill for one agent and keep it for another.
:::

If the command failed, see [Troubleshooting](../troubleshooting.md).

## ➡️ Next steps

- [Update installed skills](./update-skills.md) — drop skills the catalogue dropped
- [Install skills](./install-skills.md) — put a skill back
