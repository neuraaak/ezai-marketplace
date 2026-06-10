const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { DEFAULT_PLATFORMS, resolvePlatforms } = require('../platforms');

function assertSafeRelPath(p) {
  if (typeof p !== 'string' || p.length === 0) throw new Error('chemin invalide');
  if (path.isAbsolute(p) || p.split(/[\\/]/).includes('..')) {
    throw new Error(`chemin non sûr détecté : ${p}`);
  }
}

function collectFiles(dir, baseDir, result, excludeDirs = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (excludeDirs.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, baseDir, result, excludeDirs);
    } else {
      const dest = path.relative(baseDir, fullPath).replaceAll('\\', '/');
      result.push({ src: fullPath, dest });
    }
  }
}

function linkToPlatforms(skillNames, agentsDir, platformDirs = DEFAULT_PLATFORMS) {
  const symlinkType = process.platform === 'win32' ? 'junction' : 'dir';
  let linked = 0;

  for (const platform of platformDirs) {
    if (!fs.existsSync(platform.dir)) continue;

    const skillsDir = path.join(platform.dir, 'skills');
    try {
      fs.mkdirSync(skillsDir, { recursive: true });
    } catch {
      console.warn(`  [warn] ${platform.name} : impossible de créer ${skillsDir}`);
      continue;
    }

    for (const skillName of skillNames) {
      const src = path.resolve(path.join(agentsDir, skillName));
      const dest = path.join(skillsDir, skillName);
      try {
        try {
          fs.readlinkSync(dest);
          fs.rmSync(dest, { recursive: true, force: true });
        } catch (e) {
          if (e.code === 'ENOENT') {
            // dest n'existe pas — ok
          } else if (e.code === 'EINVAL') {
            // vrai dossier (pas un lien) — ne pas supprimer
            console.warn(
              `  [warn] ${platform.name} : ${dest} est un dossier réel, non remplacé — supprimez-le manuellement si nécessaire`
            );
            continue;
          } else {
            throw e;
          }
        }
        fs.symlinkSync(src, dest, symlinkType);
        console.info(`  ↔ ${platform.name.padEnd(12)} → ${dest}`);
        linked++;
      } catch (err) {
        console.warn(
          `  [warn] ${platform.name} : impossible de créer le lien pour ${skillName} — ${err.message}`
        );
      }
    }
  }

  if (linked > 0) console.info('');
}

async function runInstall(pluginName, options, catalogue) {
  const { plugins } = await catalogue.fetchCatalogue();

  const targets = pluginName ? plugins.filter((p) => p.name === pluginName) : plugins;

  if (pluginName && targets.length === 0) {
    console.error(`Plugin "${pluginName}" introuvable dans le catalogue.`);
    console.error('Utilisez `ezai list` pour voir les plugins disponibles.');
    throw new Error(`Plugin "${pluginName}" introuvable`);
  }

  const baseDestRoot = options.dest || os.homedir();
  const agentsSkillsDir = path.join(baseDestRoot, '.agents', 'skills');
  const platformDirs = resolvePlatforms(options);
  const installedNames = [];

  for (const plugin of targets) {
    const rawSource = plugin.source;
    const pluginRelPath = (
      typeof rawSource === 'string' ? rawSource : rawSource?.path || plugin.path || ''
    ).replace(/^\.\//, '');
    assertSafeRelPath(pluginRelPath);
    const repoRoot = path.resolve(__dirname, '..', '..');
    const pluginDir = path.join(repoRoot, pluginRelPath);
    const destDir = path.join(agentsSkillsDir, plugin.name);
    fs.mkdirSync(destDir, { recursive: true });

    const files = [];
    collectFiles(pluginDir, pluginDir, files, ['.claude-plugin']);

    for (const { src, dest } of files) {
      const destFile = path.join(destDir, dest);
      const resolved = path.resolve(destFile);
      if (!resolved.startsWith(path.resolve(destDir) + path.sep)) {
        throw new Error(`tentative d'écriture hors du répertoire cible : ${resolved}`);
      }
      fs.mkdirSync(path.dirname(destFile), { recursive: true });
      fs.copyFileSync(src, destFile);
      console.info(`  + ${plugin.name}/${dest}`);
    }
    installedNames.push(plugin.name);
  }

  console.info('');
  linkToPlatforms(installedNames, agentsSkillsDir, platformDirs);

  const label =
    installedNames.length === 1 ? `"${installedNames[0]}"` : `${installedNames.length} plugins`;
  console.info(`${label} installé(s) dans ${agentsSkillsDir}\n`);
}

module.exports = { assertSafeRelPath, runInstall, linkToPlatforms };
