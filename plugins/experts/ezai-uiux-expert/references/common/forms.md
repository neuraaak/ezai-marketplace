# Forms

Load this file for any review of a form, a checkout, a signup, or any sequence
that asks the user for input. Forms are where usability, accessibility and
business pressure collide, and where the highest-severity findings cluster.

## Structure

- **One column.** Multi-column forms break the vertical scan and cause skipped
  fields. The exception is genuinely paired data (city / postal code, expiry /
  CVC), kept on one row because they are one thought.
- **Label above the field.** Not beside it, and **never a placeholder as the
  label**: the placeholder disappears on focus, fails contrast, breaks
  autofill, and leaves the user unable to check their answer before submitting.
- **Placeholders are for format hints only**, and even then a persistent hint
  below the field is better.
- **Group by meaning**, with visibly more space between groups than within them
  (see `perception.md`). Use `<fieldset>`/`<legend>` for radio and checkbox sets.
- **Field width signals expected input.** A postal-code field as wide as the
  address field is a false signifier.

## What to ask

- **Every field must earn its place.** The cheapest usability win in any form is
  deleting a field. Ask what the business would actually do with the answer; if
  the answer is "nothing yet", it is a `majeur` finding.
- **Never ask for what the system knows** (SC 3.3.7 Redundant Entry). Carry
  forward, pre-fill, infer from the account.
- **Progressive profiling** over a long first form: ask the minimum to create
  value, collect the rest when it becomes useful.
- **Mark the minority.** If most fields are required, mark the optional ones;
  if most are optional, mark the required ones. Marking everything marks nothing.
- Do not demand personal data at the first step of a flow the user has not yet
  committed to. It raises abandonment and, when it is not needed for the
  purpose, it is a data-minimisation problem as well as a usability one.

## Input mechanics

- **`autocomplete` tokens on every field that has one** (`email`, `given-name`,
  `street-address`, `postal-code`, `cc-number`, `one-time-code`…). This is an
  accessibility requirement (SC 1.3.5), not a convenience.
- **The right keyboard on mobile**: `inputmode="numeric"` for codes,
  `type="email"`, `type="tel"`. A numeric keypad for a postal code saves a real
  interaction cost.
- **Accept what the user types** (Postel's law): spaces in card and phone
  numbers, any sane date format, pasted values. Normalise on the way in rather
  than rejecting. **Never block paste**, least of all on password or one-time-code
  fields — it is a 3.3.8 failure as well as a security anti-pattern.
- **Format on blur, not on every keystroke.** Live reformatting fights the
  caret.
- **Password rules shown before the user types**, not after a rejection. Offer a
  show-password toggle.

## Validation and errors

- **Validate inline, on blur** — not on every keystroke (which scolds the user
  mid-typing), not only on submit (which hides the problem until the end).
  Re-validate on submit regardless.
- **Never clear what the user entered.** A validation error that empties the
  form, or the password fields, is a `bloquant`.
- **The error message sits next to its field**, is programmatically associated
  with it (`aria-describedby`, `aria-invalid`), and survives being read by
  someone who cannot see the red.
- **An error summary at the top** for a long form, linking to each field, with
  focus moved to the summary on failed submit.
- Error copy: what happened, why, what to do — in the user's words. See
  `content.md`.
- **A disabled submit button with no explanation is a dead end.** Either enable
  it and explain on submit, or say what is missing.

## Multi-step

- Show where the user is and how much is left (`Zeigarnik`, goal-gradient — see
  `cognitive-laws.md`), with real steps, never invented ones.
- **Save state between steps.** Losing a long form to a back button, a timeout
  or a refresh is a `bloquant`.
- Let the user go back and change an earlier answer without losing the later
  ones.
- One question per screen works well on mobile and badly on a desktop form the
  user wants to scan — pick for the surface, not as a universal rule.

## Checkout specifics

- **Total cost visible before the last step.** Fees, shipping and taxes revealed
  at the end is `hidden costs`, a dark pattern with regulatory exposure — see
  `anti-patterns.md`.
- **Nothing added to the basket the user did not choose**, including insurance,
  donations, warranties and pre-ticked options.
- **Guest checkout** available, or at least account creation after the purchase.
- Keep the field count near the minimum the order genuinely needs; most
  checkouts carry fields they could drop. **Baymard Institute** is the empirical
  source here — look up the current figure before quoting a number, and do not
  quote one from memory.
