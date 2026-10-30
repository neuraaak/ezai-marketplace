# Sector conventions

Read `ui/index.md` first. This file names the expectation attached to a sector —
it does not produce a design.

Why a sector matters more than taste: users spend most of their time on *other*
products in the same category, and arrive expecting yours to work like those
(Jakob's law). A register that fights the sector costs the product comprehension
on every first visit, and the cost is paid by the business, not by the designer.

## Status of this table

**Only the B2B SaaS and consumer-brand rows are sourced** (web research,
2026-10-30). The rows marked *unsourced* carry a plausible expectation that has
**not been verified**: state the uncertainty when you use them, and do not
present them as established convention. Filling them properly is outstanding
work — the sources to use are named in each row.

| Sector                                            | Expectation                                                                                                                                                                                                                                                                                                                     | Sourced            |
| :------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------- |
| **B2B SaaS — application, dashboard**             | Data-first, flat, high contrast. Structured tables as the backbone; charts only where a trend genuinely needs a shape. Progressive disclosure over density: density read as value around 2020 and now reads as unfinished. The primary question answered within about two seconds. Stripe and Linear are the reference register | yes                |
| **B2B SaaS — landing and marketing**              | More expressive than the application it sells: personality, interactivity, conversion storytelling. Using the app's sober register on the landing page is a common and costly mismatch                                                                                                                                          | yes                |
| **Consumer or creator brand**                     | Loud palettes and neo-brutalism land **here and essentially only here**. Elsewhere the loud palette works against categories that convert on trust rather than personality. Even here, neo-brutalism works best as one bold element inside a conventional layout                                                                | yes                |
| **Local business** (florist, restaurant, artisan) | Imagery-led, warm, mobile-first. Hours, location, booking and contact above everything else — the visit is the conversion, not the browse                                                                                                                                                                                       | **no — unsourced** |
| **Public sector, health, finance**                | Conformance-first, sober, high legibility. Accessibility is a legal obligation here before it is a quality goal, and the register must not compete with the content. GOV.UK and equivalent national design systems are the sources                                                                                              | **no — unsourced** |
| **E-commerce**                                    | Product imagery, trust signals, total cost visible early, a checkout stripped to the minimum. Baymard Institute is the empirical source, including for field counts                                                                                                                                                             | **no — unsourced** |

## Reading the sector from a repository

In this order; stop at the first that answers.

1. **The user said so**, in the brief or in a scoping answer.
2. **README and landing copy** — what the product claims to do, and for whom.
3. **The domain and product name.**
4. **The screens themselves** — a table-heavy application and a photo-led page
   are different registers whatever the marketing says.

When none answers, the sector is `unknown`. Say so, keep the direction advisory,
and do not guess from the technology stack: a Next.js project says nothing about
whether it is a florist or a trading desk.

## Cross-register products

A product frequently carries two registers — the marketing site and the
application — and that is correct, not a defect. The finding to write is about
the **transition**: a user arriving from an expressive landing into a sober
application should recognise the same product. Shared typography and a shared
accent usually carry that continuity; identical layouts do not.

Judge each surface against its own row of the table.
