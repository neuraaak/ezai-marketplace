# Apple platforms — Human Interface Guidelines

Load for iOS, iPadOS, macOS, watchOS and tvOS surfaces. Verified 2026-10-30;
the HIG moves, so check Apple's own pages before asserting a current rule in
writing.

## Liquid Glass

Introduced at WWDC25 (June 2025) across iOS 26, iPadOS 26, macOS Tahoe 26,
watchOS 26 and tvOS 26. A translucent material that reflects and refracts its
surroundings and transforms dynamically to bring focus to content.

The rules that produce findings:

- **Glass belongs to the control and navigation layer** that floats *above*
  content — not to the content itself. Lists, cards and content surfaces are not
  glass. Filling the content layer with it is the documented mistake.
- **Do not stack glass on glass.** It makes the interface cluttered and
  illegible fast.
- **Two variants**: *Regular*, versatile and adaptive; *Clear*, permanently
  transparent and requiring a dimming layer behind it for legibility. Clear
  without that layer is a contrast failure, not a style preference.
- **It honours accessibility settings**: Reduce Transparency makes it frostier
  and hides more of what is behind it; it respects Increase Contrast and Reduce
  Motion. A custom imitation of the material that ignores those settings is a
  `bloquant`.
- Apply custom glass effects sparingly. Adopting Liquid Glass does not mean
  stripping every blur, fill and material from the content layer.

**Reported but unverified**: a 2026 HIG user setting letting people adjust
Liquid Glass from ultra-clear toward a more tinted appearance. Single secondary
source — check Apple's HIG before relying on it.

**On the web, this is a style family, not a platform material.** Imitating
Liquid Glass in a browser gets none of the system support: no Reduce
Transparency, no automatic adaptation, no legibility layer. Judge it as
glassmorphism (`ui/style-families.md`) and hold it to the contrast rules.

## Conventions that differ from other platforms

- **Navigation**: a per-screen back button with the previous screen's title, plus
  an edge-swipe back gesture. Do not place a system back control where Android
  would.
- **Tab bar at the bottom**, 3–5 destinations. Not a drawer.
- **Sheets for focused, dismissible tasks**; full-screen modals only when the
  task owns the screen. A sheet must be dismissible by swipe *and* by a control.
- **Destructive actions** are red and placed per platform convention in action
  sheets and alerts; button order in alerts is not the web's order.
- **Safe areas** on every edge: notch, Dynamic Island, home indicator, rounded
  corners. Content under the home indicator is a real finding, not a nitpick.
- **Target size: 44 × 44 pt** — Apple's guideline. It is **not** the WCAG
  requirement, which is 24 × 24 CSS px at AA (SC 2.5.8). Cite them separately;
  conflating them is the most common false finding in a native review.

## Accessibility on Apple platforms

- **Dynamic Type** must be supported: text scales with the user's setting, and
  layouts must survive the accessibility sizes. Hard-coded point sizes are a
  `majeur`; a layout that clips at the largest size is a `bloquant`.
- **VoiceOver**: labels, traits, values and hints on every control; a rotor-
  navigable heading structure.
- Honour Reduce Motion, Reduce Transparency, Increase Contrast, Bold Text,
  Button Shapes and Differentiate Without Color. Each exists because someone
  cannot use the default.
- The system font carries accessibility behaviour. Substituting a custom font
  without reproducing Dynamic Type support loses it.

## Writing a finding on an Apple surface

- Cite the HIG as a **platform guideline**, and WCAG as the **requirement**.
  Keep them in separate findings when both apply.
- A Material-derived pattern on an Apple surface is a Nielsen 4 finding
  (consistency and standards), and worth naming as such.
- Do not report a Liquid Glass adoption gap as a defect: not adopting a new
  material is a product decision, not a usability failure. Misusing it is the
  finding.
