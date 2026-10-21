# Documentation Writing Standards (language-agnostic)

Load this file whenever writing or auditing documentation, in any language and under any profile. It holds the rules that depend neither on the language, the site generator, nor the documentation profile: heading case, emoji placement, badges, admonition semantics, the emoji set, and the shared success criteria.

Page structure — which pages exist, how they are organized, their anti-patterns and success criteria — belongs to the documentation profile: see `profiles/index.md`.

For the language-specific layer — docstring syntax (Google-style vs JSDoc/TSDoc), admonition **syntax** (`!!!` vs `:::`), and the API-reference generator — load the matching `languages/python/standards.md` or `languages/javascript/standards.md`.

## Core Rules

- **CASE:** Sentence case for all page titles and headings (only first word and proper nouns capitalized). Exception: `README.md` headings use Title Case — see `common/readme.md`.
- **EMOJI:** Allowed in nav titles, H2–H6 section headings, and admonition titles only. Never in prose sentences, docstrings, or code comments.
- **BADGES:** Place on both `README.md` and `docs/index.md`, immediately after H1, using shields.io `flat` style. Keep the two blocks in sync. See `common/readme.md` for the canonical badge set.

For the per-language docstring rule (Google-style for Python, JSDoc/TSDoc for JS/TS), see the language `standards.md`.

---

## Admonition semantics

Admonitions signal meta-information without polluting prose. The semantics below are universal; the **syntax** differs per site generator (MkDocs `!!! tip`, VitePress `::: tip`) — see the language `standards.md`.

| Type       | Use for                                          |
| :--------- | :----------------------------------------------- |
| `note`     | Neutral supplementary information                |
| `tip`      | Shortcuts, better ways, non-obvious improvements |
| `warning`  | Behaviour that surprises or causes data loss     |
| `danger`   | Security or irreversible actions                 |
| `example`  | Standalone runnable code blocks                  |
| `abstract` | Summaries at the top of long explanation pages   |

---

## Emoji set for section headings

Allowed in **nav titles**, **section headings (H2–H6)**, and **admonition titles** only — never in prose, docstrings, or code comments.

> **Scope:** This table governs **documentation pages** (`docs/`). The `README.md` has its own section emoji set — see the section structure table in `common/readme.md`, which is authoritative for the README. Where the two differ (e.g. Key Features `🎯` in README vs `✨` on the homepage), do not reconcile one against the other.

| Section type       | Emoji | Usage                                     |
| :----------------- | :---- | :---------------------------------------- |
| Quick start        | 🚀     | Installation + minimal usage on homepage  |
| Key features       | ✨     | Feature list on homepage                  |
| Documentation nav  | 📚     | Navigation table on homepage              |
| Requirements       | 📋     | Dependency / runtime version list         |
| License            | ⚖️     | License reference                         |
| Prerequisites      | 🔧     | Required knowledge and tools              |
| Steps              | 📝     | Numbered steps in How-To / Tutorial       |
| Result / outcome   | ✅     | Success state at end of guide or tutorial |
| Next steps         | ➡️     | Links to related pages                    |
| CLI usage          | 💻     | Command syntax block                      |
| CLI options        | ⚙️     | Option/flag tables                        |
| CLI commands       | 📋     | Command listing tables                    |
| CLI examples       | 🧪     | Short CLI invocation snippets             |
| Code examples      | 🚀     | First / basic example block               |
| Additional example | 💡     | Second and subsequent example blocks      |
| Test suite         | 🧪     | Running tests section                     |
| Coverage           | 📊     | Coverage reporting section                |
| New test           | ✏️     | Writing tests section                     |
| Modules (API)      | 📦     | Module listing table in `api/index.md`    |
| Full reference     | 🔍     | Link to the API auto-dump                 |

---

## Success criteria (language-agnostic)

- `README.md` and `docs/index.md` both carry the badges block (kept in sync); the homepage also has a quick-start snippet and the navigation table.
- Emojis appear in nav titles, H2–H6 headings, and admonition titles only — never in prose.
- All headings in sentence case, except `README.md` headings (Title Case — see `common/readme.md`).

For generator-specific criteria (the API curated-index vs auto-dump split, docstring style), see the language `standards.md`.
