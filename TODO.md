# TODO — idées à intégrer

## 1. Capabilities registry par skill

**Idée :** Déclarer explicitement ce que chaque skill sait faire, pour deux usages :

- Découvrabilité pré-invocation (utilisateur, CLI, graphify)
- Confirmation de scope pendant l'invocation (agent)

**Approche retenue :** A + C en tandem, source unique dans `plugin.json`, miroir dans `SKILL.md`.

`plugin.json` :

```json
{
  "capabilities": [
    { "id": "badges", "description": "Badge block (README + docs/index.md)" },
    { "id": "readme", "description": "Full README.md generation or audit" },
    { "id": "api-ref", "description": "Docstrings → reference page" },
    { "id": "tutorial", "description": "Tutorial page (Diátaxis)" }
  ]
}
```

`SKILL.md` (section `## Capabilities`, maintenue manuellement en miroir) :

```markdown
## Capabilities

- **badges** — badge block (README + docs/index.md)
- **readme** — full README.md generation or audit
- **api-ref** — docstrings → reference page
- **tutorial** — tutorial page (Diátaxis)
```

**Débloque :** `ezai info <skill>` liste les capabilities ; graphify les indexe comme nœuds ;
`build-index.js` peut valider qu'une capability a un fichier de référence correspondant.

**Prototype sur :** `ezai-docs-writer` en premier.

---

## 2. Graphify scopé par skill

**Idée :** Plutôt qu'un seul graphify racine pour tout le marketplace, générer un graph
par plugin, stocké dans `plugins/<name>/graphify-out/`.

```
plugins/ezai-docs-writer/
  graphify-out/          ← graph scopé au plugin
    graph.json
    GRAPH_REPORT.md
    graph.html
  SKILL.md
  references/
```

**Gain :** Le routing dans `index.md` (code déguisé en markdown) devient une requête
sémantique : `graphify query "badge registry pour python"` → nœud exact, sans naviguer
l'arbre `references/` manuellement. SKILL.md encore plus mince.

**Bonus inter-skill :** `persona-docs-specialist` peut requêter le graph de `docs-writer`
pour résoudre dynamiquement les fichiers à charger. Aujourd'hui `pipeline.md` liste les
chemins en dur (`references/languages/python/...`) — avec le graph, l'étape DETECTION fait
`graphify query "fichiers à charger pour python + github + internal"` et obtient les bons
nœuds sans couplage structurel. Résistant aux futures réorgs de `docs-writer`.

**Limite :** Les graphs per-plugin ne se voient pas entre eux pour l'architecture globale —
le graph racine reste utile pour les relations cross-skills.

**Commande :** `graphify plugins/ezai-docs-writer` puis committer `graphify-out/`.
À faire après le prototype capabilities (item 1).
