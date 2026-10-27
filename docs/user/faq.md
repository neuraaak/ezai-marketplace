# FAQ

## Where are the skills installed?

In `~/.agents/skills/`, one directory per skill. That is the only copy; everything else is
a link pointing at it.

## Why is there no `--codex` flag?

Codex reads `~/.agents/skills/` by itself, so there is nothing to link. Gemini CLI, Copilot
CLI, Vibe and Kimi Code have no flag either, for the same reason — all of them read that
directory too. The only flag is `--claude`, for the one agent that reads only its own
directory.

A flag named after Codex would also be misleading: writing the shared store and no link
serves every one of them alike. If that is what you want, ask for it
directly:

```bash
ezai install --no-links
```

## Does `ezai install --claude` keep the skill away from my other agents?

No. The shared files in `~/.agents/skills/` are written on every run, and Codex, Gemini CLI,
Copilot CLI, Vibe and Kimi Code read that directory directly. The flag only chooses whether
the Claude Code link is created.
See [Choose whether a platform link is created](./tasks/choose-platform-links.md).

## Can I remove a skill for one agent and keep it for another?

No. `uninstall` always deletes the shared files, so the skill goes away for everyone.
`--claude` only selects whether the Claude Code link is deleted along with them.

## Will `ezai` touch skills I installed myself?

No. Only names the catalogue lists are ever installed, uninstalled or purged, and a
platform entry is deleted only when it is a link. A real directory is left alone with a
warning.

## Do I need an internet connection?

Only to obtain the package. The skill files and the catalogue both ship inside the
package, so `ezai install` works offline. A connection is needed only if you set
`EZAI_CATALOGUE_URL` to [use a remote catalogue](./tasks/use-a-remote-catalogue.md).

## Does `ezai install` overwrite a skill I already have?

Yes. The skill's directory is emptied and rewritten with the current version, so files
removed upstream do not linger. Any change you made inside `~/.agents/skills/<name>/` is
lost.

## What is the difference between `uninstall` and `purge`?

`uninstall` removes skills you name, or all of them. `purge` removes only the skills still
on your machine that the catalogue no longer lists — the leftovers of a rename or a
removal. See [Update installed skills](./tasks/update-skills.md).

## Do I need administrator rights on Windows?

No. Where Linux and macOS use symbolic links, Windows uses directory junctions, which need
no elevation. See [Set up on Windows](./tasks/set-up-on-windows.md).

## Why was my `--dest` path refused?

For safety, because `ezai` deletes and recreates directories underneath it. The path must
sit inside your home directory, inside the directory you are running the command from, or
inside the absolute root you name in `EZAI_ALLOWED_DEST_ROOT`. See
[Install to a shared directory](./tasks/install-to-a-shared-directory.md).

## My agent does not see a newly installed skill. Why?

An agent discovers skills when a session starts, so restart it. If it still does not
appear, see
[Troubleshooting › An agent does not offer the skill](./troubleshooting.md).
