const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { resolvePlatforms } = require('../platforms');
const { unlinkFromPlatforms } = require('./uninstall');

const MANAGED_PREFIX = 'ezai-';

// Recense tous les skills « gérés » (préfixe ezai-) actuellement présents, qu'ils
// soient encore dans le catalogue ou devenus obsolètes (renommés / retirés). On
// scanne .agents/skills/ ET chaque dossier skills/ de plateforme pour attraper
// aussi un symlink dont la cible .agents a déjà disparu.
function collectManagedSkills(agentsSkillsDir, platformDirs) {
  const managed = new Set();

  const scan = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(MANAGED_PREFIX)) managed.add(entry.name);
    }
  };

  scan(agentsSkillsDir);
  for (const platform of platformDirs) {
    scan(path.join(platform.dir, 'skills'));
  }

  return [...managed].sort((a, b) => a.localeCompare(b));
}

async function runPurge(options, catalogue) {
  const baseDestRoot = options.dest || os.homedir();
  const agentsSkillsDir = path.join(baseDestRoot, '.agents', 'skills');
  const platformDirs = options._platformDirs || resolvePlatforms(options);

  // Obsolète = skill géré (ezai-) présent en local mais absent du catalogue courant.
  const { plugins } = await catalogue.fetchCatalogue();
  const catalogueNames = new Set(plugins.map((p) => p.name));
  const managed = collectManagedSkills(agentsSkillsDir, platformDirs);
  const stale = managed.filter((name) => !catalogueNames.has(name));

  if (stale.length === 0) {
    console.info('Aucun skill obsolète à purger.\n');
    return;
  }

  // 1. Supprimer les symlinks plateformes en premier.
  console.info('Purge des skills obsolètes :');
  unlinkFromPlatforms(stale, platformDirs);

  // 2. Supprimer les dossiers dans .agents/skills/.
  console.info('');
  for (const name of stale) {
    const skillDir = path.join(agentsSkillsDir, name);
    if (fs.existsSync(skillDir)) {
      fs.rmSync(skillDir, { recursive: true, force: true });
    }
    console.info(`  - ${name}`);
  }

  const label = stale.length === 1 ? `"${stale[0]}"` : `${stale.length} skills obsolètes`;
  console.info(`\n${label} purgé(s).\n`);
}

module.exports = { runPurge, collectManagedSkills, MANAGED_PREFIX };
