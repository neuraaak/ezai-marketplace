const path = require('node:path');
const { resolvePluginFiles, buildDestPath } = require('../../lib/commands/install');

describe('resolvePluginFiles', () => {
  it("retourne les chemins des fichiers .md d'un plugin", () => {
    const pluginEntry = {
      name: 'skill-test',
      path: 'plugins/skill-test',
      skills: ['skills/test/SKILL.md']
    };
    const repoRoot = '/fake/repo';

    const files = resolvePluginFiles(pluginEntry, repoRoot);

    expect(files).toHaveLength(1);
    expect(files[0].src).toBe(path.join('/fake/repo', 'plugins/skill-test', 'skills/test/SKILL.md'));
    expect(files[0].dest).toBe('skills/test/SKILL.md');
  });
});

describe('buildDestPath', () => {
  it("construit le chemin de destination dans .agents/", () => {
    const result = buildDestPath('skill-test', '/my/project');
    expect(result).toBe(path.join('/my/project', '.agents', 'skill-test'));
  });

  it('utilise le répertoire courant si pas de dest fourni', () => {
    const result = buildDestPath('skill-test');
    expect(result).toBe(path.join(process.cwd(), '.agents', 'skill-test'));
  });
});
