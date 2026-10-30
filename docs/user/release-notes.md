# Release notes

User-visible changes, newest version first. Upgrade with
`npm install -g ezai-marketplace`, then run
[Update installed skills](./tasks/update-skills.md).

For the full commit-level history, see the
[developer changelog](../changelog.md).

## 1.9.0 — 2026-10-30

### New

- Two skills for interface work, bringing the catalogue to eleven. `ezai-uiux-expert`
  handles one screen, flow, form or component: a usability review against the Nielsen
  heuristics, a WCAG 2.2 check, a conformance fix, a deceptive-design check on a flow, or
  the visual direction a sector implies. `ezai-uiux-specialist-persona` runs the same
  ground over a whole product, through a six-stage pipeline that stops for your approval
  before changing anything. See the [catalogue](../skills/).
- Both skills say what they could not check. Contrast, focus visibility, target size and
  reflow cannot be judged from source code, so a review that could not run your interface
  lists them as unverified rather than reporting them as failures.
- Neither skill redesigns your interface. They apply the corrections that need no visual
  decision — accessible names, focus order, form semantics, error copy — and for anything
  that does, they name the skill that should do it and the prompt to give it. If you have
  no UI skill installed, you get the direction and the name of the one that would fit.

### Fixed

- The documentation version switcher offers 1.9.0. It had stayed at 1.8.1 through one
  release.

## 1.8.0 — 2026-10-27

### New

- Vibe and Kimi Code are supported. Both read the shared `~/.agents/skills/` store
  directly, so an `ezai install` you have already run covers them: there is nothing new to
  type and no new flag. See
  [How skill installation works](../concepts/how-skills-work.md) for the directory each
  agent reads, and for the version caveat — support for the shared store arrived at
  different times in each CLI.

### Fixed

- The documentation version switcher offers 1.8.0. It had stayed at 1.6.3 through two
  releases.

## 1.7.0 — 2026-10-27

::: warning Action may be required
The `--gemini` and `--copilot` flags are removed. A command that passes one now fails with
`error: unknown option`. Drop the flag: a plain `ezai install` already covers both agents.
:::

### Changed

- `ezai` no longer creates links in `~/.gemini/skills/` or `~/.copilot/skills/`. Both
  agents read the shared `~/.agents/skills/` store natively, so those links never made a
  skill visible that was not already. Claude Code is the only agent that needs a link, and
  the only one `ezai` still creates. Nothing becomes invisible — unless you run a release
  of Gemini CLI or Copilot CLI old enough not to read the shared store, in which case stay
  on 1.6.3.
- The Windows batch wrapper `scripts\install.bat` creates a junction for Claude Code only,
  matching the CLI.

### New

- `ezai install --no-links` writes the shared store and creates no link at all. It is the
  only way to install without touching `~/.claude/skills/`, and it is rejected together
  with `--claude`.

## 1.6.3 — 2026-10-27

::: warning Action may be required
If you install into a directory outside your home directory, the command now fails unless
you also set `EZAI_ALLOWED_DEST_ROOT`. See
[Install to a shared directory](./tasks/install-to-a-shared-directory.md).
:::

### Fixed

- `--dest` is confined to your home directory, the directory you run the command from, or
  the absolute root named in `EZAI_ALLOWED_DEST_ROOT`. A mistyped or hostile path can no
  longer make `install`, `uninstall` or `purge` write elsewhere on the disk. A `.agents`
  entry that is a link redirecting out of the allowed root is rejected as well.

## 1.6.2 — 2026-10-27

### Fixed

- `uninstall` removes only links. A real directory that happens to share a skill's name is
  left in place with a warning instead of being deleted with everything inside it.
- Skill names coming from a catalogue are checked before any file path is built, so a
  crafted name can no longer make a command act outside the skills directory.

### Improved

- The documentation version switcher shows the released version again.

## 1.6.1 — 2026-10-26

### Improved

- The supported Node.js version is 24.22.1 or later, aligned across the project.

## 1.6.0 — 2026-10-21

### New

- `ezai-docs-writer` also writes product documentation for end users — get-started, task,
  troubleshooting, FAQ and release-notes pages — alongside developer documentation.

### Improved

- Skills ask up to three short questions before they start, so they no longer guess at what
  you want. Unasked questions fall back to a stated default.
- The documentation audit skill checks each part of a site against the kind of
  documentation that part is, rather than assuming one layout for everything.
