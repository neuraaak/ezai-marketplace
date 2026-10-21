# Pipeline — ezai-docs-specialist-persona

This file is loaded by the orchestrator when the pipeline starts. It defines the role, inputs, outputs, and artifact contract for each stage. Load `references/report-format.md` before reading this file.

## Artifact contract

All artifacts live in `.docs-audit/` at the root of the audited project. Names are fixed — every stage knows exactly where to read and write.

```text
.docs-audit/
  00-context.json     written by DETECTION, read by AUDIT + PLANNING + GENERATION
  01-audit.json       written by AUDIT, read by PLANNING + VALIDATION
  02-plan.json        written by PLANNING (main agent), read by GENERATION
  03-changes.json     written by GENERATION, read by VALIDATION
  04-validation.json  written by VALIDATION, presented to user
```

Every artifact is JSON and has a schema in `references/schemas/`. The schemas use the subset that structured outputs accept: every field required, no extra field, closed enums.

Finding IDs are stable across stages: `01-NNN`. PLANNING and VALIDATION cross-reference by this ID.

## Artifact validation

The orchestrator validates each artifact before the next stage reads it.

1. **Constrain when possible.** When the harness can constrain a subagent's output to a JSON schema (structured outputs — e.g. `codex exec --output-schema`), pass the stage's schema: the output is then valid by construction.
2. **Otherwise check it.** The subagent writes the file following the schema; the orchestrator checks that it parses as JSON, that every required field is present, that there is no extra field, and that every enum value is allowed.
3. **Cross-reference IDs.** Every ID is `01-NNN`; every `02-plan.json` ID exists in `01-audit.json`; every `03-changes.json` ID exists in the plan; `04-validation.json` lists every audit finding exactly once.
4. **On failure**, re-dispatch the stage once with the list of errors. A second failure stops the pipeline: tell the user which stage failed and which fields or IDs are wrong.

---

## Stage 0 — DETECTION

**Who:** Dedicated subagent (read-only).
**Inputs:** The persona's Scope answers, project root — file extensions, `pyproject.toml`, `package.json`, `composer.json`, `mkdocs.yml`, `docs/.vitepress/config.*`, `docusaurus.config.*`, `astro.config.*`, `.github/`, `.gitlab-ci.yml`.
**Output:** `.docs-audit/00-context.json` (`schemas/00-context.schema.json`)

### Questions to answer

1. **Language** — Python, JavaScript/TypeScript or PHP? Detected from `pyproject.toml` / `package.json` / `composer.json`.
2. **Docs tooling** — MkDocs / VitePress / Docusaurus / Starlight / none? Detected from config file presence: `mkdocs.yml`, `docs/.vitepress/config.*`, `docusaurus.config.*`, `astro.config.*` importing `@astrojs/starlight`. A docs site built with another tool is `other`: `ezai-docs-writer` has no recipe for it, so the audit says so instead of applying another tool's config rules.
3. **Versioning platform** — GitHub or GitLab? Detected from `.github/` or `.gitlab-ci.yml`.
4. **Documentation profile and zones** — Diátaxis, Product, or a hybrid site with one profile per zone. Detected with the signals and zone rules in `ezai-docs-writer/references/profiles/index.md`.
5. **ezai-docs-writer reference files to load** — the exact list of files from `ezai-docs-writer/references/` that AUDIT and GENERATION must load for this project. Start at `ezai-docs-writer/references/index.md`, then follow it into `languages/index.md` (per-language files), `forge/index.md` (badge registries) and `profiles/index.md` (one `structure.md` per profile in use).

`docs_writer_refs` usually lists `references/common/standards.md`, `references/profiles/<profile>/structure.md` (one per profile in use), `references/languages/<lang>/standards.md`, and the `forge/<platform>/` + `languages/<lang>/` badge registries, plus any file AUDIT or GENERATION needs. `zones` is empty unless the site is hybrid.

---

## Stage 1 — AUDIT *(load `report-format.md` before starting)*

**Who:** Dedicated subagent (read-only).
**Inputs:** `.docs-audit/00-context.json` + the `ezai-docs-writer` reference files listed in `docs_writer_refs` + full `docs/` tree.
**Output:** `.docs-audit/01-audit.json` (`schemas/01-audit.schema.json`)

