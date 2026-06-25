#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { findPluginDirs } = require('./lib/find-plugins');

const ROOT = path.resolve(__dirname, '..');
const PLUGINS_DIR = path.join(ROOT, 'plugins');
const { version } = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

let updated = 0;

for (const pluginDir of findPluginDirs(PLUGINS_DIR)) {
  const pluginJsonPath = path.join(pluginDir, '.claude-plugin', 'plugin.json');
  const meta = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
  if (meta.version === version) continue;

  meta.version = version;
  fs.writeFileSync(pluginJsonPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
  console.log(`  version ${path.basename(pluginDir)} → ${version}`);
  updated++;
}

if (updated > 0) console.log(`\n${updated} plugin(s) mis à jour.`);
