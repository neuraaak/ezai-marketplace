# Accessibility References Index

Three files, loaded on demand.

| Need                                                    | Load         |
| :------------------------------------------------------ | :----------- |
| Which criteria apply, at which level, under which law   | `wcag.md`    |
| How to make a control actually usable by assistive tech | `aria.md`    |
| How to establish a finding instead of guessing at one   | `testing.md` |

## Load when

- **Any audit of an existing interface** → `wcag.md` + `testing.md`, always,
  even when the request does not mention accessibility.
- **A custom control, a dialog, a menu, a combobox, a tab set** → add `aria.md`.
- **A conformance claim, a procurement answer, a legal question** → `wcag.md`
  alone, and read its *Legal frame* section rather than answering from memory.

## The two things to settle before writing any finding

1. **The conformance target.** AA is the level every current regulation
   references. A criterion above the target is reported, but never as
   `bloquant` — see the severity scale in `common/heuristics.md`.
2. **Whether the interface was rendered.** Contrast, focus visibility, reflow,
   target size, motion and reading order **cannot be judged from source code**.
   Under a static read, record the limitation; do not assert the failure.
   `testing.md` says what each method can and cannot establish.

> Automated tooling catches roughly **30–40 %** of accessibility issues. An
> audit that is only a tool run is not an audit, and must say so.
