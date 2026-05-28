const path = require('node:path');
const {
  resolvePluginFiles,
  buildDestPath,
  assertSafeRelPath,
} = require('../../lib/commands/install');

describe('resolvePluginFiles', () => {
  it("retourne les chemins des fichiers .md d'un plugin", () => {
    const pluginEntry = {
      name: 'skill-test',
      path: 'plugins/skill-test',
      skills: ['skills/test/SKILL.md'],
    };
    const repoRoot = '/fake/repo';

    const files = resolvePluginFiles(pluginEntry, repoRoot);

    expect(files).toHaveLength(1);
    expect(files[0].src).toBe(
      path.join('/fake/repo', 'plugins/skill-test', 'skills/test/SKILL.md')
    );
    expect(files[0].dest).toBe('skills/test/SKILL.md');
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
    const malicious = { path: '../../outside', skills: ['skills/SKILL.md'] };
    expect(() => resolvePluginFiles(malicious, '/repo')).toThrow('chemin non sûr');
  });

  it('lève une erreur si un skill path contient ..', () => {
    const malicious = { path: 'plugins/skill-test', skills: ['../../outside/SKILL.md'] };
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
