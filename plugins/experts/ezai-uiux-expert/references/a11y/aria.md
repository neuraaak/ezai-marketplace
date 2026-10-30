# ARIA and assistive-technology mechanics

Load this file when the interface has custom controls, dialogs, menus,
comboboxes, tabs, live content, or anything that is not a plain native element.

## The first rule of ARIA

**Use the native element.** A `<button>`, `<a href>`, `<select>`, `<input
type="checkbox">` or `<dialog>` arrives with role, name, state, keyboard
behaviour, focus handling and platform conventions already correct. Every one of
those must be rebuilt by hand once you reach for `role="button"` on a `div`.

> No ARIA is better than bad ARIA. An element with a wrong role is less usable
> than one with no role, because it lies about what it is.

Corollaries worth checking for directly:

- `role` on a native element that already has it is redundant and often wrong.
- `aria-label` on a `div` with no role names nothing.
- `aria-hidden="true"` on anything focusable removes it from the accessibility
  tree while leaving it in the tab order — a control that exists for the keyboard
  and not for the screen reader.
- A `title` attribute is not an accessible name you can rely on.

## Accessible name — where it comes from

Computed in this order; the first that yields a non-empty string wins:

1. `aria-labelledby` (concatenates the referenced elements' text)
2. `aria-label`
3. The native labelling mechanism: `<label for>`, a wrapping `<label>`, `<legend>`, `alt`, `<caption>`
4. The element's own text content
5. `title` — last resort, and not exposed by every assistive technology

Checks that produce findings:

- **Every interactive element has a non-empty accessible name.** Icon-only
  buttons are the usual failure.
- **The visible label is contained in the accessible name** (SC 2.5.3 Label in
  Name). A button reading "Send" whose `aria-label` is "Submit form" breaks
  voice control: the user says "Send" and nothing happens.
- A name describes the *action or the target*, not the icon: "Close dialog", not
  "Cross".

## Structure

- **One `<h1>` per page**, then no skipped heading levels. Headings are the
  primary navigation mechanism for screen-reader users, far more than links.
- **Landmarks**: `header`/`banner`, `nav`, `main` (exactly one), `aside`,
  `footer`/`contentinfo`, `search`. Multiple landmarks of the same type need
  distinguishing labels.
- **Skip link** to `main`, first in the tab order, visible on focus.
- **Reading order follows DOM order.** CSS that reorders visually (`order`,
  `grid-area`, absolute positioning) desynchronises it and produces a tab order
  that jumps around the screen.
- **Lists are lists, tables are tables.** A data table needs `<th>` with
  `scope`, and a `<caption>`. A layout table is a defect.

## Focus

- **Everything interactive is reachable by `Tab`**, in a sensible order, and
  nothing non-interactive is in the tab order. Positive `tabindex` values are
  always a defect; `tabindex="-1"` for programmatic focus is correct.
- **The focus indicator is visible.** Use `:focus-visible` to keep it for
  keyboard users without showing it on mouse click — never remove it outright.
  Check it against SC 2.4.11 (not obscured by sticky elements) and, at AAA,
  2.4.13.
- **Modals trap focus**: focus moves into the dialog on open, cycles inside it,
  `Escape` closes, and focus returns to the element that opened it. A dialog
  that leaves focus behind it is a `bloquant`.
- **No keyboard trap** anywhere else (SC 2.1.2): the user must always be able to
  tab out.
- Focus must never be stolen while the user types, and must never move on a
  change of value alone (SC 3.2.2 On Input).

## Live regions

- `aria-live="polite"` for anything that can wait — results counts, saved
  indicators, non-urgent status. `assertive` only for what must interrupt, which
  is rare; overuse makes the interface unusable.
- `role="status"` is polite, `role="alert"` is assertive. Prefer these over raw
  `aria-live` when they fit.
- The live region must exist in the DOM **before** the text is inserted, or
  nothing is announced.
- A toast that vanishes on a timer is inaccessible to anyone who reads slowly or
  is not looking. Important messages persist until dismissed.

## Widget patterns

For any composite widget, follow the ARIA Authoring Practices Guide (APG)
pattern: it defines the roles, the states and — critically — the **keyboard
contract**, which is the part most reimplementations get wrong.

| Widget         | Keyboard contract to verify                                                                                                          |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| Dialog         | `Escape` closes, focus trapped, focus returns on close                                                                               |
| Menu / menubar | Arrow keys move, `Escape` closes, `Enter`/`Space` activates, typeahead                                                               |
| Tabs           | Arrows move between tabs, `Tab` leaves the tab list and enters the panel                                                             |
| Combobox       | Arrows move through options, `Enter` selects, `Escape` closes and restores, `aria-expanded` and `aria-activedescendant` kept in sync |
| Disclosure     | `Enter`/`Space` toggles, `aria-expanded` reflects state                                                                              |
| Slider         | Arrows step, `Home`/`End` jump, `aria-valuenow`/`min`/`max`/`text`                                                                   |
| Tree / grid    | Two-dimensional arrow navigation, one tab stop for the whole widget                                                                  |

**Roving `tabindex` or `aria-activedescendant`, never a tab stop per item.** A
composite widget is one tab stop.

## User preferences

Honour them; each has a criterion or a real impairment behind it:

- `prefers-reduced-motion` — vestibular disorders. Non-negotiable; see `common/motion.md`.
- `prefers-contrast`, forced-colours mode — never defeat it with hard-coded colours.
- `prefers-color-scheme` — and the contrast must hold in both themes, which is
  where dark mode usually fails.
- Zoom to 200 % (SC 1.4.4) and reflow at 320 px equivalent (SC 1.4.10) without
  loss of content or two-dimensional scrolling. Text spacing overrides must not
  clip content (SC 1.4.12).
