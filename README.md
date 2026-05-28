# ezai-marketplace

Marketplace curated de skills IA pour Claude Code.

## Installation

### Via npm (recommandé)

```bash
# Sans installation globale
npx ezai-marketplace install skill-mon-plugin

# CLI global
npm install -g ezai-marketplace
```

### Via script (sans Node.js)

```bash
git clone https://github.com/Neuraaak/ezai-marketplace
cd ezai-marketplace
scripts\install.bat skill-mon-plugin
```

## Commandes

| Commande | Description |
|---|---|
| `ezai list` | Lister tous les plugins disponibles |
| `ezai search <terme>` | Rechercher un plugin par nom ou catégorie |
| `ezai info <plugin>` | Afficher les détails d'un plugin |
| `ezai install <plugin>` | Installer un plugin dans `.agents/` |

### Options

- `--dest <chemin>` : Répertoire de destination (défaut : répertoire courant)

## Structure d'un plugin

```
plugins/skill-mon-plugin/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    └── <categorie>/
        └── SKILL.md
```

### plugin.json

```json
{
  "name": "skill-mon-plugin",
  "version": "1.0.0",
  "description": "Description du skill",
  "author": "ezai",
  "category": "ma-categorie",
  "skills": ["skills/ma-categorie/SKILL.md"]
}
```

## Mettre à jour le catalogue

Après avoir ajouté un plugin dans `plugins/` :

```bash
node scripts/build-index.js
# ou
scripts\build-index.bat
```
