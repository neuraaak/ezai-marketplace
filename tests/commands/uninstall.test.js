const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  runUninstall,
  unlinkFromPlatforms,
  resolvePlatforms,
} = require('../../src/commands/uninstall');

// --- helpers ---

function makeSkill(agentsSkillsDir, skillName, files = ['SKILL.md']) {
  const skillDir = path.join(agentsSkillsDir, skillName);
  fs.mkdirSync(skillDir, { recursive: true });
  for (const f of files) {
    fs.writeFileSync(path.join(skillDir, f), `# ${skillName}`);
  }
  return skillDir;
}

function makeSymlink(platformDir, skillName, target) {
  const skillsDir = path.join(platformDir, 'skills');
  fs.mkdirSync(skillsDir, { recursive: true });
  const dest = path.join(skillsDir, skillName);
  const type = process.platform === 'win32' ? 'junction' : 'dir';
  fs.symlinkSync(target, dest, type);
  return dest;
}

// --- resolvePlatforms ---

describe('resolvePlatforms', () => {
  it('retourne toutes les plateformes par défaut', () => {
    expect(resolvePlatforms({}).map((p) => p.name)).toEqual([
      'Claude Code',
      'Gemini CLI',
      'Copilot',
    ]);
  });

  it('filtre avec --claude', () => {
    expect(resolvePlatforms({ claude: true }).map((p) => p.name)).toEqual(['Claude Code']);
  });

  it('combine plusieurs flags', () => {
    expect(resolvePlatforms({ gemini: true, copilot: true }).map((p) => p.name)).toEqual([
      'Gemini CLI',
      'Copilot',
    ]);
  });
});

// --- unlinkFromPlatforms ---

describe('unlinkFromPlatforms', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-unlink-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('supprime les symlinks existants', () => {
    const platform = path.join(tmpDir, 'platform');
    const target = path.join(tmpDir, 'target');
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, 'SKILL.md'), '# skill');
    const dest = makeSymlink(platform, 'ezai-code-formatter', target);

    unlinkFromPlatforms(['ezai-code-formatter'], [{ name: 'P', dir: platform }]);

    expect(fs.existsSync(dest)).toBe(false);
  });

  it("ne lève pas d'erreur si le symlink est absent", () => {
    const platform = path.join(tmpDir, 'platform');
    fs.mkdirSync(platform);

    expect(() =>
      unlinkFromPlatforms(['ezai-code-formatter'], [{ name: 'P', dir: platform }])
    ).not.toThrow();
  });
});

// --- runUninstall ---

describe('runUninstall', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-uninstall-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('supprime un skill spécifique', async () => {
    const agentsSkillsDir = path.join(tmpDir, '.agents', 'skills');
    makeSkill(agentsSkillsDir, 'ezai-code-formatter');

    await runUninstall('ezai-code-formatter', { dest: tmpDir });

    expect(fs.existsSync(path.join(agentsSkillsDir, 'ezai-code-formatter'))).toBe(false);
  });

  it('supprime tous les skills si aucun nom fourni', async () => {
    const agentsSkillsDir = path.join(tmpDir, '.agents', 'skills');
    makeSkill(agentsSkillsDir, 'ezai-code-formatter');
    makeSkill(agentsSkillsDir, 'ezai-docs-writer');

    await runUninstall(undefined, { dest: tmpDir });

    expect(fs.existsSync(path.join(agentsSkillsDir, 'ezai-code-formatter'))).toBe(false);
    expect(fs.existsSync(path.join(agentsSkillsDir, 'ezai-docs-writer'))).toBe(false);
  });

  it('supprime aussi les symlinks plateformes', async () => {
    const agentsSkillsDir = path.join(tmpDir, '.agents', 'skills');
    const skillDir = makeSkill(agentsSkillsDir, 'ezai-code-formatter');
    const platform = path.join(tmpDir, 'platform');
    const dest = makeSymlink(platform, 'ezai-code-formatter', skillDir);

    await runUninstall('ezai-code-formatter', {
      dest: tmpDir,
      _platformDirs: [{ name: 'P', dir: platform }],
    });

    expect(fs.existsSync(dest)).toBe(false);
  });

  it("ne lève pas d'erreur si .agents/skills/ est absent", async () => {
    await expect(runUninstall(undefined, { dest: tmpDir })).resolves.not.toThrow();
  });
});
