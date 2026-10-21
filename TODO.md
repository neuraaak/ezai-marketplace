# Idées de fond (backlog, non priorisé)

## Graphify — scope root uniquement (décidé)

Le graph et la DB graphify sont générés au **scope root** du projet
(`graphify-out/` à la racine). Les graphs per-plugin
(`plugins/<name>/graphify-out/`) ont été abandonnés : un seul graph racine
voit les relations cross-skills, et les requêtes (`graphify query "..."`,
`graphify explain`, `graphify path`) permettent toujours de cibler les
interactions au scope d'un skill.

## Structured outputs — skill dédié (à étudier)

Un expert pour les développeurs d'applications LLM (ex. `ezai-llm-structured-outputs`) :
concevoir des JSON Schema compatibles avec le constrained decoding (`additionalProperties: false`,
tous les champs requis, enums fermés), générer le schéma depuis Pydantic / Zod, appels
structured outputs par fournisseur, validation + retry, gestion des refus, streaming partiel.

## Structured outputs — evals vérifiées par schéma (à étudier)

Les evals vérifient aujourd'hui des regex sur du texte libre, ce qui reste fragile (variantes
de langue, syntaxe `(?i)`). Piste : lancer l'agent en mode non interactif avec un schéma de
sortie (ex. `codex exec --output-schema`) et vérifier le rapport JSON champ par champ.
Prérequis : un runner d'evals, qui n'existe pas encore dans le repo.
