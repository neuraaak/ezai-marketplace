# UI direction — index and discipline

This group **advises**. It does not build, and it does not own a catalogue.

Read this page before any of the files below. The discipline is the point; the
content is secondary.

## What this group does

1. **Names what the domain expects.** A B2B SaaS dashboard and a florist's site
   fail for opposite reasons. The direction comes from the sector before any
   style is named — this is Jakob's law applied: the convention the user already
   expects is not a matter of taste.
2. **Suggests, lightly.** One recommended style family, two alternatives, one
   thing to avoid, each with a one-line reason.
3. **Routes.** Once the direction is set, the implementation belongs to whichever
   UI skill is installed.

Its real purpose is to **complete the UX verdict**. "The primary action is not
distinguishable" is an incomplete finding; "…and in this sector the convention
is a single saturated CTA against a near-neutral page" is actionable.

## The line

> **The moment this group names a hex value, a font file or a component, it has
> left its lane.**

Concretely, never produced here: palettes, colour ramps, font pairings, CSS,
component code, spacing values for a new system, icon sets, illustrations.

Produced here: a direction note, a sector expectation, the vocabulary to state a
finding precisely, and the name of the skill that should do the work.

Why the line exists: other installed skills already own implementation — styles,
palettes, font pairings, stack-specific components, charts. Duplicating them
loses. The defensible territory is **evaluation and standards conformance**.
See `routing.md`.

## Files

| File                    | Load when                                                                  |
| :---------------------- | :------------------------------------------------------------------------- |
| `direction.md`          | Giving a direction: the four questions and the note's format               |
| `sector-conventions.md` | The expectation attached to a sector                                       |
| `style-families.md`     | Naming a register: when each fits and when it backfires                    |
| `vocabulary.md`         | Stating a visual finding precisely — token tiers, type scale, contrast     |
| `routing.md`            | Deciding which installed skill should take the work, and with which prompt |

## Load when

- **A direction is asked for** ("what style for…", "does this look right for…")
  → `direction.md` + `sector-conventions.md` + `style-families.md`.
- **A visual finding must be written** in an audit → `vocabulary.md` alone. It
  is the only file of this group an audit needs.
- **An audit is finished and visual work remains** → `routing.md`.
