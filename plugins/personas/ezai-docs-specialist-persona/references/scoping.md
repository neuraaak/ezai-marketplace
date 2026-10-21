# Docs Specialist Persona — Scoping questions

Ordered list used by the **Scope** step of `SKILL.md`. Walk it top to bottom, drop every question the request or the repository already answers, then ask the **first three remaining** in a single call. For any question left unasked, apply the recommended option and state it in the response.

Options are listed recommended first, as `label` — `description`. Never add an "Other" option: every harness appends a free-form one.

A question whose condition depends on another answer is asked only when the request already settles that answer — questions in one call cannot depend on each other.

## 1. `mode` — header `Mode`

**Ask when** the request does not say how deep to go ("full audit", "check the badges", "add a page" already answer it).
**Question:** How should the documentation be handled?

- `Full audit (Recommended)` — Whole site: Diátaxis structure and coherence, then a plan to approve.
- `Targeted audit` — One axis or one section of the site, then a plan to approve.
- `Write directly` — No audit: hand the pages to write over to `ezai-docs-writer`.

## 2. `focus` — header `Focus`

**Ask when** the mode is Targeted audit and the request does not name the axis.
**Question:** Which axis should the audit check?

- `Structure gaps (Recommended)` — Missing Diátaxis quadrants and pages that mix two of them.
- `Coherence` — Badges, project name, placeholder text and leftovers from a template.

## 3. `section` — header `Section`

**Ask when** the mode is Targeted audit and the request does not name a part of the site.
**Question:** Which part of the site is in scope?

- `Whole site (Recommended)` — Every page under `docs/`.
- `One section` — A single folder or page group; the user names it via the free-form answer.

## Why these questions

- **Mode** lets a vague request ("improve my docs") avoid a full audit when the user only needs a few pages. Its default is the full audit because that is what this persona exists for; single-page requests never reach this question — the scope gate routes them to `ezai-docs-writer` first.
- **Focus** maps one-to-one to the AUDIT sections: Structure gaps runs Section A only, Coherence runs Section B only.
- No question asks whether to apply the plan: PLANNING already stops for approval, at the moment the user can see the plan.
