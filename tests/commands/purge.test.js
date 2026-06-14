const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { runPurge, collectManagedSkills } = require('../../src/commands/purge');

// --- collectManagedSkills ---

describe('collectManagedSkills', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-managed-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('recense les skills ezai- de .agents et des plateformes, dédupliqués et triés', () => {
    const agentsSkillsDir = path.join(tmpDir, '.agents', 'skills');
    fs.mkdirSync(path.join(agentsSkillsDir, 'ezai-docs-writer'), { recursive: true });
    fs.mkdirSync(path.join(agentsSkillsDir, 'ezai-old-orphan'), { recursive: true });
    fs.mkdirSync(path.join(agentsSkillsDir, 'foreign-skill'), { recursive: true });

    const platform = path.join(tmpDir, 'platform');
    const platSkills = path.join(platform, 'skills');
    fs.mkdirSync(path.join(platSkills, 'ezai-docs-writer'), { recursive: true });
    fs.mkdirSync(path.join(platSkills, 'ezai-only-in-platform'), { recursive: true });

    const result = collectManagedSkills(agentsSkillsDir, [{ name: 'P', dir: platform }]);

    expect(result).toEqual(['ezai-docs-writer', 'ezai-old-orphan', 'ezai-only-in-platform']);
    expect(result).not.toContain('foreign-skill');
  });

  it("retourne un tableau vide si rien n'est installé", () => {
    expect(collectManagedSkills(path.join(tmpDir, 'nope'), [])).toEqual([]);
  });
});

// --- runPurge ---

describe('runPurge', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-purge-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  const catalogue = {
    fetchCatalogue: async () => ({ plugins: [{ name: 'ezai-docs-writer' }] }),
  };

  function options(platform) {
    return { dest: tmpDir, _platformDirs: [{ name: 'P', dir: platform }] };
  }

  it("supprime l'orphelin (absent du catalogue) côté .agents et plateforme", async () => {
    const agentsSkillsDir = path.join(tmpDir, '.agents', 'skills');
    const platform = path.join(tmpDir, 'platform');
    const platSkills = path.join(platform, 'skills');

    // Orphelin : absent du catalogue.
    const orphanAgents = path.join(agentsSkillsDir, 'ezai-old-orphan');
    fs.mkdirSync(orphanAgents, { recursive: true });
    fs.mkdirSync(platSkills, { recursive: true });
    const symlinkType = process.platform === 'win32' ? 'junction' : 'dir';
    fs.symlinkSync(orphanAgents, path.join(platSkills, 'ezai-old-orphan'), symlinkType);

    // Skill courant : présent dans le catalogue, doit être préservé.
    const keptAgents = path.join(agentsSkillsDir, 'ezai-docs-writer');
    fs.mkdirSync(keptAgents, { recursive: true });

    await runPurge(options(platform), catalogue);

    expect(fs.existsSync(orphanAgents)).toBe(false);
    expect(fs.existsSync(path.join(platSkills, 'ezai-old-orphan'))).toBe(false);
    expect(fs.existsSync(keptAgents)).toBe(true);
  });

  it('ne touche pas les skills non-ezai', async () => {
    const agentsSkillsDir = path.join(tmpDir, '.agents', 'skills');
    const foreign = path.join(agentsSkillsDir, 'foreign-skill');
    fs.mkdirSync(foreign, { recursive: true });

    await runPurge(options(path.join(tmpDir, 'platform')), catalogue);

    expect(fs.existsSync(foreign)).toBe(true);
  });

  it('ne fait rien si aucun skill obsolète', async () => {
    const agentsSkillsDir = path.join(tmpDir, '.agents', 'skills');
    fs.mkdirSync(path.join(agentsSkillsDir, 'ezai-docs-writer'), { recursive: true });

    await expect(
      runPurge(options(path.join(tmpDir, 'platform')), catalogue)
    ).resolves.toBeUndefined();
    expect(fs.existsSync(path.join(agentsSkillsDir, 'ezai-docs-writer'))).toBe(true);
  });
});
