# Usability heuristics and the severity scale

Load this file for every review of an existing interface. It holds the two
heuristic sets, the method for applying them, and the severity scale the rest of
the corpus refers to.

Heuristics tell you **that** something is wrong. The cognitive laws
(`cognitive-laws.md`) and Norman's model (`norman.md`) tell you **why**, and
`norman.md` tells you **where in the task** the user fails. A finding that cites
only a heuristic is usually a finding that has not been diagnosed.

## Nielsen's 10 usability heuristics (NN/g)

| #    | Heuristic                                              | What a failure looks like                                                                                  |
| :--- | :----------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| 1    | Visibility of system status                            | An action with no acknowledgement; a save with no confirmation; a long operation with no progress          |
| 2    | Match between system and the real world                | Labels drawn from the database schema or the codebase rather than the user's vocabulary                    |
| 3    | User control and freedom                               | No cancel, no back, no undo; a destructive action with only a confirm dialog between the user and the loss |
| 4    | Consistency and standards                              | The same action named two ways; a control that looks like a platform control and behaves differently       |
| 5    | Error prevention                                       | A free-text field where a constrained choice would do; an impossible option left enabled                   |
| 6    | Recognition rather than recall                         | A code, an ID or a value the user must carry from one screen to the next                                   |
| 7    | Flexibility and efficiency of use                      | No shortcut, no bulk action, no saved state for the user who does this fifty times a day                   |
| 8    | Aesthetic and minimalist design                        | Every element competing for attention, so none wins                                                        |
| 9    | Help users recognise, diagnose and recover from errors | "An error occurred"; a message that names a code but no remedy                                             |
| 10   | Help and documentation                                 | Help that is unreachable from the point of need, or that explains the UI instead of the task               |

## Shneiderman's 8 golden rules — what they add

Six overlap Nielsen. Two do not, and both produce findings Nielsen's list misses:

- **Permit easy reversal of actions.** Reversibility is stronger than
  confirmation: an undo after the fact beats a dialog before it, because a
  dialog is dismissed reflexively. Prefer undo; keep confirmation for what
  genuinely cannot be undone, and then name the consequence in the button.
- **Support internal locus of control.** The user initiates, the system
  responds — never the reverse. Unrequested modals, forced tours, focus stolen
  mid-typing and auto-playing media are failures of this rule.

The other six map to Nielsen 1, 2, 4, 5, 6 and 9.

## Running a heuristic evaluation

1. **Evaluate flows, not screens.** Walk the entry, the primary task, and every
   destructive or irreversible action. A screenshot cannot fail heuristic 3.
2. **3–5 evaluators.** One evaluator finds roughly a third of the problems. This
   is the single most-ignored part of the method; when there is only one
   evaluator, say so rather than presenting the result as exhaustive.
3. **One finding, one heuristic.** A finding that cites four heuristics is four
   findings or none.
4. **Rate severity** on the scale below, and state it as frequency × impact ×
   persistence — a rare annoyance and a constant blocker are not the same thing.
5. **Separate the finding from the fix.** The fix is a sentence, not a redesign.

## Severity scale

The corpus uses three levels, and the persona's artifacts use the same names.
The 0–4 scale from the academic literature maps onto them as shown.

| Level        | 0–4  | Use when                                                                                                                                                                                                                                                                      |
| :----------- | :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **bloquant** | 4    | The task cannot be completed, data is lost, or the interface is unlawful: a flow unreachable by keyboard, a control with no accessible name, a dark pattern covered by DSA Art. 25 or ROSCA, a validation error that clears the form, an irreversible action with no way back |
| **majeur**   | 3    | The task completes at a real cost: the primary action does not stand out, an interface state is unhandled, the form re-asks what the system knows, an error names no remedy, navigation labels do not match the user's vocabulary                                             |
| **mineur**   | 1–2  | Polish: spacing that groups the wrong things, an inconsistent type scale, a label that could be clearer, a transition that is too long                                                                                                                                        |

Level 0 ("not a problem, a disagreement about taste") is not a finding. Drop it.

**Severity is not priority.** A `mineur` finding on the signup button outranks a
`majeur` one on an admin screen three people see. Say what the severity is, and
let frequency decide the order.

## What is not a finding

- A preference with no rule, no law and no sector convention behind it.
- A platform convention applied to the wrong platform (see `platforms/index.md`).
- Anything that would require choosing how the interface should look: that is a
  direction, not a defect — `ui/index.md` handles it, and it never gets fixed
  here.
- A claim the evidence does not support. Contrast, focus visibility, reflow,
  target size and motion **cannot be judged from source code alone**; when the
  interface was not rendered, record the limitation instead of the verdict.
