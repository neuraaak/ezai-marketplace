# Interface states and response time

Load this file for any review of a view that displays data, and for any task
that involves waiting. Unhandled states are the most common `majeur` finding in
an audit, because they are invisible in the happy path the developer tested.

## The states every data-bearing view must handle

A view is incomplete until all eight are designed. Check each one by name — do
not accept "it probably falls back to the empty state".

| State            | The question it answers                        | Typical failure                                                           |
| :--------------- | :--------------------------------------------- | :------------------------------------------------------------------------ |
| **Ideal**        | What it looks like when everything is normal   | The only one designed                                                     |
| **Empty**        | First use, or a filter that matched nothing    | A blank area with no explanation and no way forward                       |
| **Loading**      | Work is in progress                            | No indicator at all, or a spinner that replaces content already on screen |
| **Partial**      | Some data arrived, some has not                | The whole view blocked on the slowest item                                |
| **Error**        | Something failed                               | A toast that disappears before it is read, or a message with no remedy    |
| **Offline**      | The network is gone                            | Silent failure that looks identical to "no results"                       |
| **Unauthorised** | The user may not see this                      | A 403 rendered as an empty list, so the user retries forever              |
| **Overflow**     | There is far more data than the layout assumed | Truncation with no affordance, a table that scrolls the page sideways     |

Two rules that turn these into real findings:

- **The empty state is an onboarding surface.** Distinguish *never had data*
  (explain and offer the first action) from *filtered to nothing* (offer to
  clear the filter). The same blank panel for both is a `majeur`.
- **Never replace content with a spinner.** Once something is on screen, keep it
  and show progress beside it; replacing it costs the user their place and
  re-triggers the whole perception of waiting.

## Response-time thresholds

Nielsen's three limits are the basis. They are about human perception and have
not moved.

| Budget      | What the user perceives       | What the interface must do                                                       |
| :---------- | :---------------------------- | :------------------------------------------------------------------------------- |
| **< 0.1 s** | Direct manipulation           | Nothing. Any indicator here is noise                                             |
| **< 1 s**   | Uninterrupted flow of thought | Nothing, but the result must actually land in that second                        |
| **1–3 s**   | A noticeable wait             | An indeterminate indicator: spinner, or a skeleton when the shape is predictable |
| **3–10 s**  | Attention starts to wander    | A determinate indicator: progress plus an estimate, and a cancel                 |
| **> 10 s**  | Attention is gone             | Let the user leave and notify them when it is done. Keep the work going          |

**Doherty threshold:** below ~400 ms of system response, users stay in flow and
their productivity rises; above it they wait on the machine. Treat 400 ms as the
design target for anything interactive, and the thresholds above as the fallback
when the target cannot be met.

### The measurable proxy on the web

| Metric  | Good (75th percentile of real users) | What it measures                                       |
| :------ | :----------------------------------- | :----------------------------------------------------- |
| **LCP** | ≤ 2.5 s                              | When the main content became visible                   |
| **INP** | ≤ 200 ms                             | Interaction to next paint — replaced FID in March 2024 |
| **CLS** | ≤ 0.1                                | How much the layout moved under the user               |

These are field metrics: a lab score says what the page can do, not what users
get. A finding that cites a Lighthouse number alone is weaker than one that
cites field data, and should say which it is.

**CLS is a usability failure, not a performance one.** A layout that shifts
under a tap makes the user press the wrong thing; file it against Nielsen 1 and
error prevention, not against page speed.

## Skeleton, spinner, or progress

- **Skeleton** when the resulting shape is known and stable: it sets the
  expectation and removes the shift. Do not animate it aggressively; a skeleton
  that shimmers faster than the content arrives reads as broken.
- **Spinner** when the shape is unknown and the wait is short. A spinner that
  runs past ~3 s reads as a hang whether or not it is one.
- **Determinate progress** as soon as the work can be counted, and always past
  3 s. An estimate that is roughly right beats no estimate.
- **Optimistic UI** when the operation almost always succeeds and can be undone:
  apply the change immediately, reconcile on response, and surface a clear
  rollback on failure. Never use it for anything that spends money, sends a
  message, or cannot be reversed — see `motion.md` and `anti-patterns.md`.
