# Pipeline — ezai-uiux-specialist-persona

This file is loaded by the orchestrator when the pipeline starts. It defines the role, inputs, outputs, and artifact contract for each stage. Load `references/report-format.md` before reading this file.

## Artifact contract

All artifacts live in `.uiux-audit/` at the root of the audited project. Names are fixed — every stage knows exactly where to read and write.

```text
.uiux-audit/
  00-context.json     written by DETECTION, read by AUDIT + PLANNING + GENERATION + ROUTING
  01-audit.json       written by AUDIT, read by PLANNING + VALIDATION + ROUTING
  02-plan.json        written by PLANNING (main agent), read by GENERATION
  03-changes.json     written by GENERATION, read by VALIDATION
  04-validation.json  written by VALIDATION, presented to user
  05-routing.json     written by ROUTING (main agent), presented to user
```

Every artifact is JSON and has a schema in `references/schemas/`. The schemas use the subset that structured outputs accept: every field required, no extra field, closed enums.

Finding IDs are stable across stages: `01-NNN`. PLANNING, VALIDATION and ROUTING cross-reference by this ID.

## Artifact validation

The orchestrator validates each artifact before the next stage reads it.

1. **Hand the schema over.** Subagents do not load this persona and cannot read its `references/schemas/`: paste the stage's schema into the dispatch prompt.
2. **Constrain when possible.** When the harness can constrain a subagent's output to a JSON schema (structured outputs — e.g. `codex exec --output-schema`), pass the stage's schema. The constraint applies to the subagent's final answer, not to a file it writes: the subagent returns the artifact as its answer, valid by construction, and the orchestrator writes it to `.uiux-audit/`.
3. **Otherwise check it.** The subagent writes the file following the schema; the orchestrator checks that it parses as JSON, that every required field is present, that there is no extra field, and that every enum value is allowed.
4. **Cross-reference IDs.** Every ID is `01-NNN`; every `02-plan.json` ID exists in `01-audit.json`; every `03-changes.json` ID exists in the plan; `04-validation.json` lists every audit finding exactly once; `05-routing.json` lists every finding whose `track` is `route` exactly once, and no other.
   Structured outputs cannot express array counts, so also check that `01-audit.json` lists each of the three sections exactly once, that no `direction` finding carries `track: apply`, and that the `summary` counts of `04-validation.json` match its findings' statuses.
5. **On failure**, re-dispatch the stage once with the list of errors. A second failure stops the pipeline: tell the user which stage failed and which fields or IDs are wrong.

---

## Stage 0 — DETECTION

**Who:** Dedicated subagent (read-only).
**Inputs:** The persona's Scope answers, project root — `package.json`, `pyproject.toml`, `composer.json`, framework configs, `tailwind.config.*`, token files, component directories, `ACCESSIBILITY.md`, README and landing copy.
**Output:** `.uiux-audit/00-context.json` (`schemas/00-context.schema.json`)

### Questions to answer

1. **Surface** — `web`, `ios`, `android`, `desktop` or `multiple`? Detected from the project type: a web framework or HTML templates, an Xcode project or SwiftUI sources, a Gradle/Compose or Flutter project, Electron/Tauri. Drives which `platforms/` reference the expert loads.
2. **Stack** — `react`, `vue`, `svelte`, `angular`, `html`, `swiftui`, `flutter`, `react-native`, `other` or `none`. Detected from dependencies. It decides where the UI lives, not how it is judged.
3. **Design system** — is there one, and is it the project's own or a library? Record `tokens` (a DTCG file, CSS custom properties, a Tailwind theme, a Material/Mantine/MUI theme) and `component_library`. A finding that contradicts an existing token is a `majeur`, not an invitation to invent a new scale.
4. **Rendering capability** — `live` or `static`. `live` only when the interface can actually be rendered and inspected: a dev-server script plus an installed driver (Playwright, Puppeteer, Cypress) or a reachable browser binary; a simulator for a native surface. Otherwise `static`. **This is the single most consequential field in the artifact**: under `static`, contrast, focus visibility, reflow, target size and motion cannot be verified, and AUDIT must record that in `limitations` rather than assert failures it did not observe.
5. **Accessibility tooling** — which of axe, pa11y, Lighthouse, `eslint-plugin-jsx-a11y`, or a native accessibility inspector is already installed. Only tooling present in the project counts; do not propose installing any at this stage.
6. **Sector** — from the Scope answer, or read from README, landing copy, product name or domain. Needed by Section C; `unknown` is allowed and makes Section C advisory only.
7. **Conformance target** — from the Scope answer, or from an accessibility policy found in the repository (`ACCESSIBILITY.md`, a declaration page, a CI gate). Default `wcag22-aa`.
8. **`ezai-uiux-expert` reference files to load** — the exact list AUDIT and GENERATION must read. Start at `ezai-uiux-expert/references/index.md`, then follow it into `common/`, `a11y/`, `ui/` and `platforms/index.md` according to the focus and the surface.
9. **UI skills available** — glob `~/.agents/skills/*/SKILL.md` then `~/.claude/skills/*/SKILL.md`, read each match's frontmatter `name`, and record the names that match the capability table in `ezai-uiux-expert/references/ui/routing.md`. Recorded here, consumed by ROUTING five stages later: the set does not change mid-run, and detecting it once keeps ROUTING cheap.