The AUDIT stage merges what would otherwise be two separate passes (profile structure + contextual coherence) into one single read of the docs tree. Two sections, one subagent, one cold-start.

Honor `user_scope` from `00-context.json`: read only the `section` in scope, and run only Section A (`focus: structure`) or Section B (`focus: coherence`) when the audit is targeted. `sections` lists both sections; one left out is `skipped` with the reason `user scope`.

### Section A — Profile structure

For each zone (the whole site when there is no zone), load the `structure.md` and `templates.md` of its profile from `ezai-docs-writer/references/profiles/<profile>/`.

- List the actual `docs/` tree.
- Diff each zone against its profile's navigation structure in `templates.md` (Diátaxis: Tutorial, How-To, Reference, Explanation, Examples, Changelog; Product: Get started, Tasks, Concepts, Reference, Troubleshooting, FAQ, Release notes, and the admin zone when the product is self-hosted).
- Flag: absent sections of the profile, pages that mix two page types, and the anti-patterns listed in the profile's `structure.md` (e.g. `api/index.md` merged with auto-dump under Diátaxis, architecture exposed in the product user zone).
- Classify each finding with a severity level (see `report-format.md`).

### Section B — Contextual coherence

Use `00-context.json` (language, platform) as the control.

- Load the platform + language `badge-registry.md` pair.
- Check: badges present and correct for this platform/language, no placeholder text (`<your-project>`, `TODO`, `FIXME`, `TBD`), no stray mentions from a different project or template.
- Classify each finding with a severity level.

---

## Stage 2 — PLANNING *(load `report-format.md` before starting)*

**Who:** Main orchestrator agent, entering plan mode.
**Inputs:** `.docs-audit/00-context.json` + `.docs-audit/01-audit.json`
**Output:** `.docs-audit/02-plan.json` (`schemas/02-plan.schema.json`)

The main agent reads both artifacts, drafts a prioritized upgrade plan (bloquant first, then majeur, then mineur), writes it with `approved: false`, and presents it to the user as a readable list. **This is the human gate — no patch runs until the user approves.** On approval the main agent sets `approved: true`; GENERATION never runs on a plan whose `approved` is `false`.

Each TODO carries the finding ID from `01-audit.json` so VALIDATION can cross-reference.

---

## Stage 3 — GENERATION

**Who:** Dedicated subagent (write).
**Inputs:** `.docs-audit/00-context.json` + `.docs-audit/02-plan.json`
**Output:** Real file patches + `.docs-audit/03-changes.json` (`schemas/03-changes.schema.json`)

The GENERATION subagent reads the approved plan and executes it file by file. For each TODO it **invokes `ezai-docs-writer`** via the Skill tool to produce or correct the target file, passing the `profile` and `zones` from `00-context.json` so the writer uses the same profile as the audit. It does not write documentation content itself.

If `ezai-docs-writer` is unavailable, GENERATION must:

1. Mark the TODO as `SKIPPED` in `03-changes.json`.
2. Add it to `blockers` with its finding ID and the reason `ezai-docs-writer unavailable`.
3. Continue with the remaining TODOs that don't require docs-writer.

This ensures VALIDATION can distinguish "not fixed because skipped" from "not fixed because the fix failed".

---

## Stage 4 — VALIDATION

**Who:** Dedicated subagent (read-only).
**Inputs:** `.docs-audit/01-audit.json` + `.docs-audit/03-changes.json` + updated `docs/` tree.
**Output:** `.docs-audit/04-validation.json` (`schemas/04-validation.schema.json`)

The VALIDATION subagent re-reads the docs tree and cross-references every finding from `01-audit.json` against the changes recorded in `03-changes.json`. It reports the status of each finding by its stable ID, and lists new issues it notices in `observations`.

---

## Bounded re-loop

If `04-validation.json` contains findings with status OPEN or REGRESSED, the orchestrator surfaces the summary to the user and offers **one** re-loop back to PLANNING (stage 2). The user decides: re-patch or close. No automatic second loop.
