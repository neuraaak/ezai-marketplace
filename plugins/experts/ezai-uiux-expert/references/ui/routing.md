# Routing — handing visual work to another skill

Read `ui/index.md` first.

**This is not a design-to-dev handoff.** It is not a Figma-style spec package of
tokens, measurements, states and exported assets. It is the decision of *which
installed skill should do the visual work*, and the prompt to give it.

## Why it exists

This skill's territory is evaluation and standards conformance. Implementation —
style catalogues, palettes, font pairings, stack-specific components, charts —
is owned by other skills, and duplicating them loses on every axis.

> They answer "make me a glassmorphism dashboard". This answers "is this
> interface usable, accessible and lawful, and where exactly does it fail".

## Detecting what is installed

On-disk skill stores are the only mechanism portable across harnesses (Claude
Code, Codex, Gemini CLI, Copilot CLI and others all read a store from disk).
In this order:

1. Glob `~/.agents/skills/*/SKILL.md` — the shared store `ezai` installs into.
2. Glob `~/.claude/skills/*/SKILL.md` — Claude Code's own store, which also
   holds skills installed outside the marketplace.
3. Read each match's frontmatter `name` and `description`, and match against the
   capability table below.

Detect **once**. Under the persona pipeline this happens at DETECTION and is
recorded in `00-context.json`; the set does not change mid-run.

Caveat worth stating when it bites: a skill delivered by a plugin may live in a
cache outside both stores and go undetected. A miss means "not found", never
"not installed" — say which when it matters.

## Capability table

| If installed      | Route to it for                                                                  |
| :---------------- | :------------------------------------------------------------------------------- |
| `ui-ux-pro-max`   | Implementation: named styles, palettes, font pairings, stack-specific components |
| `frontend-design` | Aesthetic direction on new UI, typography                                        |
| `dataviz`         | Anything with a chart, a KPI tile, or a dashboard layout                         |

`dataviz` owns data visualisation outright. Never write chart guidance here —
route it.

## What a route entry contains

For each finding handed over:

- **The finding**, by its stable ID and title.
- **The skill**, by the name found on disk — or `null` when nothing installed
  fits.
- **The prompt**: what to do, the constraints to respect, and what not to
  change. Constraints are not optional — they are the whole reason the audit
  ran first.
- **The suggested install**, when no installed skill fits.

A prompt that omits the constraints hands over a defect and invites a redesign.
State at least: the existing tokens or design system, the conformance target,
the sector register, and the parts of the interface that must not move.

```text
<skill> — finding 01-007, "Primary action indistinguishable from secondary"

Restyle the primary action on the checkout screen so it is the only
emphasised control on the page.
Constraints: use the existing semantic tokens (color-action-primary);
keep contrast at 4.5:1 against the surface and 3:1 for the control
boundary (WCAG 2.2 AA); keep the register data-first and flat, per the
B2B SaaS convention; do not change the layout or the copy.
```

## The hard limit

**Routing never invokes anything.** It names the skill and writes the prompt;
the user decides whether to spend a second pass on implementation.

This is the line that keeps the skill an auditor. An audit that silently
redesigns what it reviewed cannot be trusted to have reviewed it.

When nothing installed fits: deliver the direction note alone, name the skill
that would have fitted so the user can install it, and **do not degrade into
generating CSS**.
