const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  assertSafeRelPath,
  linkToPlatforms,
  collectRuntimeFiles,
  RUNTIME_INCLUDE,
} = require('../../src/commands/install');
const { resolvePlatforms } = require('../../src/platforms');

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

// --- collectRuntimeFiles ---

describe('collectRuntimeFiles', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-collect-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function makePluginDir() {
    const pluginDir = path.join(tmpDir, 'ezai-fake');
    fs.mkdirSync(path.join(pluginDir, 'references', 'python'), { recursive: true });
    fs.mkdirSync(path.join(pluginDir, 'evals'), { recursive: true });
    fs.mkdirSync(path.join(pluginDir, 'graphify-out'), { recursive: true });
    fs.mkdirSync(path.join(pluginDir, '.claude-plugin'), { recursive: true });
    fs.writeFileSync(path.join(pluginDir, 'SKILL.md'), '# skill');
    fs.writeFileSync(path.join(pluginDir, 'references', 'index.md'), 'idx');
    fs.writeFileSync(path.join(pluginDir, 'references', 'python', 'standards.md'), 'std');
    fs.writeFileSync(path.join(pluginDir, 'evals', 'eval_set.json'), '{}');
    fs.writeFileSync(path.join(pluginDir, 'graphify-out', 'graph.json'), '{}');
    fs.writeFileSync(path.join(pluginDir, '.claude-plugin', 'plugin.json'), '{}');
    return pluginDir;
  }

  it('inclut SKILL.md et tout references/ récursivement', () => {
    const dests = collectRuntimeFiles(makePluginDir()).map((f) => f.dest);
    expect(dests).toContain('SKILL.md');
    expect(dests).toContain('references/index.md');
    expect(dests).toContain('references/python/standards.md');
  });

  it('exclut evals/, graphify-out/ et .claude-plugin/', () => {
    const dests = collectRuntimeFiles(makePluginDir()).map((f) => f.dest);
    expect(dests.some((d) => d.startsWith('evals/'))).toBe(false);
    expect(dests.some((d) => d.startsWith('graphify-out/'))).toBe(false);
    expect(dests.some((d) => d.startsWith('.claude-plugin/'))).toBe(false);
  });

  it('ignore sans erreur une entrée whitelistée absente', () => {
    const pluginDir = path.join(tmpDir, 'ezai-minimal');
    fs.mkdirSync(pluginDir, { recursive: true });
    fs.writeFileSync(path.join(pluginDir, 'SKILL.md'), '# skill');
    const dests = collectRuntimeFiles(pluginDir).map((f) => f.dest);
    expect(dests).toEqual(['SKILL.md']);
  });

  it('expose une whitelist runtime minimale', () => {
    expect(RUNTIME_INCLUDE).toEqual(['SKILL.md', 'references']);
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
