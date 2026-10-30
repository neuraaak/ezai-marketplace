# Style families — a vocabulary, not a catalogue

Read `ui/index.md` first. This file exists so a direction can **name** a
register. It deliberately holds a short list with trade-offs, not a large
catalogue with examples: catalogues and implementations belong to the skills
named in `routing.md`.

Each family below carries what it costs, because the cost is the part that
decides.

| Family                    | Reads as                           | Fits                                                                    | Backfires when                                                                                                             |
| :------------------------ | :--------------------------------- | :---------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **Flat / functional**     | Neutral, invisible, competent      | Applications, dashboards, tools, admin                                  | The product needs to be remembered, or to feel like anything at all                                                        |
| **Minimalism**            | Confident, expensive, restrained   | Portfolios, premium products, content                                   | Affordances get removed with the ornament — minimal signifiers are a Norman failure, not a style                           |
| **Swiss / editorial**     | Serious, structured, authoritative | Documentation, publishing, institutions                                 | The content is not actually structured enough to carry a grid that strict                                                  |
| **Soft / rounded**        | Friendly, approachable             | Consumer products, health, education                                    | The product handles money or risk and needs to read as precise                                                             |
| **Bento grid**            | Organised, modular, scannable      | Feature overviews, dashboards, marketing summaries                      | Used for sequential content: a grid implies peers, not steps                                                               |
| **Glassmorphism**         | Layered, modern, atmospheric       | Showcase surfaces, media-rich backgrounds, native Apple-platform chrome | Text sits on it — figure/ground and contrast both fail; stacking it on itself makes it unreadable                          |
| **Neumorphism**           | Tactile, soft, physical            | Almost nothing, honestly                                                | Nearly always: the technique relies on low contrast by construction, so controls fail 1.4.11                               |
| **Neo-brutalism**         | Loud, opinionated, memorable       | Consumer and creator brands                                             | The product converts on trust; and even where it fits, it works best as one bold element in a conventional layout          |
| **Skeuomorphism**         | Literal, learnable                 | Specialist tools whose physical analogue is real (audio, instruments)   | Used decoratively; it ages fastest of any family                                                                           |
| **Dark-first**            | Focused, technical                 | Developer tools, media, long sessions                                   | Treated as a palette inversion — contrast, elevation and imagery all need rework, and WCAG 2 over-rewards dark backgrounds |
| **Material-derived**      | Familiar, systematic               | Android-first products, internal tools                                  | Applied to an Apple surface, where it fights the platform's conventions                                                    |
| **Apple-platform native** | At home, current                   | iOS, iPadOS, macOS applications                                         | Imitated on the web, where the material has no system support — see `platforms/apple/hig.md`                               |
| **Illustrated / warm**    | Human, reassuring                  | Local business, onboarding, education, health                           | Illustration substitutes for information the user came for                                                                 |
| **Data-dense**            | Professional, efficient            | Trading, operations, monitoring, admin                                  | The audience is occasional rather than daily: density is a cost paid by novices                                            |

## Rules that hold across every family

- **A family is a register, not a licence.** Contrast, target size, focus
  visibility and keyboard reach are the same in all of them. A style that cannot
  meet them is not a style choice; it is a defect (`neumorphism` is the standing
  example).
- **One family per surface.** Two registers on one screen read as an unfinished
  migration.
- **Trend-bound families age fastest.** Glassmorphism, neumorphism and
  neo-brutalism all carry a date stamp. For a product that must look current in
  five years, say so as part of the trade-off.
- **Density is a separate axis from style.** Flat can be dense or airy; so can
  minimalism. Decide density from the audience's frequency of use, not from the
  family.

## Choosing one

1. Read the sector (`sector-conventions.md`) — it eliminates most of the table.
2. Ask whether the product converts on **trust** or on **personality**. Trust
   rules out the loud families outright.
3. Ask how often the audience uses it. Daily use favours restraint and density;
   occasional use favours guidance and air.
4. Name the family, name two alternatives with their trade-off, and name one to
   avoid. That is the note (`direction.md`).

Then stop. Implementation is somebody else's job — `routing.md`.
