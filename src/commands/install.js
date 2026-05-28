const fs = require('node:fs');
const path = require('node:path');

function assertSafeRelPath(p) {
  if (typeof p !== 'string' || p.length === 0) throw new Error('chemin invalide');
  if (path.isAbsolute(p) || p.split(/[\\/]/).includes('..')) {
    throw new Error(`chemin non sûr détecté : ${p}`);
  }
}

function collectFiles(dir, baseDir, result) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, baseDir, result);
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

  assertSafeRelPath(plugin.path);
  const repoRoot = path.resolve(__dirname, '..', '..');
  const pluginDir = path.join(repoRoot, plugin.path);
  const skillsRelDir = plugin.skills || 'skills/';
  const baseDestRoot = options.dest || process.cwd();

  const skills = collectSkills(pluginDir, skillsRelDir);

  for (const skill of skills) {
    const destDir = path.join(baseDestRoot, '.agents', 'skills', skill.name);
    fs.mkdirSync(destDir, { recursive: true });

    for (const { src, dest } of skill.files) {
      const destFile = path.join(destDir, dest);
      const resolved = path.resolve(destFile);
      if (!resolved.startsWith(path.resolve(destDir) + path.sep)) {
        throw new Error(`tentative d'écriture hors du répertoire cible : ${resolved}`);
      }
      fs.mkdirSync(path.dirname(destFile), { recursive: true });
      fs.copyFileSync(src, destFile);
      console.log(`  + ${skill.name}/${dest}`);
    }
  }

  console.log(
    `\nPlugin "${pluginName}" installé dans ${path.join(baseDestRoot, '.agents', 'skills')}\n`
  );
}

module.exports = {
  assertSafeRelPath,
  resolvePluginFiles,
  buildDestPath,
  runInstall,
  collectSkills,
};
