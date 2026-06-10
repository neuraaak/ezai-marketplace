const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { DEFAULT_PLATFORMS, resolvePlatforms } = require('../platforms');

function unlinkFromPlatforms(skillNames, platformDirs = DEFAULT_PLATFORMS) {
  for (const platform of platformDirs) {
    const skillsDir = path.join(platform.dir, 'skills');
    for (const skillName of skillNames) {
      const dest = path.join(skillsDir, skillName);
      try {
        if (fs.existsSync(dest)) {
          fs.rmSync(dest, { recursive: true, force: true });
          console.info(`  ✕ ${platform.name.padEnd(12)} → ${dest}`);
        }
      } catch (err) {
        console.warn(
          `  [warn] ${platform.name} : impossible de supprimer le lien pour ${skillName} — ${err.message}`
        );
      }
    }
  }
}

async function runUninstall(skillName, options, catalogue) {
  const baseDestRoot = options.dest || os.homedir();
  const agentsSkillsDir = path.join(baseDestRoot, '.agents', 'skills');

  // Source de vérité : seuls les skills du catalogue peuvent être désinstallés
  const { plugins } = await catalogue.fetchCatalogue();
  const catalogueNames = new Set(plugins.map((p) => p.name));

  let targets;
  if (skillName) {
    if (!catalogueNames.has(skillName)) {
      console.error(`"${skillName}" n'est pas un skill du catalogue ezai.`);
      console.error('Utilisez `ezai list` pour voir les skills disponibles.');
      throw new Error(`"${skillName}" n'est pas un skill du catalogue ezai`);
    }
    const skillDir = path.join(agentsSkillsDir, skillName);
    if (!fs.existsSync(skillDir)) {
      console.error(`Skill "${skillName}" non installé dans ${agentsSkillsDir}`);
      throw new Error(`Skill "${skillName}" non installé`);
    }
    targets = [skillName];
  } else {
    if (!fs.existsSync(agentsSkillsDir)) {
      console.info('Aucun skill installé (dossier .agents/skills/ introuvable).\n');
      return;
    }
    // Intersection : installés ET dans le catalogue
    const installed = fs
      .readdirSync(agentsSkillsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    targets = installed.filter((name) => catalogueNames.has(name));

    if (targets.length === 0) {
      console.info('Aucun skill ezai installé.\n');
      return;
    }
  }

  const platformDirs = options._platformDirs || resolvePlatforms(options);

  // 1. Supprimer les symlinks plateformes en premier
  unlinkFromPlatforms(targets, platformDirs);

  // 2. Supprimer les fichiers dans .agents/skills/
  console.info('');
  for (const name of targets) {
    const skillDir = path.join(agentsSkillsDir, name);
    fs.rmSync(skillDir, { recursive: true, force: true });
    console.info(`  - ${name}`);
  }

  const label = targets.length === 1 ? `"${targets[0]}"` : `${targets.length} skills`;
  console.info(`\n${label} désinstallé(s) de ${agentsSkillsDir}\n`);
}

module.exports = { runUninstall, unlinkFromPlatforms, resolvePlatforms };
