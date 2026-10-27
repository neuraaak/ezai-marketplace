# Install to a shared directory

Put the skills store somewhere other than your home directory — for example a directory
shared between several accounts or projects.

## 🔧 Prerequisites

- The `ezai` command is available ([Get started](../get-started.md))
- The target directory **already exists**; `ezai` will not create it
- Write access to that directory

## 📝 Steps

1. If the directory is inside your home directory or inside the directory you are running
   the command from, `--dest` is enough:

   ```bash
   ezai install --dest ~/workspaces/shared
   ```

2. For any other location, name its absolute path in `EZAI_ALLOWED_DEST_ROOT` in the same
   command:

   ```bash
   EZAI_ALLOWED_DEST_ROOT=/opt/shared/ai-tools ezai install --dest /opt/shared/ai-tools
   ```

3. Pass the same `--dest` — and the same `EZAI_ALLOWED_DEST_ROOT` when it is needed — to
   `uninstall` and `purge`, or they will look in the default location instead:

   ```bash
   EZAI_ALLOWED_DEST_ROOT=/opt/shared/ai-tools ezai uninstall --dest /opt/shared/ai-tools
   ```

## ✅ Result

The skills are installed into `<dest>/.agents/skills/<skill-name>/`.

The Claude Code link is **not** moved: it is still created under your home directory, in
`~/.claude/skills/`, pointing at the new location.

Codex finds a custom store automatically only when `<dest>` is the directory you are
working in or one of its ancestors. An unrelated path such as `/opt/shared/ai-tools` is
outside the places Codex looks, so for Codex you need the store in its default home
location.

::: warning `--dest` is deliberately restricted
`ezai` deletes and recreates directories under `--dest`, so a typo must not be able to
write anywhere on the disk. The path is rejected unless it sits inside your home
directory, your current directory, or the absolute root you named in
`EZAI_ALLOWED_DEST_ROOT`. A `.agents` entry that is a link pointing out of the allowed
root is rejected as well.
:::

If the path is refused, see
[Troubleshooting](../troubleshooting.md).

## ➡️ Next steps

- [Choose whether a platform link is created](./choose-platform-links.md)
- [Use a remote catalogue](./use-a-remote-catalogue.md)
