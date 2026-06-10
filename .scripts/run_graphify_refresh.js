#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');
const { execSync } = require('node:child_process');
const { wrapCmd } = require('./_env');

// Semantic refresh of the single common graph at repo root.
//
// The post-commit hook already rebuilds the graph AST-only (no API key).
// This script does what the hook can't: rerun clustering and rename the
// communities via the LLM backend. Wrapped in `infisical run` so the API
// key is injected from the vault.

const repoRoot = path.join(__dirname, '..');
const graphPath = path.join(repoRoot, 'graphify-out', 'graph.json');

if (!fs.existsSync(graphPath)) {
  throw new Error(`No graph found at ${graphPath} — run /graphify at the repo root first`);
}

console.info('Re-clustering common graph at repo root...');

execSync(wrapCmd(`graphify cluster-only "${repoRoot}"`), {
  stdio: 'inherit',
  shell: true,
  cwd: repoRoot,
});

console.info('Common graph re-clustered successfully');
