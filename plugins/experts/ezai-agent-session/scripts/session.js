#!/usr/bin/env node
// Runtime de session partagée entre deux agents : passage de jeton par fichiers, sans démon.
const fs = require('node:fs');
const path = require('node:path');
const { parseArgs } = require('node:util');

const EXIT = { OK: 0, ERROR: 1, CLOSED: 3, BLOCKED: 4 };
const POLL_MS = 1000;
const RETRIES = 20;
const RETRY_MS = 50;
const AGENT_RE = /^[a-z][a-z0-9-]{0,31}$/;
const MESSAGE_RE = /^messages\/\d{4}-[a-z][a-z0-9-]{0,31}\.json$/;
const MESSAGE_TYPES = ['plan', 'handoff', 'question', 'done'];
const DEFAULT_LIMITS = {
  claim_timeout_s: 600,
  max_handoffs: 30,
  budget_min: 120,
};

// Fixé, pas d'option : un dossier choisi par l'agent ouvrirait l'écriture hors du projet.
const dir = path.resolve('.shared-session');
let values;

class Fail extends Error {
  constructor(message, exit = EXIT.ERROR) {
    super(message);
    this.exit = exit;
  }
}

const now = () => new Date().toISOString();
const file = (name) => path.join(dir, name);

function out(obj, exit = EXIT.OK) {
  console.log(JSON.stringify(obj));
  process.exitCode = exit;
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// Sous Windows, rename et lecture échouent brièvement si l'autre agent tient le fichier ouvert.
function retry(fn) {
  for (let i = 0; ; i++) {
    try {
      return fn();
    } catch (e) {
      if (i >= RETRIES || !['EPERM', 'EBUSY', 'EACCES'].includes(e.code)) throw e;
      sleepSync(RETRY_MS);
    }
  }
}

const readJson = (name) => retry(() => JSON.parse(fs.readFileSync(file(name), 'utf8')));

function writeJson(name, data) {
  const tmp = `${file(name)}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  retry(() => fs.renameSync(tmp, file(name)));
}

function log(event, extra) {
  fs.appendFileSync(file('events.jsonl'), `${JSON.stringify({ at: now(), event, ...extra })}\n`);
}

function agentArg(name = 'agent') {
  const agent = values[name];
  if (!agent || !AGENT_RE.test(agent)) throw new Fail(`--${name} absent ou invalide`);
  return agent;
}

function loadSession(agent) {
  if (!fs.existsSync(file('session.json')))
    throw new Fail(`aucune session dans ${dir} : lancer init`);
  const session = readJson('session.json');
  if (agent && agent !== session.main && agent !== session.assistant) {
    throw new Fail(`${agent} n'est pas membre de la session`);
  }
  return session;
}

function ownedTurn(agent) {
  const turn = readJson('turn.json');
  if (turn.owner !== agent) throw new Fail(`le jeton appartient à ${turn.owner}`);
  return turn;
}

function init() {
  const agent = agentArg();
  fs.mkdirSync(file('messages'), { recursive: true });
  // Le dossier s'exclut lui-même de git : rien à ajouter au .gitignore du projet.
  fs.writeFileSync(file('.gitignore'), '*\n');
  const session = {
    protocol_version: '0.2',
    main: agent,
    assistant: null,
    state: 'ACTIVE',
    created_at: now(),
    limits: DEFAULT_LIMITS,
  };
  try {
    fs.writeFileSync(file('session.json'), JSON.stringify(session, null, 2), {
      flag: 'wx',
    });
  } catch (e) {
    if (e.code === 'EEXIST') throw new Fail('une session existe déjà : utiliser join');
    throw e;
  }
  writeJson('turn.json', {
    owner: agent,
    seq: 0,
    claimed: true,
    since: now(),
    message: null,
  });
  log('INIT', { agent });
  out({ event: 'SESSION_CREATED', role: 'main', dir });
}

function join() {
  const agent = agentArg();
  const session = loadSession();
  if (agent === session.main || agent === session.assistant) {
    return out({
      event: 'ALREADY_JOINED',
      role: agent === session.main ? 'main' : 'assistant',
    });
  }
  if (session.assistant) throw new Fail(`la session a déjà un assistant : ${session.assistant}`);
  writeJson('session.json', { ...session, assistant: agent });
  log('JOIN', { agent });
  out({ event: 'JOINED', role: 'assistant', main: session.main });
}

