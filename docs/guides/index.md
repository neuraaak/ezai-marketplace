# User guides

Task-oriented recipes for common configuration and advanced usage scenarios.

## 🔧 How to install to a specific platform only

Use platform flags to restrict where skills are deployed:

```bash
# Claude Code only
ezai install --claude

# Gemini CLI only
ezai install --gemini

# Copilot only
ezai install --copilot

# Gemini and Copilot, skip Claude Code
ezai install --gemini --copilot
```

## 🔧 How to use a custom install directory

Override the default home directory with `--dest`:

```bash
ezai install --dest /opt/shared/ai-tools
```

Skills are copied to `<dest>/.agents/skills/<name>/` and symlinked into `<dest>/.claude/skills/`, `<dest>/.gemini/skills/`, and `<dest>/.copilot/skills/` as applicable.

## 🔧 How to uninstall a single skill without removing others

```bash
ezai uninstall ezai-code-formatter
```

This removes the skill files from `~/.agents/skills/ezai-code-formatter/` and deletes its symlinks from all platform directories. Skills not in the catalogue are never touched.

## 🔧 How to remove platform symlinks without deleting skill files

Use a platform flag with `uninstall` to remove only the symlink:

```bash
# Remove Claude Code symlink only, keep skill files
ezai uninstall ezai-docs-writer --claude
```

## 🔧 How to use a remote catalogue

Set `EZAI_CATALOGUE_URL` to override the bundled `marketplace.json` with a remote URL:

```bash
EZAI_CATALOGUE_URL=https://example.com/catalogue.json ezai install
```

## 🔧 How to set up on Windows

ezai works on Windows without administrator rights. Directory junctions are used instead of symlinks automatically — no extra configuration is required.

```powershell
npm install -g ezai-marketplace
ezai install
```

Junctions behave identically to symlinks for Claude Code, Gemini CLI, and Copilot.
