# Motion and interaction feedback

Load this file for any finding about animation, transitions, gestures or
perceived speed.

Motion has exactly one job: **to explain a change the user would otherwise have
to reconstruct.** Where it continues, it earns its place. Where it decorates, it
costs time on every single use.

## Duration

| Band           | Use for                                                                  |
| :------------- | :----------------------------------------------------------------------- |
| **100–150 ms** | Micro-feedback: hover, press, toggle, checkbox, focus ring               |
| **200–300 ms** | Standard transitions: a panel opening, a tab switching, a card expanding |
| **300–500 ms** | Large surfaces entering from off screen, full-screen transitions         |
| **> 500 ms**   | Almost never. At this length the user is waiting on the animation        |

Two rules:

- **Exits are faster than entrances.** The user has already decided; make the
  thing leave.
- **Duration scales with distance and size**, not with importance. A small
  element crossing a short distance at 400 ms reads as sluggish.

## Easing

- **ease-out** for entering and for anything responding to a user action: fast
  start, settled end. This is the default and covers most cases.
- **ease-in** for exits only.
- **ease-in-out** for elements moving between two on-screen positions.
- **Spring physics** for direct manipulation — drag, swipe, pull — where the
  motion should feel attached to the finger.
- **Linear** only for continuous, indeterminate motion: spinners, progress,
  marquees.

## Meaning

- **Continuity**: when a thing becomes another thing, move it; do not fade one
  out and the other in. The user should not have to find where it went.
- **Origin and destination**: a panel comes from where its trigger is. A menu
  that appears from nowhere teaches nothing.
- **Common fate** (see `perception.md`): things that animate together are read
  as related. Staggering unrelated items implies a relationship.
- **Never animate the same thing twice.** A change marked by both a movement and
  a colour flash reads as a glitch.

## Reduced motion

`prefers-reduced-motion: reduce` is **non-negotiable**: large-surface motion,
parallax, and zoom can cause nausea, dizziness and migraine in people with
vestibular disorders.

- Honour it by **replacing** motion, not by removing feedback: cross-fade
  instead of slide, change state instantly instead of animating to it.
- Keep what communicates: a progress indicator still progresses, a loading state
  still reads as loading.
- WCAG 2.3.3 Animation from Interactions (AAA) covers this; the impairment is
  real regardless of the level, so treat it as `majeur` at minimum.
- Also check 2.2.2 Pause, Stop, Hide (A): anything auto-playing, moving,
  blinking or scrolling for more than 5 seconds needs a control.

## Gestures

- **Every gesture needs a visible alternative.** Swipe-to-delete, drag-to-reorder
  and pinch-to-zoom are discoverable by almost no one and usable by fewer. WCAG
  2.5.7 Dragging Movements (AA) makes the single-pointer alternative a
  requirement, and 2.5.1 Pointer Gestures (A) covers multipoint and path-based
  gestures.
- **Do not fight system gestures**: edge swipes for back, pull-down for
  notifications, the home indicator area.
- A gesture must be undoable, because it will be triggered by accident.

## Perceived performance

Motion is where latency is either hidden or made worse.

- **An animation during a wait does not shorten it.** Removing a 300 ms
  transition in front of a 200 ms response halves the perceived latency —
  consider deleting the animation before optimising the request.
- **Skeletons set expectations; spinners only say "wait".** See
  `interface-states.md` for which to use and when.
- **Optimistic UI** where the operation almost always succeeds and is
  reversible: apply immediately, reconcile on response, surface a clear rollback
  on failure. **Never** for anything that spends money, sends a message, or
  cannot be undone — a false confirmation is worse than a slow true one.
- **Debounce input, throttle output.** Validate on blur rather than on keystroke
  (see `forms.md`); throttle scroll and resize handlers so motion does not drop
  frames.
- Dropped frames read as broken rather than slow. A transition that cannot hold
  its frame rate is better removed than kept.
