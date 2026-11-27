# Codex

## Waiting

Codex is not called back once your turn ends: you must stay in your turn
while you wait.

1. Start `wait` as a **persistent process** (`exec_command`), not as a one-shot
   command — the one-shot variant kills the process at its timeout.
2. Poll it with `write_stdin` and no input, at the longest interval the tool
   allows. An empty poll means nothing happened yet: poll again.
3. When the process prints its JSON line and exits, act on it (`protocol.md`).
4. If the process dies without printing, start `wait` again. It keeps no state
   of its own, so nothing is lost.

Do not end your turn while the session is active and you do not hold the
token. Ending it is the one thing that takes you out of the session: the other
agent would then report you as silent and the user would have to bring you
back.

## Sandbox

The runtime only reads and writes `.shared-session/` in the project, which the
`workspace-write` sandbox allows without approval. If your installation asks
for approval on each call, tell the user once: the session cannot run on its
own until they allow it.
