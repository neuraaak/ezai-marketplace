# Use a remote catalogue

Replace the skill list bundled with the package by one published at a URL — for example a
list your team maintains.

## 🔧 Prerequisites

- The `ezai` command is available ([Get started](../get-started.md))
- A reachable URL returning a JSON document with a `plugins` array
- Network access from your machine

## 📝 Steps

1. Set `EZAI_CATALOGUE_URL` in the command you run:

   ```bash
   EZAI_CATALOGUE_URL=https://example.com/catalogue.json ezai install
   ```

2. The same variable applies to every command that reads the catalogue — `list`, `search`,
   `info`, `install`, `uninstall` and `purge`:

   ```bash
   EZAI_CATALOGUE_URL=https://example.com/catalogue.json ezai list
   ```

## ✅ Result

The command uses the remote list instead of the bundled one. The request times out after
10 seconds.

::: warning A remote list does not ship the skill files
`install` still copies from the skill files bundled inside your installed
`ezai-marketplace` package. If the remote list names a skill that is not in your package,
the installation stops with `Plugin "<name>" absent du paquet local` and nothing already
installed is removed. Upgrade the package to get the files.
:::

If the URL cannot be read, see [Troubleshooting](../troubleshooting.md).

## ➡️ Next steps

- [Install skills](./install-skills.md)
- [Install to a shared directory](./install-to-a-shared-directory.md)
