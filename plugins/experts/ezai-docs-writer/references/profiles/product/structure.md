# Product profile — Structure

Profile for product documentation: applications, SaaS, desktop or mobile software, self-hosted tools. Readers are **end users** who operate the product and, when it is self-hosted or administrable, **administrators** who run it. Load it with `templates.md` (same folder) and `common/standards.md`.

The profile follows ISO/IEC/IEEE 26514 (information for users of software: task, concept and reference information) and the minimalist approach (John Carroll): real tasks first, action before explanation, error recovery built in.

## Page types

| Page type           | Reader goal                                   | Diátaxis counterpart |
| :------------------ | :-------------------------------------------- | :------------------- |
| **Get started**     | Reach a first useful result in the product    | Tutorial             |
| **Task**            | Accomplish one thing with the product         | How-To               |
| **Concept**         | Understand a product notion needed to act     | Explanation          |
| **Reference**       | Look up a setting, shortcut, limit or term    | Reference            |
| **Troubleshooting** | Recover from a problem: symptom → cause → fix | —                    |
| **FAQ**             | Get a short answer to a recurring question    | —                    |
| **Release notes**   | Learn what changed for them in a version      | Changelog            |

### Admin zone

Present only when the product is self-hosted or administrable. Same page types, for administrators, grouped by lifecycle: **Install & deploy** · **Configure** · **Administer** (users, roles, backups) · **Upgrade** · **Monitor & troubleshoot**.

## Core Rules

- **ONE GOAL:** One page = one task, one concept or one problem. A page that needs "and" in its title is two pages.
- **ACTION FIRST:** Start with what the reader does; keep the explanation to what they need to act. Link to a Concept page for the rest.
- **UI WORDING:** Name interface elements exactly as the product shows them, in bold (**Settings** › **Members** › **Invite**). Never paraphrase a label.
- **NO INTERNALS:** The user zone never exposes architecture, code or implementation details. Code appears only when the reader must type it (a command, a formula, a URL).
- **RECOVERY:** Troubleshooting is never buried inside a task. A task links to the Troubleshooting entries for its known failure points.
- **SCREENSHOTS:** Only when the interface is not self-evident. The text must stand on its own without the image, and every screenshot has alt text.
- **TONE:** Directive and plain for Get started, Task and Troubleshooting; terse for Reference and FAQ; short and neutral for Concept.
- **TASK GROUPING:** Group tasks by feature area or user journey, in the order a user meets them — never by internal module.

---

## Product anti-patterns

| Anti-pattern                                    | Problem                                      | Fix                                                             |
| :---------------------------------------------- | :------------------------------------------- | :-------------------------------------------------------------- |
| "Features" page written as a marketing list     | Says what exists, not how to use it          | One Task page per feature the user acts on                      |
| Architecture or code explained in the user zone | Exposes internals to readers who don't care  | Move to developer docs, or drop it                              |
| Release notes copied from the git log           | Commit jargon, no user impact                | Rewrite per user-visible change, grouped New / Improved / Fixed |
| FAQ used as a catch-all                         | Real tasks hidden in Q&A, impossible to scan | Promote any answer longer than a paragraph to a Task page       |
| Troubleshooting inside task steps               | Breaks the happy path, hard to find later    | Separate Troubleshooting entry, linked from the step            |
| Paraphrased UI labels                           | Reader cannot find the control               | Copy the exact label                                            |
| Screenshot as the only instruction              | Unreadable for screen readers, goes stale    | Text first; screenshot as a complement                          |

---

## Success criteria

- Every page belongs to exactly one page type and serves one goal.
- Get started ends with a concrete result in the product and points to the next tasks.
- Every Task names its starting point, lists numbered steps in UI wording, and states the visible result.
- Every Troubleshooting entry has a symptom the user can recognize, its cause, and a fix.
- No architecture, source code or internal module name appears in the user zone.
- Release notes describe user-visible changes only, grouped New / Improved / Fixed.
- The admin zone exists only for a self-hosted or administrable product, and never mixes with the user zone.
