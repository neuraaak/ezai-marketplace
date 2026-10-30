# Android — Material Design

Load for Android surfaces, and alongside `apple/hig.md` for cross-platform
projects. Verified 2026-10-30 against secondary sources; `m3.material.io` and
the Android Developers blog are the authoritative references and should be
checked before asserting exact figures.

## Material 3 Expressive

Announced May 2025, rolling out with Android 16 and Wear OS 6. An evolution of
Material 3 centred on **motion, shape and colour**, not a replacement for it.

What actually changed, and what it means for a review:

- **Motion is physics-based.** Material motion was previously defined by fixed,
  non-customisable easing and duration values; the Expressive scheme uses
  **springs**, is the recommended default, and **overshoots the final value to
  add bounce**. Most Material 3 components use it by default.
    - Review consequence: the duration bands in `common/motion.md` still describe
    perception, but a spring is not tuned by duration. Judge it on whether the
    overshoot communicates or distracts, and whether it is dropped under Reduce
    Motion.
- **Motion is tokenised**, split into spatial and effect transitions — so motion
  is auditable the way colour is. A hand-rolled animation outside the token set
  is a consistency finding.
- **New and refreshed components**, including button groups and a loading
  indicator. Sources disagree on the count (14 or 15) — **do not quote a
  number**; name the component instead.
- **An expanded shape library** (one source says 35 options for Android). Shape
  is now an expressive axis alongside colour, which means it can also be
  overused: shape variety that does not encode meaning is noise.
- **Wear OS**: `TransformingLazyColumn` provides built-in expressive scrolling
  that follows the display's curved edges. The chosen watch-face theme applies
  system-wide.

**Unconfirmed**: the detail of the 2026 rollout. Treat timeline claims
cautiously.

## Conventions that differ from other platforms

- **System back** exists and must work, including the predictive back gesture.
  Breaking it is a `bloquant` — it is the user's guaranteed escape (Nielsen 3).
- **Navigation**: bottom navigation bar, navigation rail on wide screens, or a
  drawer for many destinations. Not an iOS tab bar, and the drawer is not a
  hamburger pressed into service for primary actions.
- **FAB** for the single most common constructive action on a screen — one, and
  only where there genuinely is one such action.
- **Snackbars** for transient feedback, with an action where one makes sense.
  They are not a place for errors the user must act on: a snackbar that
  disappears is inaccessible to anyone reading slowly.
- **Target size: 48 × 48 dp** — Material's guideline. It is **not** the WCAG
  requirement, which is 24 × 24 CSS px at AA (SC 2.5.8). Keep the two findings
  separate.
- **Dynamic colour** derives the palette from the user's wallpaper. A product
  that opts in must still meet contrast in every derived scheme, which is where
  it usually fails.

## Accessibility on Android

- **TalkBack**: content descriptions on every control, correct roles, state
  announced. A decorative image needs an explicitly empty description, not a
  missing one.
- **Font scaling and display size** must be honoured; layouts survive the
  largest settings. Hard-coded `sp` values defeated by fixed-height containers
  are the usual failure.
- Honour **Remove animations** (the system Reduce Motion equivalent), high
  contrast text, and colour-correction settings.
- Touch targets measured on the *touchable* area, which may exceed the drawn
  one — and that is the legitimate way to satisfy both Material and WCAG without
  enlarging the visual control.

## Cross-platform projects

React Native and Flutter projects need both this file and `apple/hig.md`.

The failure to look for is **one platform's conventions shipped to both**: an
iOS-style per-screen back on Android, a Material drawer on iOS, Material
snackbars on an Apple surface, or a single hard-coded type scale defeating both
Dynamic Type and Android font scaling. Each is a Nielsen 4 finding, and each is
invisible to a team testing on one device.
