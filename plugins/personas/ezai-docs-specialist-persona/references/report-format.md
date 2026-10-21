# Report format — ezai-docs-specialist-persona

Every `.docs-audit/NN-*.json` artifact is JSON and follows its schema in `references/schemas/` — the schema is the contract; this file gives the meaning of the values. Keep the text fields short: they are working artifacts, not prose documents.

## Header (required)

Every artifact opens with `stage` (the stage name), `date` (YYYY-MM-DD) and `inputs_read` (the artifacts and project files the stage read).

## Severity levels

Used in `01-audit.json` and carried through `04-validation.json`.

| Level        | When to use                                                                                                                                                                                                |
| :----------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **bloquant** | Breaks the docs contract: a section required by the zone's profile entirely absent (a Diátaxis quadrant, a product Get started or Tasks section), `api/index.md` merged with auto-dump, placeholder text shipped in prose, wrong docs tooling detected.                                       |
| **majeur**   | Significant scope or coherence break that degrades quality without breaking the contract: a page mixing two page types of its profile, a stray badge left over from a template, broken internal cross-references. |
| **mineur**   | Polish: minor wording issues, a missing optional badge, a heading that could be clearer.                                                                                                                   |

## Findings

Each finding has an `id` (`01-NNN`, e.g. `01-003` for the third finding of the audit), its `section`, a `severity`, a short `title`, and three one-sentence fields: `what` (the problem), `where` (file path or section) and `fix` (the expected correction).

The ID is stable across stages: VALIDATION uses the same IDs to report status.

## Status tracking (VALIDATION only — 04-validation.json)

Each finding gets a `status` and an optional one-line `note`:

- **FIXED**: the finding was addressed by GENERATION.
- **OPEN**: the finding was not addressed or the fix was incomplete.
- **REGRESSED**: a finding previously absent or fixed is now present in the current docs tree.
- New findings observed in VALIDATION (not in `01-audit.json`) are out of scope — list them in `observations`.
