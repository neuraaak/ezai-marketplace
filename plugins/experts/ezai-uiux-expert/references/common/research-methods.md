# Research methods

Load this file when a question about users is being answered by assertion, and
when recommending how to find out rather than what to do.

Everything else in this corpus is a rule that holds in general. This file is how
you learn something about **these** users, which is the only way to settle a
question the rules leave open.

## Choosing a method

The first question is not "which method" but **what kind of answer is needed**.

| You need to know                            | Method                                        | Tells you            |
| :------------------------------------------ | :-------------------------------------------- | :------------------- |
| Why people behave as they do                | Interviews, contextual inquiry                | Why — not how many   |
| Where the interface breaks                  | Usability testing, moderated                  | Why                  |
| Where the interface breaks, at scale        | Unmoderated testing, session replay           | What, cheaply        |
| What experts can spot without users         | Heuristic evaluation, cognitive walkthrough   | Candidate problems   |
| Whether the structure matches mental models | Card sorting (open then closed), tree testing | Structure and labels |
| Whether people find the entry point         | First-click testing, five-second test         | Findability          |
| Which of two designs performs better        | A/B test                                      | How many — not why   |
| What people do over time                    | Diary study, analytics funnels                | Patterns             |

**Two rules that prevent most wasted research:**

- **Qualitative answers *why*, quantitative answers *how many*.** A funnel shows
  where people leave; it never shows why. Pairing them is the point.
- **A/B tests settle a choice between two known options.** They cannot find the
  option nobody thought of, and a win on a metric can still be a loss for the
  user — a dark pattern usually tests well.

## Usability testing

- **Five users per segment, per iteration** reveals roughly 85 % of usability
  problems. The standard misreading is treating five as a total: it is five *per
  distinct user group*, *per round*, and testing twice with five beats once with
  ten.
- **Tasks, not questions.** "Buy a ticket for Friday" — never "what do you think
  of this page?". People are unreliable about preference and reliable about
  behaviour.
- **Do not lead, do not rescue.** Silence is data. The moment you explain the
  interface, that participant is spent.
- **Think-aloud** gives you intent, which is the thing you cannot infer from the
  recording.
- Recruit for the behaviour, not the demographic.

## Heuristic evaluation

- **3–5 evaluators**; one finds roughly a third of the problems. When there is
  only one, say so — this corpus's own audits are usually single-evaluator, and
  honesty about that is part of the finding's weight.
- Evaluate independently first, then merge. Merging early produces consensus,
  not coverage.
- Rate severity as frequency × impact × persistence. See the scale in
  `heuristics.md`.
- It finds candidate problems, not confirmed ones. An expert review is not a
  substitute for watching one real user.

## Structure research

- **Open card sort** to discover grouping and vocabulary; **closed card sort**
  to validate a proposed structure.
- **Tree testing** on the structure alone, with no visual design, is the only
  way to separate "bad IA" from "bad page". It is cheap and badly underused.
- Both answer the labelling questions in `ia-navigation.md` that otherwise get
  decided by whoever is most senior in the room.

## Modelling what you learned

- **Personas** are useful when built from research and dangerous when invented:
  a fictional persona becomes a way to assert preferences with a face attached.
- **Jobs to be done** often beats a persona, because it describes the situation
  and the goal rather than the person — and the situation is what the interface
  must serve.
- **Journey map** for the user's experience across touchpoints; **service
  blueprint** when the failure is behind the counter rather than in the
  interface. Reaching for a blueprint is the right move when every usability fix
  keeps failing for an operational reason.
- **Task analysis** before designing a flow: list the steps, then remove the ones
  the system can do.

## Ethics

- Informed consent, the right to stop, and no deception about what is being
  recorded.
- Pay participants.
- Never test a dark pattern "to see if it works". It works; that is why it is
  one.
