# How skill installation works

ezai-marketplace stores each skill once in a shared directory and creates platform links where requested. This page explains which harnesses discover those files.

## 📚 Background

The supported local harnesses discover skills in these personal directories:

| Harness     | Direct discovery                              | Platform directory used by ezai |
| :---------- | :-------------------------------------------- | :------------------------------ |
| Codex       | `~/.agents/skills/`                           | None needed                     |
| Claude Code | `~/.claude/skills/`                           | `~/.claude/skills/`             |
| Gemini CLI  | `~/.agents/skills/` or `~/.gemini/skills/`    | None needed                     |
| Copilot CLI | `~/.agents/skills/` or `~/.copilot/skills/`   | None needed                     |
| Vibe        | `~/.agents/skills/` or `~/.vibe/skills/`      | None needed                     |
| Kimi Code   | `~/.agents/skills/` or `~/.kimi-code/skills/` | None needed                     |

These locations are documented by [OpenAI](https://learn.chatgpt.com/docs/build-skills), [Claude Code](https://code.claude.com/docs/en/skills), [Gemini CLI](https://geminicli.com/docs/cli/skills/), [GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [Mistral Vibe](https://docs.mistral.ai/vibe/code/cli/skills), and [Kimi Code](https://www.kimi.com/code/docs/en/kimi-code-cli/customization/skills.html). Cloud sessions do not necessarily read skills stored on your machine.

`~/.agents/skills/` is a shared convention rather than one tool's directory, and support for it arrived at different times in each CLI. Two consequences are worth knowing:

- **An older release may not read it.** Kimi Code is the renamed `kimi-cli`, whose own documentation listed `~/.kimi/skills/` and `~/.claude/skills/` instead. If an agent does not offer a skill, check that it is a version that documents `~/.agents/skills/`.
- **Vibe gates project-scope skills behind trusted folders.** `ezai` writes the user scope, which Mistral's documentation does not describe as gated, so this should not affect an `ezai install` — but a `.agents/skills/` directory inside a project does trigger the trust prompt on first run.

A naive approach would copy skill files into each directory. That works for an initial install, but updating a skill would require re-copying it to every platform separately with no guarantee the copies stay in sync.

## 🔍 Single source of truth

ezai-marketplace writes skills once to a shared store:

```text
~/.agents/skills/<skill-name>/
```

When the Claude Code directory exists, ezai creates a symlink (or directory junction on Windows) pointing back to the shared location:

```text
~/.claude/skills/ezai-code-formatter  →  ~/.agents/skills/ezai-code-formatter
```

Updating a skill means updating the shared store once — the link immediately reflects the change without any per-platform bookkeeping.

## 🔍 Stale skills

The catalogue is the only list of managed skills, and it ships inside the package. When a
skill is renamed or dropped upstream, a newer package carries a catalogue that no longer
names it — but the files installed under the old name are still on disk, and so are their
platform links. Nothing in the shared store records that they are obsolete; their absence
from the catalogue is what makes them obsolete.

`install` cannot remove them: it only ever walks the catalogue, so a name it no longer
contains is never visited. That is why removal is a separate command. `purge` works the
other way round — it scans the shared store and every selected platform directory for
entries prefixed `ezai-`, and deletes those the current catalogue does not list. Scanning
the platform directories too catches a link whose target in `.agents` has already gone.

The prefix is the safety boundary: an entry without it was not installed by ezai, so
`purge` never considers it.

## ⚖️ Design trade-offs

The symlink model requires the shared store at `~/.agents/` to persist. Moving or deleting it breaks all links simultaneously. The upside is that a single `ezai install` brings every platform up to date in one pass.

Copying files would avoid this dependency, but ezai would have no way to track which copies are managed vs. user-modified. The catalogue approach also makes safe uninstall possible: only skills listed in the catalogue are ever removed, so third-party skills remain untouched.

On Windows, directory junctions replace symlinks automatically — no administrator rights or extra configuration is required.

## 🔗 Relationship to platform flags

Claude Code is the only harness ezai links into, because it is the only one that does not read the shared store. `--claude` selects that link during `install`, `uninstall` and `purge`, and `install --no-links` skips it. There is no flag for Codex, Gemini CLI, Copilot CLI, Vibe or Kimi Code: all of them discover `.agents/skills/` directly, so a link would add nothing. No flag makes a skill exclusive to a harness — `install` always writes the shared store.

Direct discovery above assumes the default home directory. With `--dest`, the shared store moves to `<dest>/.agents/skills/`; Codex sees it automatically only when that directory lies on its repository discovery path. Platform links remain under the user's home directory.

`uninstall` and `purge` also remove matching skill files from the shared store. For example, `ezai uninstall ezai-code-formatter --claude` removes that skill from `.agents/skills/` and removes its Claude Code link. Links left in a platform directory by an earlier version of ezai may then point to a missing target. Use `--claude` to select the link operation, not to preserve a skill for another harness.
