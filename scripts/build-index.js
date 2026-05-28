#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const PLUGINS_DIR = path.join(ROOT, 'plugins');
const OUTPUT = path.join(ROOT, '.claude-plugin', 'marketplace.json');

const REPO_URL = 'https://github.com/Neuraaak/ezai-marketplace.git';
const REPO_REF = 'main';

function today() {
  return new Date().toISOString().split('T')[0];
}

function gitSha() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT }).toString().trim();
  } catch {
    return null;
  }
}

function buildIndex() {
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.log('Dossier plugins/ introuvable. Catalogue vide généré.');
    return { version: '1.0.0', updatedAt: today(), plugins: [] };
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
      const sha = gitSha();
      const gitSource = {
        source: 'git-subdir',
        url: REPO_URL,
        path: `plugins/${d.name}`,
        ref: REPO_REF,
        ...(sha && { sha }),
      };
      return {
        name: meta.name,
        source: gitSource,
        path: `plugins/${d.name}`,
        version: meta.version || '1.0.0',
        description: meta.description || '',
        author: meta.author || {},
        category: meta.category || 'general',
        skills: meta.skills || 'skills/',
      };
    })
    .filter(Boolean);

  return {
    name: 'ezai-marketplace',
    owner: { name: 'ezai' },
    version: '1.0.0',
    updatedAt: today(),
    plugins: entries,
  };
}

const catalogue = buildIndex();
fs.writeFileSync(OUTPUT, JSON.stringify(catalogue, null, 2), 'utf8');
console.log(`\nCatalogue régénéré : ${catalogue.plugins.length} plugin(s) indexé(s).`);
console.log(`Fichier : ${OUTPUT}\n`);
