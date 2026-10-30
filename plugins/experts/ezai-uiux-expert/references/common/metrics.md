# UX metrics

Load this file when a claim needs a number behind it, when a team asks "how do
we measure this", or when an existing number is being over-read.

Figures below were verified on 2026-10-30 where they are version- or
benchmark-bound.

## The four hard task metrics

These need no instrument and are the most defensible numbers in UX.

| Metric                | Definition                                 | Watch out for                                                    |
| :-------------------- | :----------------------------------------- | :--------------------------------------------------------------- |
| **Task success rate** | Share of attempts that reach the goal      | Define "success" before the session, not after                   |
| **Time on task**      | Elapsed time for successful attempts only  | Faster is not always better: a deliberate confirmation is right  |
| **Error rate**        | Errors per attempt, by type                | Separate slips from mistakes (see `norman.md`) — different fixes |
| **Completion rate**   | Share of users finishing a multi-step flow | Falls out of analytics; says nothing about why                   |

## Questionnaires

| Instrument    | Shape                            | Measures                           | How to read it                                                                                                                                                                                 |
| :------------ | :------------------------------- | :--------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SUS**       | 10 items, 5-point                | Perceived usability, whole product | Scored 0–100 — **not a percentage**. Mean around 68. Use the Sauro–Lewis curved grading scale for a grade                                                                                      |
| **UMUX-Lite** | 2 items, 7-point                 | Perceived usability, whole product | Converted to 0–100. Report it **as a UMUX-Lite score**, not as a SUS score — the SUS regression adjustment is no longer recommended, and individual studies diverge from SUS by several points |
| **SEQ**       | 1 item, 7-point, after each task | Perceived task difficulty          | Post-task, not post-study. Benchmark tables exist — look up the current norm rather than quoting one from memory                                                                               |
| **CES**       | 1 item                           | Effort for a transaction           | Support and self-service flows                                                                                                                                                                 |
| **NPS**       | 1 item                           | Willingness to recommend           | A **business** metric. It is not a usability measure, and treating it as one is the most common misuse in this list                                                                            |

Rules for using any of them:

- **A single score is not a finding.** These are comparative instruments: use
  them against a previous round, a competitor, or a benchmark.
- **Never mix instruments across rounds** and compare the numbers.
- Sample size drives the confidence interval; a SUS of 71 from eight people is
  not meaningfully different from 68.

## HEART

Google's framework, for choosing what to measure rather than measuring
everything.

| Dimension        | Typical signal                            |
| :--------------- | :---------------------------------------- |
| **Happiness**    | SUS, UMUX-Lite, SEQ, satisfaction ratings |
| **Engagement**   | Depth or frequency of use per active user |
| **Adoption**     | New users completing the core action      |
| **Retention**    | Users still active after a period         |
| **Task success** | The four hard metrics above               |

Use it with **Goals → Signals → Metrics**: name the goal, decide what behaviour
would signal it, then pick the metric. Going straight to metrics produces a
dashboard nobody can act on.

Two cautions:

- **Not every dimension applies to every product.** Engagement is the wrong goal
  for a tax form or an incident tool, where less time and fewer visits is the
  win. Choosing the wrong dimension is how a team optimises against its users.
- **No published thresholds.** HEART says what to track, not what is good. A
  "good" value is your previous value.

## Performance metrics

The field thresholds (75th percentile of real users): **LCP ≤ 2.5 s, INP ≤
200 ms, CLS ≤ 0.1**. INP replaced FID in March 2024.

Field data describes what users got; a lab run describes what the page can do.
State which one a number is. See `interface-states.md` for the perception
thresholds these proxy.

## Accessibility is not a metric

There is no "accessibility score". A tool's percentage reflects the automatable
subset — roughly 30–40 % of real issues — and a product can score 100 and be
unusable with a keyboard. Report conformance against criteria, with scope and
level, per `a11y/testing.md`. Never present a Lighthouse accessibility number as
a conformance result.

## Reading a number honestly

- Say what the number **cannot** tell you. A conversion lift says nothing about
  whether the interface deceived someone into it.
- Prefer a benchmark over an absolute. "68" means nothing; "68, up from 54" does.
- A metric that improved while task success fell is a warning, not a win.
