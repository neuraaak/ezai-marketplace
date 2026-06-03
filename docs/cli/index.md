# CLI reference

`ezai` — install and manage AI skills across Claude Code, Gemini CLI, and Copilot.

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
| `uninstall` | Remove marketplace skills and their platform symlinks |

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

Displays detailed metadata for a single skill: name, description, category, version, and author.

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

Copies skill files to `~/.agents/skills/<name>/` and creates symlinks (or directory junctions on Windows) in each detected platform directory.

```bash
ezai install [skill] [OPTIONS]
```

When `[skill]` is omitted, all catalogue skills are installed.

### ⚙️ Options

| Option          | Description                                                       |
| :-------------- | :---------------------------------------------------------------- |
| `--dest <path>` | Override the base destination directory (default: home directory) |
| `--claude`      | Deploy symlinks to `~/.claude/skills/` only                       |
| `--gemini`      | Deploy symlinks to `~/.gemini/skills/` only                       |
| `--copilot`     | Deploy symlinks to `~/.copilot/skills/` only                      |

When no platform flag is set, symlinks are deployed to every platform directory that already exists on your machine.

### 🧪 Examples

```bash
# Install all skills to all detected platforms
ezai install

# Install a single skill
ezai install ezai-project-quality

# Install to Claude Code only
ezai install --claude

# Install a skill to Gemini CLI and Copilot only
ezai install ezai-docs-writer --gemini --copilot

# Use a custom base directory
ezai install --dest /opt/ai-tools
```

---

## `ezai uninstall [skill]`

Removes marketplace-managed skills from `~/.agents/skills/` and their platform symlinks. Skills not present in the catalogue catalogue are never touched.

```bash
ezai uninstall [skill] [OPTIONS]
```

When `[skill]` is omitted, all catalogue skills are removed.

### ⚙️ Options

| Option          | Description                                           |
| :-------------- | :---------------------------------------------------- |
| `--dest <path>` | Override the base directory (default: home directory) |
| `--claude`      | Remove symlinks from `~/.claude/skills/` only         |
| `--gemini`      | Remove symlinks from `~/.gemini/skills/` only         |
| `--copilot`     | Remove symlinks from `~/.copilot/skills/` only        |

### 🧪 Examples

```bash
# Remove all marketplace skills
ezai uninstall

# Remove a single skill
ezai uninstall ezai-code-formatter

# Remove only the Claude Code symlink, keep skill files
ezai uninstall ezai-code-formatter --claude
```
