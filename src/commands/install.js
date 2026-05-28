const fs = require('node:fs');
const path = require('node:path');

function assertSafeRelPath(p) {
  if (typeof p !== 'string' || p.length === 0) throw new Error('chemin invalide');
  if (path.isAbsolute(p) || p.split(/[\\/]/).includes('..')) {
    throw new Error(`chemin non sûr détecté : ${p}`);
  }
}

function collectFiles(dir, pluginDir, result) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, pluginDir, result);
    } else {
      const dest = path.relative(pluginDir, fullPath).replace(/\\/g, '/');
      result.push({ src: fullPath, dest });
    }
  }
}

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

  const repoRoot = path.resolve(__dirname, '..', '..');
  const destRoot = buildDestPath(pluginName, options.dest);
  const files = resolvePluginFiles(plugin, repoRoot);

  fs.mkdirSync(destRoot, { recursive: true });

  for (const { src, dest } of files) {
    const destFile = path.join(destRoot, dest);
    const resolved = path.resolve(destFile);
    if (!resolved.startsWith(path.resolve(destRoot) + path.sep)) {
      throw new Error(`tentative d'écriture hors du répertoire cible : ${resolved}`);
    }
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.copyFileSync(src, destFile);
    console.log(`  + ${dest}`);
  }

  console.log(`\nPlugin "${pluginName}" installe dans ${destRoot}\n`);
}

module.exports = { assertSafeRelPath, resolvePluginFiles, buildDestPath, runInstall };
