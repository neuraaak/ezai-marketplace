'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const DEFAULT_PLATFORMS = [
  { name: 'Claude Code', dir: path.join(os.homedir(), '.claude') },
  { name: 'Gemini CLI', dir: path.join(os.homedir(), '.gemini') },
  { name: 'Copilot', dir: path.join(os.homedir(), '.copilot') },
];

// `--dest` vient de la ligne de commande et sert de racine à des rmSync/mkdirSync :
// il est résolu en absolu et doit désigner un dossier existant, pour qu'une faute
// de frappe ne fabrique pas une arborescence ailleurs sur le disque.
function resolveAgentsSkillsDir(dest) {
  if (dest === undefined || dest === null) {
    return path.join(os.homedir(), '.agents', 'skills');
  }
  if (typeof dest !== 'string' || dest.length === 0) {
    throw new Error('--dest : chemin invalide');
  }
  const root = path.resolve(dest);
  if (!fs.statSync(root, { throwIfNoEntry: false })?.isDirectory()) {
    throw new Error(`--dest : dossier introuvable — ${root}`);
  }
  return path.join(root, '.agents', 'skills');
}

function resolvePlatforms(options = {}) {
  const deployAll = !options.claude && !options.gemini && !options.copilot;
  return DEFAULT_PLATFORMS.filter(({ name }) => {
    if (deployAll) return true;
    if (options.claude && name === 'Claude Code') return true;
    if (options.gemini && name === 'Gemini CLI') return true;
    if (options.copilot && name === 'Copilot') return true;
    return false;
  });
}

module.exports = { DEFAULT_PLATFORMS, resolveAgentsSkillsDir, resolvePlatforms };
