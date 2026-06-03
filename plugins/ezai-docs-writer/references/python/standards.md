# Documentation Writing Standards

Load this file when writing or auditing docstrings, checking emoji usage, or reviewing doc quality.

## Core Rules

- **FRAMEWORK:** Structure all documentation using the 4 Diátaxis quadrants — Tutorials, How-To Guides, Reference, Explanation.
- **PURITY:** Never mix quadrant types within a single page. Blurring boundaries is the root cause of most documentation failures.
- **TONE:** Match tone to quadrant — instructional for tutorials, directive for how-to, terse for reference, narrative for explanation.
- **DOCSTRINGS:** Google-style exclusively; omit types in docstring (pulled from signatures by mkdocstrings).
- **CASE:** Sentence case for all page titles and headings (only first word and proper nouns capitalized).
- **EMOJI:** Allowed in nav titles, H2–H6 section headings, and admonition titles. Never in prose sentences, docstrings, or code comments.
- **CLI:** Treat CLI as a Reference sub-section (`cli/`). One page per command group for large CLIs.
- **EXAMPLES:** `examples/` is a standalone section, not Diátaxis. Each example is one H2, self-contained, copy-paste ready.
- **BADGES:** Place on both `README.md` and `docs/index.md`, immediately after H1, using shields.io `flat` style. Keep the two blocks in sync. See `common/readme.md` for the canonical badge set.

---

## Google-Style Docstrings

Omit types in docstring body — mkdocstrings pulls them from the function signature.

```python
def process(data: list[float], threshold: float = 0.5) -> dict[str, float]:
    """Filters and aggregates measurement data.

    Args:
        data: Raw measurements to process.
        threshold: Values below this are discarded.

    Returns:
        Mapping of metric names to aggregated values.

    Raises:
        ValueError: If `data` is empty.

    Example:
        >>> process([0.1, 0.9, 0.4], threshold=0.3)
        {'mean': 0.65, 'count': 2}
    """
```

Rules:

- First line: complete sentence, ends with period, one line.
- Use `Args`, `Returns`, `Raises`, and `Example` sections for all public symbols.
- Omit types in docstring body — mkdocstrings pulls them from the signature.
- Use realistic domain names for variables (no `data`, `obj`, `foo`).

Recognized section headers (case-insensitive): `Args`, `Returns`, `Raises`, `Example`, `Note`, `Warning`, `Tip`, `See also`.
`Note:` / `Warning:` / `Tip:` sections render as MkDocs Material admonitions automatically.

---

## Admonitions (MkDocs Material)

Use admonitions to signal meta-information without polluting prose.

```markdown
!!! tip "Performance"
Use `uv sync --frozen` in CI to avoid re-solving the lockfile.

!!! warning
This method mutates the input list in place.

??? note "Implementation detail"
Collapsible — use for information that is true but not critical to the flow.
```

| Type       | Use for                                          |
| :--------- | :----------------------------------------------- |
| `note`     | Neutral supplementary information                |
| `tip`      | Shortcuts, better ways, non-obvious improvements |
| `warning`  | Behaviour that surprises or causes data loss     |
| `danger`   | Security or irreversible actions                 |
| `example`  | Standalone runnable code blocks                  |
| `abstract` | Summaries at the top of long explanation pages   |

---

## Material Annotations

Annotations render numbered markers `(1)` as inline popovers. Distinct from admonitions.

**Required extensions** (in `mkdocs.yml`):

```yaml
markdown_extensions:
  - attr_list
  - md_in_html
```

**Syntax — inline text:**

```markdown
This is a paragraph with an annotation. (1)
{ .annotate }

1. This is the annotation content — rendered as a popover.
```

**Syntax — code block:**

````markdown
```python { .annotate }
def process(data):
    return sorted(data)  # (1)!
```

1. `sorted()` returns a new list — it does not mutate `data`.
````

The `!` suffix on `(1)!` strips the comment from the rendered output.

When to use: Reference pages (annotate specific lines) and How-To pages (explain a step inline).
Never inside docstrings — mkdocstrings does not interpret Material annotations.

---

## Emoji Usage

Allowed in **nav titles**, **section headings (H2–H6)**, and **admonition titles** only.
Never in prose sentences, docstrings, or code comments.

> **Scope:** The table below governs **documentation pages** (`docs/`). The `README.md` has its own section emoji set — see the section structure table in `common/readme.md`, which is authoritative for the README. Where the two differ (e.g. Key Features `🎯` in README vs `✨` on the homepage), do not reconcile one against the other.

### Standard emoji set for section headings

| Section type       | Emoji | Usage                                     |
| :----------------- | :---- | :---------------------------------------- |
| Quick start        | 🚀     | Installation + minimal usage on homepage  |
| Key features       | ✨     | Feature list on homepage                  |
| Documentation nav  | 📚     | Navigation table on homepage              |
| Requirements       | 📋     | Dependency / Python version list          |
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
| Full reference     | 🔍     | Link to mkdocstrings auto-dump            |

---

## Anti-Patterns

| Anti-pattern                               | Problem                                 | Fix                                                       |
| :----------------------------------------- | :-------------------------------------- | :-------------------------------------------------------- |
| Tutorial that explains "why" at each step  | Cognitive overload, loses learning flow | Move theory to Explanation page                           |
| How-To guide that teaches from scratch     | Conflates learning with doing           | Split: Tutorial for beginners, How-To for competent users |
| Reference with "chatty" prose              | Slows down lookup                       | Trim to facts; link to Explanation for context            |
| Explanation with step-by-step instructions | Wrong quadrant                          | Move steps to How-To                                      |
| One mega-page covering all four types      | Navigation impossible                   | Decompose into separate pages                             |
| Creating empty skeleton structure upfront  | Structure without content adds no value | Apply Diátaxis bottom-up to real pages                    |

---

## Success Criteria

- Every doc page belongs unambiguously to exactly one Diátaxis quadrant (or `examples/`).
- Tutorials end with a working outcome and pointers to How-To / Reference.
- Reference pages are generated from Google-style docstrings via mkdocstrings.
- `api/index.md` is a human-curated navigation index; `api/reference/index.md` is the full mkdocstrings dump.
- `cli/` contains static Reference pages — no instructions, no narrative.
- `examples/` contains self-contained snippets; each example is one H2 section.
- `README.md` and `docs/index.md` both carry the badges block (kept in sync); the homepage also has a quick-start snippet and the navigation table.
- Emojis appear in nav titles, H2–H6 headings, and admonition titles only — never in prose.
- All headings in sentence case, **except `README.md` headings**, which use Title Case (see `common/readme.md`).
- No step-by-step instructions appear in Explanation pages.
- No theory or "why" blocks appear inside How-To steps.