// Renvoie [sortie, code] dès qu'un événement concerne l'agent, sinon null.
function waitOutcome(agent, awaitingJoin) {
  const session = readJson('session.json');
  const turn = readJson('turn.json');
  if (session.state === 'CLOSED') return [{ event: 'SESSION_CLOSED' }, EXIT.CLOSED];
  if (awaitingJoin && session.assistant) {
    return [{ event: 'ASSISTANT_JOINED', assistant: session.assistant, next: 'handoff' }, EXIT.OK];
  }
  if (!awaitingJoin && turn.owner === agent) {
    const event = turn.claimed ? 'TOKEN_HELD' : 'TOKEN_RECEIVED';
    return [{ event, seq: turn.seq, next: 'claim' }, EXIT.OK];
  }
  const heldMs = Date.now() - Date.parse(turn.since);
  if (!turn.claimed && heldMs > session.limits.claim_timeout_s * 1000) {
    const waited_s = Math.round(heldMs / 1000);
    return [{ event: 'RECEIVER_SILENT', receiver: turn.owner, waited_s }, EXIT.BLOCKED];
  }
  if (Date.now() - Date.parse(session.created_at) > session.limits.budget_min * 60_000) {
    return [{ event: 'BUDGET_EXCEEDED' }, EXIT.BLOCKED];
  }
  return null;
}

function wait() {
  const agent = agentArg();
  // Sans assistant, seul le main est membre : il attend la jonction avant son premier handoff.
  const awaitingJoin = !loadSession(agent).assistant;
  return new Promise((resolve, reject) => {
    const poll = () => {
      try {
        const outcome = waitOutcome(agent, awaitingJoin);
        if (!outcome) return setTimeout(poll, POLL_MS);
        out(...outcome);
        resolve();
      } catch (e) {
        reject(e);
      }
    };
    poll();
  });
}

function claim() {
  const agent = agentArg();
  loadSession(agent);
  const turn = ownedTurn(agent);
  if (turn.message && !MESSAGE_RE.test(turn.message))
    throw new Fail(`chemin de message refusé : ${turn.message}`);
  if (!turn.claimed) {
    writeJson('turn.json', { ...turn, claimed: true });
    log('CLAIM', { agent, seq: turn.seq });
  }
  out({
    event: 'CLAIMED',
    seq: turn.seq,
    message: turn.message ? readJson(turn.message) : null,
  });
}

function handoff() {
  const agent = agentArg();
  const to = agentArg('to');
  const session = loadSession(agent);
  if (to === agent || (to !== session.main && to !== session.assistant))
    throw new Fail(`destinataire invalide : ${to}`);
  if (!MESSAGE_TYPES.includes(values.type))
    throw new Fail(`--type parmi : ${MESSAGE_TYPES.join(', ')}`);
  if (!values.summary) throw new Fail('--summary requis');
  const turn = ownedTurn(agent);
  if (!turn.claimed) throw new Fail('jeton pas encore réclamé : lancer claim');
  if (turn.seq >= session.limits.max_handoffs)
    throw new Fail('max_handoffs atteint : prévenir l’utilisateur', EXIT.BLOCKED);
  const seq = turn.seq + 1;
  const name = `messages/${String(seq).padStart(4, '0')}-${agent}.json`;
  const message = {
    seq,
    from: agent,
    to,
    type: values.type,
    summary: values.summary,
    files_touched: values.files ? values.files.split(',') : [],
    next: values.next ?? null,
    at: now(),
  };
  // Message d'abord, jeton ensuite : un handoff interrompu laisse un message orphelin, jamais un jeton sans message.
  fs.writeFileSync(file(name), JSON.stringify(message, null, 2), {
    flag: 'wx',
  });
  writeJson('turn.json', {
    owner: to,
    seq,
    claimed: false,
    since: now(),
    message: name,
  });
  log('HANDOFF', { from: agent, to, seq, message: name });
  out({ event: 'HANDED_OFF', to, seq, next: 'wait' });
}

function status() {
  loadSession();
  out({ session: readJson('session.json'), turn: readJson('turn.json') });
}

function close() {
  const agent = agentArg();
  const session = loadSession(agent);
  ownedTurn(agent);
  writeJson('session.json', { ...session, state: 'CLOSED', closed_at: now() });
  log('CLOSE', { agent });
  out({ event: 'SESSION_CLOSED' });
}

const COMMANDS = { init, join, wait, claim, handoff, status, close };

// Toutes les erreurs sont capturées dans le try : la promesse ne peut pas être rejetée.
void (async () => {
  try {
    const parsed = parseArgs({
      allowPositionals: true,
      options: {
        agent: { type: 'string' },
        to: { type: 'string' },
        type: { type: 'string', default: 'handoff' },
        summary: { type: 'string' },
        next: { type: 'string' },
        files: { type: 'string' },
      },
    });
    values = parsed.values;
    const command = COMMANDS[parsed.positionals[0]];
    if (!command)
      throw new Fail(`commande inconnue ; commandes : ${Object.keys(COMMANDS).join(', ')}`);
    await command();
  } catch (e) {
    out({ event: 'ERROR', error: e.message }, e instanceof Fail ? e.exit : EXIT.ERROR);
  }
})();
