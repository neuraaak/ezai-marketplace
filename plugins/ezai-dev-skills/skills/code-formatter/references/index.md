# Code Formatter References Index

Route to the correct language subdirectory based on the file extension.

## Supported languages

| Language           | Extensions              | Subdirectory      | File |
| :----------------- | :---------------------- | :---------------- | :--- |
| Python             | `.py`                   | `python/`         | `style-layout.instructions.md` |
| JavaScript / TypeScript | `.js` `.ts` `.jsx` `.tsx` `.mjs` | `javascript/` | `style-layout.instructions.md` |

More languages can be added under their own subdirectory following the same pattern.

---

## Python (`python/`)

Docstring style: Google. Separator: `# ///...` (main) + `# ---...` (sub).

- `python/style-layout.instructions.md` — section markers, import grouping, class structure, docstring format

---

## JavaScript / TypeScript (`javascript/`)

Docstring style: JSDoc. Separator: `// ///...` (main) + `// ---...` (sub).

- `javascript/style-layout.instructions.md` — section markers, import grouping (node:, 3rd-party, local), JSDoc format

---

## Adding a new language

1. Create a `<language>/` subdirectory here.
2. Add a `style-layout.instructions.md` covering: section separators, import grouping, docstring/comment style.
3. Register the language in the table above.
