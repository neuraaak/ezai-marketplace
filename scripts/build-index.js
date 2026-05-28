#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PLUGINS_DIR = path.join(ROOT, 'plugins');
const OUTPUT = path.join(ROOT, '.claude-plugin', 'marketplace.json');

function today() {
  return new Date().toISOString().split('T')[0];
}

function buildIndex() {
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.log('Dossier plugins/ introuvable. Catalogue vide généré.');
    return { version: '1.0.0', updatedAt: today(), plugins: [] };
  }

  const entries = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const pluginJsonPath = path.join(PLUGINS_DIR, d.name, '.claude-plugin', 'plugin.json');
      if (!fs.existsSync(pluginJsonPath)) {
        console.warn(`  [warn] ${d.name} : plugin.json manquant, ignoré.`);
        return null;
      }
      const meta = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
      return {
        name: meta.name,
        version: meta.version || '1.0.0',
        description: meta.description || '',
        category: meta.category || 'general',
        path: `plugins/${d.name}`,
        skills: meta.skills || []
      };
    })
    .filter(Boolean);

  return { version: '1.0.0', updatedAt: today(), plugins: entries };
}

const catalogue = buildIndex();
fs.writeFileSync(OUTPUT, JSON.stringify(catalogue, null, 2), 'utf8');
console.log(`\nCatalogue régénéré : ${catalogue.plugins.length} plugin(s) indexé(s).`);
console.log(`Fichier : ${OUTPUT}\n`);
