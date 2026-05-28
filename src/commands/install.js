const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

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
      const dest = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      result.push({ src: fullPath, dest });
    }
  }
}

// Résout les fichiers d'un plugin (à plat) — utilisé pour la validation de chemins.
function resolvePluginFiles(pluginEntry, repoRoot) {
  assertSafeRelPath(pluginEntry.path);
  const pluginDir = path.join(repoRoot, pluginEntry.path);
  const skillsField = pluginEntry.skills || 'skills/';
  const skillsDirs = Array.isArray(skillsField) ? skillsField : [skillsField];

  const files = [];
  for (const skillDir of skillsDirs) {
    const normalized = skillDir.replace(/\/$/, '') || 'skills';
    assertSafeRelPath(normalized);
    const absDir = path.join(pluginDir, skillDir);
    if (fs.existsSync(absDir)) {
      collectFiles(absDir, pluginDir, files);
    }
  }
  return files;
}

// Retourne chaque skill comme unité indépendante : [{ name, files }]
function collectSkills(pluginDir, skillsRelDir) {
  const normalized = skillsRelDir.replace(/\/$/, '') || 'skills';
  assertSafeRelPath(normalized);
  const skillsAbsDir = path.join(pluginDir, skillsRelDir);
  if (!fs.existsSync(skillsAbsDir)) return [];

  return fs
    .readdirSync(skillsAbsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const skillAbsDir = path.join(skillsAbsDir, d.name);
      const files = [];
      collectFiles(skillAbsDir, skillAbsDir, files);
      return { name: d.name, files };
    });
}

const DEFAULT_PLATFORMS = [
  { name: 'Claude Code', dir: path.join(os.homedir(), '.claude') },
  { name: 'Gemini CLI', dir: path.join(os.homedir(), '.gemini') },
  { name: 'Copilot', dir: path.join(os.homedir(), '.copilot') },
];

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
        fs.rmSync(dest, { recursive: true, force: true });
        fs.symlinkSync(src, dest, symlinkType);
        console.log(`  ↔ ${platform.name.padEnd(12)} → ${dest}`);
        linked++;
      } catch (err) {
        console.warn(
          `  [warn] ${platform.name} : impossible de créer le lien pour ${skillName} — ${err.message}`
        );
      }
    }
  }

  if (linked > 0) console.log('');
}

function buildDestPath(pluginName, destRoot) {
  const base = destRoot || process.cwd();
  return path.join(base, '.agents', pluginName);
}

async function runInstall(pluginName, options, catalogue) {
  const { plugins } = await catalogue.fetchCatalogue();
  const plugin = plugins.find((p) => p.name === pluginName);

  if (!plugin) {
    console.error(`Plugin "${pluginName}" introuvable dans le catalogue.`);
    console.error('Utilisez `ezai list` pour voir les plugins disponibles.');
    process.exit(1);
  }

  const pluginRelPath = (plugin.source || plugin.path || '').replace(/^\.\//, '');
  assertSafeRelPath(pluginRelPath);
  const repoRoot = path.resolve(__dirname, '..', '..');
  const pluginDir = path.join(repoRoot, pluginRelPath);
  const baseDestRoot = options.dest || process.cwd();

  const destDir = path.join(baseDestRoot, '.agents', 'skills', pluginName);
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
    console.log(`  + ${pluginName}/${dest}`);
  }

  const agentsSkillsDir = path.join(baseDestRoot, '.agents', 'skills');
  console.log('');
  linkToPlatforms([pluginName], agentsSkillsDir);

  console.log(`Plugin "${pluginName}" installé dans ${agentsSkillsDir}\n`);
}

module.exports = {
  assertSafeRelPath,
  resolvePluginFiles,
  buildDestPath,
  runInstall,
  collectSkills,
  linkToPlatforms,
};
