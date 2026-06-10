# TODO — ezai-marketplace

> Source de vérité : audit du 2026-06-10 (`.tmp/audit.md`, note globale **B+**).
> Branche de travail : `feat/updating-agents-and-optimizations`.
> Rien de bloquant — il s'agit de nettoyages et de mises à niveau avant la prochaine release.

Légende sévérité : 🟠 modéré · 🟡 mineur · 🟢 cosmétique / opportuniste.

---

## Phase 0 — Hygiène git (à faire en premier)

- [x] **Committer le renommage des personas de façon atomique** 🟢
      Le renommage `ezai-persona-{senior-dev,docs-specialist}` → `ezai-{senior-dev,docs-specialist}-persona`
      est complet et cohérent mais éclaté entre l'index et le working tree
      (`marketplace.json`, `docs/skills/index.md`, `src/commands/info.js`…).
      Inclure le fix de `info.js` (lecture des capabilities en chaînes simples — correct et nécessaire).
- [x] **Relancer `graphify update .`** une fois le commit du renommage passé (le graph actuel est figé sur `a36e4d6`).

---

## Phase 1 — Quick fixes CLI (≈ 1 h, fort ratio gain/effort)

- [x] **Version CLI hardcodée** 🟠 — `bin/ezai.js:14`
      `program.version('1.0.0')` alors que le package est en **1.1.2** : `ezai --version` ment.
      → `program.version(require('../package.json').version)`.
- [x] **Supprimer le code mort** 🟠 — `src/commands/install.js`
      `resolvePluginFiles()`, `buildDestPath()`, `collectSkills()` ne sont utilisés que par les tests.
      Pire, `buildDestPath()` retourne `.agents/<name>` au lieu du vrai `.agents/skills/<name>` :
      un piège pour quiconque réutilise cette fonction « testée ».
      → Les supprimer (ainsi que leurs tests), ou les brancher réellement dans `runInstall`.
- [x] **Gestion d'erreurs du binaire** 🟡 — `bin/ezai.js`
      `program.parse()` (non-async) n'attrape pas les promesses rejetées des actions → message d'erreur
      **puis** stack trace d'unhandled rejection (sortie doublée, code retour non garanti).
      → `program.parseAsync().catch((err) => { console.error(err.message); process.exitCode = 1; })`
      et retirer les `.catch(rethrow)` par action.
- [x] **Dédupliquer `DEFAULT_PLATFORMS` + `resolvePlatforms`** 🟡
      Définies à l'identique dans `install.js` et `uninstall.js` → risque d'asymétrie silencieuse.
      → Extraire dans `src/platforms.js` partagé.
- [x] **`fetchCatalogue` sans timeout ni validation** 🟡 — `src/catalogue.js:9`
      Un serveur muet (`EZAI_CATALOGUE_URL`) gèle le CLI indéfiniment ; un JSON sans `plugins` crashe loin
      avec une erreur cryptique.
      → `fetch(url, { signal: AbortSignal.timeout(10_000) })` + garde `Array.isArray(data.plugins)`.
- [x] **Pinner `pnpm/action-setup@v4` par SHA** 🟡 — `.github/workflows/ci.yml` (2 occurrences)
      Seule action non pinnée du repo ; incohérent avec le standard maison et avec ce que prêche
      le propre skill `ezai-cicd-expert`.

---

## Phase 2 — Standard capabilities (≈ 2–3 h)

> **Règle à appliquer partout :** tout plugin déclare des capabilities au format objets
> `{ id, description }` dans `plugin.json`, avec un miroir manuel en section `## Capabilities`
> (en **anglais**) dans `SKILL.md`.
>
> - **Skill atomique** → compétences techniques (`badges`, `write-github-actions`…).
> - **Persona / orchestrateur** → _outcomes_ de workflow, un id par étage de pipeline,
>   - un champ séparé `"composes": [...]` listant les sous-skills orchestrés.
>
> Prototype validé sur `ezai-docs-writer`, déjà étendu à `ezai-project-quality`.

État de conformité actuel des 9 plugins :

| Niveau                             | Plugins                                                   |
| ---------------------------------- | --------------------------------------------------------- |
| ✅ Conforme                        | `ezai-docs-writer`, `ezai-project-quality`                |
| 🟡 Strings + section EN            | `ezai-cicd-expert`, `ezai-code-formatter`                 |
| 🟡 Strings + section FR non normée | `ezai-project-{architect,config,performance}`             |
| 🔴 Absent                          | `ezai-docs-specialist-persona`, `ezai-senior-dev-persona` |

- [x] **Migrer les 5 skills atomiques non conformes** 🟠
      `cicd-expert`, `code-formatter`, `project-{architect,config,performance}` :
      passer les strings en objets `{id, description}` et normaliser la section SKILL.md en
      `## Capabilities` anglais (remplace les `## Capacités` FR).
