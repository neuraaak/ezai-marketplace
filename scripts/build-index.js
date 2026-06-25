#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { findPluginDirs } = require('./lib/find-plugins');

const ROOT = path.resolve(__dirname, '..');
const PLUGINS_DIR = path.join(ROOT, 'plugins');
const { version: PKG_VERSION } = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
);
const OUTPUT = path.join(ROOT, '.claude-plugin', 'marketplace.json');

function today() {
  return new Date().toISOString().split('T')[0];
}

function buildIndex() {
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.log('Dossier plugins/ introuvable. Catalogue vide généré.');
    return {
      $schema: 'https://json.schemastore.org/claude-code-marketplace.json',
      name: 'ezai-marketplace',
      version: PKG_VERSION,
      description: 'Marketplace of AI skills for developers',
      owner: { name: 'ezai', email: 'floriansalort@gmail.com' },
      updatedAt: today(),
      plugins: [],
    };
  }

  const entries = findPluginDirs(PLUGINS_DIR)
    .map((pluginDir) => {
      const pluginJsonPath = path.join(pluginDir, '.claude-plugin', 'plugin.json');
      const meta = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
      const relSource = path.relative(ROOT, pluginDir).replaceAll('\\', '/');
      const entry = {
        name: meta.name,
        description: meta.description || '',
        source: `./${relSource}`,
        category: meta.category || 'development',
      };
      if (meta.version) entry.version = meta.version;
      if (meta.author) entry.author = meta.author;
      if (meta.capabilities) entry.capabilities = meta.capabilities;
      if (meta.composes) entry.composes = meta.composes;
      return entry;
    })
    .filter(Boolean);

  return {
    $schema: 'https://json.schemastore.org/claude-code-marketplace.json',
    name: 'ezai-marketplace',
    version: PKG_VERSION,
    description: 'Curated marketplace of AI skills for senior developers (Python / JS/TS)',
    owner: { name: 'ezai', email: 'floriansalort@gmail.com' },
    updatedAt: today(),
    plugins: entries,
  };
}

const VALID_ASSERTION_TYPES = new Set([
  'contains',
  'regex',
  'not_contains',
  'import_order',
  'no_logic_change',
]);

function validateEvals(pluginsDir) {
  if (!fs.existsSync(pluginsDir)) return;
  let warnings = 0;

  for (const pluginDir of findPluginDirs(pluginsDir)) {
    const dirName = path.basename(pluginDir);
    const evalsDir = path.join(pluginDir, 'evals');
    if (!fs.existsSync(evalsDir)) continue;

    for (const file of fs.readdirSync(evalsDir)) {
      if (!file.startsWith('eval_set_') || !file.endsWith('.json')) continue;
      const filePath = path.join(evalsDir, file);
      let data;
      try {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch {
        console.warn(`  [eval] ${dirName}/${file} : JSON invalide`);
        warnings++;
        continue;
      }

      const prefix = `  [eval] ${dirName}/${file}`;
      if (typeof data.skill_name !== 'string') {
        console.warn(`${prefix} : champ skill_name manquant ou non-string`);
        warnings++;
      }
      if (!Array.isArray(data.evals)) {
        console.warn(`${prefix} : champ evals[] manquant`);
        warnings++;
        continue;
      }

      for (const ev of data.evals) {
        const loc = `${prefix}#${ev.id ?? '?'}`;
        if (typeof ev.id !== 'number') {
          console.warn(`${loc} : id doit être un number`);
          warnings++;
        }
        if (typeof ev.prompt !== 'string' || ev.prompt.trim() === '') {
          console.warn(`${loc} : prompt manquant`);
          warnings++;
        }
        if (!Array.isArray(ev.assertions)) {
          console.warn(`${loc} : assertions[] absent (requis depuis Phase 4)`);
          warnings++;
          continue;
        }
        for (const a of ev.assertions) {
          if (!VALID_ASSERTION_TYPES.has(a.type)) {
            console.warn(
              `${loc} assertion "${a.id ?? '?'}" : type "${a.type}" inconnu (valides : ${[...VALID_ASSERTION_TYPES].join(', ')})`
            );
            warnings++;
          }
          if (typeof a.value !== 'string' || a.value.trim() === '') {
            console.warn(`${loc} assertion "${a.id ?? '?'}" : value manquante`);
            warnings++;
          }
        }
      }

      if (data.skill_name && !data.skill_name.startsWith('ezai-')) {
        console.warn(`${prefix} : skill_name "${data.skill_name}" ne commence pas par "ezai-"`);
        warnings++;
      }
    }
  }

  if (warnings === 0) {
    console.log('  Evals : OK (aucune anomalie de schéma détectée)');
  } else {
    console.warn(`  Evals : ${warnings} avertissement(s) de schéma`);
  }
}

const catalogue = buildIndex();
fs.writeFileSync(OUTPUT, JSON.stringify(catalogue, null, 2), 'utf8');
console.log(`\nCatalogue régénéré : ${catalogue.plugins.length} plugin(s) indexé(s).`);
console.log(`Fichier : ${OUTPUT}`);
validateEvals(PLUGINS_DIR);
console.log();
