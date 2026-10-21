# Diátaxis profile — Structure

Profile for developer documentation: libraries, frameworks, SDKs, APIs and CLIs. Load it with `templates.md` (same folder) and `common/standards.md`.

## Core Rules

- **FRAMEWORK:** Structure all documentation using the 4 Diátaxis quadrants — Tutorials, How-To Guides, Reference, Explanation. The framework is language-agnostic.
- **PURITY:** Never mix quadrant types within a single page. Blurring boundaries is the root cause of most documentation failures.
- **TONE:** Match tone to quadrant — instructional for tutorials, directive for how-to, terse for reference, narrative for explanation.
- **CLI:** Treat CLI as a Reference sub-section (`cli/`). One page per command group for large CLIs.
- **EXAMPLES:** `examples/` is a standalone section, not a Diátaxis quadrant. Each example is one H2, self-contained, copy-paste ready.

---

## Diátaxis anti-patterns

These failures are independent of language and site generator.

| Anti-pattern                               | Problem                                 | Fix                                                       |
| :----------------------------------------- | :-------------------------------------- | :-------------------------------------------------------- |
| Tutorial that explains "why" at each step  | Cognitive overload, loses learning flow | Move theory to Explanation page                           |
| How-To guide that teaches from scratch     | Conflates learning with doing           | Split: Tutorial for beginners, How-To for competent users |
| Reference with "chatty" prose              | Slows down lookup                       | Trim to facts; link to Explanation for context            |
| Explanation with step-by-step instructions | Wrong quadrant                          | Move steps to How-To                                      |
| One mega-page covering all four types      | Navigation impossible                   | Decompose into separate pages                             |
| Creating empty skeleton structure upfront  | Structure without content adds no value | Apply Diátaxis bottom-up to real pages                    |

---

## Success criteria

- Every doc page belongs unambiguously to exactly one Diátaxis quadrant (or `examples/`).
- Tutorials end with a working outcome and pointers to How-To / Reference.
- `cli/` contains static Reference pages — no instructions, no narrative.
- `examples/` contains self-contained snippets; each example is one H2 section.
- No step-by-step instructions appear in Explanation pages; no theory or "why" blocks appear inside How-To steps.
