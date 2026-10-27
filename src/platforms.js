const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Codex, Gemini CLI, Copilot CLI, Vibe et Kimi Code découvrent ~/.agents/skills/
// nativement : leur lien n'apporte rien. Claude Code ne lit que ~/.claude/skills/,
// d'où le seul lien à créer.
const DEFAULT_PLATFORMS = [{ name: 'Claude Code', dir: path.join(os.homedir(), '.claude') }];

// `--dest` vient de la ligne de commande et sert de racine à des rmSync/mkdirSync :
// il est résolu en absolu et doit désigner un dossier existant, pour qu'une faute
// de frappe ne fabrique pas une arborescence ailleurs sur le disque.
function isWithin(parent, child) {
  const relative = path.relative(parent, child);
  return (
    relative === '' ||
    (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
  );
}

function resolveAgentsSkillsDir(dest) {
  if (dest === undefined || dest === null) {
    return path.join(os.homedir(), '.agents', 'skills');
  }
  if (typeof dest !== 'string' || dest.length === 0) {
    throw new Error('--dest : chemin invalide');
  }
  const root = path.resolve(dest);
  const extraRoot = process.env.EZAI_ALLOWED_DEST_ROOT;
  if (extraRoot && !path.isAbsolute(extraRoot)) {
    throw new Error('EZAI_ALLOWED_DEST_ROOT : chemin absolu requis');
  }
  const allowedRoots = [os.homedir(), process.cwd(), extraRoot]
    .filter(Boolean)
    .map((value) => path.resolve(value));
  if (!allowedRoots.some((value) => isWithin(value, root))) {
    throw new Error(`--dest : dossier hors des emplacements autorisés — ${root}`);
  }
  if (!fs.statSync(root, { throwIfNoEntry: false })?.isDirectory()) {
    throw new Error(`--dest : dossier introuvable — ${root}`);
  }
  const canonicalRoot = fs.realpathSync(root);
  if (
    !allowedRoots.some(
      (value) => isWithin(value, root) && isWithin(fs.realpathSync(value), canonicalRoot)
    )
  ) {
    throw new Error(`--dest : dossier hors des emplacements autorisés — ${root}`);
  }
  const agentsDir = path.join(root, '.agents');
  const skillsDir = path.join(agentsDir, 'skills');
  for (const dir of [agentsDir, skillsDir]) {
    if (
      fs.statSync(dir, { throwIfNoEntry: false }) &&
      !isWithin(canonicalRoot, fs.realpathSync(dir))
    ) {
      throw new Error(`--dest : dossier hors des emplacements autorisés — ${dir}`);
    }
  }
  return skillsDir;
}

function resolvePlatforms(options = {}) {
  if (options.links === false) {
    if (options.claude) {
      throw new Error('--no-links : incompatible avec --claude');
    }
    return [];
  }
  return [...DEFAULT_PLATFORMS];
}

module.exports = {
  DEFAULT_PLATFORMS,
  resolveAgentsSkillsDir,
  resolvePlatforms,
};
