# WCAG criteria and the legal frame

Load this file for any accessibility finding and for any conformance question.
Facts dated below were verified on 2026-10-30; re-check the dated ones before
asserting them in a formal conformance statement.

## POUR — the four principles

| Principle          | Means                                                   | Typical failure                                               |
| :----------------- | :------------------------------------------------------ | :------------------------------------------------------------ |
| **Perceivable**    | The information can be sensed, in more than one way     | Image with no text alternative; colour as sole meaning        |
| **Operable**       | The interface can be driven, by any input               | Mouse-only control; keyboard trap; a drag with no alternative |
| **Understandable** | Content and behaviour are predictable                   | An input that submits on change; an error with no remedy      |
| **Robust**         | It survives assistive technology and future user agents | A `div` wired as a button with no role or name                |

Levels: **A** (minimum), **AA** (the regulated level), **AAA** (not expected to
be met in full for a whole site; some criteria are impossible for some content).

## WCAG 2.2 — what changed

Recommendation of 2023-10-05. Nine new success criteria; **4.1.1 Parsing was
removed** (it no longer reflects how user agents work — do not report it).

| SC     | Name                                 | Level | What it catches in practice                                                                                                                 |
| :----- | :----------------------------------- | :---- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.4.11 | Focus Not Obscured (Minimum)         | AA    | A sticky header or cookie bar covering the element that just received focus                                                                 |
| 2.4.12 | Focus Not Obscured (Enhanced)        | AAA   | As above, with no part of the element obscured                                                                                              |
| 2.4.13 | Focus Appearance                     | AAA   | A focus indicator too thin or too low-contrast to see                                                                                       |
| 2.5.7  | Dragging Movements                   | AA    | Reorder, slider, map or kanban with no single-pointer alternative                                                                           |
| 2.5.8  | Target Size (Minimum)                | AA    | **24 × 24 CSS px**, spacing may count toward it. Icon buttons at 16 px and dense inline links are the usual failures                        |
| 3.2.6  | Consistent Help                      | A     | Help, contact or chat placed differently from page to page                                                                                  |
| 3.3.7  | Redundant Entry                      | A     | Re-asking in step 3 for what was given in step 1                                                                                            |
| 3.3.8  | Accessible Authentication (Minimum)  | AA    | Login requiring a cognitive function test — puzzle, transcription, memorisation — with no alternative, and paste blocked on password fields |
| 3.3.9  | Accessible Authentication (Enhanced) | AAA   | As above, with object recognition also disallowed                                                                                           |

### Target size — do not conflate the numbers

Four different figures circulate and only one is the AA requirement:

| Figure         | Source                            | Status                       |
| :------------- | :-------------------------------- | :--------------------------- |
| **24 × 24 px** | WCAG 2.5.8 Target Size (Minimum)  | **AA — the requirement**     |
| 44 × 44 px     | WCAG 2.5.5 Target Size (Enhanced) | AAA                          |
| 44 × 44 pt     | Apple HIG                         | Platform guideline, not WCAG |
| 48 × 48 dp     | Material                          | Platform guideline, not WCAG |

Citing 44 × 44 as the accessibility requirement is a false finding. Cite 2.5.8,
then cite the platform guideline separately if the surface is native.

## Contrast

| What                                  | Ratio | Criterion |
| :------------------------------------ | :---- | :-------- |
| Body text                             | 4.5:1 | 1.4.3 AA  |
| Large text (≥ 18.66 px bold, ≥ 24 px) | 3:1   | 1.4.3 AA  |
| UI components and graphical objects   | 3:1   | 1.4.11 AA |
| Body text, enhanced                   | 7:1   | 1.4.6 AAA |

Rules that produce real findings:

- **Contrast is measured against what is actually behind the text**, including a
  gradient, an image, or a translucent material. A token pair that passes on
  white fails over a photo.
- **Colour is never the sole carrier of meaning** (1.4.1): a red field border
  without a message, a status shown only as a dot, a chart whose only key is
  hue.
- **Do not judge contrast from source.** Computed colour, opacity and stacking
  decide it.

### APCA and WCAG 3 — the honest position

WCAG 2 ratios are the legal reference **today**. WCAG 3.0 is a Working Draft
(new draft published 2026-03-03); a Candidate Recommendation is estimated around
Q4 2027 and a Recommendation **not before 2028**. APCA's normative status inside
it is disputed and unsettled.

Practical rule: **audit against WCAG 2. Use APCA only as a tiebreaker on
dark-mode text**, where WCAG 2 is known to over-reward dark backgrounds. Never
base a finding on APCA alone, and never tell a user they are required to use it.

## Legal frame

| Jurisdiction | Instrument                                          | Level referenced                                                                                                   | Since                     |
| :----------- | :-------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- | :------------------------ |
| EU           | European Accessibility Act, Directive (EU) 2019/882 | EN 301 549, which cites **WCAG 2.1 AA** for web content                                                            | Applicable **2025-06-28** |
| EU           | EN 301 549                                          | Editions in circulation: V3.2.1 (2021-03), v4.1.1. Movement toward WCAG 2.2 but **not yet the formal requirement** | —                         |
| EU           | EAA, legacy self-service terminals                  | Terminals in service before 2025-06                                                                                | Until **2030-06-28**      |
| France       | RGAA 4.1.2                                          | Aligned on WCAG, French public sector                                                                              | —                         |
| US           | Section 508, ADA Title II rule                      | WCAG 2.1 AA                                                                                                        | —                         |

What this means for an audit:

- **Meeting EN 301 549 creates a presumption of conformity** with the EAA. It is
  the standard to cite, not the directive.
- EN 301 549 goes beyond the web: non-web documents, software, hardware,
  documentation and support services each carry their own requirements.
- **Default the audit to WCAG 2.2 AA** even though the letter of EN 301 549 is
  2.1 AA: 2.2 is a superset, the direction of travel is clear, and a 2.1-only
  audit will be re-run within the product's lifetime. When a conformance
  statement must match the letter of the standard, say 2.1 AA and say why.

## Writing an accessibility finding

- `criterion` carries the SC number (`2.5.8`), not the principle.
- `what` states the observable fact and, when relevant, the rule ID the tool
  reported.
- Severity follows the conformance target: a failure at or below the target is
  `bloquant` when it blocks the task (no keyboard reach, no accessible name,
  keyboard trap), `majeur` otherwise. A criterion above the target is never
  `bloquant`.
- Never report 4.1.1 Parsing. Never report a "failure" that the evidence does
  not support — say what could not be verified instead.
