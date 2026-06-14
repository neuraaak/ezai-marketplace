# GitLab CI — Release & Deploy Orchestration

Patterns for modular and multi-stage release pipelines: `include`, parent-child pipelines, the release flow, and Pages deployment. For the building blocks (stages, rules, needs, caching), see `gitlab/syntax.md`.

## `include` — modular pipelines

```yaml
include:
  - local: .gitlab/ci/test.yml
  - project: my-group/ci-templates
    file: /python.yml
    ref: v1.2.0                      # pin the ref
  - template: Security/SAST.gitlab-ci.yml
```

Split large pipelines and reuse shared templates instead of copy-pasting. Pin external `ref`s — an unpinned template can change under you, the GitLab equivalent of an unpinned action.

## Parent-child & multi-project pipelines

`trigger` is GitLab's equivalent of GitHub's `workflow_call` cascade — run a downstream pipeline as part of the current one:

```yaml
# Child pipeline in the same repo
publish:
  stage: deploy
  trigger:
    include: .gitlab/ci/publish.yml
    strategy: depend                 # parent waits on the child's result

# Downstream pipeline in another project (e.g. trigger a docs repo build)
deploy-docs:
  stage: deploy
  trigger:
    project: my-group/docs
    branch: main
```

`strategy: depend` makes the parent reflect the child's success/failure — without it, the trigger is fire-and-forget.

## Release flow (tag → build → publish → pages)

The GitLab analogue of the tag-sync cascade. A tag pipeline drives the release; each stage gates the next, and the publish/deploy jobs are gated behind `rules` + a protected environment.

```yaml
stages: [test, build, publish, pages]

workflow:
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+/   # release pipeline on semver tags
    - if: $CI_COMMIT_BRANCH == "main"           # CI pipeline on main

build:
  stage: build
  script: [uv build]
  artifacts:
    paths: [dist/]

publish:
  stage: publish
  needs: [build]                     # reuse the built artifact, don't rebuild
  rules:
    - if: $CI_COMMIT_TAG =~ /^v/
      when: on_success
  id_tokens:
    PYPI_ID_TOKEN: { aud: https://pypi.org }
  script: [uv publish]
```

GitLab also has a native **release** object via the `release` keyword (`release-cli`) to attach release notes and assets to a tag — use it instead of hand-rolling release creation.

**Two modes map onto `rules`** (see `common/principles.md` → "Validation vs release"). The same job graph runs in both; `rules` decide whether a job *delivers* or merely *validates*:

- **Validation** (MR / branch pipeline): `build` and the docs job run, but `publish`/`pages` carry `rules: - if: $CI_COMMIT_TAG` so they're absent — nothing mutates the registry or the site.
- **Release** (semver tag pipeline): the mutating jobs activate. The tag itself is the trigger, so the "version changed?" gate is implicit — a tag exists only when a human cut a release. Keep `vX.Y.Z` **immutable**; if you also publish a moving major alias or a `latest` docs alias, push that to a *separate* ref, never by force-moving the release tag.

**Re-run safe publish.** A re-run of a release pipeline must not fail on an already-published version: `twine upload --skip-existing` (Python) or an existence check before `npm publish` (JS). Pages re-deploys are idempotent by construction (the job overwrites `public/`). Keep the order **publish → pages**: publish is irreversible, the site is not.

**Optional `dev` docs alias.** A docs job rule'd on `$CI_COMMIT_BRANCH == "main"` (not on tags) can publish unreleased content into a `dev/` subfolder of `public/`, decoupled from publish — the GitLab analogue of a `mike deploy dev`.

## GitLab Pages deploy

```yaml
pages:
  stage: pages
  script: [pnpm build, mv dist public]
  artifacts:
    paths: [public]
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

The job must be named `pages` and publish to `public/`. For versioned docs, build each version into a subdirectory of `public/` (GitLab Pages has no built-in alias mechanism like mike — version routing is done by directory layout).
