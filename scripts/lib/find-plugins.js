'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Un plugin = tout dossier contenant `.claude-plugin/plugin.json`. Les dossiers
// de regroupement sous plugins/ (personas/, experts/) sont purement
// organisationnels : on les traverse sans jamais les nommer en dur.
function findPluginDirs(pluginsDir) {
  if (!fs.existsSync(pluginsDir)) return [];

  const found = [];
  for (const entry of fs.readdirSync(pluginsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(pluginsDir, entry.name);
    if (fs.existsSync(path.join(dir, '.claude-plugin', 'plugin.json'))) {
      found.push(dir);
    } else {
      found.push(...findPluginDirs(dir));
    }
  }
  return found.sort((a, b) => a.localeCompare(b));
}

// Les deux scripts (build-index, sync-versions) lisent le même plugin.json :
// sans ce wrapper, une virgule en trop avorte le hook pre-commit sur un
// « Unexpected token » qui ne nomme pas le fichier fautif.
function readPluginJson(pluginJsonPath) {
  try {
    return JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
  } catch (e) {
    throw new Error(`${pluginJsonPath} : ${e.message}`, { cause: e });
  }
}

module.exports = { findPluginDirs, readPluginJson };
