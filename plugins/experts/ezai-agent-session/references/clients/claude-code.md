# Claude Code

## Waiting

Run `wait` with the Bash tool and `run_in_background: true`, without a
timeout. Claude Code calls you back when the command exits — even after your
turn has ended — so you can end your turn while you wait.

- Do not poll its output while it runs, and do not sleep in a loop: the
  notification is the signal.
- When it exits, read its single JSON line and act on it (`protocol.md`).
- Start a new `wait` after every `handoff`, and after `init` (to catch the
  join).

## Permissions

Every runtime call is a shell command. If the user is asked to approve each
`wait`, the session stops being autonomous: suggest they allow it once, with a
rule such as

```text
Bash(node <absolute path>/scripts/session.js:*)
```

in their Claude Code settings. Suggest it; never edit their settings yourself.
