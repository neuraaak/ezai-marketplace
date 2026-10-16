# Config & Toolchain — JavaScript / TypeScript

## Rules

- **VERSION**: ES2026 / Node.js 24+ minimum.
- **ESM**: always `"type": "module"` in `package.json`. Never CommonJS for new projects.
- **MANAGER**: `pnpm` as the package manager; commit `pnpm-lock.yaml`.
- **DETERMINISM**: `pnpm install --frozen-lockfile` in CI.

## Version pinning

Pin the package manager via corepack (the standard) — committed in `package.json`,
enabled with `corepack enable`:

```json
{
  "packageManager": "pnpm@12.11.2",
  "engines": { "node": ">=24" }
}
```

Pin the Node version separately via `.nvmrc`:

```text
# .nvmrc
24
```

Volta remains an alternative that pins both Node and pnpm in one place:

```json
{
  "volta": {
    "node": "24.1.0",
    "pnpm": "12.11.2"
  }
}
```

## `package.json` — essentials

```json
{
  "type": "module",
  "engines": { "node": ">=24" },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "test": "node --test",
    "typecheck": "tsc --noEmit",
    "check": "pnpm lint && pnpm typecheck && pnpm test"
  }
}
```

`check` is the project's command surface — the aggregate the README, the CI job
and the pre-commit hook all call, so a gate is declared once and never drifts
between the three. The same role `poe check` plays in Python.

`node --test` runs `.ts` test files directly: Node 24 strips types natively, no
build step and no transpiler for tests. On Node 22 the same script needs
`--experimental-strip-types`. Type stripping erases annotations, it does not
check them — `typecheck` stays a separate gate.

## Which bucket a dependency goes in

`package.json` has no dependency groups: it has four buckets, and only the
first one ships to whoever installs your package.

| Bucket                 | Holds                                             | Installed by                    |
| :--------------------- | :------------------------------------------------ | :------------------------------ |
| `dependencies`         | what the published code imports at runtime        | every consumer, always          |
| `devDependencies`      | the toolchain: linter, types, test runner, build  | `pnpm install`, never consumers |
| `peerDependencies`     | what the **host app** must provide (`react`, `vue`) | nobody — it is a constraint     |
| `optionalDependencies` | native/platform extras whose install may fail     | consumers, failure tolerated    |

A tool in `dependencies` is downloaded by every consumer of your package, for
nothing. A runtime import in `devDependencies` builds fine locally and crashes
in production, where only `dependencies` was installed.

```bash
pnpm install --frozen-lockfile   # everything, CI and local
pnpm install --prod              # dependencies only — what the runtime image gets
```

For a library, a framework belongs in `peerDependencies` (plus
`devDependencies` so the repo can build it), never in `dependencies` — that is
how two Reacts end up in one bundle.

## Pinning versions across a monorepo — pnpm catalogs

Declare each shared version once in `pnpm-workspace.yaml`, reference it with
`catalog:` everywhere:

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/*"
catalog:
  react: ^19.0.0
  typescript: ^5.7.0
```

```json
// packages/ui/package.json
{ "dependencies": { "react": "catalog:" } }
```

An upgrade is then one line in one file, and two packages of the workspace can
no longer drift onto different majors of the same dependency. `pnpm` resolves
`catalog:` at install time; the lockfile and published `package.json` carry the
real range, so consumers never see the alias.

## `tsconfig.json` (TS 5.x)

```json
{
  "compilerOptions": {
    "target": "ES2026",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "types": [],
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

- `strict: true` non-negotiable
- `types: []` speeds up compilation by disabling automatic type inclusion — it also drops the Node globals (`process`, `Buffer`, `__dirname`); use `types: ["node"]` if you touch them. Explicit `node:*` imports keep their types either way
- `noUncheckedIndexedAccess` catches array-index bugs

> **Forward note — TypeScript 7 (`tsgo`):** the compiler is being rewritten in Go
> (~10× faster, semantically identical). Available today as a preview
> (`@typescript/native-preview`); becomes the stable `tsc` in TS 7 GA (~mid-2026).
> The swap is drop-in — keep using `tsc --noEmit`, adopt on GA.

## Linting & formatting — pick one toolchain

| Toolchain         | When                                                                 |
| :---------------- | :------------------------------------------------------------------- |
| **Biome**         | New projects — one fast (Rust) tool for lint + format, single config |
| ESLint + Prettier | Existing setups, or when you need a plugin only ESLint provides      |

Don't run both as blocking gates — choose one.

### Biome (recommended for new projects)

```jsonc
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "formatter": { "enabled": true, "indentStyle": "space" }
}
```

```json
// package.json scripts
{
  "scripts": {
    "lint": "biome check src/",
    "format": "biome format --write src/"
  }
}
```

`biome check` runs lint + format checks in one pass; `biome check --write` applies fixes.

### ESLint — config (flat config, ESLint 9+)

```javascript
// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "error",
    },
  },
);
```

## Modern syntax (ES2026 / Node 24+)

```typescript
// Temporal API — prefer over Date for new date/time code where the runtime
// ships it (Node 24+ / modern browsers); fall back to Date or a polyfill otherwise
const now = Temporal.Now.plainDateTimeISO();

// Explicit Resource Management — automatic cleanup at end of scope
await using conn = await getConnection();  // [Symbol.asyncDispose]() called automatically

// Array by Copy — no mutation
const sorted = original.toSorted();
const reversed = original.toReversed();

// AbortController — standard for cancellable async ops
const controller = new AbortController();
const result = await fetch(url, { signal: controller.signal });
```

## Environment variables

```typescript
// Startup validation — fail fast if a required var is missing
function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Required environment variable '${key}' is not set`);
  return value;
}

const DATABASE_URL = getEnv("DATABASE_URL");
const API_KEY = getEnv("API_KEY");
```

- `.env` local only — always in `.gitignore`.
- In CI: inject via the platform's secrets.
- For Next.js projects: `@t3-oss/env-nextjs` for typed env-var validation.

## Docker multi-stage (Node.js)

```dockerfile
# Build stage
FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY src/ src/ tsconfig.json ./
RUN pnpm run build

# Runtime stage
FROM node:24-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
WORKDIR /app
COPY --from=builder /app/dist dist/
COPY --from=builder /app/node_modules node_modules/
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1))"
CMD ["node", "dist/index.js"]
```

## Node.js Permission Model (Node 24+)

```bash
node --permission --allow-fs-read="./data" --allow-fs-write="./output" app.js
```

## Success criteria

- `"type": "module"` in `package.json`.
- `strict: true` in `tsconfig.json`.
- `pnpm-lock.yaml` committed; `--frozen-lockfile` in CI.
- A `check` script aggregating lint + typecheck + test, called by README, CI and hooks.
- Runtime imports in `dependencies`, toolchain in `devDependencies`, framework of a library in `peerDependencies`.
- One lint/format toolchain: Biome (recommended) or ESLint flat config + Prettier.
- Prefer the `Temporal` API over `Date` for new code where the runtime ships it.
- `using` / `await using` for resource management.
- Secrets via environment variables — validated at startup.
- Multi-stage Docker images, non-root, pinned tags.
