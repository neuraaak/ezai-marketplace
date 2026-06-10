---
name: ezai-project-config
description: >
  Toolchain setup, project configuration, and infrastructure standards for Python
  and JS/TS projects. Covers pyproject.toml / package.json structure, build backends,
  linters, type checkers, Docker multi-stage builds, lockfiles, env vars, and
  observability setup.

  Charge depuis ezai-senior-dev-persona ou en direct pour toute tâche de config.

  Déclenche sur : "set up the project", "configure ruff/ty/uv", "write a Dockerfile",
  "set up pre-commit", "configure tsconfig", "add OpenTelemetry", "lockfile issue",
  "configurer eslint", "monorepo setup", "env vars", "variable d'environnement",
  "pyproject.toml", "package.json", "configurer le projet".
---

Toolchain, configuration et infrastructure projet. Suit le workflow en 3 étapes : identifier la langue et le type de tâche, charger le fichier langue adapté, puis appliquer les standards avec config complète.

## Capacités

| Capacité                                    | Quand l'utiliser                             |
| :------------------------------------------ | :------------------------------------------- |
| Structure `pyproject.toml` / `package.json` | Initialisation ou audit d'un projet          |
| Linting / formatting / type checking        | ruff, ty (Python) — ESLint, tsc (JS/TS)      |
| Docker multi-stage                          | Conteneurisation Python ou Node.js           |
| Lockfiles & reproductibilité                | `uv.lock`, `pnpm-lock.yaml`, CI déterministe |
| Gestion des env vars & secrets              | `.env`, vault, patterns sécurisés            |
| Observabilité                               | OpenTelemetry, structured logs               |
| Monorepo tooling                            | Workspaces `uv` / `pnpm`                     |

## Workflow

1. **Identifier** — langue(s) détectées (`pyproject.toml` → Python, `package.json` → JS/TS) + type de tâche (init / audit / Docker / CI)
2. **Charger** — fichier langue ci-dessous + `references/common/config.md` (principes transversaux)
3. **Appliquer** — config complète avec critères de succès vérifiables

## Language routing

| Langue                  | Fichier                                     |
| :---------------------- | :------------------------------------------ |
| Python                  | `references/languages/python/config.md`     |
| JavaScript / TypeScript | `references/languages/javascript/config.md` |

Pour les monorepos couvrant les deux langues, charger les deux fichiers et appliquer chacun à son sous-répertoire respectif. Si un fichier est inaccessible, notifier l'utilisateur et se rabattre sur `references/common/config.md`.

## Output format

- **Config files** : blocs complets prêts à copier-coller, avec sections commentées
- **Choix d'outil** : tableau comparatif si plusieurs options sont valides
- **Critères de succès** : liste vérifiable en fin de réponse
- **Secrets** : toujours signaler si une config expose des valeurs sensibles
