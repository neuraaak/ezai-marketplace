# Documentation Profiles Index

A profile defines the page structure of a documentation site: which kinds of pages exist, how they are organized, and their anti-patterns and success criteria. The rules shared by every profile live in `common/standards.md`.

| Profile  | For                                                                                      | Files                                                               |
| :------- | :--------------------------------------------------------------------------------------- | :------------------------------------------------------------------ |
| Diátaxis | Developer documentation: libraries, frameworks, SDKs, APIs, CLIs                         | `profiles/diataxis/structure.md` + `profiles/diataxis/templates.md` |
| Product  | Product documentation for end users and administrators: apps, SaaS, self-hosted software | `profiles/product/structure.md` + `profiles/product/templates.md`   |

Load only the profile of the zone being written or audited.

## Detecting the profile

Read the repository before asking. The signals usually settle it:

| Signal                                                                                                                                                                                                                                                                                          | Profile                |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------- |
| Published to a package registry — PyPI (`[project]` with a build backend), npm (`package.json` with `exports` or `bin`, without `"private": true`), Packagist (`composer.json` of type `library`) — whether or not it ships `[project.scripts]` or a `bin`; public API documented in docstrings | **Diátaxis**           |
| Deployed or distributed without being published as a package: user interface (frontend app, Electron, mobile), `Dockerfile` / compose / Helm chart, `"private": true`, existing FAQ or Troubleshooting pages                                                                                    | **Product**            |
| Both an application and a public SDK or API published to a registry                                                                                                                                                                                                                             | **Both, in two zones** |

Publication is the deciding signal: a CLI installed from PyPI or npm is developer tooling and takes the Diátaxis profile, even though it has an entry point.

When the signals conflict or are absent, the Scope step asks the `profile` question. Its default is Diátaxis.

## Zones

- **Single-profile site** — the common case. No zone: the profile applies to the whole `docs/` tree. An existing Diátaxis site keeps its layout.
- **Hybrid site** — one top-level folder per zone, each with exactly one profile. For example `docs/guide/` and `docs/admin/` under the product profile, `docs/developers/` under Diátaxis. A page takes the profile of its zone; the purity rules of that profile apply inside the zone only.
- The product **admin zone** exists only when the product is self-hosted or administrable.
- The homepage (`docs/index.md`) belongs to no zone: on a hybrid site, its navigation table lists each zone with its audience.
