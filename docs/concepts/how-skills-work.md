# How skill installation works

ezai-marketplace uses a single-source model: skills are stored once, then linked into each AI platform directory. This page explains why and what the trade-offs are.

## 📚 Background

Claude Code, Gemini CLI, and Copilot each expect skills in a specific directory under the user's home folder:

- `~/.claude/skills/`
- `~/.gemini/skills/`
- `~/.copilot/skills/`

A naive approach would copy skill files into each directory. That works for an initial install, but updating a skill would require re-copying it to every platform separately with no guarantee the copies stay in sync.

## 🔍 Single source of truth

ezai-marketplace writes skills once to a shared store:

```text
~/.agents/skills/<skill-name>/
```

Each platform directory then receives a symlink (or directory junction on Windows) pointing back to that shared location:

```text
~/.claude/skills/ezai-code-formatter  →  ~/.agents/skills/ezai-code-formatter
~/.gemini/skills/ezai-code-formatter  →  ~/.agents/skills/ezai-code-formatter
```

Updating a skill means updating the shared store once — all platform links immediately reflect the change without any per-platform bookkeeping.

## ⚖️ Design trade-offs

The symlink model requires the shared store at `~/.agents/` to persist. Moving or deleting it breaks all links simultaneously. The upside is that a single `ezai install` brings every platform up to date in one pass.

Copying files would avoid this dependency, but ezai would have no way to track which copies are managed vs. user-modified. The catalogue approach also makes safe uninstall possible: only skills listed in the catalogue are ever removed, so third-party skills remain untouched.

On Windows, directory junctions replace symlinks automatically — no administrator rights or extra configuration is required.

## 🔗 Relationship to platform flags

The `--claude`, `--gemini`, and `--copilot` flags control which platform links are created or removed without touching the shared store. Removing a platform link with `ezai uninstall --claude` leaves `~/.agents/skills/<name>/` intact — the skill remains available on all other platforms.
