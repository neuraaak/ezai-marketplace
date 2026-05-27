# Design — ezai-marketplace : Marketplace de Skills IA

**Date :** 2026-05-28  
**Statut :** Approuvé

---

## Contexte et objectifs

Un marketplace curated de skills IA (fichiers `.md` pour Claude Code) distribués via un repo Git public. Les utilisateurs finaux non-techniques peuvent browser et installer des skills dans leur dossier `.agents/` via un CLI npm ou un script `.bat`. Le contenu est publié uniquement par l'équipe ezai (plateforme curatée, gratuite).

L'architecture est extensible vers des agents IA complets à terme, mais la V1 cible exclusivement les skills Claude Code (markdown).

---

## Structure du repo

```
ezai-marketplace/
├── .claude-plugin/
│   └── marketplace.json          ← catalogue central (auto-généré par build-index)
├── plugins/
│   └── skill-<nom>/
│       ├── .claude-plugin/
│       │   └── plugin.json       ← métadonnées du plugin
│       └── skills/
│           └── <categorie>/
│               └── SKILL.md      ← le skill Claude Code
├── bin/
│   └── ezai.js                   ← entry point CLI npm
├── lib/
│   └── commands/
│       ├── install.js
│       ├── list.js
│       ├── search.js
│       └── info.js
├── scripts/
│   ├── install.bat               ← fallback pour utilisateurs sans Node
│   └── build-index.bat           ← régénère marketplace.json
├── docs/
│   └── superpowers/specs/
├── package.json
└── .gitignore
```

---

## Format des fichiers de métadonnées

### `plugins/skill-<nom>/.claude-plugin/plugin.json`

```json
{
  "name": "skill-<nom>",
  "version": "1.0.0",
  "description": "Description courte du skill",
  "author": "ezai",
  "category": "<categorie>",
  "skills": ["skills/<categorie>/SKILL.md"]
}
```

### `.claude-plugin/marketplace.json`

Généré automatiquement par `build-index.bat`. Ne pas éditer à la main.

```json
{
  "version": "1.0.0",
  "updatedAt": "2026-05-28",
  "plugins": [
    {
      "name": "skill-<nom>",
      "version": "1.0.0",
      "description": "...",
      "category": "<categorie>",
      "path": "plugins/skill-<nom>"
    }
  ]
}
```

---

## Scripts `.bat`

### `scripts/install.bat <plugin-name> [destination]`

- Vérifie que `plugins/<plugin-name>/` existe
- Crée `.agents/<plugin-name>/` dans la destination (défaut : répertoire courant)
- Copie tous les `*.md` du plugin vers `.agents/<plugin-name>/`
- Affiche confirmation

```
install.bat skill-mon-plugin             → .\.agents\skill-mon-plugin\
install.bat skill-mon-plugin C:\monapp  → C:\monapp\.agents\skill-mon-plugin\
```

### `scripts/build-index.bat`

- Scanne `plugins/*/`
- Lit chaque `plugin.json`
- Régénère `.claude-plugin/marketplace.json`
- À lancer manuellement après chaque ajout de plugin

---

## CLI npm

### Publication

Package npm : `ezai-marketplace`  
Binaire exposé : `ezai`

### Installation

```bash
# Sans installation (recommandé)
npx ezai-marketplace install skill-mon-plugin

# CLI global
npm install -g ezai-marketplace
ezai install skill-mon-plugin
```

### Commandes

| Commande | Description |
|---|---|
| `ezai install <plugin>` | Copie les skills du plugin vers `.agents/` |
| `ezai list` | Liste tous les plugins du catalogue |
| `ezai search <terme>` | Filtre par nom ou catégorie |
| `ezai info <plugin>` | Affiche les métadonnées d'un plugin |

### Comportement du CLI

- Lit `marketplace.json` depuis l'URL raw GitHub (pas en local) → toujours synchronisé sans mise à jour npm
- Destination d'installation : `.agents/` dans le répertoire courant par défaut
- Option `--dest <path>` pour spécifier une destination custom

---

## Flux utilisateur

### Via npm (recommandé)

```bash
npx ezai-marketplace list
npx ezai-marketplace install skill-mon-plugin
# → Skills copiés dans ./.agents/skill-mon-plugin/
```

### Via script bat (fallback)

```bash
git clone https://github.com/ezai/marketplace
cd marketplace
scripts\install.bat skill-mon-plugin
```

---

## Extensibilité future

- **Agents complets** : ajouter un champ `"type": "skill" | "agent"` dans `plugin.json` ; les agents auront leur propre structure de dossier
- **Versioning** : ajouter `ezai install skill-mon-plugin@1.2.0` via tags Git
- **Interface web** : `marketplace.json` est déjà structuré pour alimenter une UI browse
- **Dépendances entre plugins** : champ `"dependencies": []` dans `plugin.json`

---

## Ce qui n'est PAS dans la V1

- Interface web / site vitrine
- Authentification ou comptes utilisateurs
- Monétisation
- Résolution automatique de dépendances entre plugins
- Versioning par tag Git
