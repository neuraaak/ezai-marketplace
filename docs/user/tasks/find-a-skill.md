# Find a skill before installing

Browse, search or inspect the catalogue before you commit to installing anything.

## 🔧 Prerequisites

- The `ezai` command is available ([Get started](../get-started.md))

## 📝 Steps

1. List every skill in the catalogue:

   ```bash
   ezai list
   ```

2. Narrow the list by keyword. The term is matched against the skill name, its category
   and its description:

   ```bash
   ezai search python
   ezai search formatter
   ```

3. Read the full entry for one skill:

   ```bash
   ezai info ezai-cicd-expert
   ```

## ✅ Result

`list` and `search` print one line per skill: name, category and description. `info`
prints the name, version, category, description, path and the skill's listed capabilities.

None of these three commands writes anything to your machine.

## ➡️ Next steps

- [Install skills](./install-skills.md) — install what you found
- [Available skills](../../skills/index.md) — the same catalogue as a table
