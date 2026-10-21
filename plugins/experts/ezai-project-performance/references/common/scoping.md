# Project Performance — Scoping questions

Ordered list used by the **Scope** step of `SKILL.md`. Walk it top to bottom, drop every question the request or the repository already answers, then ask the **first three remaining** in a single call. For any question left unasked, apply the recommended option and state it in the response.

Options are listed recommended first, as `label` — `description`. Never add an "Other" option: every harness appends a free-form one.

## 1. `symptom` — header `Symptom`

**Ask when** the request does not describe the problem ("it's slow", "out of memory", "which async model" already answer it).
**Question:** What is the performance problem?

- `Too slow (Recommended)` — Requests, jobs or builds take longer than they should.
- `Memory pressure` — Memory keeps growing or the process gets killed for running out of it.
- `Design up front` — No problem yet; choose the concurrency model before writing the code.

## 2. `evidence` — header `Evidence`

**Ask when** the symptom is slowness or memory and the request carries no profile, trace or measurement.
**Question:** Has the bottleneck been measured yet?

- `Not yet (Recommended)` — Start by profiling; the response gives the tool and the exact command.
- `Yes, I'll share it` — The user pastes the profile or measurements via the free-form answer.

## 3. `workload` — header `Workload`

**Ask when** no code is shared and the request does not say what the hot path does.
**Question:** What does the slow or planned code spend its time on?

- `Waiting on I/O (Recommended)` — Network calls, database queries, disk reads.
- `Computing (CPU)` — Parsing, number crunching, image or data transforms.
- `Both` — A pipeline that fetches data and then processes it heavily.

## 4. `goal` — header `Goal`

**Ask when** the symptom is slowness and the request does not name the metric to improve.
**Question:** Which metric should improve?

- `Latency (Recommended)` — Each request or job finishes sooner.
- `Throughput` — More items processed per second, even if each takes as long.
- `Memory ceiling` — Stay under a fixed memory budget.

## 5. `constraints` — header `Constraints`

**Ask when** the likely fix may bring a new dependency or runtime change (NumPy, uvloop, a worker pool, a bundler plugin).
**Question:** What may change to reach the goal?

- `Code only (Recommended)` — Keep the current dependencies and runtime.
- `New dependencies allowed` — Add a library or change the runtime setup if it pays off.

## Why these questions

- **Evidence** enforces the first core rule — profile before optimizing. When nothing is measured, the right answer is a profiling plan, not a rewrite.
- **Workload** picks the concurrency model: async for I/O, processes or workers for CPU. Choosing it from a guess is the most expensive mistake this skill can make.
- **Goal** matters because latency and throughput pull in opposite directions: batching raises throughput and hurts latency.
