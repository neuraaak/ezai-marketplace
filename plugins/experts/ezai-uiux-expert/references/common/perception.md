# Perception, hierarchy and layout

Load this file for any finding about layout, grouping or "it looks cluttered".
It is what turns a vague impression into a statable defect.

The cognitive laws explain decisions; these principles explain what the eye
assembles **before** any decision is made. Most layout complaints reduce to one
of them being used against itself.

## Gestalt principles

| Principle                 | What the eye does                 | The finding it produces                                                                                  |
| :------------------------ | :-------------------------------- | :------------------------------------------------------------------------------------------------------- |
| **Proximity**             | Groups what is close              | A label nearer the field below it than the one it belongs to; buttons spaced evenly so no grouping reads |
| **Similarity**            | Groups what looks alike           | Two different kinds of thing styled identically; a non-clickable element styled like a link              |
| **Common region**         | Groups what shares an enclosure   | A card that encloses items from two unrelated sets                                                       |
| **Closure**               | Completes an implied shape        | An over-drawn container where whitespace already did the job                                             |
| **Continuity**            | Follows a line or curve           | A broken alignment that makes the eye stop mid-scan                                                      |
| **Common fate**           | Groups what moves together        | Items that animate together but are not related                                                          |
| **Figure / ground**       | Separates subject from background | A translucent surface over busy content, so neither reads                                                |
| **Uniform connectedness** | Groups what is visibly joined     | A connector or shared border implying a relationship that does not exist                                 |

**Proximity beats every other cue.** When proximity and similarity disagree,
proximity wins — which is why colour-coding a badly spaced form does not fix it.
Say this explicitly in a finding; it is the most frequently misdiagnosed layout
problem there is.

**Whitespace is the grouping tool, not decoration.** Space between groups must
be visibly larger than space within a group. A layout on a single uniform gap
has no groups.

## Visual hierarchy

Six mechanisms, roughly in order of strength:

1. **Size** — the strongest and the most abused
2. **Weight** — a bolder weight at the same size often does what a size jump does, more quietly
3. **Contrast** — against the background, not against a neighbour
4. **Colour** — the weakest when used alone, and never the sole carrier of meaning (see `a11y/wcag.md`, SC 1.4.1)
5. **Position** — top and left (in LTR) carry inherent weight
6. **Whitespace** — isolation elevates

**One level at a time.** Using three mechanisms to mark one step of hierarchy
produces an interface where everything shouts. A finding worth writing: "the
primary action is marked by size, fill, colour and a shadow, while the secondary
differs only in fill — the distinction is made four times and the hierarchy
still reads flat because every other element is also emphasised."

**Count the primaries.** Exactly one per view (Von Restorff). Two is a finding.

## Scanning patterns

- **F-pattern** — text-heavy pages read for information. The right side and the
  lower-left are weakly seen. Front-load headings and list items.
- **Z-pattern** — sparse, promotional layouts with few elements.
- **Layer-cake** — the realistic pattern for well-structured content: users jump
  heading to heading and read the band beneath. It only works when headings are
  informative; "Overview", "More", "Details" break it.
- **Spotted** — scanning for a specific known target. Nothing else gets seen.

Pattern claims are weak evidence on their own. Use them to argue placement, not
to assert that something "will not be seen" without a test behind it.

## Alignment, grid and spacing

- **One spacing scale**, 4 pt or 8 pt based, used everywhere. An arbitrary
  13 px gap is a `mineur` finding; a dozen of them is a `majeur` one about the
  absence of a system.
- **Alignment is binary.** Elements are aligned or they are not; "nearly
  aligned" reads as an error. Optical alignment overrides geometric alignment
  for round shapes, icons and punctuation.
- **Limit alignment edges.** Each new edge is a line the eye must track.
- **Grid**: a 12-column fluid grid on web; container queries over viewport
  breakpoints for components that are reused at several widths.
- **Measure**: 45–75 characters per line for body text. Beyond ~90 the eye loses
  the line return; below ~35 the rhythm breaks.

## Depth and elevation

- An elevation ladder with a small number of levels (typically 0–4). More levels
  than that cannot be told apart and stop meaning anything.
- Two shadows read better than one: a tight, dark direct shadow plus a wide,
  soft ambient one.
- Elevation must mean *distance from the surface*, consistently. A modal above a
  dropdown above a card is a hierarchy; shadows sprinkled for looks are not.
- Translucent materials are a figure/ground risk: they require a legibility
  layer behind the text, not a hope. See `platforms/apple/hig.md`.
