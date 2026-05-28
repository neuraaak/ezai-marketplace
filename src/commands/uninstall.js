const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const DEFAULT_PLATFORMS = [
  { name: 'Claude Code', dir: path.join(os.homedir(), '.claude') },
  { name: 'Gemini CLI', dir: path.join(os.homedir(), '.gemini') },
  { name: 'Copilot', dir: path.join(os.homedir(), '.copilot') },
];

function resolvePlatforms(options = {}) {
  const removeAll = !options.claude && !options.gemini && !options.copilot;
  return DEFAULT_PLATFORMS.filter(({ name }) => {
    if (removeAll) return true;
    if (options.claude && name === 'Claude Code') return true;
    if (options.gemini && name === 'Gemini CLI') return true;
    if (options.copilot && name === 'Copilot') return true;
    return false;
  });
}

function unlinkFromPlatforms(skillNames, platformDirs = DEFAULT_PLATFORMS) {
  for (const platform of platformDirs) {
    const skillsDir = path.join(platform.dir, 'skills');
    for (const skillName of skillNames) {
      const dest = path.join(skillsDir, skillName);
      try {
        if (fs.existsSync(dest)) {
          fs.rmSync(dest, { recursive: true, force: true });
          console.log(`  ✕ ${platform.name.padEnd(12)} → ${dest}`);
        }
      } catch (err) {
        console.warn(
          `  [warn] ${platform.name} : impossible de supprimer le lien pour ${skillName} — ${err.message}`
        );
      }
    }
  }
}

async function runUninstall(skillName, options) {
  const baseDestRoot = options.dest || process.cwd();
  const agentsSkillsDir = path.join(baseDestRoot, '.agents', 'skills');

  if (!fs.existsSync(agentsSkillsDir)) {
    console.log('Aucun skill installé (dossier .agents/skills/ introuvable).\n');
    return;
  }

  let targets;
  if (skillName) {
    const skillDir = path.join(agentsSkillsDir, skillName);
    if (!fs.existsSync(skillDir)) {
      console.error(`Skill "${skillName}" non trouvé dans ${agentsSkillsDir}`);
      process.exit(1);
    }
    targets = [skillName];
  } else {
    targets = fs
      .readdirSync(agentsSkillsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    if (targets.length === 0) {
      console.log('Aucun skill installé.\n');
      return;
    }
  }

  const platformDirs = options._platformDirs || resolvePlatforms(options);

  for (const name of targets) {
    const skillDir = path.join(agentsSkillsDir, name);
    fs.rmSync(skillDir, { recursive: true, force: true });
    console.log(`  - ${name}`);
  }

  console.log('');
  unlinkFromPlatforms(targets, platformDirs);

  const label = targets.length === 1 ? `"${targets[0]}"` : `${targets.length} skills`;
  console.log(`\n${label} désinstallé(s) de ${agentsSkillsDir}\n`);
}

module.exports = { runUninstall, unlinkFromPlatforms, resolvePlatforms };
