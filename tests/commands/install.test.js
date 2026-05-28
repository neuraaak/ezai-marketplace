const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  resolvePluginFiles,
  buildDestPath,
  assertSafeRelPath,
} = require('../../lib/commands/install');

describe('resolvePluginFiles', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('scanne le dossier skills/ et retourne les fichiers trouvés', () => {
    const pluginDir = path.join(tmpDir, 'plugins', 'skill-test');
    const skillDir = path.join(pluginDir, 'skills', 'test');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), '---\nname: test\n---\n');

    const pluginEntry = {
      name: 'skill-test',
      path: 'plugins/skill-test',
      skills: 'skills/',
    };

    const files = resolvePluginFiles(pluginEntry, tmpDir);

    expect(files).toHaveLength(1);
    expect(files[0].src).toBe(path.join(pluginDir, 'skills', 'test', 'SKILL.md'));
    expect(files[0].dest).toBe('skills/test/SKILL.md');
  });

  it('scanne plusieurs fichiers dans des sous-dossiers', () => {
    const pluginDir = path.join(tmpDir, 'plugins', 'skill-test');
    const skillA = path.join(pluginDir, 'skills', 'a');
    const skillB = path.join(pluginDir, 'skills', 'b');
    fs.mkdirSync(skillA, { recursive: true });
    fs.mkdirSync(skillB, { recursive: true });
    fs.writeFileSync(path.join(skillA, 'SKILL.md'), '---\nname: a\n---\n');
    fs.writeFileSync(path.join(skillB, 'SKILL.md'), '---\nname: b\n---\n');
    fs.writeFileSync(path.join(skillB, 'ref.md'), '# ref');

    const pluginEntry = { name: 'skill-test', path: 'plugins/skill-test', skills: 'skills/' };
    const files = resolvePluginFiles(pluginEntry, tmpDir);

    expect(files).toHaveLength(3);
    const dests = files.map((f) => f.dest).sort();
    expect(dests).toEqual(['skills/a/SKILL.md', 'skills/b/SKILL.md', 'skills/b/ref.md'].sort());
  });

  it('retourne un tableau vide si le dossier skills/ est absent', () => {
    const pluginDir = path.join(tmpDir, 'plugins', 'skill-test');
    fs.mkdirSync(pluginDir, { recursive: true });

    const pluginEntry = { name: 'skill-test', path: 'plugins/skill-test', skills: 'skills/' };
    const files = resolvePluginFiles(pluginEntry, tmpDir);

    expect(files).toHaveLength(0);
  });
});

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

describe('resolvePluginFiles — path traversal', () => {
  it('lève une erreur si le path du plugin contient ..', () => {
    const malicious = { path: '../../outside', skills: 'skills/' };
    expect(() => resolvePluginFiles(malicious, '/repo')).toThrow('chemin non sûr');
  });

  it('lève une erreur si le skills dir contient ..', () => {
    const malicious = { path: 'plugins/skill-test', skills: '../../outside/' };
    expect(() => resolvePluginFiles(malicious, '/repo')).toThrow('chemin non sûr');
  });
});

describe('buildDestPath', () => {
  it('construit le chemin de destination dans .agents/', () => {
    const result = buildDestPath('skill-test', '/my/project');
    expect(result).toBe(path.join('/my/project', '.agents', 'skill-test'));
  });

  it('utilise le répertoire courant si pas de dest fourni', () => {
    const result = buildDestPath('skill-test');
    expect(result).toBe(path.join(process.cwd(), '.agents', 'skill-test'));
  });
});
