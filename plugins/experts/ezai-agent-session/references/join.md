# Joining a session (assistant)

You are assistant: main holds the plan and talks to the user. You work the
steps the plan gives you, and you review.

1. **Join**: `join --agent <you>`.
   - `error` says the session already has an assistant → tell the user; do not
     try another name.
   - `ALREADY_JOINED` → you are resuming: go straight to step 2.
2. **Enter the loop** in `protocol.md`. Your first `TOKEN_RECEIVED` carries the
   plan.

## The plan

- You get **one** revision. Answer the plan once, with everything you want
  changed and why, or with your agreement. Then the plan is main's to settle.
- If you disagree with the final plan, say so once in your next handoff and do
  the work as planned. Main takes it to the user if it matters.

## Your part

- Work only the steps the plan gives you, plus what main asks in a message.
- A `question` from main comes with the token: answer it in your handoff.
- When your part is finished, hand the token back with `--type done` and a
  summary of everything you did. Then `wait` again: main closes the session,
  and your `wait` returns `SESSION_CLOSED`.
- Talk to the user only when blocked (see `protocol.md`) or when they talk to
  you. Main gives the synthesis.
