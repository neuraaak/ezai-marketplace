# Idées de fond (backlog, non priorisé)

## Graphify — scope root uniquement (décidé)

Le graph et la DB graphify sont générés au **scope root** du projet
(`graphify-out/` à la racine). Les graphs per-plugin
(`plugins/<name>/graphify-out/`) ont été abandonnés : un seul graph racine
voit les relations cross-skills, et les requêtes (`graphify query "..."`,
`graphify explain`, `graphify path`) permettent toujours de cibler les
interactions au scope d'un skill.
