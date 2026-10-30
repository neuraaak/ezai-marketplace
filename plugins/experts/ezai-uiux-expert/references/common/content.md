# Content design and microcopy

Load this file for any finding about words: button labels, error messages,
empty states, confirmations, tone, or anything that will be translated.

Microcopy is not decoration applied after the design. It is the interface: the
user reads the label, not the component.

## Button and action labels

- **Name the outcome, not the mechanism.** "Create my account", "Pay €10",
  "Delete 3 files" — not "Submit", "Validate", "OK". A generic label is a
  `majeur` finding whenever the consequence is not reversible or not obvious.
- **The label answers the question the dialog asked.** A dialog headed "Discard
  your changes?" is answered by *Discard* and *Keep editing*, never by *OK* and
  *Cancel* — which invert under a negative question and make the user guess.
- **The destructive verb goes in the button.** "Delete account" on the
  destructive action; the safe option carries no colour and no emphasis.
- Sentence case, no terminal period, no ellipsis unless more input follows.
- The visible label must be contained in the accessible name (SC 2.5.3) — see
  `a11y/aria.md`.

## Error messages

Three parts, in this order, in the user's words:

1. **What happened** — concretely, not "an error occurred".
2. **Why**, when it helps. Skip it when it does not.
3. **What to do now** — the remedy, as an action if possible.

Rules:

- **Never blame the user.** No "invalid", no "you failed to", no "illegal".
- **No codes alone.** A support code may accompany a message; it may not be the
  message.
- Next to the field it concerns, programmatically associated with it.
- Say what is accepted, not only what was rejected: "Use 8 characters or more"
  beats "Password too weak".
- A failure the user cannot act on is the system's to fix, not the user's to
  read. Retry silently where that is honest, and say so when it is not.

## Empty states

An empty state is the most-read screen in a new product. It must distinguish:

- **Never had data** → explain what will appear here, and offer the first
  action. This is onboarding, and the only place a product can teach without
  interrupting.
- **Filtered to nothing** → say which filter is responsible, and offer to clear
  it. Showing the same panel for both is a `majeur` finding.
- **Failed to load** → that is an error state, not an empty one. Conflating them
  makes the user wait for data that is never coming.

## Confirmation and destructive actions

- Prefer **undo over confirm**. A dialog is dismissed reflexively; an undo is
  read when it matters. See the reversibility rule in `common/heuristics.md`.
- When confirmation is genuinely needed, **name the consequence and what is
  affected** — "Delete 3 projects and their 42 files" — and put the verb in the
  button.
- Require real friction only for the genuinely irreversible: typing the name of
  what is being destroyed. Using that pattern for something undoable trains the
  user to type past it.

## Tone and register

- Match the sector. A bank that jokes about a failed payment, and a game that
  speaks like a tax form, both break the match with the real world (Nielsen 2).
- Write at the reading level of the audience, not of the team. Jargon drawn from
  the database schema is the most common failure: *entity*, *resource*,
  *instance*, *record* are rarely the user's words.
- Be consistent: one name per concept, everywhere, forever. Two names for one
  thing is a Nielsen 4 finding.
- Keep sentences short. If a sentence needs a comma to survive, it needs to be
  two sentences.

## Internationalisation

Checks that produce findings before a single translation exists:

- **Text expands.** German and French commonly run 20–35 % longer than English;
  short labels expand most. A layout that only fits the English string is a
  `majeur` finding, not a translation problem.
- **No text baked into images**, and no text in icons.
- **No string concatenation** to build a sentence: word order differs between
  languages. Use whole strings with placeholders.
- **Pluralisation is not `if (n === 1)`.** Several languages have more than two
  plural forms.
- **Locale-aware** dates, numbers, currencies, and name order. `MM/DD/YYYY` is
  ambiguous outside the US; prefer an unambiguous format or a locale-formatted
  one.
- **RTL mirroring**: layout, icons that indicate direction, and progress all
  flip; logos and media controls do not.
- Never infer language from country, nor country from language.
