#!/usr/bin/env node
'use strict';

// Full graphify extraction scoped to one or all plugins (requires API key).
// Usage: node .scripts/graphify-plugin.js <plugin-name>
//        node .scripts/graphify-plugin.js all
// Env resolution: infisical (vault) → .env root → bare (Windows env vars).

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const { wrapCmd } = require('./_env');

const ROOT = path.resolve(__dirname, '..');
const PLUGINS_DIR = path.join(ROOT, 'plugins');

function allPluginDirs() {
  return fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({ name: d.name, dir: path.join(PLUGINS_DIR, d.name) }));
}

function runGraphify(name, dir) {
  console.info(`\nRunning graphify on ${name} ...`);
  execSync(wrapCmd(`graphify "${dir}"`), { stdio: 'inherit', shell: true, cwd: dir });
}

const arg = process.argv[2];

if (!arg || arg === '--help' || arg === '-h') {
  const available = allPluginDirs()
    .map((p) => `  ${p.name}`)
    .join('\n');
  console.info('Usage: node .scripts/graphify-plugin.js <plugin-name|all>');
  console.info('\nGenerates a graphify knowledge graph scoped to a single plugin.');
  console.info('Use "all" to process every plugin sequentially.');
  console.info('Output is written to plugins/<plugin-name>/graphify-out/\n');
  console.info(`Available plugins:\n${  available}`);
  process.exitCode = arg ? 0 : 1;
} else if (arg === 'all') {
  const plugins = allPluginDirs();
  let ok = 0;
  let failed = 0;
  for (const { name, dir } of plugins) {
    try {
      runGraphify(name, dir);
      ok++;
    } catch {
      console.warn(`  [warn] graphify failed for ${name}`);
      failed++;
    }
  }
  console.info(`\nDone: ${ok} succeeded${failed > 0 ? `, ${failed} failed` : ''}.`);
} else {
  const pluginDir = path.join(PLUGINS_DIR, arg);
  if (fs.existsSync(pluginDir)) {
    runGraphify(arg, pluginDir);
  } else {
    console.error(`Error: plugin '${arg}' not found in plugins/`);
    process.exitCode = 1;
  }
}
