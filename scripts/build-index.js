#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PLUGINS_DIR = path.join(ROOT, 'plugins');
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
      version: '1.0.0',
      description: 'Marketplace of AI skills for developers',
      owner: { name: 'ezai', email: 'floriansalort@gmail.com' },
      updatedAt: today(),
      plugins: [],
    };
  }

  const entries = fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const pluginJsonPath = path.join(PLUGINS_DIR, d.name, '.claude-plugin', 'plugin.json');
      if (!fs.existsSync(pluginJsonPath)) {
        console.warn(`  [warn] ${d.name} : plugin.json manquant, ignoré.`);
        return null;
      }
      const meta = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
      const entry = {
        name: meta.name,
        description: meta.description || '',
        source: `./plugins/${d.name}`,
        category: meta.category || 'development',
      };
      if (meta.version) entry.version = meta.version;
      if (meta.author) entry.author = meta.author;
      if (meta.capabilities) entry.capabilities = meta.capabilities;
      return entry;
    })
    .filter(Boolean);

  return {
    $schema: 'https://json.schemastore.org/claude-code-marketplace.json',
    name: 'ezai-marketplace',
    version: '1.0.0',
    description: 'Curated marketplace of AI skills for senior developers (Python / JS/TS)',
    owner: { name: 'ezai', email: 'floriansalort@gmail.com' },
    updatedAt: today(),
    plugins: entries,
  };
}

const catalogue = buildIndex();
fs.writeFileSync(OUTPUT, JSON.stringify(catalogue, null, 2), 'utf8');
console.log(`\nCatalogue régénéré : ${catalogue.plugins.length} plugin(s) indexé(s).`);
console.log(`Fichier : ${OUTPUT}\n`);
