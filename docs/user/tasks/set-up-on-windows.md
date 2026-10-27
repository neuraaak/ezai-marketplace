# Set up on Windows

Install the skills on Windows, with or without Node.js.

## 🔧 Prerequisites

- Node.js 24.22.1 or later, for the first route
- Git, for the second route

No administrator rights are needed either way.

## 📝 Steps — with Node.js

1. Install the CLI and run it, exactly as on Linux or macOS:

   ```powershell
   npm install -g ezai-marketplace
   ezai install
   ```

## 📝 Steps — without Node.js

1. Clone the repository:

   ```powershell
   git clone https://github.com/neuraaak/ezai-marketplace.git
   cd ezai-marketplace
   ```

2. Run the bundled batch script, which reproduces `ezai install`:

   ```bat
   scripts\install.bat                   REM all skills
   scripts\install.bat <skill>           REM a single skill
   scripts\install.bat <skill> <dest>    REM into a custom destination
   scripts\install.bat "" <dest>         REM all skills, custom destination
   ```

   When `<dest>` is omitted, `%USERPROFILE%` is used.

## ✅ Result

The skills are installed in `%USERPROFILE%\.agents\skills\`, and a junction is created in
`.claude\skills\` when that directory exists. The other agents read the shared store
directly and get no junction.

With the three-argument form, both the store and the junction are placed under `<dest>`,
not under your profile — unlike `ezai install`, which always links under your home
directory.

Windows cannot create symbolic links without elevated rights, so `ezai` uses directory
junctions instead, automatically and with no configuration. The agents cannot tell the
difference.

The batch script copies the same files as `ezai install` — `SKILL.md` and `references\` —
but it has no `list`, `search`, `info`, `uninstall` or `purge` counterpart. For those,
install Node.js and use the CLI.

## ➡️ Next steps

- [Install skills](./install-skills.md)
- [Choose whether a platform link is created](./choose-platform-links.md)
