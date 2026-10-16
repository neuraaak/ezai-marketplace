# JavaScript / TypeScript — Pipeline Blueprint

The role sequence and JS/TS-specific concerns for a CI pipeline. **Do not hard-code tools here** — detect the project's toolchain and resolve each role to a command via `javascript/tool-registry.md`. Wrap the resolved commands as steps/scripts using the platform file (`github/syntax.md` or `gitlab/syntax.md`).

## Role sequence

```text
install → lint → format-check → type-check → security-scan → test → build → publish → docs
```

Lint / format-check / type-check / security-scan are independent and gate the rest. `security-scan` covers SAST (`eslint-plugin-security`, or CodeQL/Semgrep on higher-risk repos) plus dependency CVEs (`pnpm audit`) — resolve via the registry. `test` fans out across a Node version matrix. `build`, `publish`, `docs` run only on a release ref.

## JS/TS-specific concerns

- **Version matrix:** test the project's supported Node range — the `engines.node` floor up to current LTS (e.g. `["22", "24"]`). A project pinned to one exact Node version in `engines` has a single-cell matrix; don't invent a range it doesn't support.
- **Runner prefix:** prefer the project's own `package.json` scripts (`pnpm lint`, `pnpm build`) over raw tool calls — they encode the intended invocation. Use `pnpm exec <tool>` only when there's no script.
- **Frozen installs:** the install command must respect the lockfile — `pnpm install --frozen-lockfile`, `npm ci`, `yarn install --immutable`, `bun install --frozen-lockfile`.
- **Pin the package manager:** either `pnpm/action-setup` with an explicit `version:`, or `corepack enable && corepack prepare pnpm@<version> --activate`. Pick one — `packageManager` in `package.json` plus a floating action version is how pnpm drifts between runners.
- **Publish auth:** prefer OIDC + `npm publish --provenance` (signed attestation); fall back to `NPM_TOKEN`. Both resolutions are in the registry.
- **Always `--ignore-scripts` on publish:** the publish job holds the release credential; a compromised `prepublishOnly` must not run there.
- **`--ignore-scripts` on a docs/build install too**, then `pnpm rebuild <pkg…>` for the handful of packages that genuinely need a native binary (esbuild, sharp…). This cuts arbitrary install-time code execution down to an explicit list.
- **Dependency audit scope:** `pnpm audit --audit-level high --prod`. The dev tree routinely carries advisories with no upstream fix — gating on them blocks every PR without making the shipped package any safer.

## Worked example (pnpm + eslint + tsc + vitest)

Detection: `pnpm-lock.yaml`, `eslint.config.*`, `tsconfig.json`, `vitest.config.*`, plus `lint`/`build` scripts → registry lookup yields `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm exec tsc --noEmit`, `vitest run`. Wrapped for **GitHub Actions**:

```yaml
jobs:
  quality:
    runs-on: ubuntu-24.04
    permissions: { contents: read }
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@<sha>      # pin every action to a SHA (principles.md)
      - uses: pnpm/action-setup@<sha>
        with: { version: "11" }
      - uses: actions/setup-node@<sha>
        with: { node-version: "24", cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm exec tsc --noEmit
      - run: pnpm audit --audit-level high --prod

  test:
    needs: [quality]
    runs-on: ubuntu-24.04
    timeout-minutes: 25
    strategy:
      fail-fast: false
      matrix: { node: ["22", "24"] }
    steps:
      - uses: actions/checkout@<sha>
      - uses: pnpm/action-setup@<sha>
        with: { version: "11" }
      - uses: actions/setup-node@<sha>
        with: { node-version: "${{ matrix.node }}", cache: pnpm }
      - run: pnpm install --frozen-lockfile
      # The threshold belongs to this script, not to the jest/vitest config.
      - run: pnpm test:coverage
```

For **GitLab CI**, wrap the same resolved commands as `script:` entries with a lockfile-keyed `cache:` on the package store (see `gitlab/syntax.md`). For **publish** and **docs deploy**, resolve those roles in the registry and place them in the orchestration file's release flow.

An npm / biome / jest project keeps this exact structure but every command differs — re-resolve from the registry, never copy the pnpm commands above.
