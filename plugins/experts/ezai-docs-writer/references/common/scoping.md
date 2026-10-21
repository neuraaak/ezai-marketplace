# Docs Writer — Scoping questions

Ordered list used by the **Scope** step of `SKILL.md`. Walk it top to bottom, drop every question the request or the repository already answers, then ask the **first three remaining** in a single call. For any question left unasked, apply the recommended option and state it in the response.

Options are listed recommended first, as `label` — `description`. Never add an "Other" option: every harness appends a free-form one.

## 1. `artifact` — header `Artifact`

**Ask when** the request does not name what to write ("write a tutorial", "add docstrings", "generate a README" already answer it).
**Question:** What should be written?

- `Documentation page (Recommended)` — One page in the docs site.
- `README` — Generate or update the repository's `README.md`.
- `Docstrings` — Document the public API in the code, feeding the reference pages.

## 2. `profile` — header `Profile`

**Ask when** the detection signals in `profiles/index.md` conflict or are absent.
**Question:** What kind of documentation is this?

- `Developer docs (Recommended)` — Diátaxis profile: a library, framework, SDK, API or CLI.
- `Product docs` — Product profile: an application, SaaS or self-hosted software, for end users and admins.
- `Both, in two zones` — Product zone for users and admins, Diátaxis zone for developers.

## 3. `page_type` — header `Page type`

**Ask when** the artifact is a documentation page, the profile is already settled, and the request fits two page types of that profile.
**Question:** Which kind of page serves the reader's goal?

Diátaxis profile:

- `How-to guide (Recommended)` — Steps to reach one concrete goal; assumes the basics are known.
- `Tutorial` — A guided first success for a newcomer, end to end.
- `Explanation` — The why behind a design or concept; no steps.

Product profile:

- `Task (Recommended)` — Steps in UI wording to accomplish one thing with the product.
- `Get started` — From zero to a first useful result in the product.
- `Troubleshooting` — Symptom, cause and fix for one problem.

Other page types (Reference, Examples, Concept, FAQ, Release notes) come from the request or the free-form answer.

## 4. `audience` — header `Audience`

**Ask when** the request does not say who reads the page and the site serves two audiences.
**Question:** Who is the primary reader?

Diátaxis profile:

- `Library users (Recommended)` — People calling the public API; no internals.
- `Contributors` — People changing the codebase; build, tests and architecture.

Product profile — the answer also picks the zone:

- `End users (Recommended)` — People using the product; user zone, no internals.
- `Administrators` — People installing and running it; admin zone.

## 5. `language` — header `Language`

**Ask when** no existing `.md` file settles the documentation language and the user writes in a language other than English.
**Question:** In which language should the documentation be written?

- `English (Recommended)` — The default for public open-source documentation.
- `The user's language` — Match the language of the request.

## 6. `target` — header `Target`

**Ask when** a docs folder exists and the request does not name a file.
**Question:** Where should the content go?

- `New page (Recommended)` — Create a page under the matching section and add it to the nav.
- `Update existing page` — Extend the closest existing page; the user names it via the free-form answer if needed.

## Why these questions

- **Profile** decides the whole page structure. Diátaxis suits developer docs, but an application's users want tasks and troubleshooting, not architecture. The default stays Diátaxis so an unclear repository keeps the previous behaviour.
- **Page type** is the decision that most often goes wrong: a page that mixes two types serves neither reader. Asking replaces the old "ask if still ambiguous" rule with a fixed question.
- **Audience** decides what is left out: user docs never expose internals, contributor docs never re-explain the public API. Under the product profile it also picks the user or admin zone.
- **Language** only matters on a fresh docs site; once pages exist, they set the language.
