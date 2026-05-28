---
name: project-performance
description:
  "[CLAUDE] - Concurrency, async patterns, and performance optimization for
  Python and JS/TS projects. Covers async/await model selection, threading vs
  multiprocessing (Python 3.14+ GIL-less), Web Workers (JS), generator patterns
  for large datasets, and profiling guidance. Load from persona-senior-dev, or
  invoke directly for performance tasks.

  Triggers on: 'this is slow', 'memory issue', 'concurrent requests', 'async
  model', 'threading vs asyncio', 'stream large data', 'optimize this loop',
  'Web Workers', 'AbortSignal'."
---

Concurrency and performance standards. Read `references/index.md` to confirm the language subdirectory, then load the relevant file.

## Language routing

| Language                | File                                   |
| :---------------------- | :------------------------------------- |
| Python                  | `references/python/performance.md`     |
| JavaScript / TypeScript | `references/javascript/performance.md` |

## Cross-language principles

- **Profile first:** Never optimize without profiling data. Measure, then act.
- **Match model to workload:** I/O-bound → async/event-loop. CPU-bound → threads or workers.
- **Stream don't buffer:** Process large datasets as generators/async iterables — never load everything into memory.
- **Cancellation:** Always provide a cancellation mechanism for long-running async ops.
