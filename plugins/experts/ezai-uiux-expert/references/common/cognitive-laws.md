# Cognitive laws of UX

Load this file to explain *why* a heuristic failure happens, and to argue a fix
that is otherwise a matter of opinion. Each law below is a predictable regularity
in human behaviour; cite it by name in a finding's `criterion`.

A law is a reason, never a rule on its own. "This violates Hick's law" is not a
finding; "eleven equally-weighted options at the first step of signup, where
three would do" is.

| Law / effect                 | The mechanism                                                                               | What it licenses you to say                                                                                                      |
| :--------------------------- | :------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------- |
| **Hick's law**               | Decision time grows with the number and complexity of choices                               | Cut simultaneous options; stage them (progressive disclosure); give a recommended default                                        |
| **Fitts's law**              | Time to acquire a target depends on its distance and its size                               | Enlarge primary actions; put them where the pointer or thumb already is; exploit screen edges, which are infinitely deep targets |
| **Miller's law**             | Working memory holds about 7 ± 2 items — and far fewer under load                           | Chunk. Do not use it to justify "7 menu items": the number is about memory, not about lists you can see                          |
| **Jakob's law**              | Users spend most of their time on *other* products, so they expect yours to work like those | Follow the convention of the sector and the platform. Novelty in a familiar control is a cost, not a feature                     |
| **Von Restorff (isolation)** | The item that differs is the one remembered                                                 | Exactly one primary action per view. Two primaries mean none                                                                     |
| **Serial position effect**   | First and last items are recalled best                                                      | Put the critical item at the start or the end of a list or menu; the middle is where things go to be lost                        |
| **Peak–end rule**            | An experience is judged on its most intense moment and its end                              | Invest in onboarding, error recovery and completion. A good ending redeems a mediocre middle                                     |
| **Zeigarnik effect**         | Unfinished tasks stay in mind                                                               | Show progress through multi-step work ("3 of 5", "profile 80 % complete") — and see the warning below                            |
| **Tesler's law**             | Every system has an irreducible complexity; it can be moved, not removed                    | Move it to the system: infer, default, remember. Complexity pushed onto the user is a design decision                            |
| **Doherty threshold**        | Below ~400 ms response, the user stays in flow                                              | Budget interaction latency as a feature; see `interface-states.md` for the full ladder                                           |
| **Goal-gradient effect**     | Effort increases as the goal gets closer                                                    | Show endowed progress (a loyalty card starting at 2 of 12 beats one starting at 0 of 10)                                         |
| **Postel's law**             | Be liberal in what you accept                                                               | Accept the phone number with spaces, the date in any sane format, the pasted card number with dashes                             |
| **Law of proximity**         | Things placed close together are perceived as related                                       | See `perception.md` — this is the one that settles most layout arguments                                                         |

## Where these laws turn into dark patterns

Three of them are the engine of manipulative design, and the line matters
because the persona must be able to tell a technique from an abuse:

- **Zeigarnik** becomes manipulation when the progress bar measures something
  the user did not choose to start, or when the "incomplete profile" nag has no
  dismissal.
- **Goal-gradient** becomes manipulation when the progress is fabricated — steps
  invented to create momentum toward a purchase.
- **Von Restorff** becomes manipulation when the isolated element is the choice
  that profits the business and the alternative is hidden in low contrast. This
  is *interface interference*; see `anti-patterns.md`.

The test is whose goal the effect serves. Serving the user's stated goal is
design; serving the business against it is a dark pattern, and dark patterns are
now enforceable law.

## Using a law in a finding

- Name the law in `criterion` (`Fitts`, `Hick`, `Jakob`).
- State the observable fact first, the law second. The law explains; it does not
  evidence.
- Do not stack laws. One mechanism per finding.
- Never cite a law for a number it does not contain. Miller's law says nothing
  about navigation width, Fitts's law says nothing about a specific pixel size,
  and Hick's law has no threshold where choice becomes "too many".
