[Source: src/shared/instructions/languages/javascript/js-style-layout.instructions.md — section: Docstrings]
[Skill location: agents/claude/skills/docs-writer/references/javascript/standards.md]

# JavaScript/TypeScript Documentation Standards

Load this file when writing or auditing JSDoc docstrings, or reviewing doc quality for JS/TS projects.

## Core Rules

- **FRAMEWORK:** Same 4 Diátaxis quadrants as Python — Tutorial, How-To, Reference, Explanation. The framework is language-agnostic.
- **PURITY:** Never mix quadrant types within a single page.
- **DOCSTRINGS:** JSDoc (Google-style) for all public functions, classes, and types.
- **CASE:** Sentence case for all page titles and headings.
- **EMOJI:** Allowed in nav titles, H2–H6 section headings, and admonition titles. Never in prose or JSDoc comments.
- **TYPES:** In TypeScript projects, prefer signature types over JSDoc `{type}` annotations — let the type system be the authority.

---

## JSDoc Docstrings

Use JSDoc for all public symbols. In TypeScript, omit `{type}` from `@param` — the TypeScript signature already captures it.

```typescript
/**
 * Calculates metrics for a dataset.
 *
 * @param data - Raw measurements to process.
 * @param threshold - Values below this are discarded.
 * @returns Mapping of metric names to aggregated values.
 * @throws {RangeError} If `data` is empty.
 *
 * @example
 * ```ts
 * const result = calculateMetrics([0.1, 0.9, 0.4], 0.3);
 * // { mean: 0.65, count: 2 }
 * ```
 */
function calculateMetrics(
  data: number[],
  threshold: number = 0.5,
): Record<string, number> {
  // implementation
}
```

**Plain JavaScript** — include `{type}` when it aids tooling:

```javascript
/**
 * Calculates metrics for a dataset.
 *
 * @param {number[]} data - Raw measurements to process.
 * @param {number} [threshold=0.5] - Values below this are discarded.
 * @returns {Record<string, number>} Mapping of metric names to aggregated values.
 */
function calculateMetrics(data, threshold = 0.5) {
  // implementation
}
```

Rules:

- First line: complete sentence, ends with a period.
- Use `@param`, `@returns`, `@throws`, `@example` for all public symbols.
- Use realistic parameter names — no `data`, `obj`, `foo`.
- `@example` block: wrap in ` ```ts ``` ` fences so TypeDoc renders it as code.

Recognized tags: `@param`, `@returns`, `@throws`, `@example`, `@deprecated`, `@since`, `@see`, `@remarks`.

---

## API Reference Toolchain

**TypeDoc** generates API reference from JSDoc/TSDoc comments (the JS equivalent of mkdocstrings + MkDocs Material).

```json
// typedoc.json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs/api",
  "plugin": ["typedoc-plugin-markdown"]
}
```

`typedoc-plugin-markdown` outputs `.md` files consumable by VitePress or Docusaurus instead of standalone HTML.

Run order:

```bash
npx typedoc   # generates docs/api/*.md from source
npx vitepress build docs   # builds the full site
```

---

## Page Structure

Diátaxis nav structure and page templates apply identically to JS/TS projects. Refer to `python/quadrants-templates.md` for the full template set — every template is language-agnostic; only replace Python-specific code snippets with TypeScript/JavaScript equivalents.

Typical JS/TS doc site stack: **VitePress** (Vue-powered, fast) or **Docusaurus** (React-powered, rich ecosystem) — equivalent to MkDocs Material for Python.

---

## Anti-Patterns

| Anti-pattern | Problem | Fix |
| :--- | :--- | :--- |
| `@param {any} foo` in TypeScript | Defeats type safety | Use TypeScript signature types |
| `{type}` annotations in TypeScript JSDoc | Redundant, diverges from source | Remove `{type}` from `@param` in `.ts` files |
| Tutorial that explains "why" at each step | Wrong quadrant, cognitive overload | Move theory to Explanation page |
| Reference page with chatty prose | Slows down lookup | Trim to facts; link to Explanation for context |
| One page covering all four quadrant types | Navigation impossible | Decompose into separate pages |
