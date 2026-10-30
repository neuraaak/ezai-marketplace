# UI/UX Specialist Persona — Scoping questions

Ordered list used by the **Scope** step of `SKILL.md`. Walk it top to bottom, drop every question the request or the repository already answers, then ask the **first three remaining** in a single call. For any question left unasked, apply the recommended option and state it in the response.

Options are listed recommended first, as `label` — `description`. Never add an "Other" option: every harness appends a free-form one.

A question whose condition depends on another answer is asked only when the request already settles that answer — questions in one call cannot depend on each other.

## 1. `mode` — header `Mode`

**Ask when** the request does not say how deep to go ("audit the whole app", "check accessibility", "which style for my site" already answer it).
**Question:** How should the interface be handled?

- `Full audit (Recommended)` — Whole surface: usability heuristics, accessibility and UI direction, then a plan to approve.
- `Targeted audit` — One axis or one flow, then a plan to approve.
- `Advice only` — No audit: a direction note and answers, nothing applied.

## 2. `focus` — header `Focus`

**Ask when** the mode is Targeted audit and the request does not name the axis.
**Question:** Which axis should the audit check?

- `Usability (Recommended)` — Heuristics, cognitive load, interface states, forms, navigation, microcopy.
- `Accessibility` — WCAG conformance, keyboard, focus, ARIA, contrast.
- `UI direction` — Whether the visual register fits the sector and the audience.

## 3. `surface` — header `Surface`

**Ask when** the mode is an audit and the request does not name what to look at.
**Question:** What is in scope?

- `Whole product (Recommended)` — Every screen or route the codebase exposes.
- `One flow` — A single journey or screen group; the user names it via the free-form answer.

## 4. `sector` — header `Sector`

**Ask when** the focus includes UI direction **and** no sector is readable from the repository (README, landing copy, product name, domain).
**Question:** What kind of product is this?

- `B2B SaaS (Recommended)` — Application or dashboard for professional users.
- `Consumer or creator brand` — Audience converting on personality.
- `Local business or institution` — Audience converting on trust and practical information.

## 5. `conformance` — header `Conformance`

**Ask when** the focus includes Accessibility **and** the request names no target level, **and** the project shows no accessibility policy (an `ACCESSIBILITY.md`, a declaration page, a CI gate).
**Question:** Which accessibility level should the audit hold the interface to?

- `WCAG 2.2 AA (Recommended)` — The level every current regulation references; EN 301 549 and the EAA rest on it.
- `WCAG 2.2 AAA` — Stricter; rarely required in full, and some criteria cannot be met by every content type.
- `WCAG 2.1 AA` — The exact level EN 301 549 cites today, when conformance must match the letter of the standard.

## Why these questions

- **Mode** lets a vague request ("my app feels clunky") avoid a full audit when the user only wants a direction. Its default is the full audit because that is what this persona exists for; single-component requests never reach this question — the scope gate routes them to `ezai-uiux-expert` first.
- **Focus** maps one-to-one to the AUDIT sections: Usability runs Section A only, Accessibility Section B only, UI direction Section C only.
- **Sector** is asked only for UI direction because it is the single input that decides the visual register (Law of Jakob: the convention the user already expects comes from the sector, not from taste).
- **Conformance** changes which findings are `bloquant`: a 24×24 target failure is AA, a 44×44 one is AAA. Auditing against the wrong level produces either false alarms or false clearance.
- No question asks whether to apply the fixes: PLANNING already stops for approval, at the moment the user can see the plan. And no question asks whether to route visual findings to another skill — ROUTING only ever names skills and prompts, it never acts.
