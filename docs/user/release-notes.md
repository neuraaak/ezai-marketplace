# Release notes

User-visible changes, newest version first. Upgrade with
`npm install -g ezai-marketplace`, then run
[Update installed skills](./tasks/update-skills.md).

For the full commit-level history, see the
[developer changelog](../changelog.md).

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
