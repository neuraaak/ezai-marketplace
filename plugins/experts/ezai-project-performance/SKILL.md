---
name: ezai-project-performance
description: >
  Performance optimization and concurrency models for Python and JS/TS.
  Covers: async/await vs threading vs multiprocessing selection, Web Workers,
  generators/async iterables for large datasets, profiling, caching, cancellation.

  Load from ezai-senior-dev-persona or directly for any performance task.

  Triggers on: "it's slow", "memory issue", "concurrent requests",
  "async model", "threading vs asyncio", "stream large data",
  "optimize this loop", "Web Workers", "AbortSignal", "profile", "GIL",
  "performance bottleneck", "out of memory", "speed this up".
---

Concurrency and performance optimization. Follows a 4-step workflow: scope the request with the user, identify the workload type, load the matching language file, then apply the model with complete code.

## Local rules precedence

Any rule declared in the user's `.claude/` (rules files, CLAUDE.md) takes
precedence over this skill. When a local rule covers the same domain, apply it
**in addition and in priority** over the defaults described here. This skill
ships only the general default; context-specific overrides live in the user's
rules.

## Capabilities

| Key                              | Description                                                                          |
| :------------------------------- | :----------------------------------------------------------------------------------- |
| `concurrency-model-selection`    | Choose between async/await, threading, and multiprocessing for I/O vs CPU-bound work |
| `async-profiling-guidance`       | Profile before optimizing — identify bottlenecks first                               |
| `streaming-large-datasets`       | Handle multi-GB files with generators or async iterables to prevent OOM              |
| `async-cancellation`             | Implement timeouts, cancellable requests, and proper async cleanup                   |
| `build-performance-js`           | Tree-shaking, lazy loading, and bundler optimization for JS/TS                       |
| `python-optimization-patterns`   | `__slots__`, `lru_cache`, NumPy, uvloop for Python performance                       |
| `semaphore-concurrency-limiting` | Limit concurrent operations with semaphores to prevent resource exhaustion           |

## Scope

Before loading any other reference, settle the scope with the user.

1. Read `references/common/scoping.md` and walk its questions in order.
2. Drop every question the request or the repository already answers.
3. Ask the first three remaining questions in **one** call to the harness's question tool: `AskUserQuestion` (Claude Code), `request_user_input` (Codex), `ask_user` (Gemini CLI, Copilot CLI). If none is available, ask them as a numbered list of multiple-choice questions and wait for the answer.
4. Keep the `header`, the option order and the `(Recommended)` suffix as written: at most 3 options, recommended first, no hand-written "Other". Phrase the question and the options in the user's language.
5. For every question left unasked, apply its recommended option and list these assumptions at the top of the response.

Ask once. Never open a second round of questions, and skip this step entirely when nothing remains to ask.

**Under a persona.** Skip this step when the skill runs in a subagent of a persona pipeline: the persona settled the scope before dispatch and wrote it to the pipeline's `00-context.md`. When a persona hands the task over inline, run this step but drop every question the persona already asked.

## Workflow

1. **Scope** — settle the scope with the user (see above)
2. **Identify** — workload type (I/O / CPU / mixed) + detected language(s) in the project
3. **Load** — the language file below + `references/common/performance.md` (cross-cutting principles)
4. **Apply** — propose the matching model with complete code + success criteria

## Language routing

| Language                | File                                             |
| :---------------------- | :----------------------------------------------- |
| Python                  | `references/languages/python/performance.md`     |
| JavaScript / TypeScript | `references/languages/javascript/performance.md` |
| PHP                     | `references/languages/php/performance.md`        |

For tasks spanning both languages, load both files and apply each to its respective layer. If a file is inaccessible, notify the user and fall back to `references/common/performance.md`.

## Output format

- **Model choice**: comparison table when several options are valid
- **Code**: complete example, annotated only on non-obvious points
- **Success criteria**: verifiable checklist at the end of the response
- **Profiling**: always indicate the tool to use before optimizing
