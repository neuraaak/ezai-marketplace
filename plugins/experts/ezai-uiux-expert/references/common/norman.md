# Norman's model — locating where the user fails

Load this file when a finding needs a diagnosis rather than a label. Heuristics
say an interface is wrong; this model says **at which moment of the task** the
user is stranded, which is what makes a fix obvious instead of arbitrary.

## The vocabulary, used precisely

These five words are routinely swapped for one another. The distinction is what
makes the model useful.

| Term                 | Definition                                                                | In an interface                                                                |
| :------------------- | :------------------------------------------------------------------------ | :----------------------------------------------------------------------------- |
| **Affordance**       | A relationship between the object and the user: what the object *permits* | A link can be clicked whether or not it looks clickable                        |
| **Signifier**        | The perceivable signal that says the affordance is there                  | Underline, button shape, cursor change, focus ring                             |
| **Constraint**       | What the object *prevents*                                                | A date picker that cannot produce 31 February; a disabled option               |
| **Mapping**          | The correspondence between control and effect                             | A left arrow that moves left; a slider whose direction matches the quantity    |
| **Feedback**         | The confirmation that something happened                                  | The state change after the tap, within the thresholds in `interface-states.md` |
| **Conceptual model** | The story the user builds about how it works                              | "Files live in folders"; "drafts save themselves"                              |

**The usual finding is a missing signifier, not a missing affordance.** The
element is clickable; nothing says so. Write it that way — it names the fix.

Corollary worth its own check: an element that *looks* interactive and is not is
a **false signifier**, and it is a worse failure than an unmarked control,
because the user blames themselves.

## The two gulfs

- **Gulf of execution** — the distance between what the user wants to do and
  knowing how to do it. Symptom: the user hunts, hesitates, or asks "where is
  the button for…". Caused by missing signifiers, bad labels, hidden entry
  points, an action buried behind a menu.
- **Gulf of evaluation** — the distance between what the system did and the user
  understanding it. Symptom: the user repeats the action, refreshes, or asks
  "did that work?". Caused by missing feedback, silent failures, state that
  changed somewhere off screen.

Classify every usability finding into one of the two. It changes the fix: the
execution gulf is closed with signifiers and labels, the evaluation gulf with
feedback and visible state. Fixing the wrong one is the most common wasted
redesign.

## The seven stages of action

Walk a flow against these stages and the failure localises itself.

| #    | Stage     | The question             | Failure signature                                                 |
| :--- | :-------- | :----------------------- | :---------------------------------------------------------------- |
| 1    | Goal      | What do I want?          | The product never names the user's goal in their own words        |
| 2    | Plan      | What are my options?     | Options not discoverable from where the user stands               |
| 3    | Specify   | Which action do I take?  | Two plausible controls, no way to tell them apart                 |
| 4    | Perform   | I do it                  | The control is hard to hit, or the gesture has no alternative     |
| 5    | Perceive  | What happened?           | No visible change                                                 |
| 6    | Interpret | What does that mean?     | A change the user cannot read: a code, a colour alone, jargon     |
| 7    | Compare   | Did I get what I wanted? | Success that looks like failure, or nothing confirming completion |

Stages 1–4 are the execution gulf; 5–7 are the evaluation gulf.

Use the stage number in a finding's `what` when it sharpens the diagnosis:
"the user reaches stage 3 and cannot choose between *Save* and *Submit*, which
are not distinguished by label or position".

## Error, slip, mistake

Norman's distinction decides where the fix belongs, and it is worth keeping
straight:

- **Slip** — the right intention, the wrong action. Caused by similarity,
  proximity, or automaticity. Fixed with constraints, spacing and undo. Putting
  *Delete* next to *Save* causes slips, and no amount of confirmation copy fixes
  it.
- **Mistake** — the wrong intention, from a wrong conceptual model. Fixed with
  labels, signifiers and visible state, not with constraints.

**Blame the design, never the user.** A finding that concludes "users should
read more carefully" is not a finding. If people get it wrong at a rate, the
interface causes it.
