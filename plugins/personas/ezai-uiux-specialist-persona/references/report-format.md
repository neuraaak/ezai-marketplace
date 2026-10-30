# Report format — ezai-uiux-specialist-persona

Every `.uiux-audit/NN-*.json` artifact is JSON and follows its schema in `references/schemas/` — the schema is the contract; this file gives the meaning of the values. Keep the text fields short: they are working artifacts, not prose documents.

## Header (required)

Every artifact opens with `stage` (the stage name), `date` (YYYY-MM-DD) and `inputs_read` (the artifacts and project files the stage read).

## Severity levels

Used in `01-audit.json` and carried through `04-validation.json`. The level depends on the `conformance` target recorded in `00-context.json`: a criterion above that target is never `bloquant`.

| Level        | When to use                                                                                                                                                                                                                                                                                                                                                 |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **bloquant** | The interface cannot be used, or cannot be used lawfully: a flow unreachable by keyboard, a control with no accessible name, a failure of a WCAG criterion at or below the conformance target, a dark pattern covered by DSA Art. 25 or ROSCA, data loss on a validation error, an action with no way back.                                                 |
| **majeur**   | The task completes but at a real cost: a primary action that does not stand out, an interface state left unhandled (empty, loading, error, offline), a form that re-asks what the system knows, an error message that names no remedy, a navigation whose labels do not match the user's vocabulary, a failure of a criterion above the conformance target. |
| **mineur**   | Polish: spacing that groups the wrong things, an inconsistent type scale, a label that could be clearer, a transition that is too long.                                                                                                                                                                                                                     |

A finding's severity is **not** its priority. PLANNING orders by severity; `track` decides who does the work.

## Tracks

Every finding carries a `track`. It is the line drawn in the persona's design: this persona owns conformance, not taste.

| Track   | Meaning                                                                                                                                                                                                                                                                                                             |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apply` | Objectively verifiable against a standard or a rule, and fixable without a visual decision: accessible names, focus order, keyboard reach, `autocomplete` tokens, target size, redundant entry, missing interface states, error copy, field order, contrast expressed in existing tokens. GENERATION may fix these. |
| `route` | Needs a visual or brand decision: style register, palette, typography choice, layout composition, iconography, illustration, motion design. GENERATION never touches these — ROUTING names the skill that should.                                                                                                   |

Section C (`direction`) findings are always `route`. Sections A and B findings are `apply` unless the fix cannot be stated without choosing how the interface should look.

## Findings

Each finding has:

- `id` — `01-NNN` (e.g. `01-003` for the third finding of the audit). Stable across stages: PLANNING, VALIDATION and ROUTING all cross-reference by this ID.
- `section` — `heuristics`, `accessibility` or `direction`.
- `severity`, `track`.
- `title` — short.
- `what`, `where`, `fix` — one sentence each: the problem, the file path or screen, the expected correction.
- `criterion` — the rule the finding rests on: a WCAG success criterion (`2.5.8`), a named heuristic (`Nielsen 1`), a law (`Fitts`), a dark-pattern category (`sneaking`), or `null` when the finding rests on a sector convention rather than a rule.
- `evidence` — **how the finding was established**, not what it is:

| Value      | Meaning                                                                                                                                                                   |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tool`     | Reported by axe, pa11y, Lighthouse or a lint rule. Strongest; quote the rule ID in `what`.                                                                                |
| `rendered` | Observed on the interface actually rendered (headless browser, simulator, screenshot).                                                                                    |
| `static`   | Read from source only. **Weakest.** Contrast, focus visibility, reflow and target size cannot be confirmed this way — say so in `what` rather than asserting the failure. |

An `01-audit.json` whose accessibility findings are all `static` is a limited audit, and the stage must say so in `limitations`.

## Status tracking (VALIDATION only — 04-validation.json)

Each finding gets a `status` and an optional one-line `note`:

- **FIXED**: the finding was addressed by GENERATION.
- **OPEN**: the finding was not addressed or the fix was incomplete.
- **ROUTED**: the finding is `track: route` — out of GENERATION's reach by design, carried to `05-routing.json`. Not a failure.
- **REGRESSED**: a finding previously absent or fixed is now present in the current interface.
- New findings observed in VALIDATION (not in `01-audit.json`) are out of scope — list them in `observations`.
