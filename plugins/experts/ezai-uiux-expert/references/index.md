# UI/UX References Index

Root router. Four reference groups, loaded on demand. All paths below are
written from this `references/` root.

| Need                                                         | Go to                | What lives there                                                                                  |
| :----------------------------------------------------------- | :------------------- | :------------------------------------------------------------------------------------------------ |
| Judge whether an interface works                             | `common/`            | heuristics, cognitive laws, perception, states, forms, navigation, content, motion, anti-patterns |
| Judge whether an interface is usable by everyone, and lawful | `a11y/index.md`      | WCAG criteria and their legal frame, ARIA mechanics, how to test                                  |
| Say what an interface should look like — without building it | `ui/index.md`        | direction notes, style families, sector conventions, and where to route the work                  |
| Rules that only hold on one platform                         | `platforms/index.md` | web, Apple, Android conventions                                                                   |

## How to route

1. **Always load `common/heuristics.md`.** It is the backbone of every verdict,
   and it carries the severity scale the rest of the corpus refers to.
2. **Detect the surface** (`package.json` with a web framework → web, Xcode or
   SwiftUI sources → Apple, Gradle/Compose or Flutter → Android) and open
   `platforms/index.md` only when the task turns on a platform convention.
   Anything that holds everywhere stays in `common/`.
3. **Accessibility is never optional in an audit.** Load `a11y/index.md` for any
   review of an existing interface, even when the request does not mention it.
4. **`ui/` advises, it never implements.** Load it to give a direction or to
   decide where work should go — never to produce a palette, a font file or a
   component. See `ui/index.md` for the discipline that applies there.

> **One rule above all the others.** When a finding cannot be stated without
> choosing how the interface should look, it is not this skill's to fix. Say it,
> and route it (`ui/routing.md`).

---

## Common (`common/`)

Language-, framework- and platform-agnostic. The bulk of the corpus.

- `common/scoping.md` — Scope step, before anything else: ordered scoping questions and recommended defaults
- `common/heuristics.md` — Nielsen's 10, Shneiderman's 8, the severity scale, how to run a heuristic evaluation
- `common/cognitive-laws.md` — Hick, Fitts, Miller, Jakob, Von Restorff, serial position, peak-end, Zeigarnik, Tesler, Doherty
- `common/perception.md` — Gestalt principles, visual hierarchy, scanning patterns, alignment and grid
- `common/norman.md` — affordance, signifier, constraint, mapping, the two gulfs, the seven stages of action
- `common/interface-states.md` — the states every data-bearing view must handle, and the response-time thresholds
- `common/forms.md` — field order, labels, validation, autofill, errors, multi-step
- `common/content.md` — button labels, error messages, empty states, tone, internationalisation
- `common/ia-navigation.md` — taxonomy, labelling, navigation patterns, search, URLs as IA
- `common/motion.md` — duration bands, easing, meaning, reduced motion, optimistic UI
- `common/anti-patterns.md` — bad practices, dark-pattern taxonomy, and the legal frame that makes them findings
- `common/research-methods.md` — how to learn something about users rather than assert it
- `common/metrics.md` — SUS, UMUX-Lite, SEQ, HEART, and the four hard task metrics

## Accessibility (`a11y/`)

- `a11y/index.md` — routing; load `wcag.md` for criteria, `aria.md` for mechanics, `testing.md` for method

## UI direction (`ui/`)

- `ui/index.md` — the discipline, then the files: `direction.md`, `style-families.md`, `sector-conventions.md`, `vocabulary.md`, `routing.md`

## Platforms (`platforms/`)

- `platforms/index.md` — pick the surface, then load its conventions file