`expert_refs` usually lists `references/common/heuristics.md`, `references/common/interface-states.md`, the `common/` file matching the focus, `references/a11y/wcag.md` + `aria.md` when accessibility is in focus, `references/ui/sector-conventions.md` + `style-families.md` when direction is in focus, and one `platforms/<surface>/` file.

---

## Stage 1 — AUDIT *(load `report-format.md` before starting)*

**Who:** Dedicated subagent (read-only).
**Inputs:** `.uiux-audit/00-context.json` + the `ezai-uiux-expert` reference files listed in `expert_refs` + the UI sources (and the rendered interface when `rendering` is `live`).
**Output:** `.uiux-audit/01-audit.json` (`schemas/01-audit.schema.json`)

The AUDIT stage merges three passes into one read of the interface. Three sections, one subagent, one cold-start.

Honor `user_scope` from `00-context.json`: read only the `surface` in scope, and run only the section matching `focus` when the audit is targeted. `sections` lists all three; one left out is `skipped` with the reason `user scope`.

Every finding carries its `evidence`. When `rendering` is `static`, no finding may claim `rendered`, and the stage lists in `limitations` every criterion it could not verify.

### Section A — Usability and heuristics

Load `common/heuristics.md`, `common/interface-states.md`, and the `common/` files the focus calls for (`forms.md`, `ia-navigation.md`, `content.md`, `motion.md`, `perception.md`, `norman.md`, `anti-patterns.md`).

- Walk the primary flows the codebase exposes: entry, the main task, and every destructive or irreversible action.
- Check the 10 Nielsen heuristics and Shneiderman's reversibility and locus of control, each against a concrete screen rather than in the abstract.
- Check the interface states: every data-bearing view must handle ideal, empty, loading, partial, error and offline.
- Check forms, navigation labels, error copy and button labels against their reference files.
- Check `anti-patterns.md`, including the dark-pattern categories and their legal frame. A dark pattern is a finding about the product, not about the code — say where it is and which category it falls in.
- Classify each finding with a severity level and a track (see `report-format.md`).

### Section B — Accessibility

Load `a11y/wcag.md`, `a11y/aria.md` and `a11y/testing.md`.

- Run whichever tooling `00-context.json` lists as available and record its output as `evidence: tool`, quoting the rule ID.
- Then the manual pass that tooling cannot do — **it catches only 30–40 % of issues**: keyboard reach of every interactive element, focus order and visibility, accessible names, landmark structure, heading order, live-region politeness, focus management in dialogs, and the WCAG 2.2 criteria in `wcag.md`.
- Judge every criterion against the `conformance` target in `00-context.json`. A criterion above the target is reported at most `majeur`.
- Contrast: judge with WCAG 2 ratios. APCA is a tiebreaker on dark-mode text only, never the basis of a finding.
- Under `rendering: static`, report what the source makes certain (a missing label, a `div` used as a button, a missing `autocomplete`) and list the rest in `limitations`.

### Section C — UI direction

Load `ui/sector-conventions.md` and `ui/style-families.md`.

- Read the sector from `00-context.json` and name the register it implies.
- State in at most three findings where the interface's current register works against its sector or its audience, each with the convention it departs from.
- **Never produce a palette, a font file, a hex value or a component.** The output is a direction, and `track` is always `route`.
- When `sector` is `unknown`, this section runs advisory only: findings are `mineur` and say that the sector was not established.

---

## Stage 2 — PLANNING *(load `report-format.md` before starting)*

