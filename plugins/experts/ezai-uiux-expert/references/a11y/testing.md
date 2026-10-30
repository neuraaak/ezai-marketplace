# Establishing an accessibility finding

Load this file before asserting any accessibility defect. It defines what each
method can prove, and therefore what a finding may claim.

## The 30–40 % rule

Automated tooling detects roughly **30–40 %** of accessibility issues. It is
excellent at what it covers and silent about everything else. A clean axe run
means the automatable checks passed — nothing more.

What tooling cannot decide, by construction:

- Whether an `alt` text is *correct*, only that it exists
- Whether the reading and tab order make sense
- Whether a label describes the field
- Whether focus is managed across a route change or a dialog
- Whether an error message names a remedy
- Whether a custom widget's keyboard contract is complete
- Whether content is understandable

An audit that is only a tool run must say so in its limitations.

## Methods, and what each establishes

| Method                                                | Establishes                                                                                                            | Cannot establish                                                                  |
| :---------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **Static source read**                                | Missing labels, `div` used as a control, missing `alt`, missing `autocomplete`, positive `tabindex`, missing landmarks | Anything computed: contrast, focus visibility, reflow, target size, order, motion |
| **Automated scan** (axe, pa11y, Lighthouse)           | Machine-checkable violations, with a rule ID to quote                                                                  | The 60–70 % above                                                                 |
| **Keyboard pass**                                     | Reach, order, traps, focus visibility, widget contracts                                                                | How it sounds to a screen reader                                                  |
| **Screen-reader pass**                                | Names, roles, states, announcements, reading order                                                                     | Visual defects                                                                    |
| **Zoom and reflow pass**                              | 200 % zoom, 320 px reflow, text-spacing overrides                                                                      | —                                                                                 |
| **Rendered inspection** (headless browser, simulator) | Computed contrast, measured target size, focus appearance                                                              | Intent and comprehension                                                          |

## The minimum credible pass

In order. Stop and record a limitation rather than skipping a step silently.

1. **Run whatever is already installed** (axe, pa11y, Lighthouse,
   `eslint-plugin-jsx-a11y`). Record the rule ID with each finding. Do not
   propose installing tooling during an audit — note it as a recommendation.
2. **Keyboard only.** Unplug the mouse, mentally or actually. Tab through every
   flow in scope: can you reach everything, in a sensible order, see where you
   are, open and close every dialog and menu, and get out?
3. **Names and structure.** Every interactive element has a name; headings form
   an outline; one `main`; the visible label is in the accessible name.
4. **Zoom to 200 % and narrow to 320 px.** Content survives, nothing is clipped,
   no horizontal scrolling of the page.
5. **Both colour schemes.** Contrast holds in dark mode too.
6. **Screen reader on the primary flow** when one is available. This is the step
   most often skipped; say so when it was.

## Evidence discipline

Every finding records how it was established — `tool`, `rendered`, or `static`.
This is not bookkeeping: it is what stops an audit asserting failures it did not
observe.

- `tool` — strongest. Quote the rule ID.
- `rendered` — observed on the real interface.
- `static` — read from source. **Weakest.** Under a static-only read, these
  cannot be claimed and belong in limitations instead:

  > contrast, focus visibility and appearance, target size, reflow at 320 px,
  > zoom to 200 %, motion, reading order after CSS layout, anything computed.

A static read can still prove a great deal — a missing label, a `div` with a
click handler and no role, a missing `autocomplete`, a positive `tabindex`, an
`aria-hidden` focusable element. Report those with confidence and leave the rest
unasserted.

## Conformance claims

- A conformance statement names the **standard, the version, the level, and the
  scope** (which pages, which date, which assistive technologies).
- Never state "WCAG compliant" without those four. Never state conformance from
  an automated scan alone.
- Partial conformance is a legitimate, honest answer. "Conforms to WCAG 2.2 AA
  except SC 1.4.10 on the pricing table, remediation planned" is worth more than
  an unqualified claim.
