# Scoping questions

Ordered list used by the **Scope** step of `SKILL.md`, when this skill runs on
its own. Walk it top to bottom, drop every question the request or the
repository already answers, then ask the **first three remaining** in a single
call. For any question left unasked, apply the recommended option and state it
in the response.

Options are listed recommended first, as `label` — `description`. Never add an
"Other" option: every harness appends a free-form one.

**Under a persona.** Skip this step entirely when running in a subagent of
`ezai-uiux-specialist-persona`: the persona settled the scope before dispatch
and wrote it to `00-context.json`. When a persona hands the task over inline,
run this step but drop every question it already asked.

## 1. `task` — header `Task`

**Ask when** the request does not say what kind of answer is wanted ("review
this form", "what style for my site", "fix the labels" already answer it).
**Question:** What do you need on this interface?

- `Review it (Recommended)` — Usability and accessibility findings on the element or screen, with severities.
- `Give a direction` — Which visual register fits, and why. No implementation.
- `Apply a conformance fix` — Correct a specific accessibility or usability defect in the code.

## 2. `conformance` — header `Conformance`

**Ask when** the task is a review or a fix, the request names no target level,
and the project shows no accessibility policy (an `ACCESSIBILITY.md`, a
declaration page, a CI gate).
**Question:** Which accessibility level should this be held to?

- `WCAG 2.2 AA (Recommended)` — The level every current regulation references; EN 301 549 and the EAA rest on it.
- `WCAG 2.2 AAA` — Stricter; rarely required in full, and some criteria cannot be met by every content type.
- `WCAG 2.1 AA` — The exact level EN 301 549 cites today, when conformance must match the letter of the standard.

## 3. `sector` — header `Sector`

**Ask when** the task is a direction **and** no sector is readable from the
repository (README, landing copy, product name, domain).
**Question:** What kind of product is this?

- `B2B SaaS (Recommended)` — Application or dashboard for professional users.
- `Consumer or creator brand` — Audience converting on personality.
- `Local business or institution` — Audience converting on trust and practical information.

## 4. `rendering` — header `Rendering`

**Ask when** the task is a review, no dev-server script or browser driver is
installed, and the answer changes what can be claimed.
**Question:** Can the interface be rendered for this review?

- `Source only (Recommended)` — Review the code; contrast, focus visibility, target size and reflow will be listed as unverified.
- `I can run it` — You start it and share a URL or screenshots, and those criteria get checked for real.

## Why these questions

- **Task** decides which reference group is loaded: a review loads `common/` and
  `a11y/`, a direction loads `ui/`, a fix loads whichever file carries the rule.
  Loading everything is the failure this question prevents.
- **Conformance** changes which findings are `bloquant`: a 24 × 24 target
  failure is AA, a 44 × 44 one is AAA. Auditing against the wrong level produces
  either false alarms or false clearance.
- **Sector** is asked only for a direction, because it is the single input that
  decides the register (Jakob's law — the expected convention comes from the
  sector, not from taste).
- **Rendering** is asked last and least often, but it governs honesty: under a
  source-only review, several criteria cannot be judged at all, and the answer
  decides whether they are reported as limitations or checked for real.
- No question asks whether to apply a fix. A review reports; a fix is its own
  task, chosen in question 1.