- [x] **Doter les 2 personas de capabilities + `composes`** 🟠 - `ezai-docs-specialist-persona` : outcomes `docs-audit`, `docs-upgrade-plan`, `docs-apply` ;
      `"composes": ["ezai-docs-writer"]`. - `ezai-senior-dev-persona` : modes d'intervention (`feature-implementation`, `code-review`,
      `architecture-decision`…) ; `"composes": ["ezai-project-architect", "ezai-project-config",
  "ezai-project-performance", "ezai-project-quality", "ezai-cicd-expert"]`.
- [x] **Valider les capabilities dans `build-index.js`** 🟡
      Une fois le format unifié : vérifier que chaque skill composé existe dans le catalogue et,
      à terme, qu'une capability correspond à un fichier de référence. Débloque aussi une sortie
      homogène pour `ezai info <skill>` (et permettra de retirer le patch défensif string/objet de `info.js`).

---

## Phase 3 — Refonte du persona senior-dev (≈ 2–4 h)

- [x] **Aligner `ezai-senior-dev-persona` sur le modèle `docs-specialist-persona`** 🟠
      Le persona senior-dev est resté au format legacy ; il ne partage pas la logique d'orchestration
      adoptée par le persona docs (commit `a36e4d6`). À refondre sur le même socle : - workflow explicite par étapes avec **contrat d'artefacts** numérotés ; - fichiers `references/` dédiés (`pipeline.md`, `report-format.md`) ; - capabilities outcomes + champ `composes` (cf. Phase 2) ; - evals mises à jour en conséquence (cf. Phase 4).

---

## Phase 4 — Evals : format unique + validation (≈ 2–4 h)

> Deux générations cohabitent et **aucun runner** n'existe : les evals sont des specs mortes,
> une assertion cassée passerait inaperçue.

État actuel :

| Format                                                 | Plugins                                                                           |
| ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Moderne (assertions `contains`/`regex`/`not_contains`) | `cicd-expert`, `code-formatter`, `project-{architect,config,performance}`         |
| Legacy (`expected_output` en prose invérifiable)       | `docs-writer`, `docs-specialist-persona`, `project-quality`, `senior-dev-persona` |

- [ ] **Migrer les 4 sets legacy vers le format assertions** 🟠
      `docs-writer` (le skill de référence !), `docs-specialist-persona`, `project-quality`, `senior-dev-persona`.
      ⚠️ Ne **pas** enrichir les evals de `project-quality` (décision user) — migration de format seulement.
- [ ] **Valider le schéma des evals** 🟡
      Au minimum dans `build-index.js` ou la CI ; idéalement un petit `scripts/run-evals.js` exécutable à la demande.
- [ ] **Standardiser les trigger evals** 🟡
      `trigger_evals_final.json` (code-formatter) est un concept précieux mais au nom de brouillon et non généralisé.
      → Soit un `trigger_evals.json` par plugin, soit un champ `should_trigger` / cas négatifs dans le schéma `eval_set`.
      Ajouter des cas négatifs (où le skill ne doit **pas** se déclencher), aujourd'hui absents.

---

## Phase 5 — Robustesse & cosmétique (opportuniste)

- [ ] **`linkToPlatforms` détruit la destination sans vérifier** 🟢 — `install.js:87`
      `fs.rmSync(dest, { recursive: true, force: true })` avant le symlink : un **vrai dossier** homonyme
      dans `~/.claude/skills/` serait supprimé sans avertissement.
      → Ne supprimer silencieusement que si `lstat` indique un symlink/junction, sinon avertir.
- [ ] **Couverture de tests** 🟢
      Sortie polluée par les `console.info/warn` du code de prod ; pas de seuil `collectCoverage` ni de mesure en CI.
      `search.js`, `info.js` et la branche fetch distant de `catalogue.js` sont peu/pas couverts.
- [ ] **`marketplace.json` porte `"version": "1.0.0"`** 🟢
      Si c'est une version de schéma de catalogue, OK ; sinon régénérer via `build-index.js`.
- [ ] **Documenter le bilinguisme assumé** 🟢
      FR (messages CLI, commentaires) / EN (docs, descriptions) : choix non documenté → l'inscrire dans `AGENTS.md`.

---

## Idées de fond (backlog, non priorisé)

### Graphify scopé par skill (partiellement amorcé)

Un graph par plugin dans `plugins/<name>/graphify-out/` plutôt qu'un seul graph racine.
Déjà fait pour `ezai-docs-writer` (42 nœuds, 55 edges). Gain : le routing de `index.md` devient une
requête sémantique (`graphify query "badge registry pour python"`) et `docs-specialist-persona` peut
résoudre dynamiquement les fichiers à charger au lieu des chemins en dur de `pipeline.md` — résistant
aux futures réorgs. Limite : les graphs per-plugin ne se voient pas entre eux ; le graph racine reste
utile pour les relations cross-skills. À généraliser aux autres plugins une fois la Phase 2 stabilisée.
