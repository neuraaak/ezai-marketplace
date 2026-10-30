# Web conventions

Load for any web surface. Platform-specific rules only — everything general is
in `common/` and `a11y/`.

## Semantics before everything

HTML semantics are the **first accessibility layer**, and the cheapest. A
correct element arrives with role, name, state, keyboard behaviour and platform
conventions already right (see `a11y/aria.md`).

- `<button>` for an action, `<a href>` for a destination. A `<div>` with a click
  handler is a defect, not a style choice. A button that navigates and a link
  that acts are both Nielsen 4 failures.
- `<form>` with a real submit, so `Enter` works.
- `<dialog>` for modal dialogs; the popover API for lightweight overlays. Both
  handle focus and the top layer in ways a hand-rolled `div` does not.
- One `<main>`, landmarks for the rest, headings in order.

## Navigation and state

- **The URL is state.** Filters, tabs, pagination and the open item belong in
  it; a view the user cannot link to or return to is a Nielsen 3 failure.
- **The back button must do what the browser promises.** Breaking it in a
  single-page app is a `bloquant`.
- On client-side navigation, move focus to the new view's heading and announce
  the change — otherwise screen-reader and keyboard users stay where the old
  page was.
- Deep links survive a reload and an unauthenticated arrival: redirect to login,
  then back to the target.

## Responsive

- **Container queries** for components reused at several widths; viewport
  breakpoints only for page-level layout. A component that only knows the
  viewport breaks the moment it is reused in a sidebar.
- **Reflow at 320 px equivalent** without two-dimensional scrolling (SC 1.4.10),
  and **zoom to 200 %** without loss (SC 1.4.4).
- **Text spacing overrides must not clip content** (SC 1.4.12). Fixed-height
  containers around text are the usual cause.
- `clamp()` for fluid type, so there is no jump at a breakpoint.
- 16 px minimum body size on mobile: below it, iOS zooms the page on input
  focus, which reads as a bug.

## Forms on the web

Beyond `common/forms.md`:

- `autocomplete` tokens on every field that has one — a requirement (SC 1.3.5),
  not a convenience.
- `inputmode` and `type` to get the right virtual keyboard.
- Never block paste, least of all on password and one-time-code fields.
- Associate errors with `aria-describedby` and `aria-invalid`; move focus to the
  error summary on a failed submit.

## User preferences

Honour all of them; each maps to a real impairment or a stated choice:

`prefers-reduced-motion`, `prefers-contrast`, `prefers-color-scheme`,
forced-colours mode. Hard-coded colours that defeat forced-colours mode are a
finding.

## Performance as usability

The field thresholds (75th percentile of real users) and why each is a usability
matter, not a speed one:

| Metric  | Good     | Why it is a usability finding                                 |
| :------ | :------- | :------------------------------------------------------------ |
| **LCP** | ≤ 2.5 s  | Past this the user doubts the page is loading at all          |
| **INP** | ≤ 200 ms | Replaced FID in March 2024. Past this, controls feel detached |
| **CLS** | ≤ 0.1    | A shifting layout makes the user press the wrong thing        |

**CLS is an error-prevention failure** (Nielsen 5), not a performance score.
File it that way. And note whether the number is field data or a lab run — a
Lighthouse score alone is weaker evidence.

## Things that look like features and are findings

- A cookie banner that blocks the page and weights accept over refuse — see
  `common/anti-patterns.md`, and note the consent-design rules there.
- Scroll hijacking and scroll-driven narratives that disable normal reading.
- Infinite scroll with a footer the user can never reach.
- An interstitial or newsletter modal before the user has seen the content.
- Auto-playing media with sound; anything moving for more than 5 s with no
  control (SC 2.2.2).
- Disabling zoom (`user-scalable=no`) — a direct 1.4.4 failure.
