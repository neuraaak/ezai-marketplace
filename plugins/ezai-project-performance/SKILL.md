---
name: ezai-project-performance
description:
  "Concurrency, async patterns, and performance optimization for
  Python and JS/TS projects. Covers async/await model selection, threading vs
  multiprocessing (Python 3.14+ GIL-less), Web Workers (JS), generator patterns
  for large datasets, and profiling guidance. Load from ezai-persona-senior-dev, or
  invoke directly for performance tasks.

  Triggers on: 'this is slow', 'memory issue', 'concurrent requests', 'async
  model', 'threading vs asyncio', 'stream large data', 'optimize this loop',
  'Web Workers', 'AbortSignal'."
---

Concurrency and performance standards. Read `references/index.md` to confirm the language subdirectory, then load the relevant file. If `references/index.md` or the language-specific file cannot be accessed, proceed using the cross-language principles in this prompt and built-in knowledge for the detected language. If any referenced file is missing or empty, notify the user that the reference file could not be loaded and proceed with the cross-language principles and built-in knowledge only.

## Language routing

| Language                | File                                   |
| :---------------------- | :------------------------------------- |
| Python                  | `references/python/performance.md`     |
| JavaScript / TypeScript | `references/javascript/performance.md` |

If the task spans both Python and JS/TS, load both reference files and apply each language's guidance to its respective layer.

## Cross-language principles

- **Profile first:** Never optimize without profiling data. Measure, then act.
- **Match model to workload:** I/O-bound → async/event-loop. CPU-bound → threads (Python 3.14+ GIL-less or JS Workers) or multiprocessing (Python <3.14 or when process isolation is required).
- **Stream don't buffer:** Process large datasets as generators/async iterables — never load everything into memory.
- **Cancellation:** Always provide a cancellation mechanism for long-running async ops.
