const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { resolveAgentsSkillsDir } = require('../src/platforms');

describe('resolveAgentsSkillsDir', () => {
  it('retombe sur le home quand --dest est absent', () => {
    expect(resolveAgentsSkillsDir(undefined)).toBe(path.join(os.homedir(), '.agents', 'skills'));
  });

  it('résout un --dest existant en absolu', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-dest-test-'));
    expect(resolveAgentsSkillsDir(root)).toBe(path.join(root, '.agents', 'skills'));
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('refuse un --dest inexistant plutôt que de créer une arborescence ailleurs', () => {
    const missing = path.join(os.tmpdir(), 'ezai-dest-absent-', String(Date.now()), 'nope');
    expect(() => resolveAgentsSkillsDir(missing)).toThrow(/dossier introuvable/);
  });

  it('refuse un --dest vide ou non-string', () => {
    expect(() => resolveAgentsSkillsDir('')).toThrow(/chemin invalide/);
    expect(() => resolveAgentsSkillsDir(42)).toThrow(/chemin invalide/);
  });

  it('refuse un fichier comme --dest', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-dest-file-'));
    const file = path.join(root, 'pas-un-dossier');
    fs.writeFileSync(file, 'x');
    expect(() => resolveAgentsSkillsDir(file)).toThrow(/dossier introuvable/);
    fs.rmSync(root, { recursive: true, force: true });
  });
});
