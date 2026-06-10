#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PLUGINS_DIR = path.join(ROOT, 'plugins');
const { version } = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

let updated = 0;

for (const entry of fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const pluginJsonPath = path.join(PLUGINS_DIR, entry.name, '.claude-plugin', 'plugin.json');
  if (!fs.existsSync(pluginJsonPath)) continue;

  const meta = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
  if (meta.version === version) continue;

  meta.version = version;
  fs.writeFileSync(pluginJsonPath, `${JSON.stringify(meta, null, 2)  }\n`, 'utf8');
  console.log(`  version ${entry.name} → ${version}`);
  updated++;
}

if (updated > 0) console.log(`\n${updated} plugin(s) mis à jour.`);
