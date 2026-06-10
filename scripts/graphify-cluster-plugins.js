#!/usr/bin/env node
'use strict';

// Reruns community detection + report generation on each plugin that already has
// a graphify-out/graph.json. No API key needed — pure local clustering.
// For initial extraction of a plugin graph, use: scripts/graphify-plugin.bat <name>

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const PLUGINS_DIR = path.join(ROOT, 'plugins');

const plugins = fs
  .readdirSync(PLUGINS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => ({
    name: d.name,
    dir: path.join(PLUGINS_DIR, d.name),
    graph: path.join(PLUGINS_DIR, d.name, 'graphify-out', 'graph.json'),
  }));

const ready = plugins.filter((p) => fs.existsSync(p.graph));
const missing = plugins.filter((p) => !fs.existsSync(p.graph));

if (missing.length > 0) {
  console.info(`Skipped (no graph.json): ${missing.map((p) => p.name).join(', ')}`);
  console.info('  → run scripts/graphify-plugin.bat <name> to build a plugin graph first\n');
}

if (ready.length > 0) {
  let ok = 0;
  let failed = 0;

  for (const plugin of ready) {
    console.info(`\nClustering ${plugin.name}...`);
    try {
      execSync(`graphify cluster-only "${plugin.dir}"`, {
        stdio: 'inherit',
        shell: true,
        cwd: ROOT,
      });
      ok++;
    } catch {
      console.warn(`  [warn] cluster-only failed for ${plugin.name}`);
      failed++;
    }
  }

  console.info(`\nDone: ${ok} succeeded${failed > 0 ? `, ${failed} failed` : ''}.`);
} else {
  console.info('No plugin graphs found. Nothing to cluster.');
}
