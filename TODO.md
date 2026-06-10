# Idées de fond (backlog, non priorisé)

## Graphify scopé par skill (partiellement amorcé)

Un graph par plugin dans `plugins/<name>/graphify-out/` plutôt qu'un seul graph racine.
Déjà fait pour `ezai-docs-writer` (42 nœuds, 55 edges). Gain : le routing de `index.md` devient une
requête sémantique (`graphify query "badge registry pour python"`) et `docs-specialist-persona` peut
résoudre dynamiquement les fichiers à charger au lieu des chemins en dur de `pipeline.md` — résistant
aux futures réorgs. Limite : les graphs per-plugin ne se voient pas entre eux ; le graph racine reste
utile pour les relations cross-skills. À généraliser aux autres plugins une fois les phases précédentes
stabilisées.
