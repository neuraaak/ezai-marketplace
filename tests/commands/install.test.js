const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  resolvePluginFiles,
  buildDestPath,
  assertSafeRelPath,
  collectSkills,
  linkToPlatforms,
  resolvePlatforms,
} = require('../../src/commands/install');

// --- helpers ---

function makeTmpPlugin(base) {
  const pluginDir = path.join(base, 'plugins', 'skill-test');
  return pluginDir;
}

function mkSkill(pluginDir, skillName, files = ['SKILL.md']) {
  const skillDir = path.join(pluginDir, 'skills', skillName);
  fs.mkdirSync(skillDir, { recursive: true });
  for (const f of files) {
    const fullPath = path.join(skillDir, f);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, `# ${skillName}/${f}`);
  }
}

// --- resolvePluginFiles ---

describe('resolvePluginFiles', () => {
  let tmpDir;
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-test-'));
  });
  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('scanne le dossier skills/ et retourne les fichiers trouvés', () => {
    const pluginDir = makeTmpPlugin(tmpDir);
    mkSkill(pluginDir, 'test');

    const files = resolvePluginFiles(
      { name: 'skill-test', path: 'plugins/skill-test', skills: 'skills/' },
      tmpDir
    );

    expect(files).toHaveLength(1);
    expect(files[0].src).toBe(path.join(pluginDir, 'skills', 'test', 'SKILL.md'));
    expect(files[0].dest).toBe('skills/test/SKILL.md');
  });

  it('scanne plusieurs fichiers dans des sous-dossiers', () => {
    const pluginDir = makeTmpPlugin(tmpDir);
    mkSkill(pluginDir, 'a');
    mkSkill(pluginDir, 'b', ['SKILL.md', 'references/ref.md']);

    const files = resolvePluginFiles(
      { name: 'skill-test', path: 'plugins/skill-test', skills: 'skills/' },
      tmpDir
    );

    expect(files).toHaveLength(3);
    const dests = files.map((f) => f.dest).sort();
    expect(dests).toEqual(
      ['skills/a/SKILL.md', 'skills/b/SKILL.md', 'skills/b/references/ref.md'].sort()
    );
  });

  it('retourne un tableau vide si le dossier skills/ est absent', () => {
    const pluginDir = makeTmpPlugin(tmpDir);
    fs.mkdirSync(pluginDir, { recursive: true });

    const files = resolvePluginFiles(
      { name: 'skill-test', path: 'plugins/skill-test', skills: 'skills/' },
      tmpDir
    );
    expect(files).toHaveLength(0);
  });
});

// --- collectSkills ---

describe('collectSkills', () => {
  let tmpDir;
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-test-'));
  });
  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('retourne un skill par sous-dossier', () => {
    mkSkill(tmpDir, 'code-formatter');
    mkSkill(tmpDir, 'docs-writer');

    const skills = collectSkills(tmpDir, 'skills/');

    expect(skills).toHaveLength(2);
    const names = skills.map((s) => s.name).sort();
    expect(names).toEqual(['code-formatter', 'docs-writer']);
  });

  it('les fichiers de chaque skill sont relatifs à leur propre dossier', () => {
    mkSkill(tmpDir, 'code-formatter', ['SKILL.md', 'references/index.md']);

    const skills = collectSkills(tmpDir, 'skills/');
    const skill = skills.find((s) => s.name === 'code-formatter');

    expect(skill.files.map((f) => f.dest).sort()).toEqual(
      ['SKILL.md', 'references/index.md'].sort()
    );
  });

  it('retourne [] si le dossier skills/ est absent', () => {
    fs.mkdirSync(tmpDir, { recursive: true });
    expect(collectSkills(tmpDir, 'skills/')).toHaveLength(0);
  });

  it('lève une erreur si le skills dir contient ..', () => {
    expect(() => collectSkills(tmpDir, '../../outside/')).toThrow('chemin non sûr');
  });
});

// --- assertSafeRelPath ---

describe('assertSafeRelPath', () => {
  it('accepte un chemin relatif normal', () => {
    expect(() => assertSafeRelPath('skills/test/SKILL.md')).not.toThrow();
  });
  it('rejette un chemin absolu', () => {
    expect(() => assertSafeRelPath('/etc/passwd')).toThrow('chemin non sûr');
  });
  it('rejette une traversée parent (..)', () => {
    expect(() => assertSafeRelPath('../../etc/passwd')).toThrow('chemin non sûr');
  });
  it('rejette une chaîne vide', () => {
    expect(() => assertSafeRelPath('')).toThrow('chemin invalide');
  });
});

// --- resolvePluginFiles path traversal ---

describe('resolvePluginFiles — path traversal', () => {
  it('lève une erreur si le path du plugin contient ..', () => {
    expect(() => resolvePluginFiles({ path: '../../outside', skills: 'skills/' }, '/repo')).toThrow(
      'chemin non sûr'
    );
  });
  it('lève une erreur si le skills dir contient ..', () => {
    expect(() =>
      resolvePluginFiles({ path: 'plugins/skill-test', skills: '../../outside/' }, '/repo')
    ).toThrow('chemin non sûr');
  });
});

// --- linkToPlatforms ---

