#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');
const { execSync } = require('node:child_process');

// Bootstrap the knowledge-graph DB at repo root if it does not exist yet.
// AST-only extraction (no LLM / no API key needed) — creates graphify-out/graph.json.
// Idempotent: no-op if the graph already exists. Run `graphify:refresh` afterwards
// for semantic clustering and community naming.

const repoRoot = path.join(__dirname, '..');
const graphPath = path.join(repoRoot, 'graphify-out', 'graph.json');

if (fs.existsSync(graphPath)) {
  console.info(`Graph already present at ${graphPath} — nothing to init.`);
} else {
  console.info('Initializing knowledge-graph DB at repo root (AST-only)...');

  execSync(`graphify update --no-cluster "${repoRoot}"`, {
    stdio: 'inherit',
    shell: true,
    cwd: repoRoot,
  });

  console.info('Graph DB initialized — run `pnpm graphify:refresh` for semantic clustering.');
}
