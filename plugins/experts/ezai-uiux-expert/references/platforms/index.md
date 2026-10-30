# Platforms — routing

Load a file from this group **only** when the task turns on a convention that
genuinely differs between platforms. Everything that holds everywhere lives in
`common/` and `a11y/`, and that is where the bulk of any audit is decided.

| Surface                                | Load                                          |
| :------------------------------------- | :-------------------------------------------- |
| Web application or site                | `web/conventions.md`                          |
| iOS, iPadOS, macOS, watchOS, tvOS      | `apple/hig.md`                                |
| Android                                | `android/material.md`                         |
| Cross-platform (React Native, Flutter) | Both `apple/hig.md` and `android/material.md` |

## Detecting the surface

| Signal                                                 | Surface                                          |
| :----------------------------------------------------- | :----------------------------------------------- |
| `package.json` with a web framework, or HTML templates | web                                              |
| `.xcodeproj`, `.xcworkspace`, SwiftUI or UIKit sources | apple                                            |
| Gradle with Compose or Android views                   | android                                          |
| `pubspec.yaml` (Flutter), React Native dependencies    | both                                             |
| Electron, Tauri                                        | web, plus the host platform's window conventions |

## The rule that matters most here

**Do not apply one platform's convention to another.** It is the most common
false finding in a cross-platform review, and it discredits the rest of the
audit.

The usual offenders:

- **Target size.** WCAG 2.5.8 is 24 × 24 CSS px at AA, everywhere. Apple's
  44 × 44 pt and Material's 48 × 48 dp are *platform guidelines*, not WCAG
  requirements. Cite them separately and label them as such — see
  `a11y/wcag.md`.
- **Back navigation.** Android has a system back; iOS has a per-screen back and
  an edge swipe; the web has browser history. A pattern correct on one is wrong
  on the others.
- **Destructive-action placement** and button order in dialogs differ by
  platform convention.
- **Navigation structure.** Bottom tab bar, navigation drawer and top bar are
  not interchangeable across platforms.
- **System fonts and type scales** are platform-defined and carry accessibility
  behaviour (Dynamic Type, font scaling) that a hard-coded size destroys.

## What never changes between platforms

Say this explicitly when a team tries to argue a platform exemption:

- Keyboard and switch-control reach, and focus order
- Accessible names, roles and states
- Contrast thresholds
- Reduced motion, increased contrast and text-size preferences
- The interface states in `common/interface-states.md`
- Everything in `common/anti-patterns.md` — a dark pattern is not a platform
  convention
