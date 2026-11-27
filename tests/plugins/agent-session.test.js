const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const SCRIPT = path.resolve(
  __dirname,
  '../../plugins/experts/ezai-agent-session/scripts/session.js'
);
const WAIT_TEST_TIMEOUT_MS = 15_000;
const WAIT_STARTUP_MS = 1_000;

jest.setTimeout(WAIT_TEST_TIMEOUT_MS);

let cwd;

function run(...args) {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { cwd, encoding: 'utf8' });
  return { code: r.status, out: JSON.parse(r.stdout) };
}

function startWait(agent) {
  const child = spawn(process.execPath, [SCRIPT, 'wait', '--agent', agent], { cwd });
  let stdout = '';
  child.stdout.on('data', (d) => {
    stdout += d;
  });
  return new Promise((resolve) => {
    child.on('close', (code) => resolve({ code, out: JSON.parse(stdout) }));
  });
}

function editJson(name, patch) {
  const file = path.join(cwd, '.shared-session', name);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  fs.writeFileSync(file, JSON.stringify(patch(data)));
}

function openPair() {
  run('init', '--agent', 'claude');
  run('join', '--agent', 'codex');
}

beforeEach(() => {
  cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'ezai-session-test-'));
});

afterEach(() => {
  fs.rmSync(cwd, { recursive: true, force: true });
});

describe('init / join', () => {
  it('crée la session, le main détient le jeton', () => {
    expect(run('init', '--agent', 'claude')).toMatchObject({
      code: 0,
      out: { event: 'SESSION_CREATED', role: 'main' },
    });
    expect(run('status').out.turn).toMatchObject({ owner: 'claude', claimed: true, seq: 0 });
  });

  it('refuse un second init', () => {
    run('init', '--agent', 'claude');
    expect(run('init', '--agent', 'codex')).toMatchObject({ code: 1, out: { event: 'ERROR' } });
  });

  it('accepte un assistant, refuse un troisième agent, tolère un join répété', () => {
    openPair();
    expect(run('join', '--agent', 'codex').out.event).toBe('ALREADY_JOINED');
    expect(run('join', '--agent', 'gemini').code).toBe(1);
  });

  it('refuse un nom d’agent invalide et une commande inconnue', () => {
    expect(run('init', '--agent', '../x').code).toBe(1);
    expect(run('bogus').code).toBe(1);
  });

  it('refuse de placer la session hors du dossier courant', () => {
    expect(run('init', '--agent', 'claude', '--dir', os.tmpdir()).code).toBe(1);
    expect(fs.existsSync(path.join(os.tmpdir(), 'session.json'))).toBe(false);
  });

  it('crée un dossier de session que git ignore sans toucher au .gitignore du projet', () => {
    spawnSync('git', ['init', '-q'], { cwd });
    openPair();
    const status = spawnSync('git', ['status', '--porcelain', '--untracked-files=all'], {
      cwd,
      encoding: 'utf8',
    });
    expect(status.stdout).toBe('');
  });
});

describe('handoff / claim', () => {
  it('passe le jeton et transmet le message', () => {
    openPair();
    expect(
      run(
        'handoff',
        '--agent',
        'claude',
        '--to',
        'codex',
        '--type',
        'plan',
        '--summary',
        'plan "v1" é',
        '--files',
        'a.js,b.js'
      )
    ).toMatchObject({ code: 0, out: { event: 'HANDED_OFF', seq: 1 } });
    expect(run('claim', '--agent', 'codex').out.message).toMatchObject({
      from: 'claude',
      type: 'plan',
      summary: 'plan "v1" é',
      files_touched: ['a.js', 'b.js'],
    });
  });

  it.each([
    ['sans le jeton', ['--agent', 'codex', '--to', 'claude', '--summary', 'x']],
    ['vers soi-même', ['--agent', 'claude', '--to', 'claude', '--summary', 'x']],
    ['vers un inconnu', ['--agent', 'claude', '--to', 'gemini', '--summary', 'x']],
    [
      'avec un type inconnu',
      ['--agent', 'claude', '--to', 'codex', '--type', 'x', '--summary', 'x'],
    ],
    ['sans résumé', ['--agent', 'claude', '--to', 'codex']],
  ])('refuse un handoff %s', (_, args) => {
    openPair();
    expect(run('handoff', ...args).code).toBe(1);
  });

  it('refuse un handoff avant claim', () => {
    openPair();
    run('handoff', '--agent', 'claude', '--to', 'codex', '--summary', 'x');
    expect(run('handoff', '--agent', 'codex', '--to', 'claude', '--summary', 'y').code).toBe(1);
  });

  it('bloque au-delà de max_handoffs', () => {
    openPair();
    editJson('session.json', (s) => ({ ...s, limits: { ...s.limits, max_handoffs: 0 } }));
    expect(run('handoff', '--agent', 'claude', '--to', 'codex', '--summary', 'x').code).toBe(4);
  });

  it('refuse un chemin de message hors de messages/', () => {
    openPair();
    editJson('turn.json', (t) => ({ ...t, claimed: false, message: '../../etc/passwd' }));
    expect(run('claim', '--agent', 'claude')).toMatchObject({ code: 1, out: { event: 'ERROR' } });
  });
});

describe('wait', () => {
  it('rend ASSISTANT_JOINED au main quand l’assistant rejoint', async () => {
    run('init', '--agent', 'claude');
    const waiting = startWait('claude');
    // wait doit avoir lu la session avant la jonction, sinon il voit déjà l'assistant.
    await new Promise((r) => setTimeout(r, WAIT_STARTUP_MS));
    run('join', '--agent', 'codex');
    expect(await waiting).toMatchObject({
      code: 0,
      out: { event: 'ASSISTANT_JOINED', assistant: 'codex' },
    });
  });

  it('rend TOKEN_RECEIVED au receveur, puis TOKEN_HELD une fois réclamé', async () => {
    openPair();
    const waiting = startWait('codex');
    run('handoff', '--agent', 'claude', '--to', 'codex', '--summary', 'x');
    expect(await waiting).toMatchObject({ code: 0, out: { event: 'TOKEN_RECEIVED', seq: 1 } });
    run('claim', '--agent', 'codex');
    expect((await startWait('codex')).out.event).toBe('TOKEN_HELD');
  });

  it('signale un receveur muet', async () => {
    openPair();
    editJson('session.json', (s) => ({ ...s, limits: { ...s.limits, claim_timeout_s: 0 } }));
    run('handoff', '--agent', 'claude', '--to', 'codex', '--summary', 'x');
    expect(await startWait('claude')).toMatchObject({
      code: 4,
      out: { event: 'RECEIVER_SILENT', receiver: 'codex' },
    });
  });

  it('signale un budget dépassé', async () => {
    openPair();
    editJson('session.json', (s) => ({ ...s, limits: { ...s.limits, budget_min: 0 } }));
    expect(await startWait('codex')).toMatchObject({ code: 4, out: { event: 'BUDGET_EXCEEDED' } });
  });

  it('sort avec le code 3 à la clôture, réservée au détenteur du jeton', async () => {
    openPair();
    expect(run('close', '--agent', 'codex').code).toBe(1);
    const waiting = startWait('codex');
    run('close', '--agent', 'claude');
    expect(await waiting).toMatchObject({ code: 3, out: { event: 'SESSION_CLOSED' } });
  });

  it('refuse un agent qui n’est pas membre', () => {
    openPair();
    const r = spawnSync(process.execPath, [SCRIPT, 'wait', '--agent', 'gemini'], {
      cwd,
      encoding: 'utf8',
    });
    expect(r.status).toBe(1);
  });
});
