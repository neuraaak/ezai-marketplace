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
    console.info('Dossier plugins/ introuvable. Catalogue vide généré.');
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

// Chaque niveau retourne ses messages au lieu d'incrémenter un compteur partagé :
// le comptage et l'affichage restent à la charge de validateEvals.
function validateAssertion(a, loc) {
  const warnings = [];
  if (!VALID_ASSERTION_TYPES.has(a.type)) {
    warnings.push(
      `${loc} assertion "${a.id ?? '?'}" : type "${a.type}" inconnu (valides : ${[...VALID_ASSERTION_TYPES].join(', ')})`
    );
  }
  if (typeof a.value !== 'string' || a.value.trim() === '') {
    warnings.push(`${loc} assertion "${a.id ?? '?'}" : value manquante`);
  }
  return warnings;
}

function validateEval(ev, prefix) {
  const loc = `${prefix}#${ev.id ?? '?'}`;
  const warnings = [];
  if (typeof ev.id !== 'number') warnings.push(`${loc} : id doit être un number`);
  if (typeof ev.prompt !== 'string' || ev.prompt.trim() === '') {
    warnings.push(`${loc} : prompt manquant`);
  }
  if (!Array.isArray(ev.assertions)) {
    warnings.push(`${loc} : assertions[] absent (requis depuis Phase 4)`);
    return warnings;
  }
  for (const a of ev.assertions) warnings.push(...validateAssertion(a, loc));
  return warnings;
}

function validateEvalFile(filePath, prefix) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [`${prefix} : JSON invalide`];
  }

  const warnings = [];
  if (typeof data.skill_name !== 'string') {
    warnings.push(`${prefix} : champ skill_name manquant ou non-string`);
  }
  if (!Array.isArray(data.evals)) {
    warnings.push(`${prefix} : champ evals[] manquant`);
    return warnings;
  }

  for (const ev of data.evals) warnings.push(...validateEval(ev, prefix));

  if (data.skill_name && !data.skill_name.startsWith('ezai-')) {
    warnings.push(`${prefix} : skill_name "${data.skill_name}" ne commence pas par "ezai-"`);
  }
  return warnings;
}

function validateEvals(pluginsDir) {
  if (!fs.existsSync(pluginsDir)) return;
  const warnings = [];

  for (const pluginDir of findPluginDirs(pluginsDir)) {
    const evalsDir = path.join(pluginDir, 'evals');
    if (!fs.existsSync(evalsDir)) continue;

    for (const file of fs.readdirSync(evalsDir)) {
      if (!file.startsWith('eval_set_') || !file.endsWith('.json')) continue;
      const prefix = `  [eval] ${path.basename(pluginDir)}/${file}`;
      warnings.push(...validateEvalFile(path.join(evalsDir, file), prefix));
    }
  }

  for (const warning of warnings) console.warn(warning);
  if (warnings.length === 0) {
    console.info('  Evals : OK (aucune anomalie de schéma détectée)');
  } else {
    console.warn(`  Evals : ${warnings.length} avertissement(s) de schéma`);
  }
}

const catalogue = buildIndex();
fs.writeFileSync(OUTPUT, JSON.stringify(catalogue, null, 2), 'utf8');
console.info(`\nCatalogue régénéré : ${catalogue.plugins.length} plugin(s) indexé(s).`);
console.info(`Fichier : ${OUTPUT}`);
validateEvals(PLUGINS_DIR);
console.info();
