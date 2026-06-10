#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');
const { execSync } = require('node:child_process');
const { wrapCmd } = require('./_env');

// Full AST re-extraction of the repo, wrapped in infisical for API key injection.
// Use when the graph is stale or after structural refactors (rename, delete, move).
// The post-commit hook does incremental updates; this is the full rebuild.

const repoRoot = path.join(__dirname, '..');

if (!fs.existsSync(path.join(repoRoot, 'graphify-out'))) {
  throw new Error('graphify-out/ not found — run /graphify at the repo root first');
}

console.info('Re-extracting full graph at repo root...');

execSync(wrapCmd(`graphify update "${repoRoot}"`), {
  stdio: 'inherit',
  shell: true,
  cwd: repoRoot,
});

console.info('Graph updated successfully');
