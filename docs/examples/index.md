# Examples

Copy-paste CLI scenarios for common ezai-marketplace operations.

::: tip
All examples assume the CLI is installed globally: `npm install -g ezai-marketplace`
:::

## 🚀 Install all skills to all platforms

```bash
ezai install
```

Skills are copied to `~/.agents/skills/` and symlinked into every platform directory that already exists on your machine.

## 💡 Install to a single platform

```bash
# Claude Code only
ezai install --claude

# Gemini CLI only
ezai install --gemini

# Copilot only
ezai install --copilot
```

## 💡 Install a specific skill

```bash
ezai install ezai-project-quality
```

## 💡 Search and inspect before installing

```bash
# Filter the catalogue by keyword
ezai search python

# View full metadata for a skill
ezai info ezai-cicd-expert
```

## 💡 Uninstall a skill from one platform, keep it on others

```bash
# Remove the Claude Code symlink only — skill files stay in ~/.agents/skills/
ezai uninstall ezai-code-formatter --claude
```

## 💡 Install to a shared directory

```bash
ezai install --dest /opt/shared/ai-tools
```

Skills are deployed to `/opt/shared/ai-tools/.agents/skills/` and symlinked into `/opt/shared/ai-tools/.claude/skills/`, `/opt/shared/ai-tools/.gemini/skills/`, and `/opt/shared/ai-tools/.copilot/skills/` as applicable.
