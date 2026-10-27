const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { resolveAgentsSkillsDir } = require('../src/platforms');

describe('resolveAgentsSkillsDir', () => {
  const originalAllowedRoot = process.env.EZAI_ALLOWED_DEST_ROOT;

  beforeAll(() => {
    process.env.EZAI_ALLOWED_DEST_ROOT = os.tmpdir();
  });

  afterAll(() => {
    if (originalAllowedRoot === undefined) delete process.env.EZAI_ALLOWED_DEST_ROOT;
    else process.env.EZAI_ALLOWED_DEST_ROOT = originalAllowedRoot;
  });

  it('retombe sur le home quand --dest est absent', () => {
    expect(resolveAgentsSkillsDir(undefined)).toBe(path.join(os.homedir(), '.agents', 'skills'));
  });

  it('résout un --dest existant en absolu', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-dest-test-'));
    expect(resolveAgentsSkillsDir(root)).toBe(path.join(root, '.agents', 'skills'));
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('accepte le projet courant comme destination', () => {
    expect(resolveAgentsSkillsDir('.')).toBe(path.join(process.cwd(), '.agents', 'skills'));
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

  it('refuse une destination hors des racines autorisées', () => {
    expect(() => resolveAgentsSkillsDir(path.parse(process.cwd()).root)).toThrow(
      /emplacements autorisés/
    );
  });

  it('refuse une racine externe relative', () => {
    process.env.EZAI_ALLOWED_DEST_ROOT = 'relative/path';
    expect(() => resolveAgentsSkillsDir(os.tmpdir())).toThrow(/chemin absolu requis/);
    process.env.EZAI_ALLOWED_DEST_ROOT = os.tmpdir();
  });

  it('refuse un dossier .agents redirigé hors de la destination', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-agents-link-'));
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-agents-outside-'));
    const link = path.join(root, '.agents');
    fs.symlinkSync(outside, link, process.platform === 'win32' ? 'junction' : 'dir');

    expect(() => resolveAgentsSkillsDir(root)).toThrow(/emplacements autorisés/);

    fs.unlinkSync(link);
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  });
});
