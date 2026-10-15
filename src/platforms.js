'use strict';

const os = require('node:os');
const path = require('node:path');

// Nom de plateforme → dossier, relatif à la racine de destination. Résolu par
// resolvePlatforms() : --dest déplace les skills ET leurs liens, sinon un
// install dans un bac à sable laisserait des liens morts dans le home réel.
const PLATFORM_DIRS = [
  { name: 'Claude Code', dir: '.claude' },
  { name: 'Gemini CLI', dir: '.gemini' },
  { name: 'Copilot', dir: '.copilot' },
];

function resolvePlatforms(options = {}) {
  const root = options.dest || os.homedir();
  const deployAll = !options.claude && !options.gemini && !options.copilot;
  return PLATFORM_DIRS.filter(({ name }) => {
    if (deployAll) return true;
    if (options.claude && name === 'Claude Code') return true;
    if (options.gemini && name === 'Gemini CLI') return true;
    if (options.copilot && name === 'Copilot') return true;
    return false;
  }).map(({ name, dir }) => ({ name, dir: path.join(root, dir) }));
}

const DEFAULT_PLATFORMS = resolvePlatforms();

module.exports = { DEFAULT_PLATFORMS, resolvePlatforms };
