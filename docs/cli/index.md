# CLI reference

`ezai` — install and manage AI skills for Codex, Claude Code, Gemini CLI, Copilot, Vibe, and Kimi Code.

## 💻 Usage

```bash
ezai [OPTIONS] COMMAND [ARGS]...
```

## ⚙️ Global options

| Option      | Description                |
| :---------- | :------------------------- |
| `--version` | Print the version and exit |
| `--help`    | Show help and exit         |

## 📋 Commands

| Command     | Description                                           |
| :---------- | :---------------------------------------------------- |
| `list`      | List all skills available in the catalogue            |
| `search`    | Filter skills by name, category, or description       |
| `info`      | Show detailed metadata for a single skill             |
| `install`   | Copy skills and deploy platform symlinks              |
| `purge`     | Delete stale ezai skills absent from the catalogue    |
| `uninstall` | Remove marketplace skills and their platform symlinks |

For commands with `--dest`, the directory must be inside your home or current
working directory. To target a shared directory elsewhere, set
`EZAI_ALLOWED_DEST_ROOT` to an absolute trusted path; see
[Install to a shared directory](../user/tasks/install-to-a-shared-directory.md).

---

## `ezai list`

Lists all skills available in the bundled catalogue.

```bash
ezai list
```

---

## `ezai search <term>`

Filters skills by name, category, or description keyword.

```bash
ezai search <term>
```

### 🧪 Examples

```bash
ezai search formatter
ezai search development
ezai search python
```

---

## `ezai info <skill>`

Displays detailed metadata for a single skill: name, description, category, version, author, and capabilities.

```bash
ezai info <skill>
```

### 🧪 Examples

```bash
ezai info ezai-code-formatter
ezai info ezai-docs-writer
```

---

## `ezai install [skill]`

Copies skill files to `~/.agents/skills/<name>/`, where Codex, Gemini CLI, Copilot CLI, Vibe, and Kimi Code discover them directly. It also creates a link (or a directory junction on Windows) in `~/.claude/skills/` when that directory exists, because Claude Code reads only its own.

```bash
ezai install [skill] [OPTIONS]
```

When `[skill]` is omitted, all catalogue skills are installed.

### ⚙️ Options

| Option          | Description                                                       |
| :-------------- | :---------------------------------------------------------------- |
| `--dest <path>` | Override the base destination directory (default: home directory) |
| `--claude`      | Deploy symlinks to `~/.claude/skills/` only                       |
| `--no-links`    | Write the shared store only, create no link at all                |

Claude Code is the only platform ezai links into: Codex, Gemini CLI, Copilot CLI, Vibe and Kimi Code read
`~/.agents/skills/` natively and need no link. The link is created when `~/.claude/` exists,
whether or not `--claude` is passed.

`--no-links` is accepted by `install` only, and is rejected together with `--claude`. It
leaves the skills readable by every agent that discovers the shared store natively, and
skips the link Claude Code needs.

### 🧪 Examples

```bash
# Install all skills to all detected platforms
ezai install

# Install a single skill
ezai install ezai-project-quality

# Create the Claude Code link explicitly
ezai install --claude

# Write the shared store only, no link at all
ezai install ezai-docs-writer --no-links

# Use a shared base directory outside your home and current project
EZAI_ALLOWED_DEST_ROOT=/opt/ai-tools ezai install --dest /opt/ai-tools
```

---

## `ezai purge`

Deletes **stale** `ezai-` skills: those installed in `~/.agents/skills/` (or
linked in a platform directory) whose name is **no longer in the current
catalogue**. Skills still in the catalogue are left untouched, and no reinstall
is performed.

Stale shared skill files are always removed; platform flags select which links
are removed. For why stale skills exist, see
[How skill installation works](../concepts/how-skills-work.md).

```bash
ezai purge [OPTIONS]
```

### ⚙️ Options

| Option          | Description                                           |
| :-------------- | :---------------------------------------------------- |
| `--dest <path>` | Override the base directory (default: home directory) |
| `--claude`      | Select links in `~/.claude/skills/`                   |

### 🧪 Examples

```bash
# Drop every stale skill
ezai purge

# Then refresh the catalogue
ezai install
```

---

## `ezai uninstall [skill]`

Removes marketplace-managed skills from `~/.agents/skills/` and their selected platform links. Skills not present in the catalogue are never touched. Other platform links may become broken because the shared skill files are removed.

```bash
ezai uninstall [skill] [OPTIONS]
```

When `[skill]` is omitted, all catalogue skills are removed.

### ⚙️ Options

| Option          | Description                                           |
| :-------------- | :---------------------------------------------------- |
| `--dest <path>` | Override the base directory (default: home directory) |
| `--claude`      | Select links in `~/.claude/skills/`                   |

### 🧪 Examples

```bash
# Remove all marketplace skills
ezai uninstall

# Remove a single skill
ezai uninstall ezai-code-formatter

# Remove the shared skill files and the Claude Code link
ezai uninstall ezai-code-formatter --claude
```
