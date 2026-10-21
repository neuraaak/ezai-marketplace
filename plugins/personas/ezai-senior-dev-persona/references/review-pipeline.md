# Review pipeline — ezai-senior-dev-persona

Loaded by the orchestrator **only** when the active capability is `code-review`.
For every other capability use `references/pipeline.md` (inline workflow) — this
file does not apply. Load `references/report-format.md` before this file: the
domain subagents reuse its `code-review` finding format.

The orchestrator owns no domain knowledge. All expertise lives in the project
sub-skills (`ezai-project-architect`, `ezai-project-quality`,
`ezai-project-performance`, `ezai-project-config`). The orchestrator dispatches,
consolidates, gates, and loops.

## Artifact contract

All artifacts live in `.senior-review/` at the root of the reviewed project.
Names are fixed — every stage knows where to read and write. Ensure
`.senior-review/` is gitignored in the reviewed repo (add it to `.gitignore` if
absent).

```text
.senior-review/
  00-context.json           written by DETECTION,  read by REVIEW + PLANNING + APPLY
  01-review-<DOMAIN>.json   written by REVIEW,     read by PLANNING + VALIDATION (one file per domain)
  02-plan.json              written by PLANNING,   read by APPLY
  03-changes.json           written by APPLY,      read by VALIDATION
  04-validation.json        written by VALIDATION, presented to user
```

Every artifact is JSON and has a schema in `references/schemas/` (`01-review-<DOMAIN>.json` files share `01-review.schema.json`). The schemas use the subset that structured outputs accept: every field required, no extra field, closed enums.

Finding IDs are stable across stages: `01-<DOMAIN>-NNN` where DOMAIN ∈
`ARCH | QUAL | PERF | CONF`. PLANNING and VALIDATION cross-reference by this ID.

## Artifact validation

The orchestrator validates each artifact before the next stage reads it.

1. **Constrain when possible.** When the harness can constrain a subagent's output to a JSON schema (structured outputs — e.g. `codex exec --output-schema`), pass the stage's schema: the output is then valid by construction.
2. **Otherwise check it.** The subagent writes the file following the schema; the orchestrator checks that it parses as JSON, that every required field is present, that there is no extra field, and that every enum value is allowed.
3. **Cross-reference IDs.** Every ID is `01-<DOMAIN>-NNN` and matches its file's domain; every `02-plan.json` ID exists in a review file; every `03-changes.json` ID exists in the plan; `04-validation.json` lists every review finding exactly once.
4. **On failure**, re-dispatch the stage once with the list of errors. A second failure stops the pipeline: tell the user which stage failed and which fields or IDs are wrong.

---

## Stage 0 — DETECTION

**Who:** Dedicated subagent (read-only).
**Inputs:** The persona's Scope answers, reviewed code scope (target
files/modules), `pyproject.toml`, `package.json`, file extensions.
**Output:** `.senior-review/00-context.json` (`schemas/00-context.schema.json`)

### Role

1. **Language** — Python or JavaScript/TypeScript, from `pyproject.toml` /
   `package.json` / extensions.
2. **Review scope** — the exact files/modules under review, bounded by the
   `target` answer of the Scope step.
3. **Domain selection** — pick the relevant domains among `architect`,
   `quality`, `performance`, `config`. Do **not** launch all four by reflex: a
   domain that does not apply must be listed as `skipped` with a one-line
   reason (e.g. no async/concurrent code ⇒ skip `performance`). When the
   `domains` answer restricts the review, keep only those domains and mark the
   others `skipped` with the reason `user scope`.

`domains` lists all four domains, each `selected` or `skipped` with its reason.
REVIEW never starts on an artifact that failed validation.

---

## Stage 1 — REVIEW *(load `report-format.md` before starting)*

**Who:** One dedicated subagent per selected domain (read-only), dispatched
**in series** (one at a time).
**Inputs:** `00-context.json` + the reviewed code + the domain's project
sub-skill (loaded by the subagent via the Skill tool).
**Output:** each subagent writes **its own file**,
`.senior-review/01-review-<DOMAIN>.json` (`schemas/01-review.schema.json`). One
file per domain: no subagent ever edits another's output.

Domain → sub-skill mapping:

| Domain (ID) | Sub-skill to load          |
| :---------- | :------------------------- |
| ARCH        | `ezai-project-architect`   |
| QUAL        | `ezai-project-quality`     |
| PERF        | `ezai-project-performance` |
| CONF        | `ezai-project-config`      |

Each finding carries a stable ID, a severity, a title, and the `what` / `where`
(`file:line`) / `fix` fields of the `code-review` format in `report-format.md`.

Severity: `bloquant` (breaks contract) · `majeur` (degrades quality) ·
`mineur` (polish).

---

## Stage 2 — PLANNING *(load `report-format.md` before starting)*

**Who:** Main orchestrator, entering plan mode.
**Inputs:** `00-context.json` + every `01-review-<DOMAIN>.json`.
**Output:** `.senior-review/02-plan.json` (`schemas/02-plan.schema.json`).

The orchestrator consolidates every domain finding into one prioritized fix plan
(bloquant → majeur → mineur), writes it with `approved: false`, presents it to
the user as a readable list, and **waits for approval**. This is the human gate:
on approval the orchestrator sets `approved: true`. APPLY never runs on a plan
whose `approved` is `false`.

Each TODO carries the finding ID so VALIDATION can cross-reference.

---

## Stage 3 — APPLY

**Who:** A **single** dedicated subagent (write).
**Inputs:** `00-context.json` + `02-plan.json`.
**Output:** real file patches + `.senior-review/03-changes.json` (`schemas/03-changes.schema.json`).

The APPLY subagent executes the approved plan **in series, file by file**. It
loads inline whichever project sub-skills the fixes require, to respect the
standards. A single agent ⇒ no write collisions.

Degraded mode: if a fix fails or cannot be applied, mark it `SKIPPED` /
`FAILED` and add it to `blockers`, then continue with the remaining TODOs. This
lets VALIDATION distinguish "not fixed because skipped" from "fix failed".

---

## Stage 4 — VALIDATION

**Who:** Dedicated subagent (read-only).
**Inputs:** every `01-review-<DOMAIN>.json` + `03-changes.json` + updated code.
**Output:** `.senior-review/04-validation.json` (`schemas/04-validation.schema.json`).

Re-reads the code and cross-references every review finding (by ID)
against `03-changes.json`. Status: `FIXED` | `OPEN` | `REGRESSED`.

---

## Bounded re-loop

If `04-validation.json` contains `OPEN` or `REGRESSED` findings, the orchestrator
surfaces the summary to the user — count of OPEN/REGRESSED, the IDs and titles,
and a one-line diagnosis each — then offers **one** re-loop back to PLANNING.
Present it as: « Voulez-vous corriger ces N points restants, ou considérer la
revue terminée ? » The user decides — no automatic second loop.
