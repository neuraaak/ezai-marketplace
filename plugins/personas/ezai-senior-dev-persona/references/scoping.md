# Senior Dev Persona — Scoping questions

Ordered list used by the **Scope** step of `SKILL.md`. Walk it top to bottom, drop every question the request or the repository already answers, then ask the **first three remaining** in a single call. For any question left unasked, apply the recommended option and state it in the response.

Options are listed recommended first, as `label` — `description`. Never add an "Other" option: every harness appends a free-form one.

A question whose condition depends on another answer is asked only when the request already settles that answer — questions in one call cannot depend on each other.

## 1. `mode` — header `Mode`

**Ask when** the request does not say whether it wants a review or a piece of work.
**Question:** How should this request be handled?

- `Targeted work (Recommended)` — Implement, refactor, debug or decide on a precise target, inline, without the review pipeline.
- `Review` — Run the review pipeline: detection, domain reviews, a plan to approve, then fixes.

## 2. `target` — header `Target`

**Ask when** the request neither names files, modules or a feature nor pastes code.
**Question:** Which code is in scope?

- `Changed code (Recommended)` — What the working tree modifies. If the tree is clean, recommend `Specific module` instead.
- `Specific module` — One module, package or feature; the user names it via the free-form answer.
- `Whole project` — Every source file; the most expensive option.

## 3. `domains` — header `Domains`

**Ask when** the mode is Review and the request does not name the concern ("security review", "check the architecture" already answer it).
**Question:** Which domains should the review cover?

- `Detection picks (Recommended)` — DETECTION keeps only the domains that apply and skips the rest with a reason.
- `Quality & security` — Tests, validation, security and secrets only.
- `Architecture` — Structure, patterns and public API only.

Config and performance come from the request or the free-form answer.

## Why these questions

- **Mode** decides whether the review pipeline runs at all. Its default is the cheaper path: the pipeline costs one subagent per domain, so it runs only when a review is actually wanted.
- **Target** bounds every later stage. Asking it up front keeps DETECTION from scanning the whole project when one module was meant.
- No question asks whether to apply the fixes: PLANNING already stops for approval, at the moment the user can see the plan.
