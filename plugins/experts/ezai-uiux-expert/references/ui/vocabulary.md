# Vocabulary for stating a visual finding

Read `ui/index.md` first.

This file exists for one purpose: so a finding can be **precise** rather than
impressionistic. "The spacing is off" is not a finding; "body and label share
the 16 px step, so the label groups with the wrong field" is.

It is not a design system, and nothing here licenses producing one.

## Design tokens

Three tiers. Naming a finding at the wrong tier is why token discussions go in
circles.

| Tier          | Holds                           | Example of the *shape*                  |
| :------------ | :------------------------------ | :-------------------------------------- |
| **Primitive** | Raw values, no meaning          | `blue-600`, `space-4`, `size-16`        |
| **Semantic**  | A role, pointing at a primitive | `color-action-primary`, `space-section` |
| **Component** | A component's use of a role     | `button-primary-background`             |

Findings this enables:

- **A component referencing a primitive directly** skips the semantic tier, so
  the theme cannot be changed in one place. Common, and worth a `mineur`.
- **A semantic token with a colour name** (`color-blue-action`) has merged two
  tiers and will be wrong the first time the brand changes.
- **A hard-coded value where a token exists** is a consistency defect, and it is
  the one GENERATION may fix — the token is the vocabulary, see the pipeline.

**Format**: the DTCG specification published a **stable version, 2025.10**
(2025-10-28), described as a Candidate Recommendation by the group's own
process. It is **not a W3C Standard and not on the W3C Standards Track** — say
that accurately if asked. The core format is usable in production; the taxonomy
and naming-tier work is less settled, so do not cite a naming convention as if
the spec mandated one.

## Typography

| Property        | The usable rule                                                                                        |
| :-------------- | :----------------------------------------------------------------------------------------------------- |
| **Scale**       | One modular scale, typically ratio 1.2, 1.25, 1.333 or 1.5. Arbitrary sizes outside it are the finding |
| **Measure**     | 45–75 characters per line for body text                                                                |
| **Line height** | 1.4–1.6 for body, 1.1–1.25 for display. Tighter as size grows                                          |
| **Body size**   | 16 px minimum on mobile web — below it iOS zooms the page on focus                                     |
| **Fluid type**  | `clamp()` between a floor and a ceiling, so there is no step at a breakpoint                           |
| **Weights**     | Two or three in use. More than that is usually an accident                                             |

A finding worth writing: "six distinct font sizes appear on this screen, four of
them within 2 px of each other — the hierarchy is accidental, not designed."

## Colour

- **Semantic roles before values**: action, surface, border, text, feedback
  (success / warning / danger / info). A palette with no roles cannot be
  themed and cannot be audited.
- **Ramps**: a consistent number of steps per hue (9 to 12 is typical), built in
  a perceptual space (OKLCH) so lightness steps look even. Ramps built in HSL
  have uneven perceived steps between hues — that is a statable finding.
- **Dark mode is not inversion.** Elevation reverses (lighter means closer),
  saturated colours need desaturating, and large white surfaces need rework.
  Contrast must be re-checked in both themes.
- **Contrast is a conformance matter**, not a visual one: `a11y/wcag.md` owns
  the thresholds. State the ratio, cite the criterion, and do not propose a new
  colour — propose the role that should have been used.

## Spacing, layout, elevation

- **One spacing scale**, 4 pt or 8 pt based. A value off the scale is a finding;
  a dozen of them is a finding about the absence of a system.
- **Space between groups must exceed space within a group** — see
  `common/perception.md`, which owns the perceptual rule.
- **Elevation ladder** of a few levels, each meaning a consistent distance from
  the surface. More levels than can be told apart is a finding.
- **Radii** follow a scale too, and nest correctly: an inner radius should be
  the outer radius minus the padding, or the corners read as wrong without the
  viewer knowing why.

## The limit

Everything above lets you **name** what is wrong and **which role** should have
been used. None of it licenses choosing the value.

> A finding says "this uses a hard-coded `#2F6FED` where `color-action-primary`
> exists". It does not say what `color-action-primary` should be.

Choosing the value is a design decision — `routing.md`.
