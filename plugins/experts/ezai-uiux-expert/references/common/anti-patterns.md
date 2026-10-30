# Anti-patterns, dark patterns and the legal frame

Load this file for any audit of a flow that involves money, consent, a
subscription, or a decision the business has a stake in.

Two categories, and the distinction decides the severity: **bad practice** is
incompetence and is a `majeur`; **deceptive design** is a design that works
against the user on purpose, is now enforceable law, and is a `bloquant`.

The test is whose goal the interface serves. Serving the user's stated goal is
design. Serving the business *against* that goal is a dark pattern — whatever
the team's intent, which an auditor cannot read and does not need to.

Legal facts below were verified on 2026-10-30. Re-check the dated ones before
citing them to anyone outside the team.

## Bad practices

| Pattern                         | What it looks like                                                            | Severity baseline |
| :------------------------------ | :---------------------------------------------------------------------------- | :---------------- |
| Invisible system state          | A long operation with no indicator; an action with no acknowledgement         | majeur            |
| Ambiguous button labels         | "Validate", "Submit", "OK" where the outcome should be named                  | majeur            |
| Premature personal data         | Identity, phone or address demanded before the user has committed to anything | majeur            |
| Overlay overkill                | Cookie banner, newsletter modal, chat widget and tour stacked on first visit  | majeur            |
| Interruption on arrival         | A modal before the user has seen the page — a locus-of-control failure        | majeur            |
| Infinite scroll with a footer   | Content the user can never reach                                              | majeur            |
| Destructive action with no undo | Confirmation dialog as the only protection against loss                       | bloquant          |

## Deceptive design — taxonomy

Use **Gray et al.'s ontology** as the top level: it is the taxonomy the
literature and regulators converge on, and it avoids the ad-hoc lists.

| Category                   | Mechanism                                               | Named patterns                                                                         |
| :------------------------- | :------------------------------------------------------ | :------------------------------------------------------------------------------------- |
| **Nagging**                | Repeated interruption until the user yields             | Permission re-prompts, "complete your profile" with no dismissal                       |
| **Obstruction**            | Making the undesired path artificially hard             | **Roach motel** — one-click signup, cancellation by phone or letter; buried settings   |
| **Sneaking**               | Hiding or delaying information material to the decision | **Hidden costs**, **sneak into basket**, silent auto-renewal, pre-ticked options       |
| **Interface interference** | Weighting the presentation toward one choice            | **Confirmshaming**, low-contrast decline, misdirection, trick questions, disguised ads |
| **Forced action**          | Requiring something unrelated to proceed                | Mandatory account, forced data sharing, "watch an ad to continue"                      |

Add **false urgency and false social proof** — fabricated countdowns, invented
stock counts, fake "12 people are viewing this" — which cut across sneaking and
interference and are among the most frequently enforced.

## Legal frame

### EU

- **DSA Article 25**, applicable since February 2024, prohibits interfaces that
  deceive or manipulate users, or that impair their ability to decide freely.
  **Scope is online platforms** — a marketplace is squarely in; a single-brand
  store selling its own stock generally is not. Check scope before invoking it.
- A first non-compliance decision against X, reported at €120 M on 2025-12-05
  and said to rest partly on deceptive design, circulates widely. **Unverified
  against a primary source — do not cite it as an example.**
- **Digital Fairness Act**: in the Commission's 2026 work programme, proposal
  expected around Q4 2026. The thing to watch, not to cite as law.
- **GDPR / ePrivacy consent design**: refusing must be as easy as accepting, no
  pre-ticked consent, no interface weighting between the two options. CNIL
  guidance is the French reference.

### US

- The FTC "click to cancel" amendment to the Negative Option Rule was **vacated
  by the Eighth Circuit on 2025-07-08**, on procedural grounds — the FTC had not
  completed the required preliminary regulatory analysis. **It is not in force.**
  Do not tell a user it is.
- Enforcement continues regardless under **ROSCA** and **FTC Act § 5**. Amazon
  settled for **$2.5 bn in September 2025** over Prime enrolment and
  cancellation. An advance notice to revive the rule is reported for early 2026;
  the dates conflict across sources.
- **State auto-renewal laws** (California, Colorado, Minnesota, New York among
  others) tightened independently and apply on their own.

## Writing a dark-pattern finding

- `criterion` carries the ontology category (`sneaking`, `obstruction`,
  `interface interference`…), not the marketing name alone.
- State the observable mechanism and the decision it distorts. "The decline
  button is 3:1 against the background while accept is a filled primary, in a
  consent dialog" — not "this is a dark pattern".
- Cite the legal instrument **only when the scope fits**, and say which. An
  incorrect legal claim costs the whole audit its credibility.
- Severity is `bloquant` when the pattern is covered by an instrument that
  applies to this product, `majeur` when it is deceptive but outside any scope
  you can establish.
- This is a finding about the **product**, not the code. It is nearly always
  `track: route` in the sense that it needs a product decision — but it is never
  a UI-style question, so it stays in the audit and goes to the plan, not to a
  style skill.

## AI-specific deceptive patterns

New and under-regulated; worth flagging explicitly because no catalogue covers
them yet:

- **Fabricated confidence** — asserting without any uncertainty cue.
- **Hidden model or quality switching** without telling the user.
- **Engagement-optimised sycophancy** — agreement tuned to retention.
- **Undisclosed reuse** of user content for training.
- **Fake agency** — presenting an automated decision as if a human made it.