**Who:** Main orchestrator agent, entering plan mode.
**Inputs:** `.uiux-audit/00-context.json` + `.uiux-audit/01-audit.json`
**Output:** `.uiux-audit/02-plan.json` (`schemas/02-plan.schema.json`)

The main agent reads both artifacts, drafts a prioritized plan (bloquant first, then majeur, then mineur), writes it with `approved: false`, and presents it to the user as a readable list. **This is the human gate — no patch runs until the user approves.** On approval the main agent sets `approved: true`; GENERATION never runs on a plan whose `approved` is `false`.

The plan holds **only `track: apply` findings**. Findings tracked `route` are listed separately in the presentation, as "handled at the end by another skill" — they are not TODOs and GENERATION must never see them.

Each TODO carries the finding ID from `01-audit.json` so VALIDATION can cross-reference.

---

## Stage 3 — GENERATION

**Who:** Dedicated subagent (write).
**Inputs:** `.uiux-audit/00-context.json` + `.uiux-audit/02-plan.json`
**Output:** Real file patches + `.uiux-audit/03-changes.json` (`schemas/03-changes.schema.json`)

The GENERATION subagent reads the approved plan and executes it file by file. For each TODO it **invokes `ezai-uiux-expert`** via the Skill tool to produce the correction, passing the `surface`, `stack`, `tokens` and `conformance` from `00-context.json`. It does not decide standards itself.

Two hard limits:

- **Existing tokens are the vocabulary.** A fix expressed in colour, spacing or type uses the project's tokens. If no token satisfies the fix, the TODO becomes `SKIPPED` with the reason `needs a design decision` and moves to `05-routing.json` — it was mis-tracked at AUDIT, and inventing a value is the failure mode this persona exists to avoid.
- **No visual redesign.** Layout recomposition, restyling and palette work are out of scope whatever the plan says.

If `ezai-uiux-expert` is unavailable, GENERATION must:

1. Mark the TODO as `SKIPPED` in `03-changes.json`.
2. Add it to `blockers` with its finding ID and the reason `ezai-uiux-expert unavailable`.
3. Continue with the remaining TODOs that don't require the expert.

This ensures VALIDATION can distinguish "not fixed because skipped" from "not fixed because the fix failed".

---

## Stage 4 — VALIDATION

**Who:** Dedicated subagent (read-only).
**Inputs:** `.uiux-audit/01-audit.json` + `.uiux-audit/03-changes.json` + the updated sources (and the rendered interface when `rendering` is `live`).
**Output:** `.uiux-audit/04-validation.json` (`schemas/04-validation.schema.json`)

The VALIDATION subagent re-reads the interface and cross-references every finding from `01-audit.json` against the changes recorded in `03-changes.json`. It reports the status of each finding by its stable ID, and lists new issues it notices in `observations`.

Every `track: route` finding gets `status: ROUTED`. That is the expected outcome, not a failure, and it must not appear in the OPEN count.

Re-run the accessibility tooling listed in `00-context.json` when there is any: a `tool` finding is confirmed fixed by the tool falling silent, not by reading the patch.

---

## Stage 5 — ROUTING

**Who:** Main orchestrator agent.
**Inputs:** `.uiux-audit/00-context.json` + `.uiux-audit/01-audit.json` + `.uiux-audit/04-validation.json`
**Output:** `.uiux-audit/05-routing.json` (`schemas/05-routing.schema.json`)

The terminal stage. It runs **after** VALIDATION, never before: the audit must stand on its own even when no UI skill exists.

For every finding whose `track` is `route`, plus every TODO that GENERATION skipped with `needs a design decision`:

1. Match it to a skill from `ui_skills_available` in `00-context.json`, using the capability table in `ezai-uiux-expert/references/ui/routing.md`.
2. Write the **exact prompt** to hand that skill: the finding, the constraint it must respect (existing tokens, conformance target, sector register), and what not to change.
3. When no installed skill fits, set `skill` to `null` and name in `suggested_install` the skill that would — then say so plainly in the presentation.

**ROUTING never invokes anything.** It names the skill and the prompt; the user decides whether to spend a second pipeline on implementation. This is the line that keeps the persona an auditor.

Present the result as: the direction note from Section C, then one line per routed finding — finding, skill, prompt.

---

## Bounded re-loop

If `04-validation.json` contains findings with status OPEN or REGRESSED, the orchestrator surfaces the summary to the user and offers **one** re-loop back to PLANNING (stage 2). The user decides: re-patch or close. No automatic second loop. ROUTED findings never trigger a re-loop.
