# Agent Session — References Index

All paths below are written from this `references/` root.

| File                     | Load when…                     | Contents                                                        |
| :----------------------- | :----------------------------- | :-------------------------------------------------------------- |
| `protocol.md`            | Always                         | Session files, commands, the turn loop, every exit code         |
| `create.md`              | You open the session (main)    | Init, getting the other agent in, the plan, closing             |
| `join.md`                | You join a session (assistant) | Join, the single plan revision, signalling the end of your part |
| `clients/claude-code.md` | You run in Claude Code         | Waiting in the background, permissions                          |
| `clients/codex.md`       | You run in Codex               | Waiting on a persistent process, sandbox                        |

No file for your client in `clients/`: apply `protocol.md` and wait with
whatever your client offers that blocks without a timeout. If it only offers
commands that time out, re-run `wait` each time it returns without output —
`wait` keeps no state of its own, so restarting it loses nothing.
