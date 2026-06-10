'use strict';

// Shared env resolution for dev scripts.
// Priority: infisical (vault) → .env file at repo root → bare (no injection).

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');

function hasInfisical() {
  try {
    execSync('infisical --version', { stdio: 'ignore', shell: true });
    return true;
  } catch {
    return false;
  }
}

function loadDotEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return false;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    if (key && !(key in process.env)) process.env[key] = val;
  }
  return true;
}

// Returns the command prefixed with infisical if available.
// If infisical is absent but .env exists, loads it into process.env and returns cmd bare.
// If neither, returns cmd bare.
function wrapCmd(cmd) {
  if (hasInfisical()) return `infisical run --path=/_API -- ${cmd}`;
  if (loadDotEnv()) {
    console.info('[env] infisical absent — chargement .env');
  } else {
    console.info('[env] infisical absent, pas de .env — lancement sans clé API');
  }
  return cmd;
}

module.exports = { wrapCmd };
