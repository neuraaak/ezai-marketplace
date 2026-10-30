# Giving a direction

Read `ui/index.md` first — the discipline there governs this file.

A direction note is the only artefact this group produces. It is **under 15
lines**, it names a register, and it contains no hex value, no font file and no
component.

## The four questions

Three of them are usually already answered by the brief or the repository. Ask
only what is genuinely open, and state the assumption for the rest.

| Question                   | Why it decides the register                                                                           | Where to read it                                               |
| :------------------------- | :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------- |
| **Sector and audience**    | Sets the convention the user already expects (Jakob's law). The strongest input                       | README, landing copy, product name, domain                     |
| **Trust or personality**   | A product that converts on trust rules out loud registers; one that converts on personality needs one | What the product asks the user to do, and how much it costs    |
| **Content density**        | Data-first versus narrative decides layout before it decides colour                                   | The screens themselves: tables and charts, or prose and images |
| **Existing brand or none** | A brand present means direction, not invention                                                        | Tokens, a logo, an existing palette, brand guidelines          |

**When a brand already exists, the job changes.** The note then says how to
apply it consistently, not what it should be. Proposing a different register for
a product that has one is out of scope unless the user asked for a rebrand.

## The note's format

```text
Register:      <family>, because <one line tying it to the sector or audience>
Alternatives:  <family> — <the trade-off>
               <family> — <the trade-off>
Avoid:         <family or move> — <why it works against this product>
Next:          <skill> handles the implementation — see routing
```

Rules:

- **One recommendation.** A note offering four equal options has decided
  nothing and hands the problem back.
- **Each line carries its reason.** A register asserted without a reason is
  taste, and taste is not this skill's output.
- **The anti-recommendation is mandatory.** It is usually the most useful line,
  because it is the one that prevents a predictable mistake.
- Name families from `style-families.md`, not invented labels.

## Completing a UX finding

The common case is not a standalone note: it is one line appended to a usability
finding, turning a defect into a direction.

| Usability finding alone                      | Completed with a direction                                                                                   |
| :------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| "The primary action is not distinguishable." | "…and in this sector the convention is a single saturated CTA against a near-neutral page."                  |
| "The dashboard is hard to scan."             | "…the register here is data-first and flat; the current ornamentation competes with the numbers."            |
| "The landing page feels generic."            | "…a B2B landing can carry more personality than the app it sells; the current page uses the app's register." |

That completion is still `track: route`: it describes a direction, and someone
else implements it.

## When not to give a direction

- **The sector is unknown and cannot be read.** Say so, give the note as
  advisory only, and keep every finding `mineur`.
- **The user asked for an accessibility or usability audit** and nothing about
  appearance. An unsolicited restyling recommendation is scope creep.
- **A design system exists and is being followed.** Then the finding is about
  consistency with it, which is `vocabulary.md` territory, not this file's.
