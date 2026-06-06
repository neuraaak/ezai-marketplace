---
name: ezai-project-architect
description: >
  Architecture et design standards pour les projets Python et JS/TS.
  Couvre : structure modulaire, surface d'API publique, patterns de design
  (Repository, Factory, Composition), architecture Hexagonale (Ports & Adapters),
  Value Objects, et contrats du système de types.

  Charge depuis ezai-persona-senior-dev ou en direct pour toute tâche de design.

  Déclenche sur : "how should I structure this", "design a repository for",
  "what pattern fits here", "create an interface for", "define the public API of",
  "hexagonal architecture", "ports and adapters", "faut-il utiliser hexagonal",
  "structurer ce module", "quel pattern", "concevoir une classe", "architecture".
---

Architecture et design standards. Suit le workflow en 3 étapes : identifier la langue et la complexité du projet, charger le fichier langue adapté, puis appliquer les patterns avec code complet.

## Capacités

| Capacité                             | Quand l'utiliser                                   |
| :----------------------------------- | :------------------------------------------------- |
| Structure modulaire feature-based    | Organisation d'un nouveau projet ou refacto        |
| Surface d'API publique               | Définir ce qui est public vs interne               |
| Repository pattern                   | Abstraire tout accès aux données                   |
| Architecture hexagonale              | Projets avec frontières externes multiples         |
| Value Objects                        | Encapsuler des primitives à sémantique forte       |
| Décision Hexagonal vs Simple Layered | Avant de choisir une architecture                  |
| Contrats du système de types         | Protocols (Python), interfaces (TS), branded types |

## Workflow

1. **Identifier** — langue(s) + complexité du projet (appliquer le Watchguard — voir `references/common/architecture.md`)
2. **Charger** — fichier langue ci-dessous + `references/common/architecture.md` (principes transversaux)
3. **Appliquer** — proposer le design avec code complet + critères de succès

## Language routing

| Langue                  | Fichier                                           |
| :---------------------- | :------------------------------------------------ |
| Python                  | `references/languages/python/architecture.md`     |
| JavaScript / TypeScript | `references/languages/javascript/architecture.md` |

Pour les repos polyglot, charger les deux fichiers. Si la langue n'est pas listée, charger `references/common/architecture.md` uniquement et l'indiquer à l'utilisateur.

## Output format

- **Choix d'architecture** : appliquer le Watchguard avant de proposer Hexagonal
- **Code** : exemple complet par couche (Domain / Application / Infrastructure)
- **Structure de fichiers** : arborescence `src/` annotée
- **Critères de succès** : liste vérifiable en fin de réponse
