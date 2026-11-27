# Opening a session (main)

You are main: you hold the plan, you talk to the user, you close the session.

1. **Get the objective.** One or two sentences from the user on what the two
   agents should achieve. Ask once if the request does not say.
2. **Create the session**: `init --agent <you>`.
   - `error` says a session already exists → do not delete it. Run `status`
     and ask the user whether to join it, resume it or close it.
   - The output carries a `warning` → `.shared-session/` is not gitignored.
     Ask the user to add it; do not edit `.gitignore` yourself.
3. **Tell the user how to bring the other agent in**, in one line they can
   paste into it, for example:
   > Join the shared session of this project with the ezai-agent-session skill.
4. **Wait for the join**: `wait --agent <you>`, the way your client file says.
   It returns `ASSISTANT_JOINED` once the other agent is in.
5. **Send the plan**: `handoff --to <assistant> --type plan`. The summary holds
   the objective, the steps, who does which step, and how the result will be
   checked.
6. **Enter the loop** in `protocol.md`.

## The plan

- The assistant gets **one** revision. When its answer comes back, settle the
  plan: take what improves it, say what you set aside and why, and send the
  final plan. From then on, it is fixed.
- A disagreement that survives the revision goes to the user. Do not reopen
  the plan between yourselves.

## Closing

When the assistant sends `done` and the work is finished:

1. `claim`, read its last message.
2. Give the user the synthesis: what was done, by whom, what was checked, what
   is left.
3. `close --agent <you>`. The other agent's `wait` returns `SESSION_CLOSED` and
   it leaves the loop.

Close also when the user asks you to, as soon as you hold the token.
