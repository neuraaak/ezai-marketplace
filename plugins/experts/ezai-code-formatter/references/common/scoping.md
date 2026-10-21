# Code Formatter — Scoping questions

Ordered list used by the **Scope** step of `SKILL.md`. Walk it top to bottom, drop every question the request or the repository already answers, then ask the **first three remaining** in a single call. For any question left unasked, apply the recommended option and state it in the response.

Options are listed recommended first, as `label` — `description`. Never add an "Other" option: every harness appends a free-form one.

## 1. `target` — header `Target`

**Ask when** the request neither names a file nor pastes code.
**Question:** Which files should be formatted?

- `Changed files (Recommended)` — Files modified in the working tree; keeps the diff reviewable.
- `Specific path` — One file or folder; the user names it via the free-form answer.
- `Whole project` — Every supported file; large diff, best in a dedicated commit.

## 2. `rules` — header `Rules`

**Ask when** the request does not name the change ("group the imports", "add section separators" already answer it).
**Question:** Which structural rules should be applied?

- `All rules (Recommended)` — Separators, imports, class member order, comments and docstrings.
- `Imports and separators` — Layout only; leaves comments and docstrings untouched.
- `Docstrings only` — Normalize docstring style, nothing else.

## 3. `comments` — header `Comments`

**Ask when** comment cleanup is in scope and the target holds inline comments.
**Question:** How should existing comments be treated?

- `Drop restating comments (Recommended)` — Remove comments that repeat the next line; keep rationale and workarounds.
- `Keep every comment` — Touch no comment, even redundant ones.

## 4. `docstrings` — header `Docstrings`

**Ask when** docstrings are in scope and some public symbols have none.
**Question:** What should happen to undocumented public symbols?

- `Normalize existing only (Recommended)` — Fix the style of present docstrings; content authoring belongs to `ezai-docs-writer`.
- `Add skeletons` — Insert a canonical docstring skeleton (summary, args, returns) to fill in.

## 5. `delivery` — header `Delivery`

**Ask when** the target spans more than one file.
**Question:** How should the changes be delivered?

- `Apply directly (Recommended)` — Edit the files and summarize what changed per file.
- `Preview first` — Show the planned changes per file and wait for approval before editing.

## Why these questions

- **Target** bounds the diff: a structural pass over a whole project rewrites hundreds of lines and drowns any real change in the same commit.
- **Comments** is the only lossy rule — a removed comment cannot be recovered from the code — so it gets its own question when it applies.
- **Docstrings** keeps the boundary with `ezai-docs-writer`: this skill fixes the shape, never invents the content.
