# Troubleshooting

One entry per problem you can hit while using `ezai`. The messages `ezai` prints are in
French; they are quoted here exactly as they appear in your terminal.

## The skill name is not recognised when installing

**Symptom** — `ezai install` stops with
`Plugin "<name>" introuvable dans le catalogue.` followed by
`Utilisez ezai list pour voir les plugins disponibles.`

**Cause** — The name does not match a catalogue entry. Names are case-sensitive and all
start with `ezai-`.

**Fix**

1. List the exact names:

   ```bash
   ezai list
   ```

2. Run the command again with the name copied from that output.

Nothing was installed or removed, so there is nothing to undo.

## The skill is in the list but its files are missing

**Symptom** — `ezai install` stops with
`Plugin "<name>" absent du paquet local — mettez à jour ezai.`

**Cause** — The catalogue names a skill whose files are not in the version of
`ezai-marketplace` you have installed. This happens with an outdated package, or with a
[remote catalogue](./tasks/use-a-remote-catalogue.md) ahead of your package.

**Fix**

1. Upgrade the package:

   ```bash
   npm install -g ezai-marketplace
   ```

2. Run the installation again.

`ezai` checks every skill before it deletes anything, so the skills you already had are
intact.

## The skill cannot be uninstalled because it is not in the catalogue

**Symptom** — `ezai uninstall <name>` stops with
`"<name>" n'est pas un skill du catalogue ezai.`

**Cause** — `uninstall` only ever removes skills the catalogue lists. This protects skills
you installed from elsewhere, and it also triggers for a skill that has since been removed
from the catalogue.

**Fix**

- For a skill the catalogue no longer lists, use
  [Update installed skills](./tasks/update-skills.md) — `ezai purge` is the command that
  removes it.
- For a skill that was never an ezai skill, delete its directory yourself.

## The skill is reported as not installed

**Symptom** — `ezai uninstall <name>` stops with
`Skill "<name>" non installé dans <directory>`

**Cause** — The skill is absent from the store the command looked in. If you installed it
with `--dest`, `uninstall` without the same `--dest` looks in your home directory instead.

**Fix**

1. Check what is in the store:

   ```bash
   ls ~/.agents/skills/
   ```

2. If you used a custom location, repeat the same `--dest` — see
   [Install to a shared directory](./tasks/install-to-a-shared-directory.md).

## The destination directory is refused

**Symptom** — A command stops with
`--dest : dossier hors des emplacements autorisés — <path>`

**Cause** — `--dest` is accepted only inside your home directory, inside the directory you
are running the command from, or inside the absolute root named by
`EZAI_ALLOWED_DEST_ROOT`. The same message appears when a `.agents` or `.agents/skills`
entry at that path is a link that points outside the allowed root.

**Fix**

1. Name the root explicitly in the same command:

   ```bash
   EZAI_ALLOWED_DEST_ROOT=/opt/shared/ai-tools ezai install --dest /opt/shared/ai-tools
   ```

2. If you did name it and the path is still refused, check whether
   `<path>/.agents` is a link pointing somewhere else, and remove or repoint it.

## The destination directory is not found

**Symptom** — A command stops with `--dest : dossier introuvable — <path>`

**Cause** — `ezai` does not create the destination for you; the directory must exist. A
typo in the path produces the same message.

**Fix**

1. Create the directory, then run the command again:

   ```bash
   mkdir -p /opt/shared/ai-tools
   ```

## The allowed root is rejected

**Symptom** — A command stops with
`EZAI_ALLOWED_DEST_ROOT : chemin absolu requis`

**Cause** — `EZAI_ALLOWED_DEST_ROOT` was set to a relative path.

**Fix**

1. Set it to an absolute path — `/opt/shared/ai-tools`, not `./shared` or
   `../ai-tools`.

## The remote catalogue cannot be read

**Symptom** — A command stops with
`Impossible de récupérer le catalogue (HTTP <status>)`, or with
`Catalogue distant invalide : champ "plugins" manquant ou non-tableau`.

**Cause** — The URL in `EZAI_CATALOGUE_URL` answered with an error status, or answered with
JSON that has no `plugins` array. A request that takes more than 10 seconds is abandoned.

**Fix**

1. Open the URL in a browser or with `curl` and confirm it returns JSON containing a
   `plugins` array.
2. To fall back to the list bundled with the package, unset the variable:

   ```bash
   unset EZAI_CATALOGUE_URL
   ```

## A platform directory holds a real directory instead of a link

**Symptom** — The output contains
`[warn] <platform> : <path> est un dossier réel, non remplacé` during an installation, or
`est un dossier réel, non supprimé` during an uninstallation.

**Cause** — A directory with the same name as the skill already exists in that agent's
skills folder, and it is not a link. `ezai` never deletes a real directory, so it skips it
and warns.

**Fix**

1. Look at what is there and keep a copy if it is yours:

   ```bash
   ls ~/.claude/skills/<skill-name>/
   ```

2. Remove it yourself, then run the command again so `ezai` can place the link.

## A link could not be created

**Symptom** — The output contains
`[warn] <platform> : impossible de créer le lien pour <skill> — <message>`

**Cause** — The agent's skills folder could not be written: missing permissions, a
read-only or network location, or a full disk.

**Fix**

1. Check that you can write to the folder, for example `~/.claude/skills/`.
2. The skill files themselves were still copied to `~/.agents/skills/`, so agents that read
   the shared store directly already have the skill. Only the link is missing.

## An agent does not offer the skill

**Symptom** — The installation reported success but your agent does not list the skill.

**Cause** — An agent reads its skills when a session starts, or the agent in question only
reads its own directory and no link was created for it.

**Fix**

1. Restart the agent session.
2. Confirm the files are there:

   ```bash
   ls ~/.agents/skills/
   ```

3. For Claude Code, confirm the link exists, since Claude Code reads only its own
   directory:

   ```bash
   ls ~/.claude/skills/
   ```

4. If the link is missing because that directory did not exist when you installed, create
   the agent's directory and install again — see
   [Choose whether a platform link is created](./tasks/choose-platform-links.md).

## Nothing is reported as installed

**Symptom** — `ezai uninstall` prints `Aucun skill ezai installé.` or
`Aucun skill installé (dossier .agents/skills/ introuvable).`

**Cause** — The store the command looked in holds no ezai skill. With `--dest`, the command
looked at the custom location only when you repeated the flag.

**Fix**

- Repeat the `--dest` you installed with, or accept that there is nothing to remove.

## ➡️ Next steps

- [FAQ](./faq.md)
- [Guides](./tasks/index.md)
