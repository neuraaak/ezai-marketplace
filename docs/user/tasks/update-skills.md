# Update installed skills

Bring your machine in line with the catalogue after upgrading the `ezai-marketplace`
package. This both drops skills that no longer exist and refreshes the ones that do.

## 🔧 Prerequisites

- The `ezai` command is available ([Get started](../get-started.md))

## 📝 Steps

1. Upgrade the package itself:

   ```bash
   npm install -g ezai-marketplace
   ```

2. Drop the skills that are no longer in the catalogue:

   ```bash
   ezai purge
   ```

3. Reinstall the current catalogue:

   ```bash
   ezai install
   ```

## ✅ Result

`purge` removes every skill whose name starts with `ezai-` that is still on your machine
but no longer listed in the catalogue — typically a skill that was renamed upstream. It
prints one line per removed skill, or `Aucun skill obsolète à purger.` when there is
nothing to do. It never removes a skill that is still in the catalogue, and it never
reinstalls anything, which is why step 3 follows.

`install` then copies the current version of every catalogue skill over the old files.

Skills you installed from somewhere else are untouched: `purge` only ever considers names
beginning with `ezai-` that the catalogue no longer lists.

## ➡️ Next steps

- [Release notes](../release-notes.md) — what changed in this version
- [Remove a skill](./remove-a-skill.md)