describe('linkToPlatforms', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-link-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function makeSkillInAgents(agentsDir, skillName) {
    const skillDir = path.join(agentsDir, skillName);
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), `# ${skillName}`);
    return skillDir;
  }

  it('crée un symlink dans chaque plateforme détectée', () => {
    const agentsDir = path.join(tmpDir, 'agents');
    makeSkillInAgents(agentsDir, 'ezai-code-formatter');

    const platformA = path.join(tmpDir, 'platformA');
    const platformB = path.join(tmpDir, 'platformB');
    fs.mkdirSync(platformA);
    fs.mkdirSync(platformB);

    linkToPlatforms(['ezai-code-formatter'], agentsDir, [
      { name: 'Platform A', dir: platformA },
      { name: 'Platform B', dir: platformB },
    ]);

    expect(fs.existsSync(path.join(platformA, 'skills', 'ezai-code-formatter', 'SKILL.md'))).toBe(
      true
    );
    expect(fs.existsSync(path.join(platformB, 'skills', 'ezai-code-formatter', 'SKILL.md'))).toBe(
      true
    );
  });

  it("crée le dossier skills/ s'il n'existe pas", () => {
    const agentsDir = path.join(tmpDir, 'agents');
    makeSkillInAgents(agentsDir, 'ezai-docs-writer');

    const platform = path.join(tmpDir, 'platform');
    fs.mkdirSync(platform);

    linkToPlatforms(['ezai-docs-writer'], agentsDir, [{ name: 'P', dir: platform }]);

    expect(fs.existsSync(path.join(platform, 'skills', 'ezai-docs-writer', 'SKILL.md'))).toBe(true);
  });

  it('écrase un symlink existant', () => {
    const agentsDir = path.join(tmpDir, 'agents');
    makeSkillInAgents(agentsDir, 'ezai-code-formatter');

    const platform = path.join(tmpDir, 'platform');
    const skillsDir = path.join(platform, 'skills');
    const dest = path.join(skillsDir, 'ezai-code-formatter');
    fs.mkdirSync(skillsDir, { recursive: true });
    const decoy = path.join(tmpDir, 'decoy');
    fs.mkdirSync(decoy);
    const symlinkType = process.platform === 'win32' ? 'junction' : 'dir';
    fs.symlinkSync(decoy, dest, symlinkType);

    linkToPlatforms(['ezai-code-formatter'], agentsDir, [{ name: 'P', dir: platform }]);

    expect(fs.existsSync(path.join(dest, 'SKILL.md'))).toBe(true);
  });

  it('ignore les plateformes dont le répertoire racine est absent', () => {
    const agentsDir = path.join(tmpDir, 'agents');
    makeSkillInAgents(agentsDir, 'ezai-code-formatter');

    const missingPlatform = path.join(tmpDir, 'does-not-exist');

    expect(() =>
      linkToPlatforms(['ezai-code-formatter'], agentsDir, [{ name: 'Ghost', dir: missingPlatform }])
    ).not.toThrow();

    expect(fs.existsSync(path.join(missingPlatform, 'skills'))).toBe(false);
  });

  it("continue sur les autres plateformes si l'une échoue", () => {
    const agentsDir = path.join(tmpDir, 'agents');
    makeSkillInAgents(agentsDir, 'ezai-code-formatter');

    const goodPlatform = path.join(tmpDir, 'good');
    fs.mkdirSync(goodPlatform);

    const badPlatform = path.join(tmpDir, 'bad');
    fs.mkdirSync(badPlatform);
    fs.writeFileSync(path.join(badPlatform, 'skills'), 'not-a-dir');

    expect(() =>
      linkToPlatforms(['ezai-code-formatter'], agentsDir, [
        { name: 'Bad', dir: badPlatform },
        { name: 'Good', dir: goodPlatform },
      ])
    ).not.toThrow();

    expect(
      fs.existsSync(path.join(goodPlatform, 'skills', 'ezai-code-formatter', 'SKILL.md'))
    ).toBe(true);
  });
});

// --- resolvePlatforms ---

describe('resolvePlatforms', () => {
  it('retourne toutes les plateformes par défaut (aucun flag)', () => {
    const result = resolvePlatforms({});
    expect(result.map((p) => p.name)).toEqual(['Claude Code', 'Gemini CLI', 'Copilot']);
  });

  it('filtre uniquement Claude Code avec --claude', () => {
    const result = resolvePlatforms({ claude: true });
    expect(result.map((p) => p.name)).toEqual(['Claude Code']);
  });

  it('filtre uniquement Gemini CLI avec --gemini', () => {
    const result = resolvePlatforms({ gemini: true });
    expect(result.map((p) => p.name)).toEqual(['Gemini CLI']);
  });

  it('filtre uniquement Copilot avec --copilot', () => {
    const result = resolvePlatforms({ copilot: true });
    expect(result.map((p) => p.name)).toEqual(['Copilot']);
  });

  it('combine plusieurs flags', () => {
    const result = resolvePlatforms({ claude: true, copilot: true });
    expect(result.map((p) => p.name)).toEqual(['Claude Code', 'Copilot']);
  });
});

// --- buildDestPath ---

describe('buildDestPath', () => {
  it('construit le chemin de destination dans .agents/', () => {
    expect(buildDestPath('skill-test', '/my/project')).toBe(
      path.join('/my/project', '.agents', 'skill-test')
    );
  });
  it('utilise le répertoire courant si pas de dest fourni', () => {
    expect(buildDestPath('skill-test')).toBe(path.join(process.cwd(), '.agents', 'skill-test'));
  });
});
